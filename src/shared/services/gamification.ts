import { dbRequest } from '@/shared/lib/db'
import { ACHIEVEMENTS } from '@/shared/constants/achievements'
import { calculateLevel, XP_REWARDS } from '@/shared/utils/xp'
import { updateStreak as updateStreakUtil } from '@/shared/utils/streak'
import {
    showAchievement,
    showXPGained,
    showLevelUp,
    showStreakUpdate,
    showPersonalBest,
    showDailyChallengeComplete
} from '@/shared/utils/notifications'
import type { Achievement } from '@/shared/types'

/**
 * Central gamification service for managing XP, achievements, and streaks
 */
class GamificationService {

    /**
     * Call this after completing any test
     */
    async onTestComplete(userId: string, testData: {
        mode: string
        reactionMs: number
        accuracy: number
        isPersonalBest?: boolean
        sequenceLevel?: number
    }) {
        // Increment test counter
        await dbRequest.incrementTotalTests(userId)

        // Update streak
        const streakData = updateStreakUtil()
        await dbRequest.updateStreak(
            userId,
            streakData.currentStreak,
            streakData.longestStreak,
            streakData.lastPlayedDate
        )

        // Show streak notification
        if (streakData.currentStreak > 1) {
            showStreakUpdate(streakData.currentStreak)
        }

        // Calculate XP rewards
        let totalXP = XP_REWARDS.TEST_COMPLETE

        // Bonus for perfect accuracy
        if (testData.accuracy === 100) {
            totalXP += XP_REWARDS.PERFECT_SCORE
        }

        // Bonus for personal best
        if (testData.isPersonalBest) {
            totalXP += XP_REWARDS.NEW_PERSONAL_BEST
            showPersonalBest(`${testData.reactionMs}ms`)
        }

        // Bonus for sequence levels
        if (testData.sequenceLevel && testData.sequenceLevel > 1) {
            totalXP += (testData.sequenceLevel - 1) * XP_REWARDS.LEVEL_BONUS
        }

        // First test of the day bonus
        const progress = await dbRequest.getUserProgress(userId)
        const today = new Date().toDateString()
        const lastPlayed = progress.lastPlayedDate ? new Date(progress.lastPlayedDate).toDateString() : ''

        if (today !== lastPlayed) {
            totalXP += XP_REWARDS.FIRST_TEST_OF_DAY
        }

        // Add XP
        const oldProgress = await dbRequest.getUserProgress(userId)
        const oldLevel = calculateLevel(oldProgress.totalXP)

        await dbRequest.addXP(userId, totalXP)
        showXPGained(totalXP, 'Test completed!')

        // Check for level up
        const newProgress = await dbRequest.getUserProgress(userId)
        const newLevel = calculateLevel(newProgress.totalXP)

        if (newLevel.level > oldLevel.level) {
            await dbRequest.updateLevel(userId, newLevel.level)
            showLevelUp(newLevel.level, newLevel.rank)
        }

        // Check achievements
        await this.checkAchievements(userId, testData)

        return {
            xpGained: totalXP,
            leveledUp: newLevel.level > oldLevel.level,
            newLevel: newLevel.level
        }
    }

    /**
     * Check and unlock achievements
     */
    private async checkAchievements(userId: string, testData: {
        mode: string
        reactionMs: number
        accuracy: number
        sequenceLevel?: number
    }) {
        const progress = await dbRequest.getUserProgress(userId)
        const achievements: Achievement[] = []

        // Speed achievements
        if (testData.reactionMs <= 150) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'speed_150')!)
        } else if (testData.reactionMs <= 180) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'speed_180')!)
        } else if (testData.reactionMs <= 200) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'speed_200')!)
        }

        // Accuracy achievements
        if (testData.accuracy === 100) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'accuracy_100')!)
        }

        // Milestone achievements
        if (progress.totalTests === 1) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'first_test')!)
        } else if (progress.totalTests === 10) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'tests_10')!)
        } else if (progress.totalTests === 50) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'tests_50')!)
        } else if (progress.totalTests === 100) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'tests_100')!)
        } else if (progress.totalTests === 500) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'tests_500')!)
        }

        // Sequence level achievements
        if (testData.sequenceLevel && testData.sequenceLevel >= 10) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'sequence_level_10')!)
        }

        // Streak achievements
        if (progress.currentStreak >= 3) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'streak_3')!)
        }
        if (progress.currentStreak >= 7) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'streak_7')!)
        }
        if (progress.currentStreak >= 30) {
            achievements.push(ACHIEVEMENTS.find(a => a.id === 'streak_30')!)
        }

        // Unlock achievements
        for (const achievement of achievements) {
            if (!achievement) continue

            const isUnlocked = await dbRequest.isAchievementUnlocked(userId, achievement.id)
            if (!isUnlocked) {
                await dbRequest.unlockAchievement(userId, achievement.id)
                await dbRequest.addXP(userId, achievement.xpReward)

                showAchievement(
                    achievement.title,
                    achievement.description,
                    achievement.icon,
                    achievement.xpReward
                )
            }
        }
    }

    /**
     * Get user's unlocked achievements
     */
    async getUserAchievements(userId: string) {
        const userAchievements = await dbRequest.getUserAchievements(userId)

        return ACHIEVEMENTS.map(achievement => {
            const userAch = userAchievements.find(ua => ua.achievementId === achievement.id)
            return {
                ...achievement,
                unlocked: userAch?.unlockedAt !== null && userAch?.unlockedAt !== undefined,
                unlockedAt: userAch?.unlockedAt,
                progress: userAch?.progress || 0
            }
        })
    }

    /**
     * Get user level and XP info
     */
    async getUserLevel(userId: string) {
        const progress = await dbRequest.getUserProgress(userId)
        return calculateLevel(progress.totalXP)
    }

    /**
     * Handle daily challenge completion
     */
    async onDailyChallengeComplete(userId: string, xpReward: number) {
        await dbRequest.addXP(userId, xpReward)
        showDailyChallengeComplete(xpReward)
    }
}

export const gamificationService = new GamificationService()

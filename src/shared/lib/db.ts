import { openDB, type DBSchema } from 'idb'
import { DB_CONFIG, TIME_CONSTANTS } from '@/shared/constants/app'
import type { UserAchievement } from '@/shared/types'

interface NeuroDriveDB extends DBSchema {
    users: {
        key: string
        value: {
            id: string
            username: string
            createdAt: Date
        }
        indexes: { 'by-username': string }
    }
    scores: {
        key: string
        value: {
            id: string
            userId: string
            mode: string
            reactionMs: number
            accuracy: number
            createdAt: Date
        }
        indexes: { 'by-user': string, 'by-mode': string }
    }
    userProgress: {
        key: string // userId
        value: {
            userId: string
            totalXP: number
            level: number
            currentStreak: number
            longestStreak: number
            lastPlayedDate: string
            totalTests: number
            updatedAt: Date
        }
    }
    achievements: {
        key: string // userId-achievementId
        value: {
            id: string
            userId: string
            achievementId: string
            progress: number
            unlockedAt: Date | null
        }
        indexes: { 'by-user': string }
    }
}

export async function initDB() {
    return openDB<NeuroDriveDB>(DB_CONFIG.NAME, 2, { // Upgraded to version 2
        upgrade(db, oldVersion, newVersion, transaction) {
            // Version 1 stores
            if (oldVersion < 1) {
                const userStore = db.createObjectStore(DB_CONFIG.STORES.USERS, { keyPath: 'id' })
                userStore.createIndex(DB_CONFIG.INDEXES.BY_USERNAME, 'username', { unique: true })

                const scoreStore = db.createObjectStore(DB_CONFIG.STORES.SCORES, { keyPath: 'id' })
                scoreStore.createIndex(DB_CONFIG.INDEXES.BY_USER, 'userId')
                scoreStore.createIndex(DB_CONFIG.INDEXES.BY_MODE, 'mode')
            }

            // Version 2 stores (gamification)
            if (oldVersion < 2) {
                // User progress store
                db.createObjectStore('userProgress', { keyPath: 'userId' })

                // Achievements store
                const achievementStore = db.createObjectStore('achievements', { keyPath: 'id' })
                achievementStore.createIndex('by-user', 'userId')
            }
        },
    })
}

export const dbRequest = {
    async createUser(username: string) {
        const db = await initDB()
        const id = crypto.randomUUID()
        const user = {
            id,
            username,
            createdAt: new Date()
        }
        await db.put('users', user)
        return user
    },

    async getUser(username: string) {
        const db = await initDB()
        return db.getFromIndex('users', 'by-username', username)
    },

    async getUserById(id: string) {
        const db = await initDB()
        return db.get('users', id)
    },

    async addScore(userId: string, mode: string, reactionMs: number, accuracy: number = 100) {
        const db = await initDB()
        const score = {
            id: crypto.randomUUID(),
            userId,
            mode,
            reactionMs,
            accuracy,
            createdAt: new Date()
        }
        await db.put('scores', score)
        return score
    },

    async getTopScores(mode: string, limit = 50) {
        const db = await initDB()
        const allScores = await db.getAllFromIndex('scores', 'by-mode', mode)

        // Join with users manually (IDB is NoSQL-like)
        // Optimization: fetch distinct user IDs needed
        // For top 50, fetch all then sort. 
        // In production with thousands, cursor would be better.

        const sorted = allScores.sort((a, b) => a.reactionMs - b.reactionMs).slice(0, limit)

        const results = await Promise.all(sorted.map(async (s) => {
            const user = await db.get('users', s.userId)
            return {
                ...s,
                user: { username: user?.username || 'Unknown' }
            }
        }))

        return results
    },

    async getUserScores(userId: string) {
        const db = await initDB()
        const allScores = await db.getAllFromIndex('scores', 'by-user', userId)
        return allScores.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    },

    async getUserStats(userId: string) {
        const db = await initDB()
        const scores = await db.getAllFromIndex('scores', 'by-user', userId)

        if (scores.length === 0) {
            return {
                totalTests: 0,
                avgReaction: 0,
                bestReaction: 0,
                totalTime: 0
            }
        }

        const totalTests = scores.length
        const avgReaction = scores.reduce((sum, s) => sum + s.reactionMs, 0) / totalTests
        const bestReaction = Math.min(...scores.map(s => s.reactionMs))
        const totalTime = totalTests * TIME_CONSTANTS.SECONDS_PER_TEST // Estimate seconds per test

        return {
            totalTests,
            avgReaction,
            bestReaction,
            totalTime
        }
    },

    // ========== GAMIFICATION METHODS ==========

    // Get or create user progress
    async getUserProgress(userId: string) {
        const db = await initDB()
        let progress = await db.get('userProgress', userId)

        if (!progress) {
            progress = {
                userId,
                totalXP: 0,
                level: 1,
                currentStreak: 0,
                longestStreak: 0,
                lastPlayedDate: '',
                totalTests: 0,
                updatedAt: new Date()
            }
            await db.put('userProgress', progress)
        }

        return progress
    },

    // Add XP to user
    async addXP(userId: string, xp: number) {
        const db = await initDB()
        const progress = await this.getUserProgress(userId)

        progress.totalXP += xp
        progress.updatedAt = new Date()

        await db.put('userProgress', progress)
        return progress
    },

    // Update user level
    async updateLevel(userId: string, newLevel: number) {
        const db = await initDB()
        const progress = await this.getUserProgress(userId)

        progress.level = newLevel
        progress.updatedAt = new Date()

        await db.put('userProgress', progress)
        return progress
    },

    // Update streak
    async updateStreak(userId: string, currentStreak: number, longestStreak: number, lastPlayedDate: string) {
        const db = await initDB()
        const progress = await this.getUserProgress(userId)

        progress.currentStreak = currentStreak
        progress.longestStreak = longestStreak
        progress.lastPlayedDate = lastPlayedDate
        progress.updatedAt = new Date()

        await db.put('userProgress', progress)
        return progress
    },

    // Increment total tests
    async incrementTotalTests(userId: string) {
        const db = await initDB()
        const progress = await this.getUserProgress(userId)

        progress.totalTests += 1
        progress.updatedAt = new Date()

        await db.put('userProgress', progress)
        return progress
    },

    // Get user achievements
    async getUserAchievements(userId: string) {
        const db = await initDB()
        return db.getAllFromIndex('achievements', 'by-user', userId)
    },

    // Get or create achievement progress
    async getAchievementProgress(userId: string, achievementId: string) {
        const db = await initDB()
        const id = `${userId}-${achievementId}`
        let achievement = await db.get('achievements', id)

        if (!achievement) {
            achievement = {
                id,
                userId,
                achievementId,
                progress: 0,
                unlockedAt: null
            }
            await db.put('achievements', achievement)
        }

        return achievement
    },

    // Update achievement progress
    async updateAchievementProgress(userId: string, achievementId: string, progress: number) {
        const db = await initDB()
        const id = `${userId}-${achievementId}`
        const achievement = await this.getAchievementProgress(userId, achievementId)

        achievement.progress = progress

        await db.put('achievements', achievement)
        return achievement
    },

    // Unlock achievement
    async unlockAchievement(userId: string, achievementId: string) {
        const db = await initDB()
        const id = `${userId}-${achievementId}`
        const achievement = await this.getAchievementProgress(userId, achievementId)

        if (!achievement.unlockedAt) {
            achievement.unlockedAt = new Date()
            achievement.progress = 100
            await db.put('achievements', achievement)
        }

        return achievement
    },

    // Check if achievement is unlocked
    async isAchievementUnlocked(userId: string, achievementId: string): Promise<boolean> {
        const achievement = await this.getAchievementProgress(userId, achievementId)
        return achievement.unlockedAt !== null
    }
}

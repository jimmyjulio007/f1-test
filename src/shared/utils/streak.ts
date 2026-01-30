import { format, differenceInDays, parseISO } from 'date-fns'
import type { UserStreak } from '@/shared/types'

const STREAK_STORAGE_KEY = 'user-streak'

// Get current streak data
export function getUserStreak(): UserStreak {
    if (typeof window === 'undefined') {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastPlayedDate: '',
        }
    }

    try {
        const stored = localStorage.getItem(STREAK_STORAGE_KEY)
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (error) {
        console.error('Failed to parse streak data:', error)
    }

    return {
        currentStreak: 0,
        longestStreak: 0,
        lastPlayedDate: '',
    }
}

// Update streak when user plays
export function updateStreak(): UserStreak {
    if (typeof window === 'undefined') {
        return getUserStreak()
    }

    const today = format(new Date(), 'yyyy-MM-DD')
    const streak = getUserStreak()

    // First time playing
    if (!streak.lastPlayedDate) {
        const newStreak: UserStreak = {
            currentStreak: 1,
            longestStreak: 1,
            lastPlayedDate: today,
        }
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newStreak))
        return newStreak
    }

    // Already played today
    if (streak.lastPlayedDate === today) {
        return streak
    }

    const lastPlayed = parseISO(streak.lastPlayedDate)
    const daysSinceLastPlay = differenceInDays(new Date(), lastPlayed)

    let newStreak: UserStreak

    if (daysSinceLastPlay === 1) {
        // Consecutive day - increment streak
        newStreak = {
            currentStreak: streak.currentStreak + 1,
            longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
            lastPlayedDate: today,
        }
    } else {
        // Streak broken - reset to 1
        newStreak = {
            currentStreak: 1,
            longestStreak: streak.longestStreak,
            lastPlayedDate: today,
        }
    }

    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newStreak))
    return newStreak
}

// Get streak status
export function getStreakStatus(): {
    isActive: boolean
    daysRemaining: number
    message: string
} {
    const streak = getUserStreak()

    if (!streak.lastPlayedDate) {
        return {
            isActive: false,
            daysRemaining: 0,
            message: 'Start your streak today!',
        }
    }

    const today = format(new Date(), 'yyyy-MM-DD')
    const lastPlayed = parseISO(streak.lastPlayedDate)
    const daysSince = differenceInDays(new Date(), lastPlayed)

    if (daysSince === 0) {
        return {
            isActive: true,
            daysRemaining: 1,
            message: `${streak.currentStreak} day streak! Come back tomorrow!`,
        }
    } else if (daysSince === 1) {
        return {
            isActive: true,
            daysRemaining: 0,
            message: `Don't break your ${streak.currentStreak} day streak!`,
        }
    } else {
        return {
            isActive: false,
            daysRemaining: 0,
            message: 'Streak broken. Start a new one!',
        }
    }
}

// Check if should show streak achievement
export function checkStreakAchievements(currentStreak: number): number | null {
    const milestones = [3, 7, 14, 30, 60, 100]

    for (const milestone of milestones) {
        if (currentStreak === milestone) {
            return milestone
        }
    }

    return null
}

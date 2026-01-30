import type { UserLevel } from "@/shared/types"

// XP required for each level (exponential growth)
export function getXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Get rank based on level
export function getRankForLevel(level: number): UserLevel['rank'] {
    if (level < 10) return 'Rookie'
    if (level < 25) return 'Amateur'
    if (level < 50) return 'Pro'
    if (level < 75) return 'Elite'
    if (level < 100) return 'Master'
    return 'F1 Legend'
}

// Calculate level from total XP
export function calculateLevel(totalXP: number): UserLevel {
    let level = 1
    let xpConsumed = 0

    while (xpConsumed + getXPForLevel(level) <= totalXP) {
        xpConsumed += getXPForLevel(level)
        level++
    }

    const currentXP = totalXP - xpConsumed
    const xpToNextLevel = getXPForLevel(level)
    const rank = getRankForLevel(level)

    return {
        level,
        currentXP,
        xpToNextLevel,
        rank
    }
}

// XP rewards for different actions
export const XP_REWARDS = {
    TEST_COMPLETE: 10,
    PERFECT_SCORE: 50,
    NEW_PERSONAL_BEST: 25,
    DAILY_CHALLENGE: 100,
    FIRST_TEST_OF_DAY: 15,
    LEVEL_BONUS: 50, // Bonus for each level in sequence memory
} as const

// Rank colors for UI
export const RANK_COLORS: Record<UserLevel['rank'], string> = {
    'Rookie': 'text-gray-400',
    'Amateur': 'text-green-400',
    'Pro': 'text-blue-400',
    'Elite': 'text-purple-400',
    'Master': 'text-yellow-400',
    'F1 Legend': 'text-primary',
}

// Rank badges/icons
export const RANK_ICONS: Record<UserLevel['rank'], string> = {
    'Rookie': '🌱',
    'Amateur': '🎯',
    'Pro': '⚡',
    'Elite': '💎',
    'Master': '👑',
    'F1 Legend': '🏆',
}

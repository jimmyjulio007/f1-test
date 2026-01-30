import type { Achievement } from "@/shared/types"

// All available achievements
export const ACHIEVEMENTS: Achievement[] = [
    // Speed Category
    {
        id: 'speed_200',
        title: 'Lightning Reflexes',
        description: 'React under 200ms',
        icon: '⚡',
        requirement: 200,
        category: 'speed',
        rarity: 'common',
        xpReward: 50
    },
    {
        id: 'speed_180',
        title: 'F1 Speed',
        description: 'React under 180ms',
        icon: '🏎️',
        requirement: 180,
        category: 'speed',
        rarity: 'rare',
        xpReward: 100
    },
    {
        id: 'speed_150',
        title: 'Superhuman',
        description: 'React under 150ms',
        icon: '🦸',
        requirement: 150,
        category: 'speed',
        rarity: 'epic',
        xpReward: 250
    },

    // Accuracy Category
    {
        id: 'accuracy_95',
        title: 'Sharp Shooter',
        description: '95% accuracy on 10 tests',
        icon: '🎯',
        requirement: 95,
        category: 'accuracy',
        rarity: 'common',
        xpReward: 50
    },
    {
        id: 'accuracy_100',
        title: 'Perfect Vision',
        description: '100% accuracy on a test',
        icon: '👁️',
        requirement: 100,
        category: 'accuracy',
        rarity: 'rare',
        xpReward: 100
    },

    // Consistency Category
    {
        id: 'consistency_10',
        title: 'Steady Hand',
        description: '10 tests with less than 20ms deviation',
        icon: '🤝',
        requirement: 10,
        category: 'consistency',
        rarity: 'common',
        xpReward: 75
    },
    {
        id: 'consistency_50',
        title: 'Machine Precision',
        description: '50 tests with less than 15ms deviation',
        icon: '🤖',
        requirement: 50,
        category: 'consistency',
        rarity: 'epic',
        xpReward: 200
    },

    // Streak Category
    {
        id: 'streak_3',
        title: 'Getting Started',
        description: 'Play 3 days in a row',
        icon: '🔥',
        requirement: 3,
        category: 'streak',
        rarity: 'common',
        xpReward: 50
    },
    {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Play 7 days in a row',
        icon: '📅',
        requirement: 7,
        category: 'streak',
        rarity: 'rare',
        xpReward: 150
    },
    {
        id: 'streak_30',
        title: 'Dedicated Driver',
        description: 'Play 30 days in a row',
        icon: '💪',
        requirement: 30,
        category: 'streak',
        rarity: 'legendary',
        xpReward: 500
    },

    // Milestone Category
    {
        id: 'first_test',
        title: 'First Lap',
        description: 'Complete your first test',
        icon: '🏁',
        requirement: 1,
        category: 'milestone',
        rarity: 'common',
        xpReward: 25
    },
    {
        id: 'tests_10',
        title: 'Getting Warmed Up',
        description: 'Complete 10 tests',
        icon: '🎮',
        requirement: 10,
        category: 'milestone',
        rarity: 'common',
        xpReward: 50
    },
    {
        id: 'tests_50',
        title: 'Experienced Racer',
        description: 'Complete 50 tests',
        icon: '🏆',
        requirement: 50,
        category: 'milestone',
        rarity: 'rare',
        xpReward: 150
    },
    {
        id: 'tests_100',
        title: 'Century Club',
        description: 'Complete 100 tests',
        icon: '💯',
        requirement: 100,
        category: 'milestone',
        rarity: 'epic',
        xpReward: 300
    },
    {
        id: 'tests_500',
        title: 'Legend Status',
        description: 'Complete 500 tests',
        icon: '👑',
        requirement: 500,
        category: 'milestone',
        rarity: 'legendary',
        xpReward: 1000
    },
    {
        id: 'sequence_level_10',
        title: 'Memory Master',
        description: 'Reach level 10 in Sequence Memory',
        icon: '🧠',
        requirement: 10,
        category: 'milestone',
        rarity: 'epic',
        xpReward: 250
    },
]

// Rarity colors for UI
export const RARITY_COLORS = {
    common: 'text-gray-400 border-gray-400',
    rare: 'text-blue-400 border-blue-400',
    epic: 'text-purple-400 border-purple-400',
    legendary: 'text-yellow-400 border-yellow-400',
}

// Rarity labels
export const RARITY_LABELS = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
}

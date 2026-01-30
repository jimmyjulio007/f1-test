import { format, isToday, parseISO } from 'date-fns'
import type { DailyChallenge } from '@/shared/types'
import { TEST_MODES } from '../constants/app'

// Generate a daily challenge based on the current date
export function generateDailyChallenge(date: Date = new Date()): DailyChallenge {
    const dateStr = format(date, 'yyyy-MM-dd')

    // Use date as seed for consistent daily challenges
    const seed = parseInt(dateStr.replace(/-/g, ''))
    const random = seededRandom(seed)

    const challenges = [
        {
            testMode: TEST_MODES.REACTION,
            descriptions: [
                'React under 200ms',
                'Complete 5 tests under 250ms',
                'Get 3 tests under 180ms',
            ],
            targets: [200, 250, 180],
        },
        {
            testMode: TEST_MODES.F1_LIGHTS,
            descriptions: [
                'Perfect start timing (within 50ms)',
                'Complete without jump starts',
                'Average under 220ms on 5 tests',
            ],
            targets: [50, 0, 220],
        },
        {
            testMode: TEST_MODES.DECISION,
            descriptions: [
                'Get 100% accuracy',
                'Complete 10 tests with no errors',
                'Average under 400ms',
            ],
            targets: [100, 10, 400],
        },
        {
            testMode: TEST_MODES.SEQUENCE,
            descriptions: [
                'Reach level 8',
                'Complete without mistakes',
                'Reach level 10',
            ],
            targets: [8, 1, 10],
        },
    ]

    // Pick a random challenge category
    const categoryIndex = Math.floor(random() * challenges.length)
    const category = challenges[categoryIndex]

    // Pick a specific challenge within that category
    const challengeIndex = Math.floor(random() * category.descriptions.length)

    return {
        id: `daily-${dateStr}`,
        date: dateStr,
        testMode: category.testMode,
        target: category.targets[challengeIndex],
        description: category.descriptions[challengeIndex],
        xpReward: 100 + Math.floor(random() * 100), // 100-200 XP
        completed: false,
    }
}

// Seeded random number generator for consistent daily challenges
function seededRandom(seed: number) {
    return function () {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }
}

// Get today's challenge
export function getTodaysChallenge(): DailyChallenge {
    if (typeof window === 'undefined') return generateDailyChallenge()

    const storedChallenge = localStorage.getItem('daily-challenge')

    if (storedChallenge) {
        try {
            const challenge: DailyChallenge = JSON.parse(storedChallenge)

            // Check if it's still today's challenge
            if (isToday(parseISO(challenge.date))) {
                return challenge
            }
        } catch (error) {
            console.error('Failed to parse stored challenge:', error)
        }
    }

    // Generate new challenge for today
    const newChallenge = generateDailyChallenge()
    localStorage.setItem('daily-challenge', JSON.stringify(newChallenge))
    return newChallenge
}

// Mark challenge as completed
export function completeDailyChallenge(): void {
    if (typeof window === 'undefined') return

    const challenge = getTodaysChallenge()
    challenge.completed = true
    localStorage.setItem('daily-challenge', JSON.stringify(challenge))
}

// Check if challenge is completed
export function isDailyChallengeCompleted(): boolean {
    if (typeof window === 'undefined') return false

    const challenge = getTodaysChallenge()
    return challenge.completed
}

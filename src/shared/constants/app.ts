// Test Mode Constants
export const TEST_MODES = {
    REACTION: "REACTION",
    F1_LIGHTS: "F1_LIGHTS",
    DECISION: "DECISION",
    SEQUENCE: "SEQUENCE",
} as const

export type TestMode = typeof TEST_MODES[keyof typeof TEST_MODES]

// Test Mode Display Labels
export const TEST_MODE_LABELS: Record<string, string> = {
    [TEST_MODES.REACTION]: "Reaction Test",
    [TEST_MODES.F1_LIGHTS]: "F1 Lights",
    [TEST_MODES.DECISION]: "Decision Test",
    [TEST_MODES.SEQUENCE]: "Sequence Memory",
}

// Performance Benchmarks (in milliseconds)
export const PERFORMANCE_BENCHMARKS = {
    F1_AVERAGE: 200,        // Average F1 driver reaction time
    HUMAN_AVERAGE: 250,     // Average human reaction time
    EXCELLENT: 180,         // Excellent reaction time
    JUMP_START: 200,        // Below this is considered anticipation
} as const

// Performance Score Calculation Constants
export const PERFORMANCE_CALC = {
    // Reaction Score
    REACTION_BASE: 200,
    REACTION_DIVISOR: 10,

    // Speed Score
    SPEED_BASE: 180,
    SPEED_DIVISOR: 8,

    // Consistency Score
    CONSISTENCY_MIN: 50,
    CONSISTENCY_DIVISOR: 2,

    // Default values
    DEFAULT_ACCURACY: 100,
    DEFAULT_DECISION_SCORE: 50,
} as const

// Time Estimation Constants
export const TIME_CONSTANTS = {
    SECONDS_PER_TEST: 5,    // Average test duration in seconds
    MINUTES_IN_HOUR: 60,
    SECONDS_IN_MINUTE: 60,
    HOURS_IN_DAY: 24,
} as const

// Chart Configuration
export const CHART_CONFIG = {
    RADAR_MIN: 0,
    RADAR_MAX: 100,
    CHART_HEIGHT: 300,
} as const

// Database Constants
export const DB_CONFIG = {
    NAME: 'neurodrive-db',
    VERSION: 1,
    STORES: {
        USERS: 'users',
        SCORES: 'scores',
    },
    INDEXES: {
        BY_USERNAME: 'by-username',
        BY_USER: 'by-user',
        BY_MODE: 'by-mode',
    },
} as const

// Sequence Memory Game Constants
import type { Direction } from '../types'

export const SEQUENCE_DIRECTIONS: Direction[] = [
    "UP", "DOWN", "LEFT", "RIGHT",
    "UP_LEFT", "UP_RIGHT", "DOWN_LEFT", "DOWN_RIGHT"
]

export const SEQUENCE_CONFIG = {
    BASE_SPEED: 800,           // Initial speed in ms
    MIN_SPEED: 300,            // Minimum speed in ms
    SPEED_DECREASE_PER_LEVEL: 50, // Speed decrease per level
    INITIAL_SEQUENCE_LENGTH: 3,   // Starting sequence length
    FLASH_DURATION_PERCENT: 0.7,  // Flash on for 70% of interval
} as const

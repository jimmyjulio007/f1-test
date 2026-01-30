// User related types
export interface User {
    id: string
    username: string
    createdAt: Date
}

// Score related types
export interface Score {
    id: string
    userId: string
    mode: string
    reactionMs: number
    accuracy: number
    createdAt: Date
}

export interface ScoreWithUser extends Score {
    user: {
        username: string
    }
}

// Dashboard Stats types
export interface UserStats {
    avgReaction: number | null
    accuracy: number
    totalTime: number // in minutes
    rank: number
    recentScores: RecentScore[]
}

export interface RecentScore {
    mode: string
    score: number
    timestamp: Date
}

// Performance Metrics types
export interface PerformanceMetrics {
    reaction: number
    accuracy: number
    consistency: number
    speed: number
    decision: number
}

// Database Query types
export interface UserStatsResult {
    totalTests: number
    avgReaction: number
    bestReaction: number
    totalTime: number
}

// Component Props types
export interface SidebarProps {
    className?: string
    isOpen?: boolean
    onClose?: () => void
}

export interface HeaderProps {
    onMenuClick?: () => void
}

// Sequence Memory Game types
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | "UP_LEFT" | "UP_RIGHT" | "DOWN_LEFT" | "DOWN_RIGHT"
export type GameState = "idle" | "showing" | "input" | "correct" | "wrong" | "complete"

// Achievement Types
export interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    requirement: number
    category: 'speed' | 'accuracy' | 'consistency' | 'streak' | 'milestone'
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    xpReward: number
}

export interface UserAchievement {
    achievementId: string
    unlockedAt: Date
    progress: number
}

// XP & Level Types
export interface UserLevel {
    level: number
    currentXP: number
    xpToNextLevel: number
    rank: 'Rookie' | 'Amateur' | 'Pro' | 'Elite' | 'Master' | 'F1 Legend'
}

// Daily Challenge Types
export interface DailyChallenge {
    id: string
    date: string // yyyy-MM-dd
    testMode: string
    target: number
    description: string
    xpReward: number
    completed: boolean
}

// Streak Types
export interface UserStreak {
    currentStreak: number
    longestStreak: number
    lastPlayedDate: string // yyyy-MM-dd
}

// Sound Effect Types  
export type SoundEffect = 'start' | 'success' | 'error' | 'levelup' | 'achievement' | 'countdown' | 'perfect'

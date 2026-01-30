import { PERFORMANCE_CALC, CHART_CONFIG, TEST_MODES } from "@/shared/constants/app"
import { clamp, calculateStdDev } from "@/shared/utils/formatters"
import type { PerformanceMetrics } from "@/shared/types"

// Re-export for convenience
export type { PerformanceMetrics }

interface ScoreData {
    reactionMs: number
    accuracy: number
    mode: string
}

/**
 * Calculates reaction score (0-100) based on average reaction time
 * @param avgReaction - Average reaction time in ms
 * @returns Score from 0-100
 */
export function calculateReactionScore(avgReaction: number): number {
    const score = CHART_CONFIG.RADAR_MAX - ((avgReaction - PERFORMANCE_CALC.REACTION_BASE) / PERFORMANCE_CALC.REACTION_DIVISOR)
    return Math.round(clamp(score, CHART_CONFIG.RADAR_MIN, CHART_CONFIG.RADAR_MAX))
}

/**
 * Calculates speed score (0-100) based on best reaction time
 * @param bestReaction - Best reaction time achieved in ms
 * @returns Score from 0-100
 */
export function calculateSpeedScore(bestReaction: number): number {
    const score = CHART_CONFIG.RADAR_MAX - ((bestReaction - PERFORMANCE_CALC.SPEED_BASE) / PERFORMANCE_CALC.SPEED_DIVISOR)
    return Math.round(clamp(score, CHART_CONFIG.RADAR_MIN, CHART_CONFIG.RADAR_MAX))
}

/**
 * Calculates consistency score (50-100) based on standard deviation
 * Lower deviation = higher consistency
 * @param stdDev - Standard deviation of reaction times
 * @returns Score from 50-100
 */
export function calculateConsistencyScore(stdDev: number): number {
    const score = CHART_CONFIG.RADAR_MAX - (stdDev / PERFORMANCE_CALC.CONSISTENCY_DIVISOR)
    return Math.round(clamp(score, PERFORMANCE_CALC.CONSISTENCY_MIN, CHART_CONFIG.RADAR_MAX))
}

/**
 * Calculates decision score based on decision test accuracy
 * @param decisionScores - Array of decision test scores
 * @returns Score from 0-100
 */
export function calculateDecisionScore(decisionScores: ScoreData[]): number {
    if (decisionScores.length === 0) {
        return PERFORMANCE_CALC.DEFAULT_DECISION_SCORE
    }

    const avgAccuracy = decisionScores.reduce((sum, s) => sum + s.accuracy, 0) / decisionScores.length
    return Math.round(avgAccuracy)
}

/**
 * Calculates all performance metrics from user scores
 * @param scores - Array of user score data
 * @returns Complete performance metrics object
 */
export function calculatePerformanceMetrics(scores: ScoreData[]): PerformanceMetrics {
    if (scores.length === 0) {
        return {
            reaction: 0,
            accuracy: 0,
            consistency: 0,
            speed: 0,
            decision: 0
        }
    }

    // Calculate average reaction time
    const avgReaction = scores.reduce((sum, s) => sum + s.reactionMs, 0) / scores.length

    // Calculate average accuracy
    const avgAccuracy = scores.reduce((sum, s) => sum + s.accuracy, 0) / scores.length

    // Calculate consistency (standard deviation)
    const stdDev = calculateStdDev(scores.map(s => s.reactionMs), avgReaction)

    // Find best reaction time
    const bestReaction = Math.min(...scores.map(s => s.reactionMs))

    // Filter decision test scores
    const decisionScores = scores.filter(s => s.mode === "DECISION")

    return {
        reaction: calculateReactionScore(avgReaction),
        accuracy: Math.round(avgAccuracy),
        consistency: calculateConsistencyScore(stdDev),
        speed: calculateSpeedScore(bestReaction),
        decision: calculateDecisionScore(decisionScores)
    }
}

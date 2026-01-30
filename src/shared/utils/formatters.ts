import { TIME_CONSTANTS, TEST_MODE_LABELS } from "@/shared/constants/app"

/**
 * Formats minutes into human-readable time string
 * @param minutes - Total minutes
 * @returns Formatted string (e.g., "2h 30m" or "45m")
 */
export function formatTime(minutes: number): string {
    if (minutes < TIME_CONSTANTS.MINUTES_IN_HOUR) {
        return `${minutes}m`
    }

    const hours = Math.floor(minutes / TIME_CONSTANTS.MINUTES_IN_HOUR)
    const mins = minutes % TIME_CONSTANTS.MINUTES_IN_HOUR

    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
}

/**
 * Converts a Date object to relative time string
 * @param date - Date to convert
 * @returns Relative time string (e.g., "2m ago", "3h ago", "5d ago")
 */
export function getRelativeTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)

    if (seconds < TIME_CONSTANTS.SECONDS_IN_MINUTE) {
        return `${seconds}s ago`
    }

    const minutes = Math.floor(seconds / TIME_CONSTANTS.SECONDS_IN_MINUTE)
    if (minutes < TIME_CONSTANTS.MINUTES_IN_HOUR) {
        return `${minutes}m ago`
    }

    const hours = Math.floor(minutes / TIME_CONSTANTS.MINUTES_IN_HOUR)
    if (hours < TIME_CONSTANTS.HOURS_IN_DAY) {
        return `${hours}h ago`
    }

    const days = Math.floor(hours / TIME_CONSTANTS.HOURS_IN_DAY)
    return `${days}d ago`
}

/**
 * Gets the display label for a test mode
 * @param mode - Test mode identifier
 * @returns Human-readable label
 */
export function getModeLabel(mode: string): string {
    return TEST_MODE_LABELS[mode] || mode
}

/**
 * Clamps a number between min and max values
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
}

/**
 * Calculates standard deviation of a number array
 * @param values - Array of numbers
 * @param mean - Pre-calculated mean (optional, will calculate if not provided)
 * @returns Standard deviation
 */
export function calculateStdDev(values: number[], mean?: number): number {
    const avg = mean ?? values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
    return Math.sqrt(variance)
}

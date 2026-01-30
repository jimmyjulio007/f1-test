import type { Direction } from "@/shared/types"
import { SEQUENCE_DIRECTIONS } from "@/shared/constants/app"

/**
 * Generates a random sequence of directions
 * @param length - Number of directions to generate
 * @returns Array of random directions
 */
export function generateSequence(length: number): Direction[] {
    const sequence: Direction[] = []
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * SEQUENCE_DIRECTIONS.length)
        sequence.push(SEQUENCE_DIRECTIONS[randomIndex])
    }
    return sequence
}

/**
 * Calculates the speed for showing sequence based on level
 * @param level - Current game level
 * @returns Speed in milliseconds
 */
export function getSequenceSpeed(level: number, baseSpeed: number = 800, minSpeed: number = 300, decreasePerLevel: number = 50): number {
    return Math.max(minSpeed, baseSpeed - (level - 1) * decreasePerLevel)
}

import { create } from 'zustand'
import type { Direction, GameState } from '@/shared/types'
import { SEQUENCE_CONFIG } from '@/shared/constants/app'
import { generateSequence } from '@/shared/utils/sequence'

interface SequenceGameState {
    gameState: GameState
    sequence: Direction[]
    userInput: Direction[]
    currentLevel: number
    score: number
    showingIndex: number
    bestScore: number
    startTime: number
    lastTapped: Direction | null
    tapCounter: number

    // Actions
    setGameState: (state: GameState) => void
    setSequence: (sequence: Direction[]) => void
    addUserInput: (direction: Direction) => void
    clearUserInput: () => void
    incrementLevel: () => void
    addScore: (points: number) => void
    setScore: (score: number) => void
    incrementShowingIndex: () => void
    setShowingIndex: (index: number) => void
    setBestScore: (score: number) => void
    setStartTime: (time: number) => void
    setLastTapped: (direction: Direction | null) => void
    incrementTapCounter: () => void
    resetGame: () => void
}

export const useSequenceStore = create<SequenceGameState>((set) => ({
    gameState: "idle",
    sequence: [],
    userInput: [],
    currentLevel: 1,
    score: 0,
    showingIndex: 0,
    bestScore: 0,
    startTime: 0,
    lastTapped: null,
    tapCounter: 0,

    setGameState: (gameState) => set({ gameState }),

    setSequence: (sequence) => set({ sequence }),

    addUserInput: (direction) => set((state) => ({
        userInput: [...state.userInput, direction]
    })),

    clearUserInput: () => set({ userInput: [] }),

    incrementLevel: () => set((state) => ({ currentLevel: state.currentLevel + 1 })),

    addScore: (points) => set((state) => ({ score: state.score + points })),

    setScore: (score) => set({ score }),

    incrementShowingIndex: () => set((state) => ({
        showingIndex: state.showingIndex + 1
    })),

    setShowingIndex: (index) => set({ showingIndex: index }),

    setBestScore: (score) => set({ bestScore: score }),

    setStartTime: (time) => set({ startTime: time }),

    setLastTapped: (direction) => set({ lastTapped: direction }),

    incrementTapCounter: () => set((state) => ({ tapCounter: state.tapCounter + 1 })),

    resetGame: () => {
        const newSequence = generateSequence(SEQUENCE_CONFIG.INITIAL_SEQUENCE_LENGTH)
        set({
            gameState: "showing",
            sequence: newSequence,
            userInput: [],
            currentLevel: 1,
            score: 0,
            showingIndex: 0,
            lastTapped: null,
            startTime: Date.now(),
        })
    },
}))

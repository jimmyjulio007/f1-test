import { create } from 'zustand'
import { saveReactionScore } from '../api/actions'

export type TestState = 'idle' | 'waiting' | 'ready' | 'perf' | 'result' | 'early'

interface ReactionStore {
    state: TestState
    startTime: number
    endTime: number
    attempts: number[]
    setState: (state: TestState) => void
    startTest: () => void
    triggerGreen: () => void
    click: () => void
    reset: () => void
}

export const useReactionStore = create<ReactionStore>((set, get) => ({
    state: 'idle',
    startTime: 0,
    endTime: 0,
    attempts: [],

    setState: (state) => set({ state }),

    startTest: () => {
        set({ state: 'waiting', startTime: 0, endTime: 0 })
        const delay = Math.random() * 3000 + 2000

        setTimeout(() => {
            const { state } = get()
            if (state === 'waiting') {
                get().triggerGreen()
            }
        }, delay)
    },

    triggerGreen: () => {
        set({ state: 'ready', startTime: performance.now() })
    },

    click: () => {
        const { state, startTime } = get()

        if (state === 'waiting') {
            set({ state: 'early' })
            return
        }

        if (state === 'ready') {
            const endTime = performance.now()
            const diff = endTime - startTime

            saveReactionScore(Math.round(diff))

            set((prev) => ({
                state: 'result',
                endTime,
                attempts: [...prev.attempts, diff]
            }))
        }
    },

    reset: () => set({ state: 'idle', attempts: [] })
}))

import { create } from 'zustand'
import { saveF1Score } from '../api/save-score'

export type LightState = 'idle' | 'counting' | 'holding' | 'go' | 'result' | 'early'

interface F1Store {
    state: LightState
    lightsOn: number // 0 to 5
    startTime: number
    endTime: number
    reactionTime: number | null

    startSequence: () => void
    nextLight: () => void
    triggerGo: () => void
    click: () => void
    reset: () => void
}

export const useF1Store = create<F1Store>((set, get) => ({
    state: 'idle',
    lightsOn: 0,
    startTime: 0,
    endTime: 0,
    reactionTime: null,

    startSequence: () => {
        set({ state: 'counting', lightsOn: 0, reactionTime: null })
        let count = 0;
        const interval = setInterval(() => {
            count++;
            if (count <= 5) {
                set({ lightsOn: count })
            } else {
                clearInterval(interval)
                set({ state: 'holding' })

                // Random delay 0.2s - 3s
                const delay = Math.random() * 2800 + 200
                setTimeout(() => {
                    const { state } = get()
                    if (state === 'holding') {
                        get().triggerGo()
                    }
                }, delay)
            }
        }, 1000)
    },

    nextLight: () => {
        // Helper if needed from component
    },

    triggerGo: () => {
        set({ state: 'go', lightsOn: 0, startTime: performance.now() })
    },

    click: () => {
        const { state, startTime } = get()

        if (state === 'counting' || state === 'holding') {
            set({ state: 'early', lightsOn: 5 }) // Keep lights on for shame
            return
        }

        if (state === 'go') {
            const endTime = performance.now()
            const diff = endTime - startTime

            saveF1Score(Math.round(diff))

            set({ state: 'result', reactionTime: diff })
        }
    },

    reset: () => set({ state: 'idle', lightsOn: 0, reactionTime: null })
}))

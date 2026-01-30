import { create } from 'zustand'

export type Color = 'red' | 'blue' | 'green' | 'yellow'
export type TestState = 'idle' | 'playing' | 'end'

// Mapping for keys: Arrow keys? Or explicit keys?
// Let's use:
// Q: Red
// W: Blue
// O: Green
// P: Yellow
// Or maybe just Colors on screen to click if mobile? 
// Let's go with visual Mapping: 1, 2, 3, 4
// Red(1), Blue(2), Green(3), Yellow(4)

export interface Question {
    text: string // e.g., "RED", "BLUE"
    color: Color // The actual color of the text
    answer: Color // The expected answer (depending on rule)
}

interface DecisionStore {
    state: TestState
    score: number
    totalAttempts: number
    correctAttempts: number
    currentQuestion: Question | null
    startTime: number
    history: number[] // reaction times

    startGame: () => void
    answer: (color: Color) => void
    nextQuestion: () => void
    endGame: () => void
    reset: () => void
}

const COLORS: Color[] = ['red', 'blue', 'green', 'yellow']
const TEXTS = ['RED', 'BLUE', 'GREEN', 'YELLOW']

// Rule: "Click the COLOR of the word, not what the word says"
// Stroop effect

export const useDecisionStore = create<DecisionStore>((set, get) => ({
    state: 'idle',
    score: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    currentQuestion: null,
    startTime: 0,
    history: [],

    startGame: () => {
        set({
            state: 'playing',
            score: 0,
            totalAttempts: 0,
            correctAttempts: 0,
            history: []
        })
        get().nextQuestion()
    },

    nextQuestion: () => {
        const textIndex = Math.floor(Math.random() * 4)
        const colorIndex = Math.floor(Math.random() * 4)
        const textStr = TEXTS[textIndex]
        const colorVal = COLORS[colorIndex]

        // Stroop test: Answer is the COLOR of the text
        set({
            currentQuestion: {
                text: textStr,
                color: colorVal,
                answer: colorVal
            },
            startTime: performance.now()
        })
    },

    answer: (userChoice: Color) => {
        const { currentQuestion, startTime, totalAttempts, correctAttempts, history } = get()
        if (!currentQuestion) return

        const now = performance.now()
        const diff = now - startTime

        const isCorrect = userChoice === currentQuestion.answer

        const newHistory = [...history, diff]
        const newTotal = totalAttempts + 1
        const newCorrect = isCorrect ? correctAttempts + 1 : correctAttempts

        set({
            totalAttempts: newTotal,
            correctAttempts: newCorrect,
            history: newHistory
        })

        // End after 10 questions? or 30 seconds? 
        // Let's do 10 questions for quick test
        if (newTotal >= 10) {
            get().endGame()
        } else {
            get().nextQuestion()
        }
    },

    endGame: () => {
        set({ state: 'end', currentQuestion: null })
    },

    reset: () => set({ state: 'idle', history: [], totalAttempts: 0, correctAttempts: 0 })
}))

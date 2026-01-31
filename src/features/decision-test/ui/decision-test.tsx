"use client"

import { useEffect, useCallback } from "react"
import { useDecisionStore, type Color } from "../model/store"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { saveDecisionScore } from "../api/actions"
import { useSound } from "@/shared/hooks/useSound"


const COLORS: { [key in Color]: string } = {
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500",
    yellow: "text-yellow-500"
}

export function DecisionTest() {
    const { state, currentQuestion, score, totalAttempts, correctAttempts, history, startGame, answer, reset } = useDecisionStore()
    const { play } = useSound()

    // Save score on end
    useEffect(() => {
        if (state === 'end' && totalAttempts > 0) {
            const avgReaction = history.reduce((a, b) => a + b, 0) / history.length
            const accuracy = (correctAttempts / totalAttempts) * 100
            saveDecisionScore(Math.round(avgReaction), accuracy)
        }
    }, [state, totalAttempts, correctAttempts, history])

    const handleAnswer = (color: Color) => {
        if (currentQuestion && color === currentQuestion.color) {
            play('success')
        } else {
            play('error')
        }
        answer(color)
    }

    if (state === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-card/50 rounded-xl border border-border space-y-6">
                <h2 className="text-3xl font-bold text-primary">Stroop Decision Test</h2>
                <p className="text-center text-muted-foreground max-w-md">
                    Select the color of the text, not what the text reads.
                    <br />
                    <span className="text-red-500 font-bold">Example: RED</span> (Click Red)
                </p>
                <Button onClick={startGame} size="lg" className="w-48 h-16 text-xl">START TEST</Button>
            </div>
        )
    }

    if (state === 'end') {
        const avgMs = Math.round(history.reduce((a, b) => a + b, 0) / history.length) || 0
        const acc = Math.round((correctAttempts / totalAttempts) * 100) || 0

        return (
            <div className="flex flex-col items-center justify-center p-12 bg-card/50 rounded-xl border border-border space-y-8">
                <h2 className="text-4xl font-bold mb-4">Results</h2>

                <div className="grid grid-cols-2 gap-8 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className={cn("text-4xl font-mono font-bold", acc > 90 ? "text-primary" : "text-yellow-500")}>{acc}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Avg Speed</p>
                        <p className="text-4xl font-mono font-bold text-white">{avgMs}ms</p>
                    </div>
                </div>

                <Button onClick={reset} variant="outline">Try Again</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center space-y-12 py-12">
            {/* The Question */}
            <div className="h-40 flex items-center justify-center">
                {currentQuestion && (
                    <h1 className={cn("text-8xl font-black uppercase tracking-wider transition-all scale-110 duration-75", COLORS[currentQuestion.color])}>
                        {currentQuestion.text}
                    </h1>
                )}
            </div>

            {/* The Answers */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
                {(['red', 'blue', 'green', 'yellow'] as Color[]).map((c) => (
                    <button
                        key={c}
                        onClick={() => handleAnswer(c)}
                        className={cn(
                            "h-32 rounded-xl border-4 border-transparent hover:scale-105 transition-all active:scale-95 shadow-lg",
                            c === 'red' && "bg-red-950/50 hover:border-red-500",
                            c === 'blue' && "bg-blue-950/50 hover:border-blue-500",
                            c === 'green' && "bg-green-950/50 hover:border-green-500",
                            c === 'yellow' && "bg-yellow-950/50 hover:border-yellow-500",
                        )}
                    >
                        <span className="uppercase font-bold text-xl text-white/50">{c}</span>
                    </button>
                ))}
            </div>

            <div className="text-muted-foreground font-mono">
                {totalAttempts} / 10
            </div>
        </div>
    )
}

"use client"

import { useEffect, useRef } from "react"
import { useReactionStore } from "../model/store"
import { cn } from "@/shared/lib/utils"
import { useSound } from "@/shared/hooks/useSound"

export function ReactionTest() {
    const { state, attempts, startTest, click, reset } = useReactionStore()
    const { play } = useSound()

    // Sound Effects
    useEffect(() => {
        if (state === 'waiting') play('start')
        if (state === 'ready') play('countdown') // or a 'beep'
        if (state === 'early') play('error')
        if (state === 'result') {
            const score = attempts[attempts.length - 1]
            if (score && score < 200) play('perfect') // Super fast
            else play('success')
        }
    }, [state, attempts, play])

    // Handle spacebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                if (state === 'idle' || state === 'result' || state === 'early') {
                    startTest()
                } else {
                    click()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [state, startTest, click])

    const getLastScore = () => {
        if (attempts.length === 0) return null
        return Math.round(attempts[attempts.length - 1])
    }

    return (
        <div
            className={cn(
                "w-full h-[60vh] rounded-xl flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer select-none",
                state === 'idle' && "bg-secondary/20 hover:bg-secondary/30",
                state === 'waiting' && "bg-red-900/50",
                state === 'ready' && "bg-green-500",
                state === 'result' && "bg-secondary/20",
                state === 'early' && "bg-yellow-900/50"
            )}
            onMouseDown={state === 'idle' || state === 'result' || state === 'early' ? startTest : click}
        >
            <div className="text-center space-y-4 pointer-events-none">
                {state === 'idle' && (
                    <>
                        <h2 className="text-4xl font-bold uppercase tracking-widest text-primary">Reaction Test</h2>
                        <p className="text-muted-foreground">Click or Press Space when ready</p>
                        <p className="text-sm text-muted-foreground pt-4">Wait for Green</p>
                    </>
                )}

                {state === 'waiting' && (
                    <h2 className="text-6xl font-black text-red-500 tracking-widest animate-pulse">WAIT</h2>
                )}

                {state === 'ready' && (
                    <h2 className="text-8xl font-black text-white tracking-widest">CLICK!</h2>
                )}

                {state === 'early' && (
                    <>
                        <h2 className="text-4xl font-bold text-yellow-500">TOO EARLY!</h2>
                        <p className="text-muted-foreground">Click to try again</p>
                    </>
                )}

                {state === 'result' && (
                    <>
                        <div className="flex items-baseline justify-center gap-2">
                            <span className="text-8xl font-mono font-bold text-primary">{getLastScore()}</span>
                            <span className="text-2xl text-muted-foreground">ms</span>
                        </div>
                        <p className="text-muted-foreground">Click to try again</p>

                        {attempts.length > 0 && (
                            <div className="mt-8 p-4 bg-background/50 rounded-lg backdrop-blur text-left min-w-[200px]">
                                <p className="text-sm font-medium text-muted-foreground mb-2">History:</p>
                                <div className="space-y-1">
                                    {attempts.slice(-5).reverse().map((score, i) => (
                                        <div key={i} className="flex justify-between text-sm font-mono">
                                            <span>#{attempts.length - i}</span>
                                            <span className={score < 250 ? "text-primary" : "text-foreground"}>
                                                {Math.round(score)}ms
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

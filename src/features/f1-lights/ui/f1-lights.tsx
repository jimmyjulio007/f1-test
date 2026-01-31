"use client"

import { useEffect } from "react"
import { useF1Store } from "../model/store"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"

import { useSound } from "@/shared/hooks/useSound"

export function F1Lights() {
    const { state, lightsOn, reactionTime, startSequence, click, reset } = useF1Store()
    const { play } = useSound()

    // Sound Effects
    useEffect(() => {
        if (state === 'counting' && lightsOn > 0) play('countdown')
        if (state === 'early') play('error')
        if (state === 'result') {
            if (reactionTime && reactionTime < 200) play('perfect')
            else play('success')
        }
    }, [state, lightsOn, reactionTime, play])

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault()
                if (state === 'idle' || state === 'result' || state === 'early') {
                    startSequence()
                } else {
                    click()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [state, startSequence, click])

    return (
        <div
            className="w-full flex flex-col items-center justify-center space-y-12"
            onMouseDown={(e) => {
                // Prevent double triggers if clicking buttons
                if ((e.target as Element).tagName === 'BUTTON') return
                if (state === 'idle' || state === 'result' || state === 'early') return
                click()
            }}
        >
            {/* Lights Container */}
            <div className="bg-black/80 p-6 rounded-2xl border border-gray-800 shadow-2xl flex gap-4 md:gap-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                        {/* The Light */}
                        <div
                            className={cn(
                                "w-12 h-12 md:w-20 md:h-20 rounded-full border-4 border-gray-900 transition-all duration-75",
                                lightsOn >= i ? "bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] scale-105" : "bg-red-950/30",
                                state === 'early' && lightsOn >= i && "bg-red-600 animate-pulse" // Shame lights
                            )}
                        />
                        <div className="h-2 rounded-full bg-gray-800 w-full" />
                    </div>
                ))}
            </div>

            {/* Helper Text / Feedback */}
            <div className="h-32 flex flex-col items-center justify-center">
                {state === 'idle' && (
                    <div className="text-center space-y-4">
                        <Button
                            onClick={startSequence}
                            size="lg"
                            className="text-xl px-12 py-6 font-bold tracking-widest bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                            START SEQUENCE
                        </Button>
                        <p className="text-muted-foreground">Press Space or Button to start</p>
                    </div>
                )}

                {state === 'early' && (
                    <div className="text-center space-y-2">
                        <h2 className="text-4xl font-black text-yellow-500 uppercase tracking-widest">JUMP START!</h2>
                        <Button variant="outline" onClick={reset}>Try Again</Button>
                    </div>
                )}

                {state === 'result' && reactionTime !== null && (
                    <div className="text-center space-y-4">
                        <div className="flex flex-col items-center">
                            <span className="text-sm text-muted-foreground uppercase tracking-widest">Reaction Time</span>
                            <div className="flex items-baseline gap-2">
                                <span className={cn(
                                    "text-6xl md:text-8xl font-mono font-bold tracking-tighter",
                                    reactionTime < 200 ? "text-primary text-glow" : "text-white"
                                )}>
                                    {Math.round(reactionTime)}
                                </span>
                                <span className="text-xl text-muted-foreground">ms</span>
                            </div>
                        </div>
                        <Button onClick={startSequence} variant="secondary">Go Again</Button>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="max-w-md text-center text-sm text-muted-foreground bg-secondary/20 p-4 rounded-lg">
                <p>Wait for all 5 lights to turn RED. <br /> When they go OUT, click as fast as possible.</p>
            </div>
        </div>
    )
}

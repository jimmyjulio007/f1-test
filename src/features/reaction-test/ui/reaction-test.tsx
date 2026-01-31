"use client"

import { useEffect } from "react"
import { useReactionStore } from "../model/store"
import { cn } from "@/shared/lib/utils"
import { useSound } from "@/shared/hooks/useSound"
import { PAGE_CONTENT } from "@/shared/constants/content"

export function ReactionTest() {
    const { state, attempts, startTest, click } = useReactionStore()
    const { play } = useSound()

    useEffect(() => {
        if (state === 'waiting') play('start')
        if (state === 'ready') play('countdown')
        if (state === 'early') play('error')
        if (state === 'result') {
            const score = attempts[attempts.length - 1]
            if (score && score < 200) play('perfect')
            else play('success')
        }
    }, [state, attempts, play])

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
                        <h2 className="text-4xl font-bold uppercase tracking-widest text-primary">{PAGE_CONTENT.REACTION_TEST.TITLE}</h2>
                        <p className="text-muted-foreground">{PAGE_CONTENT.REACTION_TEST.SUBTITLE}</p>
                        <p className="text-sm text-muted-foreground pt-4">{PAGE_CONTENT.REACTION_TEST.WAIT_FOR_GREEN}</p>
                    </>
                )}

                {state === 'waiting' && (
                    <h2 className="text-6xl font-black text-red-500 tracking-widest animate-pulse">{PAGE_CONTENT.REACTION_TEST.WAIT}</h2>
                )}

                {state === 'ready' && (
                    <h2 className="text-8xl font-black text-white tracking-widest">{PAGE_CONTENT.REACTION_TEST.CLICK}</h2>
                )}

                {state === 'early' && (
                    <>
                        <h2 className="text-4xl font-bold text-yellow-500">{PAGE_CONTENT.REACTION_TEST.TOO_EARLY}</h2>
                        <p className="text-muted-foreground">{PAGE_CONTENT.REACTION_TEST.TRY_AGAIN}</p>
                    </>
                )}

                {state === 'result' && (
                    <>
                        <div className="flex items-baseline justify-center gap-2">
                            <span className="text-8xl font-mono font-bold text-primary">{getLastScore()}</span>
                            <span className="text-2xl text-muted-foreground">{PAGE_CONTENT.REACTION_TEST.MILLISECONDS}</span>
                        </div>
                        <p className="text-muted-foreground">{PAGE_CONTENT.REACTION_TEST.TRY_AGAIN}</p>

                        {attempts.length > 0 && (
                            <div className="mt-8 p-4 bg-background/50 rounded-lg backdrop-blur text-left min-w-[200px]">
                                <p className="text-sm font-medium text-muted-foreground mb-2">{PAGE_CONTENT.REACTION_TEST.HISTORY}</p>
                                <div className="space-y-1">
                                    {attempts.slice(-5).reverse().map((score, i) => (
                                        <div key={i} className="flex justify-between text-sm font-mono">
                                            <span>#{attempts.length - i}</span>
                                            <span className={score < 250 ? "text-primary" : "text-foreground"}>
                                                {Math.round(score)}{PAGE_CONTENT.REACTION_TEST.MILLISECONDS}
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

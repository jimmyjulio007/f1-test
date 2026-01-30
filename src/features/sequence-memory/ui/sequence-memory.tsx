"use client"

import { useEffect, useState } from "react"
import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"
import { cn } from "@/shared/lib/utils"
import { authService } from "@/features/auth/model/auth-service"
import { dbRequest } from "@/shared/lib/db"
import { gamificationService } from "@/shared/services/gamification"
import { TEST_MODES, SEQUENCE_CONFIG } from "@/shared/constants/app"
import { generateSequence, getSequenceSpeed } from "@/shared/utils/sequence"
import { useSequenceStore } from "../model/store"
import type { Direction } from "@/shared/types"
import {
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUpLeft,
    ArrowUpRight,
    ArrowDownLeft,
    ArrowDownRight
} from "lucide-react"

const DIRECTION_ICONS: Record<Direction, any> = {
    UP: ArrowUp,
    DOWN: ArrowDown,
    LEFT: ArrowLeft,
    RIGHT: ArrowRight,
    UP_LEFT: ArrowUpLeft,
    UP_RIGHT: ArrowUpRight,
    DOWN_LEFT: ArrowDownLeft,
    DOWN_RIGHT: ArrowDownRight
}

const DIRECTION_COLORS: Record<Direction, string> = {
    UP: "bg-blue-500",
    DOWN: "bg-yellow-500",
    LEFT: "bg-red-500",
    RIGHT: "bg-green-500",
    UP_LEFT: "bg-purple-500",
    UP_RIGHT: "bg-cyan-500",
    DOWN_LEFT: "bg-orange-500",
    DOWN_RIGHT: "bg-pink-500"
}

export function SequenceMemory() {
    const {
        gameState,
        sequence,
        userInput,
        currentLevel,
        score,
        showingIndex,
        bestScore,
        lastTapped,
        setGameState,
        setSequence,
        addUserInput,
        clearUserInput,
        incrementLevel,
        setScore,
        incrementShowingIndex,
        setShowingIndex,
        setBestScore,
        setLastTapped,
        incrementTapCounter,
        resetGame,
    } = useSequenceStore()

    // Track which direction is currently flashing during showing phase
    const [flashingDirection, setFlashingDirection] = useState<Direction | null>(null)

    const startGame = () => {
        resetGame()
        setFlashingDirection(null)
    }

    const saveScore = async () => {
        const user = authService.getCurrentUser()
        if (!user) return

        try {
            await dbRequest.addScore(user.id, TEST_MODES.SEQUENCE, score, 100)

            // Handle gamification
            await gamificationService.onTestComplete(user.id, {
                mode: TEST_MODES.SEQUENCE,
                score,
                accuracy: 100,
            })
        } catch (error) {
            console.error("Failed to save score:", error)
        }
    }

    // Show sequence animation with progressive speed and clear flash effect
    useEffect(() => {
        if (gameState === "showing" && showingIndex < sequence.length) {
            const speed = getSequenceSpeed(currentLevel)
            const currentDirection = sequence[showingIndex]

            // Flash the direction
            setFlashingDirection(currentDirection)

            // Clear the flash before moving to next
            const clearFlashTimer = setTimeout(() => {
                setFlashingDirection(null)
            }, speed * SEQUENCE_CONFIG.FLASH_DURATION_PERCENT)

            // Move to next direction
            const nextTimer = setTimeout(() => {
                incrementShowingIndex()
            }, speed)

            return () => {
                clearTimeout(clearFlashTimer)
                clearTimeout(nextTimer)
            }
        } else if (gameState === "showing" && showingIndex >= sequence.length) {
            setFlashingDirection(null)
            const timer = setTimeout(() => {
                setGameState("input")
                setShowingIndex(-1)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [gameState, showingIndex, sequence.length, currentLevel, incrementShowingIndex, setGameState, setShowingIndex, sequence])

    const handleDirectionClick = (direction: Direction) => {
        if (gameState !== "input") return

        // Clear and flash
        setLastTapped(null)
        requestAnimationFrame(() => {
            setLastTapped(direction)
            incrementTapCounter()

            setTimeout(() => {
                setLastTapped(null)
            }, 150)
        })

        addUserInput(direction)
        const newInputLength = userInput.length + 1

        if (direction !== sequence[newInputLength - 1]) {
            setGameState("wrong")
            if (score > bestScore) {
                setBestScore(score)
                saveScore()
            }
            setTimeout(() => {
                setGameState("idle")
                setLastTapped(null)
            }, 1500)
            return
        }

        if (newInputLength === sequence.length) {
            const newScore = score + currentLevel * 10
            setScore(newScore)
            setGameState("correct")

            setTimeout(() => {
                incrementLevel()
                clearUserInput()
                setLastTapped(null)
                const newSequence = generateSequence(2 + currentLevel + 1)
                setSequence(newSequence)
                setGameState("showing")
                setShowingIndex(0)
            }, 1000)
        }
    }

    const DirectionButton = ({ direction }: { direction: Direction }) => {
        const Icon = DIRECTION_ICONS[direction]
        const isShowing = flashingDirection === direction
        const isTapped = lastTapped === direction

        return (
            <button
                onClick={() => handleDirectionClick(direction)}
                disabled={gameState !== "input"}
                className={cn(
                    "aspect-square rounded-xl flex items-center justify-center transition-all duration-200 border-2 relative",
                    isShowing || isTapped
                        ? `${DIRECTION_COLORS[direction]} scale-110 shadow-2xl border-white`
                        : "bg-white/10 border-white/20 hover:bg-white/20",
                    gameState === "input" && "hover:scale-105 cursor-pointer active:scale-95",
                    gameState !== "input" && "cursor-not-allowed opacity-50"
                )}
            >
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" strokeWidth={3} />
            </button>
        )
    }

    const currentSpeed = getSequenceSpeed(currentLevel)

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-to-br from-primary/20 to-transparent border-primary/40">
                    <div className="text-sm text-muted-foreground mb-1">Current Score</div>
                    <div className="text-3xl font-bold font-mono text-primary">{score}</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-yellow-500/20 to-transparent border-yellow-500/40">
                    <div className="text-sm text-muted-foreground mb-1">Best Score</div>
                    <div className="text-3xl font-bold font-mono text-yellow-500">{bestScore}</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-cyan-500/20 to-transparent border-cyan-500/40 col-span-2 sm:col-span-1">
                    <div className="text-sm text-muted-foreground mb-1">Speed</div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-500">{currentSpeed}ms</div>
                </Card>
            </div>

            <Card className="p-6 sm:p-8 bg-black/40 backdrop-blur-sm">
                <div className="space-y-6">
                    {gameState !== "idle" && (
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">Level</div>
                            <div className="text-5xl font-bold font-mono text-white">{currentLevel}</div>
                            {gameState === "showing" && (
                                <div className="text-xs text-muted-foreground mt-2">
                                    Speed: {currentSpeed}ms per arrow
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
                        <DirectionButton direction="UP_LEFT" />
                        <DirectionButton direction="UP" />
                        <DirectionButton direction="UP_RIGHT" />

                        <DirectionButton direction="LEFT" />
                        <div className="aspect-square flex items-center justify-center border-2 border-white/10 rounded-xl">
                            <div className="w-4 h-4 rounded-full bg-white/20" />
                        </div>
                        <DirectionButton direction="RIGHT" />

                        <DirectionButton direction="DOWN_LEFT" />
                        <DirectionButton direction="DOWN" />
                        <DirectionButton direction="DOWN_RIGHT" />
                    </div>

                    <div className="text-center h-8">
                        {gameState === "idle" && (
                            <p className="text-muted-foreground">Click Start to begin the 8-direction challenge</p>
                        )}
                        {gameState === "showing" && (
                            <p className="text-primary font-semibold animate-pulse">Watch the sequence...</p>
                        )}
                        {gameState === "input" && (
                            <p className="text-accent font-semibold">Your turn! Repeat the sequence</p>
                        )}
                        {gameState === "correct" && (
                            <p className="text-green-500 font-bold text-xl">Correct!</p>
                        )}
                        {gameState === "wrong" && (
                            <p className="text-destructive font-bold text-xl">Wrong!</p>
                        )}
                    </div>

                    {gameState === "input" && (
                        <div className="flex justify-center gap-2 flex-wrap">
                            {sequence.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-2 w-8 rounded-full transition-colors",
                                        index < userInput.length ? "bg-primary" : "bg-white/20"
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    {gameState === "idle" && (
                        <div className="flex justify-center pt-4">
                            <Button
                                size="lg"
                                onClick={startGame}
                                className="h-14 px-12 text-lg font-bold uppercase tracking-wider cursor-pointer"
                            >
                                Start Challenge
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="font-bold mb-2 text-primary">How to Play:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Watch the sequence of 8 directional arrows that light up</li>
                    <li>• Each arrow flashes clearly, even if the same one repeats</li>
                    <li>• Repeat the exact sequence by clicking the arrows</li>
                    <li>• Each level adds more directions AND increases speed</li>
                    <li>• Speed starts at 800ms and decreases to 300ms minimum</li>
                    <li>• Your taps will flash to show visual feedback</li>
                    <li>• One mistake ends the game - stay focused!</li>
                </ul>
            </Card>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { ReactionTest } from "@/features/reaction-test/ui/reaction-test"
import { F1Lights } from "@/features/f1-lights/ui/f1-lights"
import { DecisionTest } from "@/features/decision-test/ui/decision-test"
import { SequenceMemory } from "@/features/sequence-memory/ui/sequence-memory"
import { TEST_MODES } from "@/shared/constants/app"
import { Card } from "@/shared/ui/card"
import { motion } from "framer-motion"

interface MultiplayerArenaProps {
    mode: string
    onComplete: (score: number) => void
    opponentScores: Record<string, number>
}

export function MultiplayerArena({ mode, onComplete, opponentScores }: MultiplayerArenaProps) {
    // We wrap the existing tests. 
    // However, the existing tests save to DB directly.
    // For multiplayer, we might want to intercept that or just use the same logic.

    return (
        <div className="space-y-6">
            {/* Live Leaderboard Overlay */}
            <div className="fixed top-20 right-6 z-40 space-y-2 pointer-events-none">
                <h4 className="text-xs font-bold text-primary uppercase text-right">Live Standings</h4>
                {Object.entries(opponentScores).sort((a, b) => b[1] - a[1]).map(([name, score]) => (
                    <motion.div
                        key={name}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-black/80 border border-primary/20 p-2 rounded text-sm min-w-[150px] flex justify-between gap-4"
                    >
                        <span className="font-bold">{name}</span>
                        <span className="text-primary font-mono">{score}</span>
                    </motion.div>
                ))}
            </div>

            <Card className="p-8 bg-black/40 border-primary/20 relative overflow-hidden">
                {/* Arena Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    {mode === TEST_MODES.REACTION && <ReactionTest />}
                    {mode === TEST_MODES.F1_LIGHTS && <F1Lights />}
                    {mode === TEST_MODES.DECISION && <DecisionTest />}
                    {mode === TEST_MODES.SEQUENCE && <SequenceMemory />}
                </div>
            </Card>

            <div className="text-center text-xs text-muted-foreground animate-pulse">
                MULTIPLAYER MATCH IN PROGRESS • DRIVE FAST
            </div>
        </div>
    )
}

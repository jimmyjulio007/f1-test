"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { getTodaysChallenge, isDailyChallengeCompleted } from '@/shared/utils/daily-challenge'
import { TEST_MODE_LABELS } from '@/shared/constants/app'
import type { DailyChallenge } from '@/shared/types'
import { Trophy, CheckCircle } from 'lucide-react'

export function DailyChallengeCard() {
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const todayChallenge = getTodaysChallenge()
        setChallenge(todayChallenge)
        setLoading(false)
    }, [])

    if (loading || !challenge) {
        return null
    }

    const isCompleted = challenge.completed

    return (
        <Card className={cn(
            "p-6 border-2 transition-all",
            isCompleted
                ? "bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30"
                : "bg-gradient-to-br from-primary/10 to-transparent border-primary/30"
        )}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-3 rounded-lg",
                        isCompleted ? "bg-green-500/20" : "bg-primary/20"
                    )}>
                        {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                            <Trophy className="w-6 h-6 text-primary" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Daily Challenge</h3>
                        <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-sm text-muted-foreground">Reward</div>
                    <div className="text-xl font-bold text-primary">+{challenge.xpReward} XP</div>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="text-xs text-muted-foreground mb-1">Mode</div>
                    <div className="text-sm font-semibold">{TEST_MODE_LABELS[challenge.testMode]}</div>
                </div>

                <div>
                    <div className="text-xs text-muted-foreground mb-1">Challenge</div>
                    <div className="text-sm font-medium">{challenge.description}</div>
                </div>

                {isCompleted ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 text-green-500 font-semibold text-sm mt-4"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Completed! Come back tomorrow!
                    </motion.div>
                ) : (
                    <Button
                        className="w-full mt-4 cursor-pointer"
                        onClick={() => {
                            // Navigate to appropriate test
                            window.location.href = `/tests/${challenge.testMode.toLowerCase().replace('_', '-')}`
                        }}
                    >
                        Start Challenge 🎯
                    </Button>
                )}
            </div>
        </Card>
    )
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}

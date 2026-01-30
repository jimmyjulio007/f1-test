"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/card'
import { authService } from '@/features/auth/model/auth-service'
import { gamificationService } from '@/shared/services/gamification'
import { RANK_COLORS, RANK_ICONS } from '@/shared/utils/xp'
import type { UserLevel } from '@/shared/types'

export function XPProgressBar() {
    const [levelData, setLevelData] = useState<UserLevel | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadLevel() {
            const user = authService.getCurrentUser()
            if (!user) {
                setLoading(false)
                return
            }

            const data = await gamificationService.getUserLevel(user.id)
            setLevelData(data)
            setLoading(false)
        }

        loadLevel()
    }, [])

    if (loading || !levelData) {
        return null
    }

    const progress = (levelData.currentXP / levelData.xpToNextLevel) * 100

    return (
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{RANK_ICONS[levelData.rank]}</span>
                    <div>
                        <div className="text-sm text-muted-foreground">Level {levelData.level}</div>
                        <div className={`text-xs font-semibold ${RANK_COLORS[levelData.rank]}`}>
                            {levelData.rank}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-muted-foreground">XP</div>
                    <div className="text-sm font-mono font-bold text-primary">
                        {levelData.currentXP}/{levelData.xpToNextLevel}
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            </div>

            <div className="mt-1 text-center text-xs text-muted-foreground">
                {Math.round(progress)}% to Level {levelData.level + 1}
            </div>
        </Card>
    )
}

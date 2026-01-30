"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/shared/ui/card'
import { authService } from '@/features/auth/model/auth-service'
import { dbRequest } from '@/shared/lib/db'
import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'

export function StreakDisplay() {
    const [streak, setStreak] = useState(0)
    const [longest, setLongest] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStreak() {
            const user = authService.getCurrentUser()
            if (!user) {
                setLoading(false)
                return
            }

            const progress = await dbRequest.getUserProgress(user.id)
            setStreak(progress.currentStreak)
            setLongest(progress.longestStreak)
            setLoading(false)
        }

        loadStreak()
    }, [])

    if (loading) {
        return null
    }

    return (
        <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{
                            scale: streak > 0 ? [1, 1.2, 1] : 1,
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Flame className={`w-8 h-8 ${streak > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
                    </motion.div>

                    <div>
                        <div className="text-sm text-muted-foreground">Current Streak</div>
                        <div className="text-2xl font-bold font-mono text-orange-500">
                            {streak} {streak === 1 ? 'day' : 'days'}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs text-muted-foreground">Best Streak</div>
                    <div className="text-lg font-bold font-mono text-yellow-500">
                        {longest} {longest === 1 ? 'day' : 'days'}
                    </div>
                </div>
            </div>

            {streak > 0 && (
                <div className="mt-3 text-center text-xs text-muted-foreground">
                    🔥 Keep it up! Come back tomorrow to maintain your streak!
                </div>
            )}
        </Card>
    )
}

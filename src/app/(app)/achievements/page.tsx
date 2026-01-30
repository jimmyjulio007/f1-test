"use client"

import { useEffect, useState } from 'react'
import { authService } from '@/features/auth/model/auth-service'
import { gamificationService } from '@/shared/services/gamification'
import { AchievementCard } from '@/features/gamification/ui/achievement-card'
import { Card } from '@/shared/ui/card'
import type { Achievement } from '@/shared/types'

interface AchievementWithStatus extends Achievement {
    unlocked: boolean
    unlockedAt?: Date
    progress: number
}

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState<AchievementWithStatus[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

    useEffect(() => {
        async function loadAchievements() {
            const user = authService.getCurrentUser()
            if (!user) {
                setLoading(false)
                return
            }

            const userAchievements = await gamificationService.getUserAchievements(user.id)
            setAchievements(userAchievements as AchievementWithStatus[])
            setLoading(false)
        }

        loadAchievements()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading achievements...</div>
            </div>
        )
    }

    const filtered = achievements.filter(ach => {
        if (filter === 'unlocked') return ach.unlocked
        if (filter === 'locked') return !ach.unlocked
        return true
    })

    const unlockedCount = achievements.filter(a => a.unlocked).length
    const totalCount = achievements.length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">🏆 Achievements</h1>
                <p className="text-muted-foreground">
                    {unlockedCount} of {totalCount} unlocked ({Math.round((unlockedCount / totalCount) * 100)}%)
                </p>
            </div>

            {/* Progress Bar */}
            <Card className="p-4">
                <div className="mb-2 flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-bold text-primary">{unlockedCount}/{totalCount}</span>
                </div>
                <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                        style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                    />
                </div>
            </Card>

            {/* Filters */}
            <div className="flex gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                            ? 'bg-primary text-black font-bold'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                >
                    All ({totalCount})
                </button>
                <button
                    onClick={() => setFilter('unlocked')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'unlocked'
                            ? 'bg-primary text-black font-bold'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                >
                    Unlocked ({unlockedCount})
                </button>
                <button
                    onClick={() => setFilter('locked')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'locked'
                            ? 'bg-primary text-black font-bold'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                >
                    Locked ({totalCount - unlockedCount})
                </button>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((achievement) => (
                    <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        unlocked={achievement.unlocked}
                        unlockedAt={achievement.unlockedAt}
                        progress={achievement.progress}
                    />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                    No achievements found in this category.
                </div>
            )}
        </div>
    )
}

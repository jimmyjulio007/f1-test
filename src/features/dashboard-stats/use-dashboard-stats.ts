"use client"

import { useEffect, useState } from "react"
import { dbRequest } from "@/shared/lib/db"
import { authService } from "@/features/auth/model/auth-service"
import { TIME_CONSTANTS, TEST_MODES } from "@/shared/constants/app"
import type { UserStats } from "@/shared/types"

export function useDashboardStats() {
    const [stats, setStats] = useState<UserStats>({
        avgReaction: null,
        accuracy: 100,
        totalTime: 0,
        rank: 0,
        recentScores: []
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            const user = authService.getCurrentUser()
            if (!user) {
                setLoading(false)
                return
            }

            try {
                const db = await dbRequest.getUserStats(user.id)

                // Get all user scores
                const allScores = await dbRequest.getUserScores(user.id)

                if (allScores.length === 0) {
                    setLoading(false)
                    return
                }

                // Calculate average reaction time (across all modes)
                const avgReaction = allScores.reduce((sum, s) => sum + s.reactionMs, 0) / allScores.length

                // Calculate accuracy (for decision test, default 100% for others)
                const decisonScores = allScores.filter(s => s.mode === TEST_MODES.DECISION)
                const accuracy = decisonScores.length > 0
                    ? decisonScores.reduce((sum, s) => sum + s.accuracy, 0) / decisonScores.length
                    : 100

                // Estimate total training time (seconds per test, convert to minutes)
                const totalTime = Math.round((allScores.length * TIME_CONSTANTS.SECONDS_PER_TEST) / TIME_CONSTANTS.SECONDS_IN_MINUTE)

                // Get user progress for ranking calculation
                const progress = await dbRequest.getUserProgress(user.id)

                // MOCK RANK: In a real app, this would be an API call to count users with higher XP
                // Higher XP = Lower Rank number (Rank 1 is best)
                // We'll simulate a rank between 100 and 15000 based on total tests and XP
                const mockBaseRank = 15420
                const rankImprovement = (progress.totalXP / 10) + (progress.totalTests * 5)
                const rank = Math.max(1, Math.round(mockBaseRank - rankImprovement))

                // Get recent 5 scores
                const recentScores = allScores
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .slice(0, 5)
                    .map(s => ({
                        mode: s.mode,
                        score: s.reactionMs,
                        timestamp: s.createdAt
                    }))

                setStats({
                    avgReaction,
                    accuracy,
                    totalTime,
                    rank,
                    recentScores
                })
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return { stats, loading }
}

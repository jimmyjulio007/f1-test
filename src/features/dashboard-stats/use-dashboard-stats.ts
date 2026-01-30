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
                    rank: 0, // Will need global ranking logic later
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

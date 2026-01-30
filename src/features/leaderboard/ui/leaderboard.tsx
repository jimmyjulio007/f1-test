"use client"

import { useEffect, useState } from "react"
import { getLeaderboard } from "@/features/leaderboard/api/queries"
import { LeaderboardTable } from "@/features/leaderboard/ui/table"

export function LeaderboardWidget() {
    const [data, setData] = useState({ reaction: [], f1: [], decision: [] })

    useEffect(() => {
        async function fetchScores() {
            const reaction = await getLeaderboard("REACTION")
            const f1 = await getLeaderboard("F1_LIGHTS")
            const decision = await getLeaderboard("DECISION")
            setData({ reaction, f1, decision } as any)
        }
        fetchScores()
    }, [])

    return (
        <div className="w-full space-y-8">
            <LeaderboardTable data={data} />
        </div>
    )
}

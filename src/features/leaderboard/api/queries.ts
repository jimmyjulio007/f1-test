"use client"

import { dbRequest } from "@/shared/lib/db"

export async function getLeaderboard(mode: string = "REACTION") {
    return dbRequest.getTopScores(mode)
}

"use client"

import { dbRequest } from "@/shared/lib/db"
import { authService } from "@/features/auth/model/auth-service"

export async function saveDecisionScore(reactionMs: number, accuracy: number) {
    const user = authService.getCurrentUser()
    if (!user) return { error: "User not found" }

    try {
        await dbRequest.addScore(user.id, "DECISION", reactionMs, accuracy)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to save score" }
    }
}

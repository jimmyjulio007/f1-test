import { dbRequest } from "@/shared/lib/db"
import { authService } from "@/features/auth/model/auth-service"
import { gamificationService } from "@/shared/services/gamification"
import { TEST_MODES } from "@/shared/constants/app"

export async function saveDecisionScore(reactionMs: number, accuracy: number) {
    const user = authService.getCurrentUser()
    if (!user) return { error: "User not found" }

    try {
        await dbRequest.addScore(user.id, TEST_MODES.DECISION, reactionMs, accuracy)

        // Handle gamification (XP, achievements)
        await gamificationService.onTestComplete(user.id, {
            mode: TEST_MODES.DECISION,
            reactionMs,
            accuracy,
        })

        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to save score" }
    }
}

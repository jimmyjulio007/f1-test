import { dbRequest } from "@/shared/lib/db"
import { authService } from "@/features/auth/model/auth-service"
import { gamificationService } from "@/shared/services/gamification"
import { TEST_MODES } from "@/shared/constants/app"

export async function saveReactionScore(reactionMs: number) {
    const user = authService.getCurrentUser()
    if (!user) return { error: "User not found" }

    try {
        // Save score to DB
        await dbRequest.addScore(user.id, TEST_MODES.REACTION, reactionMs, 100)

        // Handle gamification (XP, achievements)
        await gamificationService.onTestComplete(user.id, {
            mode: TEST_MODES.REACTION,
            reactionMs,
            accuracy: 100,
        })

        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to save score" }
    }
}

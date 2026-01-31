import { authService } from "@/features/auth/model/auth-service";
import { API_ENDPOINTS, UI_MESSAGES } from "@/shared/constants/messages";

export class ScoreService {
    async saveScore(score: number, gameMode: string) {
        const user = authService.getCurrentUser();

        if (!user) {
            console.warn(UI_MESSAGES.NO_USER_FOUND);
            return { error: "User not found" };
        }

        try {
            const response = await fetch(API_ENDPOINTS.SCORES_SAVE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user.username,
                    score,
                    gameMode
                })
            });

            if (!response.ok) {
                throw new Error("Failed to save score");
            }

            return { success: true };
        } catch (error) {
            console.error(`Error saving ${gameMode} score:`, error);
            return { error: "Failed to save score" };
        }
    }
}

export const scoreService = new ScoreService();

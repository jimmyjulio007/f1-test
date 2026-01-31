import { TEST_MODES } from "@/shared/constants/app"

export interface LeaderboardEntry {
    rank: number
    userId: string
    username: string
    score: number
    level: number
    avatar?: string
    country?: string
    isYou?: boolean
}

class LeaderboardService {
    async getGlobalRankings(mode: string): Promise<LeaderboardEntry[]> {
        try {
            const response = await fetch(`/api/leaderboard/get?gameMode=${mode}&limit=50`);
            if (!response.ok) {
                throw new Error("Failed to fetch leaderboard");
            }
            const data = await response.json();

            // Get current user to mark their entry
            const currentUsername = localStorage.getItem('neuro_username');

            return data.map((entry: any) => ({
                ...entry,
                isYou: entry.username === currentUsername
            }));
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            return [];
        }
    }

    async getTopThree(mode: string): Promise<LeaderboardEntry[]> {
        const rankings = await this.getGlobalRankings(mode);
        return rankings.slice(0, 3);
    }

    async getUserRank(userId: string, mode: string): Promise<LeaderboardEntry | null> {
        const rankings = await this.getGlobalRankings(mode);
        return rankings.find(r => r.userId === userId) || null;
    }
}

export const leaderboardService = new LeaderboardService()

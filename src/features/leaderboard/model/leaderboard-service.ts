import { TEST_MODES } from "@/shared/constants/app"
import { dbRequest } from "@/shared/lib/db"

export interface LeaderboardEntry {
    rank: number
    userId: string
    username: string
    score: number
    level: number
    avatar?: string
    isYou?: boolean
}

class LeaderboardService {
    // World benchmarks to mix with local data
    private benchmarks: Record<string, any[]> = {
        [TEST_MODES.REACTION]: [
            { userId: 'w1', username: 'LewisH_44', score: 142, level: 85 },
            { userId: 'w2', username: 'MaxV_33', score: 148, level: 82 },
            { userId: 'w3', username: 'CharlesL_16', score: 151, level: 78 },
        ]
    }

    async getGlobalRankings(mode: string): Promise<LeaderboardEntry[]> {
        // Fetch local scores from IDB
        const localTop = await dbRequest.getTopScores(mode, 20)

        // Convert local scores to LeaderboardEntry format
        const localEntries = await Promise.all(localTop.map(async (s) => {
            const progress = await dbRequest.getUserProgress(s.userId)
            return {
                userId: s.userId,
                username: s.user.username,
                score: s.reactionMs,
                level: progress.level,
                isYou: true // Mark local players
            }
        }))

        // Mix with global benchmarks
        const worldBenchmarks = this.benchmarks[mode] || []

        // Combine and sort
        const combined = [...localEntries, ...worldBenchmarks]
            .sort((a, b) => a.score - b.score) // Lower is better for reaction
            .map((entry, index) => ({
                ...entry,
                rank: index + 1
            }))

        return combined
    }

    async getTopThree(mode: string): Promise<LeaderboardEntry[]> {
        const rankings = await this.getGlobalRankings(mode)
        return rankings.slice(0, 3)
    }

    async getUserRank(userId: string, mode: string): Promise<LeaderboardEntry | null> {
        const rankings = await this.getGlobalRankings(mode)
        return rankings.find(r => r.userId === userId) || null
    }
}

export const leaderboardService = new LeaderboardService()

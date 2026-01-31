import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";
import { API_MESSAGES, DEFAULT_VALUES } from "@/shared/constants/messages";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: API_MESSAGES.METHOD_NOT_ALLOWED });
    }

    const { gameMode, limit = String(DEFAULT_VALUES.LEADERBOARD_LIMIT) } = req.query;

    try {
        const whereClause = gameMode && gameMode !== "ALL"
            ? `WHERE s."gameMode" = '${gameMode}'`
            : '';

        const leaderboard = await prisma.$queryRawUnsafe<Array<{
            rank: bigint;
            userId: string;
            username: string;
            avatar: string | null;
            score: number;
            level: number;
            country: string | null;
            gameMode: string;
        }>>(`
            WITH RankedScores AS (
                SELECT 
                    s."userId",
                    s.score,
                    s."gameMode",
                    u.username,
                    u.avatar,
                    u.level,
                    u.country,
                    ROW_NUMBER() OVER (PARTITION BY s."userId" ORDER BY s.score ASC) as rn
                FROM "Score" s
                INNER JOIN "User" u ON s."userId" = u.id
                ${whereClause}
            )
            SELECT 
                ROW_NUMBER() OVER (ORDER BY score ASC) as rank,
                "userId",
                username,
                avatar,
                score,
                level,
                country,
                "gameMode"
            FROM RankedScores
            WHERE rn = 1
            ORDER BY score ASC
            LIMIT ${parseInt(limit as string)}
        `);

        const formattedLeaderboard = leaderboard.map(entry => ({
            ...entry,
            rank: Number(entry.rank)
        }));

        res.status(200).json(formattedLeaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: API_MESSAGES.INTERNAL_SERVER_ERROR });
    }
}

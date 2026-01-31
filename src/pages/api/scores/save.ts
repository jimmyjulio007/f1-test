import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";
import { API_MESSAGES, DEFAULT_VALUES } from "@/shared/constants/messages";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: API_MESSAGES.METHOD_NOT_ALLOWED });
    }

    const { username, score, gameMode } = req.body;

    if (!username || score === undefined || !gameMode) {
        return res.status(400).json({ message: API_MESSAGES.MISSING_REQUIRED_FIELDS });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.upsert({
                where: { username },
                update: {
                    gamesPlayed: { increment: 1 }
                },
                create: {
                    username,
                    totalScore: DEFAULT_VALUES.TOTAL_SCORE,
                    level: DEFAULT_VALUES.LEVEL,
                    gamesPlayed: DEFAULT_VALUES.GAMES_PLAYED
                }
            });

            const savedScore = await tx.score.create({
                data: {
                    score: score,
                    gameMode: gameMode,
                    userId: user.id
                }
            });

            if (score > user.totalScore) {
                const newLevel = Math.floor(score / DEFAULT_VALUES.POINTS_PER_LEVEL) + 1;
                await tx.user.update({
                    where: { id: user.id },
                    data: {
                        totalScore: score,
                        level: newLevel
                    }
                });
            }

            return { savedScore, shouldBroadcast: score > user.totalScore };
        });

        if (result.shouldBroadcast && (global as any).io) {
            const topUsers = await prisma.user.findMany({
                take: DEFAULT_VALUES.LEADERBOARD_LIMIT,
                orderBy: { totalScore: 'desc' },
                select: {
                    id: true,
                    username: true,
                    totalScore: true,
                    country: true,
                    level: true,
                }
            });

            (global as any).io.emit("leaderboard_update", topUsers.map(u => ({
                id: u.id,
                name: u.username,
                score: u.totalScore,
                country: u.country || DEFAULT_VALUES.COUNTRY,
                level: u.level
            })));
        }

        res.status(200).json({ success: true, score: result.savedScore });
    } catch (error) {
        console.error("Error saving score:", error);
        res.status(500).json({ message: API_MESSAGES.INTERNAL_SERVER_ERROR });
    }
}

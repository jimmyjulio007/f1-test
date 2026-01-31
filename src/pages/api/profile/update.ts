import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";
import { API_MESSAGES, DEFAULT_VALUES } from "@/shared/constants/messages";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: API_MESSAGES.METHOD_NOT_ALLOWED });
    }

    const { username, country, avatar } = req.body;

    if (!username) {
        return res.status(400).json({ message: API_MESSAGES.USERNAME_REQUIRED });
    }

    try {
        const user = await prisma.user.upsert({
            where: { username },
            update: {
                country,
                avatar
            },
            create: {
                username,
                country,
                avatar,
                level: DEFAULT_VALUES.LEVEL,
                totalScore: DEFAULT_VALUES.TOTAL_SCORE,
                gamesPlayed: DEFAULT_VALUES.GAMES_PLAYED
            }
        });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: API_MESSAGES.INTERNAL_SERVER_ERROR });
    }
}

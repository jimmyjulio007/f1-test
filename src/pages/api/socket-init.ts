import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";

export type NextApiResponseServerIO = NextApiResponse & {
    socket: any & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};

export const config = {
    api: {
        bodyParser: false,
    },
};

// Store global state
const players: Record<string, any> = {};
const rooms: Record<string, any[]> = {};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        console.log("*First use, starting socket.io*");

        const io = new SocketIOServer(res.socket.server as any, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        // Helper to fetch worldwide leaderboard
        async function getLeaderboard() {
            try {
                const users = await prisma.user.findMany({
                    take: 50,
                    orderBy: {
                        totalScore: 'desc'
                    },
                    select: {
                        id: true,
                        username: true,
                        totalScore: true,
                        country: true,
                        level: true,
                    }
                });

                return users.map(u => ({
                    id: u.id,
                    name: u.username,
                    score: u.totalScore,
                    country: u.country || "UN",
                    level: u.level
                }));
            } catch (e) {
                console.error("Failed to fetch leaderboard", e);
                return [];
            }
        }

        io.on("connection", async (socket) => {
            console.log(`Socket connected: ${socket.id}`);

            // Send initial leaderboard
            const initialLeaderboard = await getLeaderboard();
            socket.emit("leaderboard_update", initialLeaderboard);

            socket.on("submit_score", async ({ name, score, country }: { name: string; score: number, country?: string }) => {
                console.log(`Global Score submitted: ${name} - ${score} (${country})`);

                try {

                    const user = await prisma.user.upsert({
                        where: { username: name },
                        update: {
                            ...(country ? { country } : {}),
                            gamesPlayed: { increment: 1 }
                        },
                        create: {
                            username: name,
                            totalScore: score,
                            country: country || null,
                            gamesPlayed: 1,
                            level: 1
                        }
                    });


                    await prisma.score.create({
                        data: {
                            score: score,
                            gameMode: "REACTION",
                            userId: user.id
                        }
                    });


                    if (score > user.totalScore) {
                        const newLevel = Math.floor(score / 500) + 1;

                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                totalScore: score,
                                level: newLevel
                            }
                        });
                    }


                    const newLeaderboard = await getLeaderboard();
                    io.emit("leaderboard_update", newLeaderboard);

                } catch (e) {
                    console.error("Error saving score:", e);
                }
            });



            socket.on("join_room", ({ roomId, name, avatar }: { roomId: string; name: string, avatar?: string }, callback?: Function) => {
                socket.join(roomId);

                const isFirstPlayer = !rooms[roomId] || rooms[roomId].length === 0;

                const player = {
                    id: socket.id,
                    name,
                    avatar: avatar || "🏎️",
                    score: 0,
                    roomId,
                    finished: false,
                    ready: false,
                    isHost: isFirstPlayer
                };

                players[socket.id] = player;

                if (!rooms[roomId]) {
                    rooms[roomId] = [];
                    (rooms[roomId] as any).gameMode = "REACTION";
                    (rooms[roomId] as any).state = "LOBBY";
                }
                rooms[roomId].push(player);

                // Notify room of new player list and current game mode
                io.to(roomId).emit("room_update", rooms[roomId]);
                io.to(roomId).emit("game_mode_update", (rooms[roomId] as any).gameMode || "REACTION");
                console.log(`${name} joined room ${roomId}`);

                if (callback) callback({ status: "ok", roomId });
            });

            socket.on("select_game_mode", (mode: string) => {
                const player = players[socket.id];
                if (player && rooms[player.roomId]) {
                    (rooms[player.roomId] as any).gameMode = mode;
                    io.to(player.roomId).emit("game_mode_update", mode);
                }
            });

            socket.on("toggle_ready", () => {
                const player = players[socket.id];
                if (player) {
                    player.ready = !player.ready;
                    io.to(player.roomId).emit("room_update", rooms[player.roomId]);
                }
            });

            socket.on("player_finished", async (finalScore: number) => {
                const player = players[socket.id];
                if (player) {
                    player.score = finalScore;
                    player.finished = true;

                    const room = rooms[player.roomId];
                    const gameMode = (room as any).gameMode || "REACTION";

                    // Save to database
                    try {

                        const user = await prisma.user.upsert({
                            where: { username: player.name },
                            update: {
                                gamesPlayed: { increment: 1 },
                                avatar: player.avatar || "🏎️"
                            },
                            create: {
                                username: player.name,
                                avatar: player.avatar || "🏎️",
                                totalScore: 0,
                                level: 1,
                                gamesPlayed: 1
                            }
                        });


                        await prisma.score.create({
                            data: {
                                score: finalScore,
                                gameMode: gameMode,
                                userId: user.id
                            }
                        });


                        if (finalScore > user.totalScore) {
                            const newLevel = Math.floor(finalScore / 500) + 1;

                            await prisma.user.update({
                                where: { id: user.id },
                                data: {
                                    totalScore: finalScore,
                                    level: newLevel
                                }
                            });
                        }

                        console.log(`Saved score ${finalScore} for ${player.name} in ${gameMode}`);
                    } catch (e) {
                        console.error("Error saving multiplayer score:", e);
                    }

                    io.to(player.roomId).emit("room_update", room);


                    const allFinished = room.every((p: any) => p.finished);
                    if (allFinished) {
                        io.to(player.roomId).emit("game_over", room);
                    }
                }
            });

            socket.on("update_room_score", (score: number) => {
                const player = players[socket.id];
                if (player) {
                    player.score = score;
                    io.to(player.roomId).emit("room_update", rooms[player.roomId]);
                }
            });

            socket.on("start_game", (roomId: string) => {
                console.log(`Game started in room ${roomId}`);
                if (rooms[roomId]) {
                    rooms[roomId].forEach((p: any) => p.finished = false);
                }
                io.to(roomId).emit("game_started");
            });

            socket.on("send_chat", (text: string) => {
                const player = players[socket.id];
                if (player) {
                    const message = {
                        id: Math.random().toString(36).substring(7),
                        text,
                        senderId: player.id,
                        senderName: player.name,
                        timestamp: Date.now()
                    };
                    io.to(player.roomId).emit("chat_message", message);
                }
            });

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
                const player = players[socket.id];
                if (player) {
                    const roomId = player.roomId;
                    if (rooms[roomId]) {
                        rooms[roomId] = rooms[roomId].filter((p: any) => p.id !== socket.id);
                        if (rooms[roomId].length === 0) {
                            delete rooms[roomId];
                        } else {
                            io.to(roomId).emit("room_update", rooms[roomId]);
                        }
                    }
                    delete players[socket.id];
                }
            });
        });

        res.socket.server.io = io;
    } else {
        console.log("socket.io already running");
    }
    res.end();
};

export default ioHandler;

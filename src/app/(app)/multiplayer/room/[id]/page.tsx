"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { roomService } from "@/shared/services/room-service"
import { authService } from "@/features/auth/model/auth-service"
import { playSound } from "@/shared/utils/sounds"
import { TEST_MODE_LABELS, TEST_MODES } from "@/shared/constants/app"
import { RoomChat } from "@/features/gamification/ui/room-chat"
import { MultiplayerArena } from "@/features/gamification/ui/multiplayer-arena"
import type { Room, RoomPlayer, BattleResults } from "@/shared/types/multiplayer"
import { Trophy, Users, Timer, CheckCircle, XCircle, ArrowLeft, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: roomId } = use(params)
    const [room, setRoom] = useState<Room | null>(null)
    const [players, setPlayers] = useState<RoomPlayer[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [countdown, setCountdown] = useState<number | null>(null)
    const [battleResults, setBattleResults] = useState<BattleResults | null>(null)
    const router = useRouter()

    // Initial load
    useEffect(() => {
        const user = authService.getCurrentUser()
        if (!user) {
            router.push("/dashboard")
            return
        }
        setCurrentUser(user)

        async function fetchData() {
            const roomData = await roomService.getRoomByIdOrCode(roomId)
            if (!roomData) {
                router.push("/multiplayer")
                return
            }
            setRoom(roomData)
            const playersData = await roomService.getRoomPlayers(roomId)
            setPlayers(playersData)
            setLoading(false)
        }

        fetchData()
    }, [roomId, router])

    // Poll for room updates (status, players, ready checks)
    useEffect(() => {
        if (!room || room.status === "finished") return

        const interval = setInterval(async () => {
            const updatedRoom = await roomService.getRoomByIdOrCode(roomId)
            const updatedPlayers = await roomService.getRoomPlayers(roomId)

            if (updatedRoom) setRoom(updatedRoom)
            if (updatedPlayers) setPlayers(updatedPlayers)

            // Listen for countdown event via localStorage polling (mock)
            const eventsKey = `room_events_${roomId}`
            const events = JSON.parse(localStorage.getItem(eventsKey) || "[]")
            const startEvent = events.find((e: any) => e.type === "game_start" && e.timestamp > Date.now() - 2000)

            if (startEvent && countdown === null && room.status === "waiting") {
                startCountdown()
            }

            // Check for results
            const endEvent = events.find((e: any) => e.type === "game_end" && e.timestamp > Date.now() - 2000)
            if (endEvent && !battleResults) {
                setBattleResults(endEvent.results)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [roomId, room, countdown, battleResults])

    function startCountdown() {
        playSound("countdown")
        setCountdown(3)
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev === 1) {
                    clearInterval(timer)
                    setTimeout(() => {
                        setCountdown(null)
                        // In a real app, we'd transition to the actual game UI here
                    }, 1000)
                    return 0
                }
                return (prev || 1) - 1
            })
        }, 1000)
    }

    async function handleToggleReady() {
        if (!currentUser || !room) return
        await roomService.toggleReady(room.id, currentUser.id)
        playSound("success")
    }

    async function handleStartGame() {
        if (!room) return
        const allReady = players.every(p => p.ready || p.playerId === room.hostId)
        if (!allReady) {
            alert("All players must be ready!")
            return
        }
        await roomService.startBattle(room.id)
    }

    async function handleLeaveRoom() {
        if (!currentUser || !room) return
        await roomService.leaveRoom(room.id, currentUser.id)
        router.push("/multiplayer")
    }

    if (loading || !room || !currentUser) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Joining room...</div>
            </div>
        )
    }

    const isHost = room.hostId === currentUser.id
    const me = players.find(p => p.playerId === currentUser.id)
    const allReady = players.length > 1 && players.filter(p => p.playerId !== room.hostId).every(p => p.ready)

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Top Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={handleLeaveRoom} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Leave Room
                </Button>
                <div className="text-center">
                    <h1 className="text-2xl font-bold font-orbitron text-primary">ROOM {room.code}</h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{TEST_MODE_LABELS[room.mode]}</p>
                </div>
                <div className="w-24"></div> {/* Spacer for balance */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Content Area */}
                <div className="lg:col-span-2 space-y-4">
                    {room.status === "in_progress" ? (
                        <MultiplayerArena
                            mode={room.mode}
                            opponentScores={players.reduce((acc, p) => ({ ...acc, [p.username]: p.score }), {})}
                            onComplete={async (score) => {
                                // Report score to room (mock)
                                const results = {
                                    winner: currentUser.id,
                                    scores: { [currentUser.id]: score },
                                    duration: 0,
                                    rankings: players.map((p, i) => ({
                                        playerId: p.playerId,
                                        username: p.username,
                                        score: p.playerId === currentUser.id ? score : 0,
                                        rank: i + 1,
                                        xpEarned: 100
                                    }))
                                }
                                await roomService.endBattle(room.id, results)
                            }}
                        />
                    ) : (
                        <>
                            <Card className="p-6 border-primary/20 bg-black/60 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        Lineup ({players.length}/{room.maxPlayers})
                                    </h2>
                                    {isHost && (
                                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">
                                            YOU ARE HOST 👑
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {players.map((player) => (
                                        <motion.div
                                            key={player.playerId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-4 rounded-lg flex items-center justify-between border ${player.playerId === currentUser.id
                                                ? "border-primary bg-primary/10"
                                                : "border-white/10 bg-white/5"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-bold">
                                                    {player.username[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {player.username}
                                                        {player.playerId === room.hostId && <span className="text-[10px] text-yellow-500">HOST</span>}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Level 1 Rookie</div>
                                                </div>
                                            </div>

                                            {player.playerId === room.hostId ? (
                                                <div className="text-xs font-bold text-primary flex items-center gap-1">
                                                    <Play className="w-3 h-3" /> READY
                                                </div>
                                            ) : (
                                                <div className={`text-xs font-bold flex items-center gap-1 ${player.ready ? "text-green-500" : "text-gray-500"}`}>
                                                    {player.ready ? (
                                                        <><CheckCircle className="w-4 h-4" /> READY</>
                                                    ) : (
                                                        <><XCircle className="w-4 h-4" /> NOT READY</>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}

                                    {/* Empty Slots */}
                                    {Array.from({ length: room.maxPlayers - players.length }).map((_, i) => (
                                        <div key={`empty-${i}`} className="p-4 rounded-lg border border-dashed border-white/5 bg-white/2 flex items-center justify-center text-muted-foreground text-xs italic">
                                            Waiting for driver...
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Room Settings Info */}
                            <Card className="p-4 border-white/10 bg-white/5">
                                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                                    <div>
                                        <div className="text-muted-foreground text-xs">ROUNDS</div>
                                        <div className="font-bold">{room.settings.roundCount} Laps</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground text-xs">TIME LIMIT</div>
                                        <div className="font-bold">{room.settings.timeLimit}s</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground text-xs">SPECTATORS</div>
                                        <div className="font-bold">{room.settings.allowSpectators ? "ON" : "OFF"}</div>
                                    </div>
                                </div>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                {!isHost ? (
                                    <Button
                                        onClick={handleToggleReady}
                                        className={`flex-1 h-14 text-lg font-bold ${me?.ready ? "bg-green-600 hover:bg-green-700" : ""}`}
                                    >
                                        {me?.ready ? "UNREADY" : "READY UP"}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleStartGame}
                                        disabled={!allReady}
                                        className="flex-1 h-14 text-lg font-bold btn-glow"
                                    >
                                        START BATTLE 🏎️
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar: Chat & Room Info */}
                <div className="space-y-4">
                    <RoomChat roomId={room.id} playerId={currentUser.id} username={currentUser.username} />

                    <Card className="p-4 bg-primary/10 border-primary/20">
                        <div className="text-xs text-muted-foreground mb-1">SHARE CODE</div>
                        <div className="text-2xl font-mono font-bold tracking-widest text-primary flex items-center justify-between">
                            {room.code}
                            <Button size="icon" variant="ghost" onClick={() => {
                                navigator.clipboard.writeText(window.location.href)
                                alert("Link copied!")
                            }}>
                                <Users className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Countdown Overlay */}
            <AnimatePresence>
                {countdown !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
                    >
                        <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="text-9xl font-black font-orbitron text-primary text-glow-lg"
                        >
                            {countdown === 0 ? "GO!" : countdown}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Overlay (Mock) */}
            <AnimatePresence>
                {battleResults && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 overflow-y-auto"
                    >
                        <div className="max-w-2xl w-full bg-card border border-primary/30 rounded-2xl p-8 shadow-2xl">
                            <div className="text-center mb-10">
                                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
                                <h2 className="text-4xl font-bold font-orbitron">BATTLE FINISHED</h2>
                                <p className="text-muted-foreground uppercase tracking-widest">Podium Rankings</p>
                            </div>

                            <div className="space-y-4 mb-10">
                                {battleResults.rankings.map((rank) => (
                                    <motion.div
                                        key={rank.playerId}
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className={`p-4 rounded-xl flex items-center justify-between ${rank.rank === 1 ? "bg-yellow-500/20 border border-yellow-500/50" : "bg-white/5"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-black italic text-muted-foreground w-8">#{rank.rank}</span>
                                            <div>
                                                <div className="font-bold text-xl">{rank.username}</div>
                                                <div className="text-xs text-muted-foreground">{rank.score} points earned</div>
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold text-primary">+{rank.xpEarned} XP</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={() => setBattleResults(null)} className="flex-1" variant="outline">
                                    Return to Lobby
                                </Button>
                                <Button onClick={() => { router.push("/multiplayer"); window.location.reload(); }} className="flex-1">
                                    Find New Room
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

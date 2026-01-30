"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { roomService } from '@/shared/services/room-service'
import { authService } from '@/features/auth/model/auth-service'
import { TEST_MODE_LABELS, TEST_MODES } from '@/shared/constants/app'
import type { Room } from '@/shared/types/multiplayer'
import { Users, Plus, Search, Zap, Timer, Activity, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'

const MODE_ICONS = {
    [TEST_MODES.REACTION]: Zap,
    [TEST_MODES.F1_LIGHTS]: Timer,
    [TEST_MODES.DECISION]: Activity,
    [TEST_MODES.SEQUENCE]: Brain,
}

export default function MultiplayerPage() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [joinCode, setJoinCode] = useState('')
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        loadRooms()
        const interval = setInterval(loadRooms, 3000) // Refresh every 3s
        return () => clearInterval(interval)
    }, [])

    function loadRooms() {
        const allRooms = roomService.getAllRooms()
        setRooms(allRooms)
        setLoading(false)
    }

    async function handleJoinByCode() {
        if (!joinCode.trim()) return

        const user = authService.getCurrentUser()
        if (!user) return

        try {
            const room = await roomService.joinRoom(joinCode.toUpperCase(), user.id, user.username)
            if (room) {
                router.push(`/multiplayer/room/${room.id}`)
            } else {
                alert('Room not found!')
            }
        } catch (error: any) {
            alert(error.message || 'Failed to join room')
        }
    }

    async function handleCreateRoom(mode: string) {
        const user = authService.getCurrentUser()
        if (!user) return

        const room = await roomService.createRoom(user.id, user.username, mode)
        setShowCreateModal(false)
        router.push(`/multiplayer/room/${room.id}`)
    }

    async function handleJoinRoom(roomId: string) {
        const user = authService.getCurrentUser()
        if (!user) return

        try {
            await roomService.joinRoom(roomId, user.id, user.username)
            router.push(`/multiplayer/room/${roomId}`)
        } catch (error: any) {
            alert(error.message || 'Failed to join room')
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Users className="w-8 h-8 text-primary" />
                    Multiplayer Lobby
                </h1>
                <p className="text-muted-foreground">
                    Challenge players in real-time battles!
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 border-primary/30">
                    <h3 className="text-lg font-bold mb-4">Create Room</h3>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="w-full"
                        size="lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Room
                    </Button>
                </Card>

                <Card className="p-6 border-primary/30">
                    <h3 className="text-lg font-bold mb-4">Join with Code</h3>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter 5-digit code"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            maxLength={5}
                            className="uppercase font-mono text-lg text-center"
                        />
                        <Button onClick={handleJoinByCode} size="lg">
                            <Search className="w-5 h-5" />
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Public Rooms */}
            <div>
                <h2 className="text-xl font-bold mb-4">🌐 Public Rooms ({rooms.length})</h2>

                {loading ? (
                    <div className="text-center text-muted-foreground py-12">
                        Loading rooms...
                    </div>
                ) : rooms.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            No active rooms. Be the first to create one!
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rooms.map((room) => {
                            const Icon = MODE_ICONS[room.mode as keyof typeof MODE_ICONS] || Users
                            return (
                                <Card key={room.id} className="p-4 hover:border-primary/50 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-5 h-5 text-primary" />
                                            <span className="font-bold">{TEST_MODE_LABELS[room.mode]}</span>
                                        </div>
                                        <span className="text-xs font-mono bg-primary/20 px-2 py-1 rounded">
                                            {room.code}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Players</span>
                                            <span className="font-semibold">{room.maxPlayers} max</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Rounds</span>
                                            <span className="font-semibold">{room.settings.roundCount}</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleJoinRoom(room.id)}
                                        className="w-full"
                                        variant="outline"
                                    >
                                        Join Room
                                    </Button>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <Card className="p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Create Room</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Select a game mode for your room
                        </p>

                        <div className="space-y-3">
                            {Object.entries(TEST_MODE_LABELS).map(([mode, label]) => {
                                const Icon = MODE_ICONS[mode as keyof typeof MODE_ICONS]
                                return (
                                    <Button
                                        key={mode}
                                        onClick={() => handleCreateRoom(mode)}
                                        variant="outline"
                                        className="w-full justify-start text-left h-auto py-4"
                                    >
                                        <Icon className="w-6 h-6 mr-3 text-primary" />
                                        <span className="font-semibold">{label}</span>
                                    </Button>
                                )
                            })}
                        </div>

                        <Button
                            onClick={() => setShowCreateModal(false)}
                            variant="ghost"
                            className="w-full mt-4"
                        >
                            Cancel
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    )
}

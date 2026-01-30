import type { Room, RoomPlayer, RoomEvent, BattleResults } from '@/shared/types/multiplayer'
import { createRoom, generateRoomCode, calculateBattleXP } from '@/shared/utils/rooms'

/**
 * Local/Mock Room Service
 * This uses localStorage for demonstration.
 * In production, replace with Supabase Realtime.
 */
class RoomService {
    private eventCallbacks: Map<string, ((event: RoomEvent) => void)[]> = new Map()

    // Create a new room
    async createRoom(hostId: string, hostUsername: string, mode: string, settings?: any): Promise<Room> {
        const roomData = createRoom(hostId, mode, settings)
        const room: Room = {
            ...roomData,
            id: crypto.randomUUID(),
        }

        // Store room
        this.saveRoom(room)

        // Add host as first player
        await this.joinRoom(room.id, hostId, hostUsername)

        return room
    }

    // Join existing room by code or ID
    async joinRoom(roomIdOrCode: string, playerId: string, username: string): Promise<Room | null> {
        const room = await this.getRoomByIdOrCode(roomIdOrCode)
        if (!room) return null

        // Check if room is full
        const players = await this.getRoomPlayers(room.id)
        if (players.length >= room.maxPlayers) {
            throw new Error('Room is full')
        }

        // Add player
        const player: RoomPlayer = {
            roomId: room.id,
            playerId,
            username,
            ready: false,
            score: 0,
            joinedAt: new Date(),
        }

        this.savePlayer(player)

        // Emit event
        this.emitEvent(room.id, { type: 'player_joined', playerId, username })

        return room
    }

    // Leave room
    async leaveRoom(roomId: string, playerId: string): Promise<void> {
        const playersKey = `room_players_${roomId}`
        const players = JSON.parse(localStorage.getItem(playersKey) || '[]')
        const filtered = players.filter((p: RoomPlayer) => p.playerId !== playerId)

        localStorage.setItem(playersKey, JSON.stringify(filtered))

        // Emit event
        this.emitEvent(roomId, { type: 'player_left', playerId })

        // If no players left, delete room
        if (filtered.length === 0) {
            this.deleteRoom(roomId)
        }
    }

    // Toggle ready status
    async toggleReady(roomId: string, playerId: string): Promise<void> {
        const playersKey = `room_players_${roomId}`
        const players: RoomPlayer[] = JSON.parse(localStorage.getItem(playersKey) || '[]')
        const player = players.find(p => p.playerId === playerId)

        if (player) {
            player.ready = !player.ready
            localStorage.setItem(playersKey, JSON.stringify(players))

            // Emit event
            this.emitEvent(roomId, { type: 'player_ready', playerId, ready: player.ready })
        }
    }

    // Get room by ID or code
    async getRoomByIdOrCode(idOrCode: string): Promise<Room | null> {
        // Try by ID first
        const roomKey = `room_${idOrCode}`
        let roomData = localStorage.getItem(roomKey)

        if (roomData) {
            return JSON.parse(roomData)
        }

        // Try by code
        const allRooms = this.getAllRooms()
        return allRooms.find(r => r.code === idOrCode.toUpperCase()) || null
    }

    // Get all public rooms
    getAllRooms(): Room[] {
        const rooms: Room[] = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key?.startsWith('room_') && !key.includes('_players_')) {
                const room = JSON.parse(localStorage.getItem(key)!)
                if (room.status === 'waiting') {
                    rooms.push(room)
                }
            }
        }
        return rooms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Get room players
    async getRoomPlayers(roomId: string): Promise<RoomPlayer[]> {
        const playersKey = `room_players_${roomId}`
        return JSON.parse(localStorage.getItem(playersKey) || '[]')
    }

    // Start battle
    async startBattle(roomId: string): Promise<void> {
        const room = await this.getRoomByIdOrCode(roomId)
        if (!room) return

        room.status = 'in_progress'
        this.saveRoom(room)

        // Emit countdown event
        this.emitEvent(roomId, { type: 'game_start', countdown: 3 })
    }

    // End battle
    async endBattle(roomId: string, results: BattleResults): Promise<void> {
        const room = await this.getRoomByIdOrCode(roomId)
        if (!room) return

        room.status = 'finished'
        this.saveRoom(room)

        // Emit end event
        this.emitEvent(roomId, { type: 'game_end', results })
    }

    // Subscribe to room events
    onRoomEvent(roomId: string, callback: (event: RoomEvent) => void): () => void {
        if (!this.eventCallbacks.has(roomId)) {
            this.eventCallbacks.set(roomId, [])
        }

        this.eventCallbacks.get(roomId)!.push(callback)

        // Return unsubscribe function
        return () => {
            const callbacks = this.eventCallbacks.get(roomId) || []
            const index = callbacks.indexOf(callback)
            if (index > -1) {
                callbacks.splice(index, 1)
            }
        }
    }

    // ===== Private methods =====

    private saveRoom(room: Room): void {
        localStorage.setItem(`room_${room.id}`, JSON.stringify(room))
    }

    private savePlayer(player: RoomPlayer): void {
        const playersKey = `room_players_${player.roomId}`
        const players = JSON.parse(localStorage.getItem(playersKey) || '[]')
        players.push(player)
        localStorage.setItem(playersKey, JSON.stringify(players))
    }

    private deleteRoom(roomId: string): void {
        localStorage.removeItem(`room_${roomId}`)
        localStorage.removeItem(`room_players_${roomId}`)
    }

    private emitEvent(roomId: string, event: RoomEvent): void {
        const callbacks = this.eventCallbacks.get(roomId) || []
        callbacks.forEach(cb => cb(event))

        // Also store in localStorage for polling
        const eventsKey = `room_events_${roomId}`
        const events = JSON.parse(localStorage.getItem(eventsKey) || '[]')
        events.push({ ...event, timestamp: Date.now() })

        // Keep only last 50 events
        if (events.length > 50) {
            events.shift()
        }

        localStorage.setItem(eventsKey, JSON.stringify(events))
    }
}

export const roomService = new RoomService()

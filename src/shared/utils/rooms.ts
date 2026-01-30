import type { Room, RoomSettings } from '@/shared/types/multiplayer'

// Generate a 5-character room code
export function generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude confusing chars (I, O, 0, 1)
    let code = ''
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

// Create a new room
export function createRoom(
    hostId: string,
    mode: string,
    settings: Partial<RoomSettings> = {}
): Omit<Room, 'id'> {
    const defaultSettings: RoomSettings = {
        roundCount: 5,
        timeLimit: 60,
        allowSpectators: true,
        teamMode: false,
    }

    return {
        code: generateRoomCode(),
        hostId,
        mode,
        maxPlayers: settings.teamMode ? 8 : 4,
        status: 'waiting',
        settings: { ...defaultSettings, ...settings },
        createdAt: new Date(),
    }
}

// Validate room code format
export function isValidRoomCode(code: string): boolean {
    return /^[A-Z2-9]{5}$/.test(code)
}

// Calculate XP reward based on placement
export function calculateBattleXP(rank: number, totalPlayers: number): number {
    const baseXP = 50
    const bonuses = {
        1: 100, // 1st place
        2: 75,  // 2nd place
        3: 50,  // 3rd place
    }

    const rankBonus = bonuses[rank as keyof typeof bonuses] || 25
    const participationBonus = baseXP

    return rankBonus + participationBonus
}

// Get team assignment (for team modes)
export function assignTeam(playerCount: number): 'red' | 'blue' {
    return playerCount % 2 === 0 ? 'red' : 'blue'
}

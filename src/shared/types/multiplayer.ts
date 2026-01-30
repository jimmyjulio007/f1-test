// Room Types
export interface Room {
    id: string
    code: string // 5-character code
    hostId: string
    mode: string
    maxPlayers: number
    status: 'waiting' | 'ready' | 'in_progress' | 'finished'
    settings: RoomSettings
    createdAt: Date
}

export interface RoomSettings {
    roundCount: number
    timeLimit: number // seconds per round
    allowSpectators: boolean
    teamMode: boolean // false = FFA, true = Team battle
}

export interface RoomPlayer {
    roomId: string
    playerId: string
    username: string
    ready: boolean
    score: number
    team?: 'red' | 'blue'
    joinedAt: Date
}

export interface BattleSession {
    id: string
    roomId: string
    currentRound: number
    totalRounds: number
    startedAt: Date
    endedAt?: Date
    results?: BattleResults
}

export interface BattleResults {
    winner: string // playerId or 'red'/'blue' for teams
    scores: Record<string, number> // playerId -> score
    duration: number
    rankings: PlayerRanking[]
}

export interface PlayerRanking {
    playerId: string
    username: string
    score: number
    rank: number
    xpEarned: number
}

// Real-time events
export type RoomEvent =
    | { type: 'player_joined'; playerId: string; username: string }
    | { type: 'player_left'; playerId: string }
    | { type: 'player_ready'; playerId: string; ready: boolean }
    | { type: 'game_start'; countdown: number }
    | { type: 'game_end'; results: BattleResults }
    | { type: 'player_score'; playerId: string; score: number }
    | { type: 'chat_message'; playerId: string; username: string; message: string }

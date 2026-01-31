export const API_MESSAGES = {
    METHOD_NOT_ALLOWED: "Method not allowed",
    INTERNAL_SERVER_ERROR: "Internal server error",
    MISSING_REQUIRED_FIELDS: "Missing required fields",
    USERNAME_REQUIRED: "Username is required",
    FAILED_TO_SAVE: "Failed to save",
    FAILED_TO_FETCH: "Failed to fetch",
} as const;

export const API_ENDPOINTS = {
    SCORES_SAVE: "/api/scores/save",
    PROFILE_UPDATE: "/api/profile/update",
    LEADERBOARD_GET: "/api/leaderboard/get",
} as const;

export const SOCKET_EVENTS = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    SUBMIT_SCORE: "submit_score",
    LEADERBOARD_UPDATE: "leaderboard_update",
    JOIN_ROOM: "join_room",
    ROOM_UPDATE: "room_update",
    GAME_MODE_UPDATE: "game_mode_update",
    GAME_STARTED: "game_started",
    START_GAME: "start_game",
    SELECT_GAME_MODE: "select_game_mode",
    TOGGLE_READY: "toggle_ready",
    UPDATE_ROOM_SCORE: "update_room_score",
    PLAYER_FINISHED: "player_finished",
    GAME_OVER: "game_over",
    SEND_CHAT: "send_chat",
    CHAT_MESSAGE: "chat_message",
} as const;

export const STORAGE_KEYS = {
    USER_ID: "neuro_userId",
    USERNAME: "neuro_username",
    AVATAR: "neuro_avatar",
    COUNTRY: "neuro_country",
} as const;

export const UI_MESSAGES = {
    NO_USER_FOUND: "No user found, skipping score save",
    PROFILE_SAVED: "Profile saved successfully!",
    FAILED_TO_SAVE_PROFILE: "Failed to save profile.",
    ERROR_SAVING_PROFILE: "Error saving profile.",
    WAITING_FOR_OPPONENT: "WAITING FOR OPPONENT...",
    WAITING_FOR_READY: "WAITING FOR READY...",
    WAITING_FOR_OTHERS: "WAITING FOR OTHERS",
    START_RACE: "START RACE",
    READY: "READY",
    NOT_READY: "NOT READY",
    HOST: "HOST",
    NO_COMMUNICATIONS: "No communications yet...",
} as const;

export const DEFAULT_VALUES = {
    COUNTRY: "UN",
    AVATAR: "🏎️",
    LEVEL: 1,
    TOTAL_SCORE: 0,
    GAMES_PLAYED: 0,
    POINTS_PER_LEVEL: 500,
    LEADERBOARD_LIMIT: 50,
} as const;

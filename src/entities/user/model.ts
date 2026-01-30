import { create } from 'zustand'

interface UserState {
    username: string | null
    setUsername: (name: string) => void
}

export const useUserStore = create<UserState>((set) => ({
    username: null,
    setUsername: (name) => set({ username: name }),
}))

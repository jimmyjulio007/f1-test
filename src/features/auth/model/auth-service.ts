"use client"

import { dbRequest } from "@/shared/lib/db"

export const authService = {
    async getOrCreateUser(username: string) {
        let user = await dbRequest.getUser(username)
        if (!user) {
            user = await dbRequest.createUser(username)
        }

        // Persist to localStorage for session
        localStorage.setItem('neuro_userId', user.id)
        localStorage.setItem('neuro_username', user.username)

        return user
    },

    getCurrentUser() {
        // Synchronous check from storage, DB check is async
        if (typeof window === 'undefined') return null

        const id = localStorage.getItem('neuro_userId')
        const username = localStorage.getItem('neuro_username')

        if (id && username) {
            return { id, username }
        }
        return null
    },

    logout() {
        localStorage.removeItem('neuro_userId')
        localStorage.removeItem('neuro_username')
    }
}

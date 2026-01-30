"use client"

import { useEffect, useState } from "react"
import { authService } from "@/features/auth/model/auth-service"
import { UsernameForm } from "./username-form"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ id: string, username: string } | null>(null)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        // Check local storage 
        const u = authService.getCurrentUser()
        setUser(u)
        setChecking(false)
    }, [])

    if (checking) return null // or loading spinner

    if (!user) return <UsernameForm />

    return (
        <>
            {children}
        </>
    )
}

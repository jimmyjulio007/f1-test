"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authService } from "@/features/auth/model/auth-service"
import { Button } from "@/shared/ui/button"
import { useRouter } from "next/navigation"

const schema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric only"),
})

export function UsernameForm() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            await authService.getOrCreateUser(data.username)
            // Force refresh to update Layout state if we were using context, 
            // but since Layout is server, it won't see local storage update easily.
            // We will switch to Client wrapper.
            window.location.reload()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md p-8 bg-card border border-primary/20 rounded-xl shadow-[0_0_50px_rgba(0,255,148,0.1)]">
                <h2 className="text-2xl font-bold text-center mb-6 text-primary uppercase tracking-widest">
                    Enter Driver Name
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            {...register("username")}
                            className="w-full bg-secondary/50 border border-input p-3 rounded-md text-center font-mono text-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white"
                            placeholder="MAVERICK"
                            autoFocus
                        />
                        {errors.username && (
                            <p className="text-destructive text-sm mt-1 text-center font-bold">
                                {errors.username.message as string}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full font-bold text-lg h-12"
                        disabled={loading}
                    >
                        {loading ? "INITIALIZING..." : "START ENGINE"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Sidebar } from "@/widgets/sidebar/sidebar"
import { Header } from "@/widgets/header/header"
import { AuthGuard } from "@/features/auth/ui/auth-guard"

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <AuthGuard>
            <div className="relative flex min-h-screen flex-col">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />
                    <main className="flex-1 container py-6 px-4 md:px-8 max-w-full">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "@/shared/ui/toaster"
import { preloadAllSounds } from "@/shared/utils/sounds"

export function Providers({ children }: { children: React.ReactNode }) {
    // Preload sounds on mount
    React.useEffect(() => {
        preloadAllSounds()
    }, [])

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            {children}
            <Toaster />
        </NextThemesProvider>
    )
}

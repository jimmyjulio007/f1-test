"use client"

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
    return (
        <SonnerToaster
            position="top-right"
            expand={false}
            richColors
            closeButton
            theme="dark"
            toastOptions={{
                style: {
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                },
                className: 'backdrop-blur-xl',
            }}
        />
    )
}

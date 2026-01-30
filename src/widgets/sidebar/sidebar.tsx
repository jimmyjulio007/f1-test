"use client"

import Link from "next/link"
import { cn } from "@/shared/lib/utils"
import { sidebarItems } from "@/shared/lib/contant"
import { X } from "lucide-react"
import type { SidebarProps } from "@/shared/types"

export function Sidebar({ className, isOpen = false, onClose }: SidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "pb-12 w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300",
                "md:translate-x-0", // Always visible on desktop
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", // Toggle on mobile
                className
            )}>
                <div className="space-y-4 py-4">
                    <div className="px-4 py-2 flex items-center justify-between">
                        <h2 className="mb-2 px-2 text-2xl font-bold tracking-tight text-primary italic transform -skew-x-12">
                            NeuroDrive
                        </h2>
                        {/* Close button - mobile only */}
                        <button
                            onClick={onClose}
                            className="md:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <X className="h-5 w-5 text-muted-foreground" />
                        </button>
                    </div>
                    <div className="space-y-1">
                        <nav className="grid gap-1 px-2">
                            {sidebarItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={onClose} // Close sidebar on mobile when clicking a link
                                    className={cn(
                                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent transition-all",
                                        "hover:pl-4"
                                    )}
                                >
                                    <item.icon className="mr-2 h-4 w-4 text-primary" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Footer - Exit Dashboard */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/80 backdrop-blur-sm">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="group flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 hover:border-destructive/50 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Exit Dashboard</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

"use client"

import { Bell, Settings, User, Menu } from "lucide-react"
import { Button } from "@/shared/ui/button"
import type { HeaderProps } from "@/shared/types"

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 ml-0 md:ml-64 w-auto">
                <div className="flex items-center gap-3 md:hidden">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMenuClick}
                        className="md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="font-bold text-primary">NeuroDrive</span>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5 text-muted-foreground hover:text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5 text-muted-foreground hover:text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5 text-muted-foreground hover:text-primary" />
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}

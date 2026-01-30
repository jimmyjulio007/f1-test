"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { TEST_MODES, TEST_MODE_LABELS } from "@/shared/constants/app"
import { leaderboardService, type LeaderboardEntry } from "../model/leaderboard-service"
import { Trophy, Medal, Crown, Zap, Timer, Activity, Brain } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const MODE_ICONS: Record<string, any> = {
    [TEST_MODES.REACTION]: Zap,
    [TEST_MODES.F1_LIGHTS]: Timer,
    [TEST_MODES.DECISION]: Activity,
    [TEST_MODES.SEQUENCE]: Brain,
}

export default function LeaderboardPage() {
    const [activeMode, setActiveMode] = useState<string>(TEST_MODES.REACTION)
    const [rankings, setRankings] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRankings() {
            setLoading(true)
            const data = await leaderboardService.getGlobalRankings(activeMode)
            setRankings(data)
            setLoading(false)
        }
        loadRankings()
    }, [activeMode])

    const topThree = rankings.slice(0, 3)
    const remaining = rankings.slice(3)

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header section */}
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest"
                >
                    <Crown className="w-4 h-4" /> Global Standings
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black font-orbitron tracking-tighter text-glow">
                    WORLD CHAMPIONSHIP
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The fastest minds on the planet. Can you break into the elite circle of drivers?
                </p>
            </div>

            {/* Mode Selectors */}
            <div className="flex flex-wrap justify-center gap-4">
                {Object.values(TEST_MODES).map((mode) => {
                    const Icon = MODE_ICONS[mode] || Trophy
                    const active = activeMode === mode
                    return (
                        <Button
                            key={mode}
                            variant={active ? "default" : "outline"}
                            onClick={() => setActiveMode(mode)}
                            className={cn(
                                "h-14 px-6 gap-3 font-bold transition-all",
                                active ? "btn-glow scale-105" : "hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", active ? "text-white" : "text-primary")} />
                            {TEST_MODE_LABELS[mode]}
                        </Button>
                    )
                })}
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-primary font-bold animate-pulse">SYNCHRONIZING GLOBAL DATA...</p>
                </div>
            ) : (
                <div className="space-y-16">
                    {/* The Podium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto pt-10">
                        {/* 2nd Place */}
                        <PodiumSpot entry={topThree[1]} spot={2} />

                        {/* 1st Place */}
                        <PodiumSpot entry={topThree[0]} spot={1} />

                        {/* 3rd Place */}
                        <PodiumSpot entry={topThree[2]} spot={3} />
                    </div>

                    {/* Rankings Table */}
                    <Card className="overflow-hidden border-primary/20 bg-black/40 backdrop-blur-xl">
                        <div className="p-6 border-b border-primary/10 bg-primary/5 flex justify-between items-center">
                            <h3 className="font-black tracking-widest uppercase text-sm">Full Grid Standings</h3>
                            <span className="text-xs text-muted-foreground">Updated in real-time</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-white/5">
                                        <th className="px-6 py-4">P</th>
                                        <th className="px-6 py-4">Driver</th>
                                        <th className="px-6 py-4">Level</th>
                                        <th className="px-6 py-4 text-right">Performance Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankings.map((entry) => (
                                        <motion.tr
                                            key={entry.userId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "border-b border-white/5 hover:bg-white/5 transition-colors group",
                                                entry.isYou && "bg-primary/5 border-l-2 border-l-primary"
                                            )}
                                        >
                                            <td className="px-6 py-4 font-mono font-bold text-muted-foreground">
                                                {entry.rank}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                                                        entry.isYou ? "bg-primary text-black" : "bg-primary/20"
                                                    )}>
                                                        {entry.username[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold group-hover:text-primary transition-colors">
                                                            {entry.username}
                                                            {entry.isYou && <span className="ml-2 text-[10px] text-primary font-black uppercase tracking-tighter bg-primary/10 px-1 rounded">Your Sector</span>}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black border border-blue-500/20">
                                                    LVL {entry.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-bold text-lg">
                                                {entry.score}
                                                <span className="text-xs ml-1 text-muted-foreground">pts</span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}

function PodiumSpot({ entry, spot }: { entry?: LeaderboardEntry, spot: 1 | 2 | 3 }) {
    if (!entry) return null

    const heights = {
        1: "h-64",
        2: "h-48",
        3: "h-40"
    }

    const colors = {
        1: "from-yellow-500/40 to-yellow-500/10 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.2)]",
        2: "from-slate-400/40 to-slate-400/10 border-slate-400/50",
        3: "from-amber-700/40 to-amber-700/10 border-amber-700/50"
    }

    const icons = {
        1: <Crown className="w-12 h-12 text-yellow-500 mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,1)]" />,
        2: <Medal className="w-10 h-10 text-slate-400 mb-2" />,
        3: <Medal className="w-8 h-8 text-amber-700 mb-2" />
    }

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: spot * 0.2 }}
            className={cn("flex flex-col items-center", spot === 1 ? "order-1 md:order-2" : spot === 2 ? "order-2 md:order-1" : "order-3")}
        >
            <div className="text-center mb-4">
                <div className="relative inline-block mb-2">
                    <div className="w-20 h-20 rounded-full border-2 border-primary/30 p-1">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-black flex items-center justify-center text-2xl font-black">
                            {entry.username[0]}
                        </div>
                    </div>
                    <div className={cn("absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-black border-2",
                        spot === 1 ? "bg-yellow-500 border-yellow-200 text-yellow-900" :
                            spot === 2 ? "bg-slate-400 border-slate-100 text-slate-900" :
                                "bg-amber-700 border-amber-400 text-white"
                    )}>
                        {spot}
                    </div>
                </div>
                <h4 className="font-black text-lg text-white truncate w-32">{entry.username}</h4>
                <p className="text-primary font-mono font-bold text-2xl">
                    {entry.score}<span className="text-xs ml-1 opacity-50">pts</span>
                </p>
            </div>

            <div className={cn(
                "w-full rounded-t-3xl border-t-2 border-x-2 bg-gradient-to-t relative flex flex-col items-center justify-start pt-6",
                heights[spot],
                colors[spot]
            )}>
                {icons[spot]}
                <span className="text-4xl font-black opacity-10 font-orbitron">{spot}</span>

                {spot === 1 && (
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full"
                    />
                )}
            </div>
        </motion.div>
    )
}

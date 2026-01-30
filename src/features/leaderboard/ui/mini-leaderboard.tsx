"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card"
import { leaderboardService, type LeaderboardEntry } from "../model/leaderboard-service"
import { TEST_MODES } from "@/shared/constants/app"
import { Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function MiniLeaderboard() {
    const [topDrivers, setTopDrivers] = useState<LeaderboardEntry[]>([])

    useEffect(() => {
        async function load() {
            const data = await leaderboardService.getTopThree(TEST_MODES.REACTION)
            setTopDrivers(data)
        }
        load()
    }, [])

    return (
        <Card className="bg-black/40 border-primary/20 overflow-hidden">
            <CardHeader className="p-4 border-b border-primary/10 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Top Drivers
                </CardTitle>
                <Link href="/leaderboard" className="text-[10px] text-primary hover:underline flex items-center gap-1 uppercase font-black">
                    Full Grid <ArrowRight className="w-3 h-3" />
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                    {topDrivers.map((driver, i) => (
                        <motion.div
                            key={driver.userId}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-black w-4 ${i === 0 ? "text-yellow-500" : "text-muted-foreground"}`}>
                                    {i + 1}
                                </span>
                                <div className="text-sm font-bold">{driver.username}</div>
                            </div>
                            <div className="text-xs font-mono font-bold text-primary">
                                {driver.score}ms
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

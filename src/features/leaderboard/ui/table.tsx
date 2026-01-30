"use client"

import { useState } from "react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"

type Score = {
    id: string
    reactionMs: number
    accuracy: number
    createdAt: Date
    user: { username: string }
}

export function LeaderboardTable({ data }: { data: any }) {
    const [activeTab, setActiveTab] = useState<'reaction' | 'f1' | 'decision'>('reaction')

    const scores: Score[] = data[activeTab] || []

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 bg-secondary/20 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('reaction')}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all",
                        activeTab === 'reaction' ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                    )}
                >
                    Reaction
                </button>
                <button
                    onClick={() => setActiveTab('f1')}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all",
                        activeTab === 'f1' ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                    )}
                >
                    F1 Lights
                </button>
                <button
                    onClick={() => setActiveTab('decision')}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all",
                        activeTab === 'decision' ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                    )}
                >
                    Decision
                </button>
            </div>

            <div className="border border-border rounded-xl overflow-hidden backdrop-blur-sm bg-card/30">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-border bg-secondary/50">
                            <th className="h-12 px-4 font-medium text-muted-foreground w-16">#</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground">Driver</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground text-right">Time</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, i) => (
                            <tr key={score.id} className="border-b border-border hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-muted-foreground">
                                    {i < 3 ? <span className="text-yellow-500 font-bold">{i + 1}</span> : i + 1}
                                </td>
                                <td className="p-4 font-bold">{score.user.username}</td>
                                <td className="p-4 text-right font-mono text-primary">
                                    {score.reactionMs}ms
                                    {activeTab === 'decision' && <span className="text-muted-foreground text-xs ml-2">({score.accuracy}%)</span>}
                                </td>
                                <td className="p-4 text-right text-muted-foreground">
                                    {new Date(score.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {scores.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    No lap times recorded yet. Be the first!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

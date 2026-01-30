import { LeaderboardWidget } from "@/features/leaderboard/ui/leaderboard"
import { Trophy } from "lucide-react"
import type { Metadata } from "next"

// SEO Metadata for Leaderboard Page
export const metadata: Metadata = {
    title: "Global Leaderboard - NeuroDrive Rankings",
    description: "Compare your cognitive performance scores with drivers worldwide. View top rankings for reaction time, F1 lights, and decision making tests.",
    keywords: ["leaderboard", "rankings", "global standings", "top scores", "reaction time rankings", "F1 leaderboard"],
    openGraph: {
        title: "Global Leaderboard - NeuroDrive",
        description: "Compare your telemetry against other drivers worldwide.",
        type: "website",
    },
}

export default function LeaderboardPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    Global Standings
                </h1>
                <p className="text-muted-foreground">
                    Compare your telemetry against other drivers.
                </p>
            </div>

            <LeaderboardWidget />
        </div>
    )
}

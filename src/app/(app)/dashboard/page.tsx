"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { PerformanceRadar } from "@/features/dashboard-stats/performance-chart"
import { Activity, Timer, Zap, Trophy } from "lucide-react"
import { useDashboardStats } from "@/features/dashboard-stats/use-dashboard-stats"
import { formatTime, getRelativeTime, getModeLabel } from "@/shared/utils/formatters"
import { XPProgressBar } from "@/features/gamification/ui/xp-progress-bar"
import { DailyChallengeCard } from "@/features/gamification/ui/daily-challenge-card"
import { StreakDisplay } from "@/features/gamification/ui/streak-display"
import { MiniLeaderboard } from "@/features/leaderboard/ui/mini-leaderboard"

export default function Dashboard() {
  const { stats, loading } = useDashboardStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading your stats...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gamification Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <XPProgressBar />
        <StreakDisplay />
        <DailyChallengeCard />
      </div>

      {/* Stats Grid - Responsive for all screen sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary box-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reaction</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-glow">
              {stats.avgReaction ? `${Math.round(stats.avgReaction)}ms` : "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.avgReaction ? (stats.avgReaction < 250 ? "Excellent!" : "Keep training") : "No tests yet"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">Accuracy</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats.accuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Decision tests
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-500">Training Time</CardTitle>
            <Timer className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {formatTime(stats.totalTime)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total practice
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500 box-glow overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-500">World Ranking</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-glow">
              #{stats.rank.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all users
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 blur-2xl rounded-full" />
        </Card>
      </div>

      {/* Performance & Activity - Stack on mobile, side-by-side on tablet+ */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <Card className="lg:col-span-4 bg-opacity-90">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Your cognitive profile based on recent tests.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <PerformanceRadar />
          </CardContent>
        </Card>
        <div className="lg:col-span-3 space-y-4">
          <MiniLeaderboard />
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your last {stats.recentScores.length} sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentScores.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-2">No tests completed yet</p>
                  <p className="text-sm">Start a test to see your results here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentScores.map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-border pb-2 last:border-0 hover:bg-white/5 p-2 rounded transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-medium text-sm">{getModeLabel(item.mode)}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-sm font-mono text-primary">{item.score}ms</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          {getRelativeTime(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

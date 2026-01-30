import { ReactionTest } from "@/features/reaction-test/ui/reaction-test"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card"
import { Zap } from "lucide-react"
import type { Metadata } from "next"

// SEO Metadata for Reaction Test Page
export const metadata: Metadata = {
    title: "Reaction Time Test - NeuroDrive",
    description: "Test your visual reflexes and reaction speed. Click as soon as the screen turns green. Compare your results with F1 driver benchmarks (average: 200ms).",
    keywords: ["reaction time test", "reflex test", "visual reflexes", "reaction speed", "F1 reaction time"],
    openGraph: {
        title: "Reaction Time Test - NeuroDrive",
        description: "Test your visual reflexes and reaction speed. Compare with F1 drivers.",
        type: "website",
    },
}

export default function ReactionTestPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Zap className="h-8 w-8 text-primary" />
                    Reaction Time
                </h1>
                <p className="text-muted-foreground">
                    Test your visual reflexes. Click as soon as the screen turns green.
                </p>
            </div>

            <ReactionTest />

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Average F1 Driver</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-mono font-bold text-primary">200ms</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Average</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-mono font-bold text-muted-foreground">--</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Best Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-mono font-bold text-accent">--</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

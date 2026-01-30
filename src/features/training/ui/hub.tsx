import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Zap, Activity, Timer, Dumbbell } from "lucide-react"
import Link from "next/link"

const programs = [
    {
        title: "Reaction Reflex",
        description: "30-minute session focusing on raw reaction speed.",
        level: "Beginner",
        icon: Zap,
        color: "text-primary",
        link: "/tests/reaction"
    },
    {
        title: "Start Sequence",
        description: "Practice your race starts. 50 repetitions.",
        level: "Intermediate",
        icon: Timer,
        color: "text-red-500",
        link: "/tests/f1"
    },
    {
        title: "Cognitive Load",
        description: "High-pressure decision making under fatigue.",
        level: "Advanced",
        icon: Activity,
        color: "text-blue-500",
        link: "/tests/decision"
    },
    {
        title: "Endurance",
        description: "Combined tests to measure consistency over time.",
        level: "Pro",
        icon: Dumbbell,
        color: "text-yellow-500",
        link: "/tests/reaction"
    }
]

export function TrainingHub() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {programs.map((program, i) => (
                <Card key={i} className="group hover:bg-secondary/20 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <program.icon className={program.color} />
                                {program.title}
                            </CardTitle>
                            <span className="text-xs uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 rounded">
                                {program.level}
                            </span>
                        </div>
                        <CardDescription>{program.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={program.link}>
                            <Button className="w-full">Start Session</Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

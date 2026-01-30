import { DecisionTest } from "@/features/decision-test/ui/decision-test"
import { Activity } from "lucide-react"
import type { Metadata } from "next"

// SEO Metadata for Decision Test Page
export const metadata: Metadata = {
    title: "Decision Making Test - NeuroDrive",
    description: "Test your cognitive processing speed under pressure. Stroop effect challenge for decision-making accuracy and speed. High-pressure cognitive load testing.",
    keywords: ["decision making test", "cognitive test", "stroop test", "mental processing speed", "cognitive load", "brain speed test"],
    openGraph: {
        title: "Decision Making Test - NeuroDrive",
        description: "Test your cognitive processing speed under pressure.",
        type: "website",
    },
}

export default function DecisionPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
                    <Activity className="h-8 w-8 text-primary" />
                    Decision Making
                </h1>
                <p className="text-muted-foreground">
                    Test your cognitive processing speed under pressure.
                </p>
            </div>

            <DecisionTest />
        </div>
    )
}

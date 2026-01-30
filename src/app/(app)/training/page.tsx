import { TrainingHub } from "@/features/training/ui/hub"
import { Play } from "lucide-react"
import type { Metadata } from "next"

// SEO Metadata for Training Page
export const metadata: Metadata = {
    title: "Training Programs - NeuroDrive Cognitive Training",
    description: "Curated training programs to improve your cognitive performance. Structured exercises for reaction time, decision making, and mental processing speed.",
    keywords: ["cognitive training", "brain training programs", "reaction training", "mental fitness", "cognitive exercises", "performance improvement"],
    openGraph: {
        title: "Training Programs - NeuroDrive",
        description: "Curated programs to improve your cognitive performance.",
        type: "website",
    },
}

export default function TrainingPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
                    <Play className="h-8 w-8 text-primary" />
                    Training Center
                </h1>
                <p className="text-muted-foreground">
                    Curated programs to improve your cognitive performance.
                </p>
            </div>

            <TrainingHub />
        </div>
    )
}

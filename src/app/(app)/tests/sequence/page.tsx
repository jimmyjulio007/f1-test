import { SequenceMemory } from "@/features/sequence-memory/ui/sequence-memory"
import { Brain } from "lucide-react"
import type { Metadata } from "next"

// SEO Metadata for Sequence Memory Page
export const metadata: Metadata = {
    title: "Sequence Memory Test - NeuroDrive",
    description: "Test your working memory with this F1-themed sequence challenge. Remember and repeat increasingly complex patterns. Essential cognitive skill for racing drivers.",
    keywords: ["memory test", "sequence memory", "working memory", "pattern recognition", "cognitive memory", "brain training", "F1 memory"],
    openGraph: {
        title: "Sequence Memory Test - NeuroDrive",
        description: "Test your working memory with F1-themed sequence challenge.",
        type: "website",
    },
}

export default function SequenceMemoryPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
                    <Brain className="h-8 w-8 text-primary" />
                    Sequence Memory
                </h1>
                <p className="text-muted-foreground">
                    Test your working memory. Remember and repeat the pattern.
                </p>
            </div>

            <SequenceMemory />
        </div>
    )
}

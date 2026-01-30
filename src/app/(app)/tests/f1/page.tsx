import { F1Lights } from "@/features/f1-lights/ui/f1-lights"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card"
import { Timer } from "lucide-react"
import type { Metadata } from "next"

// SEO Metadata for F1 Lights Test Page
export const metadata: Metadata = {
    title: "F1 Start Lights Test - NeuroDrive",
    description: "Simulate the F1 race start sequence. Test your reaction to the 5-light system. Can you beat Bottas' 201ms record from Russia 2017?",
    keywords: ["F1 start", "F1 lights", "race start simulation", "F1 reaction test", "lights out test", "Bottas reaction"],
    openGraph: {
        title: "F1 Start Lights Test - NeuroDrive",
        description: "Simulate the F1 race start. Test your lights-out reaction time.",
        type: "website",
    },
}

export default function F1TestPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
                    <Timer className="h-8 w-8 text-primary" />
                    Race Start
                </h1>
                <p className="text-muted-foreground">
                    The ultimate test of F1 start reaction. 5 Red Lights. Lights Out = GO.
                </p>
            </div>

            <div className="py-12">
                <F1Lights />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Bottas (Russia 2017)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-mono font-bold text-primary">201ms</div>
                        <p className="text-xs text-muted-foreground">The superhuman benchmark</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Human Average</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-mono font-bold text-muted-foreground">250ms</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Jump Start</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-mono font-bold text-destructive">&lt; 200ms</div>
                        <p className="text-xs text-muted-foreground">Considered anticipation</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

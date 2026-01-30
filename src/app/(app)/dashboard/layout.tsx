import type { Metadata } from "next"

// SEO Metadata for Dashboard Page
export const metadata: Metadata = {
    title: "Dashboard - NeuroDrive Performance Analytics",
    description: "View your cognitive performance metrics, reaction time averages, accuracy stats, and training progress. Track your improvement over time.",
    robots: {
        index: false, // Dashboard is user-specific, shouldn't be indexed
        follow: false,
    },
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

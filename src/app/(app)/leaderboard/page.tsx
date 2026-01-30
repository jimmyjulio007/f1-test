import LeaderboardPage from "@/features/leaderboard/ui/leaderboard-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Global Leaderboard | NeuroDrive",
    description: "Check the worldwide rankings and see where you stand against the best drivers in the world.",
};

export default function Page() {
    return <LeaderboardPage />;
}

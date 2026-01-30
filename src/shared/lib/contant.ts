import { BarChart2, Zap, Timer, Play, Trophy, Activity, Brain, Award, Users } from "lucide-react";

export const sidebarItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
    { href: "/tests/reaction", label: "Reaction Test", icon: Zap },
    { href: "/tests/decision", label: "Decision Test", icon: Activity },
    { href: "/tests/f1", label: "F1 Lights", icon: Timer },
    { href: "/tests/sequence", label: "Sequence Memory", icon: Brain },
    { href: "/training", label: "Training", icon: Play },
    { href: "/achievements", label: "Achievements", icon: Award },
    { href: "/multiplayer", label: "Multiplayer", icon: Users },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
]
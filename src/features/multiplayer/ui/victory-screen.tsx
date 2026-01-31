"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { Trophy, Home, RotateCcw } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Player {
    id: string;
    name: string;
    score: number;
    roomId: string;
    finished?: boolean;
}

interface VictoryScreenProps {
    players: Player[];
    onReturnToLobby: () => void;
    currentUserId: string; // socket.id
    gameMode: string;
}

export function VictoryScreen({ players, onReturnToLobby, currentUserId, gameMode }: VictoryScreenProps) {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        // Play celebration sound
        const audio = new Audio("/sounds/celebration.mp3");
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Audio play failed", e));

    }, []);

    // Sort players. For Reaction/F1 Lights (lower is better?). For Sequence/Decision (score/higher is better?).
    // Needs logic based on gameMode.
    // Assuming: 
    // REACTION / F1_LIGHTS: Lower is better (ms).
    // SEQUENCE / DECISION: Higher is better (score).

    const isLowerBetter = ["REACTION", "F1_LIGHTS"].includes(gameMode);

    const sortedPlayers = [...players].sort((a, b) => {
        if (a.score === 0 && b.score === 0) return 0;
        if (a.score === 0) return 1; // 0 means no score yet usually
        if (b.score === 0) return -1;
        return isLowerBetter ? a.score - b.score : b.score - a.score;
    });

    const winner = sortedPlayers[0];
    const isWinner = winner?.id === currentUserId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full p-8 bg-gradient-to-b from-gray-900 to-black border border-yellow-500/30 rounded-3xl shadow-[0_0_100px_rgba(234,179,8,0.3)] text-center relative overflow-hidden"
            >
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-yellow-500/20 blur-3xl rounded-full" />

                <div className="relative z-10 space-y-6">
                    <motion.div
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="inline-flex p-4 rounded-full bg-yellow-500/10 border-2 border-yellow-500/50 mb-4"
                    >
                        <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                    </motion.div>

                    <div>
                        <h2 className="text-3xl font-black font-orbitron text-white uppercase mb-1">
                            {isWinner ? "VICTORY!" : "RACE FINISHED"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isWinner ? "Unmatchable speed. You dominate the track." : `Winner: ${winner?.name}`}
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-xl border border-white/10 divide-y divide-white/5">
                        {sortedPlayers.map((p, i) => (
                            <div key={p.id} className={cn("flex justify-between items-center p-4", p.id === currentUserId && "bg-primary/10")}>
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "font-black font-mono w-6 h-6 flex items-center justify-center rounded-full text-xs",
                                        i === 0 ? "bg-yellow-500 text-black" :
                                            i === 1 ? "bg-slate-400 text-black" :
                                                i === 2 ? "bg-amber-700 text-white" : "text-muted-foreground"
                                    )}>
                                        {i + 1}
                                    </span>
                                    <span className="font-bold">{p.name} {p.id === currentUserId && "(You)"}</span>
                                </div>
                                <span className="font-mono font-bold text-lg">
                                    {p.score} <span className="text-xs text-muted-foreground">{isLowerBetter ? "ms" : "pts"}</span>
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button onClick={onReturnToLobby} className="w-full font-bold" size="lg" variant="outline">
                            <Home className="w-4 h-4 mr-2" /> RETURN TO LOBBY
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

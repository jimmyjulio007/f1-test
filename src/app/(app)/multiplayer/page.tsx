"use client";

import { useState, useEffect } from "react";
import { MultiplayerLobby } from "@/features/multiplayer/ui/lobby";
import { socket } from "@/features/multiplayer/lib/socket-client";
import { ReactionTest } from "@/features/reaction-test/ui/reaction-test";
import { useReactionStore } from "@/features/reaction-test/model/store";
import { F1Lights } from "@/features/f1-lights/ui/f1-lights";
import { useF1Store } from "@/features/f1-lights/model/store";
import { SequenceMemory } from "@/features/sequence-memory/ui/sequence-memory";
import { useSequenceStore } from "@/features/sequence-memory/model/store";
import { DecisionTest } from "@/features/decision-test/ui/decision-test";
import { useDecisionStore } from "@/features/decision-test/model/store";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, CheckCircle, User } from "lucide-react";
import { TEST_MODES, TEST_MODE_LABELS } from "@/shared/constants/app";
import { VictoryScreen } from "@/features/multiplayer/ui/victory-screen";
import Link from "next/link";

interface Player {
    id: string;
    name: string;
    score: number;
    roomId: string;
    finished?: boolean;
}

export default function MultiplayerPage() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameMode, setGameMode] = useState("REACTION");
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOverPlayers, setGameOverPlayers] = useState<Player[] | null>(null);

    // Initial setup
    useEffect(() => {
        socket.on("game_mode_update", (mode: string) => {
            setGameMode(mode);
        });

        socket.on("game_over", (finalPlayers: Player[]) => {
            setGameOverPlayers(finalPlayers);
        });

        // Reset state on unmount or new game
        return () => {
            socket.off("game_mode_update");
            socket.off("game_over");
        };
    }, []);

    const handleScoreUpdate = (newScore: number) => {
        setScore(newScore);
        socket.emit("update_room_score", newScore);
    };

    const handleFinish = () => {
        setFinished(true);
        socket.emit("player_finished", score);
    };

    const handleBackToLobby = () => {
        setGameStarted(false);
        setFinished(false);
        setScore(0);
        setGameOverPlayers(null);
    };

    return (
        <div className="space-y-6">
            {!gameStarted ? (
                <div className="container mx-auto relative">
                    <div className="absolute right-0 top-0 hidden md:block">
                        <Link href="/profile">
                            <Button variant="ghost" className="rounded-full w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10" title="Driver Profile">
                                <User className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                            </Button>
                        </Link>
                    </div>
                    <div className="max-w-2xl mx-auto text-center mb-12 pt-8 md:pt-0">
                        {/* Mobile profile button */}
                        <div className="md:hidden flex justify-end mb-4">
                            <Link href="/profile">
                                <Button variant="ghost" size="sm" className="bg-white/5">
                                    <User className="w-4 h-4 mr-2" /> Profile
                                </Button>
                            </Link>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black font-orbitron text-white mb-4">
                            MULTIPLAYER <span className="text-primary">ARENA</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Challenge your friends in real-time. The fastest reaction wins.
                        </p>
                    </div>
                    <MultiplayerLobby onGameStart={() => {
                        setGameStarted(true);
                        setFinished(false);
                        setScore(0);
                        setGameOverPlayers(null);
                    }} />
                </div>
            ) : (
                <div className="container mx-auto max-w-4xl space-y-6">
                    <div className="flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={handleBackToLobby}
                            className="text-muted-foreground hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Lobby
                        </Button>

                        {finished && (
                            <div className="flex items-center text-green-500 font-bold bg-green-500/10 px-4 py-2 rounded">
                                <CheckCircle className="w-4 h-4 mr-2" /> WAITING FOR OTHERS
                            </div>
                        )}
                    </div>

                    <div className="bg-black/80 border border-primary/20 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-black font-orbitron">{(TEST_MODE_LABELS[gameMode] as string) || "LIVE RACE"}</h2>
                            <span className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded animate-pulse">
                                ● LIVE
                            </span>
                        </div>

                        {gameMode === TEST_MODES.REACTION && (
                            <ReactionTestWrapper onScoreUpdate={handleScoreUpdate} onAutoFinish={handleFinish} />
                        )}
                        {gameMode === TEST_MODES.F1_LIGHTS && (
                            <F1LightsWrapper onScoreUpdate={handleScoreUpdate} onAutoFinish={handleFinish} />
                        )}
                        {gameMode === TEST_MODES.SEQUENCE && (
                            <SequenceWrapper onScoreUpdate={handleScoreUpdate} onAutoFinish={handleFinish} />
                        )}
                        {gameMode === TEST_MODES.DECISION && (
                            <DecisionWrapper onScoreUpdate={handleScoreUpdate} onAutoFinish={handleFinish} />
                        )}
                    </div>
                </div>
            )}

            {gameOverPlayers && (
                <VictoryScreen
                    players={gameOverPlayers}
                    onReturnToLobby={handleBackToLobby}
                    currentUserId={socket.id || ""}
                    gameMode={gameMode}
                />
            )}
        </div>
    );
}

// --- Game Wrappers ---

function ReactionTestWrapper({ onScoreUpdate, onAutoFinish }: { onScoreUpdate: (score: number) => void, onAutoFinish: () => void }) {
    const attempts = useReactionStore(state => state.attempts);

    // We want to detect when the user has done a full "test" (usually 5 attempts).
    // The store doesn't explicitly expose "isFinished" but we can check attempts length.
    useEffect(() => {
        if (attempts.length >= 5) {
            const avg = attempts.reduce((a, b) => a + b, 0) / attempts.length;
            onScoreUpdate(Math.round(avg));
            onAutoFinish();
        } else if (attempts.length > 0) {
            // Update score loosely during progress
            const avg = attempts.reduce((a, b) => a + b, 0) / attempts.length;
            onScoreUpdate(Math.round(avg));
        }
    }, [attempts, onScoreUpdate, onAutoFinish]);
    return <ReactionTest />;
}

function F1LightsWrapper({ onScoreUpdate, onAutoFinish }: { onScoreUpdate: (score: number) => void, onAutoFinish: () => void }) {
    const { reactionTime, state } = useF1Store();
    useEffect(() => {
        if (state === 'result' && reactionTime !== null) {
            onScoreUpdate(Math.round(reactionTime));
            onAutoFinish();
        } else if (state === 'early') {
            onScoreUpdate(9999); // Max penalty
            onAutoFinish();
        }
    }, [state, reactionTime, onScoreUpdate, onAutoFinish]);
    return <F1Lights />;
}

function DecisionWrapper({ onScoreUpdate, onAutoFinish }: { onScoreUpdate: (score: number) => void, onAutoFinish: () => void }) {
    const { state, history } = useDecisionStore();
    useEffect(() => {
        if (state === 'end') {
            if (history.length > 0) {
                const avgMs = Math.round(history.reduce((a, b) => a + b, 0) / history.length) || 0;
                onScoreUpdate(avgMs);
            }
            onAutoFinish();
        }
    }, [state, history, onScoreUpdate, onAutoFinish]);
    return <DecisionTest />;
}

function SequenceWrapper({ onScoreUpdate, onAutoFinish }: { onScoreUpdate: (score: number) => void, onAutoFinish: () => void }) {
    const { score, gameState } = useSequenceStore();
    useEffect(() => {
        onScoreUpdate(score);
        if (gameState === 'wrong') {
            // Game over
            onAutoFinish();
        }
    }, [score, gameState, onScoreUpdate, onAutoFinish]);
    return <SequenceMemory />;
}

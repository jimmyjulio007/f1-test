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
import { ArrowLeft, Flag, CheckCircle } from "lucide-react";
import { TEST_MODES, TEST_MODE_LABELS } from "@/shared/constants/app";
import { VictoryScreen } from "@/features/multiplayer/ui/victory-screen";

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
                <div className="container mx-auto">
                    <div className="max-w-2xl mx-auto text-center mb-12">
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

                        {!finished && (
                            <Button
                                onClick={handleFinish}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold animate-pulse"
                            >
                                <Flag className="w-4 h-4 mr-2" /> FINISH RACE
                            </Button>
                        )}
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
                            <ReactionTestWrapper onScoreUpdate={handleScoreUpdate} />
                        )}
                        {gameMode === TEST_MODES.F1_LIGHTS && (
                            <F1LightsWrapper onScoreUpdate={handleScoreUpdate} />
                        )}
                        {gameMode === TEST_MODES.SEQUENCE && (
                            <SequenceWrapper onScoreUpdate={handleScoreUpdate} onAutoFinish={handleFinish} />
                        )}
                        {gameMode === TEST_MODES.DECISION && (
                            <DecisionWrapper onScoreUpdate={handleScoreUpdate} />
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

function ReactionTestWrapper({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
    const attempts = useReactionStore(state => state.attempts);
    useEffect(() => {
        if (attempts.length > 0) {
            const best = Math.min(...attempts);
            if (!isNaN(best)) onScoreUpdate(Math.round(best));
        }
    }, [attempts, onScoreUpdate]);
    return <ReactionTest />;
}

function F1LightsWrapper({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
    const { reactionTime, state } = useF1Store();
    useEffect(() => {
        if (state === 'result' && reactionTime !== null) {
            onScoreUpdate(Math.round(reactionTime));
        }
    }, [state, reactionTime, onScoreUpdate]);
    return <F1Lights />;
}

function DecisionWrapper({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
    const { state, history } = useDecisionStore();
    useEffect(() => {
        if (state === 'end' && history.length > 0) {
            const avgMs = Math.round(history.reduce((a, b) => a + b, 0) / history.length) || 0;
            onScoreUpdate(avgMs);
        }
    }, [state, history, onScoreUpdate]);
    return <DecisionTest />;
}

function SequenceWrapper({ onScoreUpdate, onAutoFinish }: { onScoreUpdate: (score: number) => void, onAutoFinish: () => void }) {
    const { score, gameState } = useSequenceStore();
    useEffect(() => {
        onScoreUpdate(score);
    }, [score, gameState, onScoreUpdate]);
    return <SequenceMemory />;
}

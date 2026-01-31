"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Users, Play, Copy, ArrowRight, User, ArrowLeft } from "lucide-react";
import { socket } from "../lib/socket-client";
import { cn } from "@/shared/lib/utils";
import { TEST_MODES, TEST_MODE_LABELS } from "@/shared/constants/app";

interface Player {
    id: string;
    name: string;
    score: number;
    roomId: string;
}

// Generate a random 5-char room code
const generateRoomCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();

export function MultiplayerLobby({ onGameStart }: { onGameStart: () => void }) {
    const [view, setView] = useState<"name" | "menu" | "join-code" | "room">("name");
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const [players, setPlayers] = useState<Player[]>([]);
    const [error, setError] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [gameMode, setGameMode] = useState<string>(TEST_MODES.REACTION);

    useEffect(() => {
        // Initialize socket server logic
        fetch("/api/socket-init");

        // Socket listeners
        socket.on("room_update", (roomPlayers: Player[]) => {
            setPlayers(roomPlayers);
            setView("room");
        });

        socket.on("game_mode_update", (mode: string) => {
            setGameMode(mode);
        });

        socket.on("game_started", () => {
            onGameStart();
        });

        return () => {
            socket.off("room_update");
            socket.off("game_mode_update");
            socket.off("game_started");
        };
    }, [onGameStart]);

    const handleConnect = (code: string) => {
        if (!username) return;

        console.log(`Attempting to join room ${code} as ${username}`);

        if (!socket.connected) {
            console.log("Socket not connected, connecting...");
            socket.on("connect", () => {
                console.log("Socket connected, joining room...");
                socket.emit("join_room", { roomId: code, name: username }, (response: any) => {
                    console.log("Join room response:", response);
                });
            });
            socket.connect();
        } else {
            console.log("Socket already connected, joining room...");
            socket.emit("join_room", { roomId: code, name: username }, (response: any) => {
                console.log("Join room response:", response);
            });
        }

        setError("");
        setRoomId(code);
    };

    const handleCreateRoom = () => {
        const newCode = generateRoomCode();
        setIsHost(true);
        handleConnect(newCode);
    };

    const handleJoinWithCode = () => {
        if (!roomId) {
            setError("Enter a valid code");
            return;
        }
        setIsHost(false);
        handleConnect(roomId);
    };

    const [copied, setCopied] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStart = () => {
        socket.emit("start_game", roomId);
    };

    const handleModeSelect = (mode: string) => {
        socket.emit("select_game_mode", mode);
    };

    // Animation variants
    const slideVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <Card className="max-w-md mx-auto overflow-hidden border-primary/20 bg-black/60 backdrop-blur-xl p-6 min-h-[400px] flex flex-col justify-center">
            <AnimatePresence mode="wait">

                {/* STEP 1: NAME INPUT */}
                {view === "name" && (
                    <motion.div
                        key="name"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black font-orbitron text-white">DRIVER PROFILE</h2>
                            <p className="text-muted-foreground text-sm">Enter your callsign to begin.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Username</label>
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="e.g. Max Ver"
                                    className="bg-white/5 border-white/10 text-lg font-bold text-center h-10"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && username && setView("menu")}
                                />
                            </div>
                            <Button
                                onClick={() => setView("menu")}
                                className="w-full h-12 text-lg font-bold"
                                size="lg"
                                disabled={!username}
                            >
                                CONTINUE <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: MENU (CREATE vs JOIN) */}
                {view === "menu" && (
                    <motion.div
                        key="menu"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black font-orbitron text-white">SELECT MODE</h2>
                            <p className="text-muted-foreground text-sm">Host a race or join a friend.</p>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={handleCreateRoom}
                                className="w-full h-16 text-xl font-black bg-primary/10 hover:bg-primary/20 border-2 border-primary/50 text-primary"
                                variant="outline"
                            >
                                CREATE LOBBY
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-black px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => setView("join-code")}
                                className="w-full h-16 text-xl font-bold bg-white/5 hover:bg-white/10"
                                variant="secondary"
                            >
                                JOIN LOBBY
                            </Button>
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => setView("name")} className="w-full text-muted-foreground">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </motion.div>
                )}

                {/* STEP 3: JOIN CODE INPUT */}
                {view === "join-code" && (
                    <motion.div
                        key="join-code"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black font-orbitron text-white">ENTER COORDINATES</h2>
                            <p className="text-muted-foreground text-sm">Input the 5-character room code.</p>
                        </div>

                        <div className="space-y-4">
                            <Input
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                placeholder="XXXXX"
                                maxLength={5}
                                className="bg-white/5 border-white/10 text-3xl font-mono font-bold text-center h-20 tracking-[1em] uppercase"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-xs font-bold text-center animate-pulse">{error}</p>}

                            <Button onClick={handleJoinWithCode} className="w-full h-12 text-lg font-bold" size="lg" disabled={!roomId}>
                                CONNECT <Users className="ml-2 w-5 h-5" />
                            </Button>
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => setView("menu")} className="w-full text-muted-foreground">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </motion.div>
                )}

                {/* STEP 4: ROOM LOBBY */}
                {view === "room" && (
                    <motion.div
                        key="room"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-black font-orbitron text-primary mb-1">Briefing Room</h2>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    WAITING FOR DRIVERS
                                </div>
                            </div>
                            <div className="bg-white/5 p-2 rounded flex flex-col items-center min-w-[60px]">
                                <Users className="w-4 h-4 text-white" />
                                <span className="font-mono font-bold text-lg">{players.length}</span>
                            </div>
                        </div>

                        {/* Room Code Display */}
                        <div
                            className="bg-primary/20 border border-primary/50 text-center py-4 rounded-xl cursor-copy hover:bg-primary/30 transition-colors group relative"
                            onClick={copyCode}
                        >
                            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Room Code</p>
                            <p className="text-4xl font-mono font-black text-white tracking-widest">{roomId}</p>
                            <div className="absolute top-2 right-2 transition-opacity">
                                {copied ? (
                                    <span className="text-xs font-bold text-green-500 animate-pulse bg-black/50 px-2 py-1 rounded">COPIED!</span>
                                ) : (
                                    <Copy className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100" />
                                )}
                            </div>
                        </div>

                        {/* Game Mode Selector */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mission Objective</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.values(TEST_MODES).map((mode) => (
                                    <Button
                                        key={mode}
                                        onClick={() => handleModeSelect(mode)}
                                        variant="outline"
                                        className={cn(
                                            "h-auto py-2 text-xs font-bold border transition-all uppercase whitespace-normal",
                                            gameMode === mode
                                                ? "bg-primary text-black border-primary hover:bg-primary/90"
                                                : "bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground"
                                        )}
                                    >
                                        {TEST_MODE_LABELS[mode]}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto">
                            {players.map((p) => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-black/40 rounded border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="font-bold">{p.name} {p.id === socket.id && <span className="text-muted-foreground text-xs">(You)</span>}</span>
                                    </div>
                                    <span className="text-xs font-mono text-green-500 font-bold">READY</span>
                                </div>
                            ))}
                        </div>

                        {/* Only Host can start? For now anyone can start to keep it simple, or check isHost */}
                        <Button onClick={handleStart} className="w-full h-14 text-xl font-black tracking-widest btn-glow">
                            START RACE <Play className="ml-2 w-6 h-6" />
                        </Button>
                    </motion.div>
                )}

            </AnimatePresence>
        </Card>
    );
}

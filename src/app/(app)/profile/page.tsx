"use client";

import { useState, useEffect } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ArrowLeft, Save, User, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/model/auth-service";
import { PAGE_CONTENT, TOAST_MESSAGES } from "@/shared/constants/content";

const AVAILABLE_AVATARS = [
    "🏎️", "🏁", "🚀", "👽", "🤖", "🦁", "🐯", "🦅", "🦈", "🔥", "⚡", "🌟"
];

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [country, setCountry] = useState("UN"); // UN = Unknown/Universal
    const [avatar, setAvatar] = useState("🏎️");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUsername(user.username);
            fetchProfile(user.username);
        }
    }, []);

    const fetchProfile = async (name: string) => {
        const storedAvatar = localStorage.getItem('neuro_avatar');
        const storedCountry = localStorage.getItem('neuro_country');
        if (storedAvatar) setAvatar(storedAvatar);
        if (storedCountry) setCountry(storedCountry);
    };

    const handleSave = async () => {
        if (!username.trim()) return;
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, country, avatar }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update local storage auth
                localStorage.setItem('neuro_username', data.username);
                localStorage.setItem('neuro_avatar', data.avatar || avatar);
                localStorage.setItem('neuro_country', data.country || country);

                setMessage(TOAST_MESSAGES.PROFILE_SAVED);
                setTimeout(() => router.push("/multiplayer"), 1000);
            } else {
                setMessage(TOAST_MESSAGES.PROFILE_SAVE_ERROR);
            }
        } catch (e) {
            setMessage(TOAST_MESSAGES.PROFILE_SAVE_ERROR);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 container mx-auto flex flex-col items-center">
            <h1 className="text-4xl font-black font-orbitron text-white mb-8">{PAGE_CONTENT.PROFILE.TITLE} <span className="text-primary">{PAGE_CONTENT.PROFILE.TITLE_HIGHLIGHT}</span></h1>

            <Card className="w-full max-w-lg bg-black/60 backdrop-blur-xl border-primary/20 p-8 space-y-8">
                {/* Avatar Selection */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block text-center">Driver Avatar</label>
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-primary flex items-center justify-center text-6xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            {avatar}
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {AVAILABLE_AVATARS.map((a) => (
                            <button
                                key={a}
                                onClick={() => setAvatar(a)}
                                className={`text-2xl p-2 rounded hover:bg-white/10 transition-colors ${avatar === a ? "bg-primary/20 ring-2 ring-primary" : ""}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Callsign (Username)</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-10 h-12 bg-white/5 border-white/10 font-bold tracking-wide"
                            placeholder="Enter Username"
                        />
                    </div>
                </div>

                {/* Country (Simple Text for now) */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Region / Team</label>
                    <div className="relative">
                        <Flag className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                            value={country}
                            onChange={(e) => setCountry(e.target.value.toUpperCase().slice(0, 3))}
                            className="pl-10 h-12 bg-white/5 border-white/10 font-bold tracking-wide"
                            placeholder="e.g. USA"
                            maxLength={3}
                        />
                    </div>
                </div>

                {message && (
                    <div className={`text-center text-sm font-bold ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1 h-12" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button
                        className="flex-1 h-12 bg-primary hover:bg-primary/80 text-black font-bold"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Save Profile"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

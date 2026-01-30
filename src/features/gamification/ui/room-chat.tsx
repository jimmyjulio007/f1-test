"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Send } from "lucide-react"

interface Message {
    id: string
    playerId: string
    username: string
    text: string
    timestamp: Date
}

export function RoomChat({ roomId, playerId, username }: { roomId: string, playerId: string, username: string }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    // Listen for chat messages from localStorage (mock)
    useEffect(() => {
        const interval = setInterval(() => {
            const eventsKey = `room_events_${roomId}`
            const events = JSON.parse(localStorage.getItem(eventsKey) || "[]")
            const chatMessages = events
                .filter((e: any) => e.type === "chat_message")
                .map((e: any) => ({
                    id: `${e.timestamp}-${e.playerId}`,
                    playerId: e.playerId,
                    username: e.username,
                    text: e.message,
                    timestamp: new Date(e.timestamp)
                }))

            setMessages(chatMessages)
        }, 1000)

        return () => clearInterval(interval)
    }, [roomId])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    function handleSendMessage() {
        if (!inputText.trim()) return

        const eventsKey = `room_events_${roomId}`
        const events = JSON.parse(localStorage.getItem(eventsKey) || "[]")
        events.push({
            type: "chat_message",
            playerId,
            username,
            message: inputText.trim(),
            timestamp: Date.now()
        })
        localStorage.setItem(eventsKey, JSON.stringify(events))

        setInputText("")
    }

    return (
        <Card className="flex flex-col h-[400px] border-primary/20 bg-black/40">
            <div className="p-3 border-b border-primary/20 font-bold text-sm">Room Chat</div>
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-primary/20"
            >
                {messages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                        <span className={`font-bold ${msg.playerId === playerId ? "text-primary" : "text-blue-400"}`}>
                            {msg.username}:
                        </span>{" "}
                        <span className="text-foreground/90">{msg.text}</span>
                    </div>
                ))}
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground text-xs mt-10">
                        No messages yet. Say hi! 👋
                    </div>
                )}
            </div>
            <div className="p-2 border-t border-primary/20 flex gap-2">
                <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Send message..."
                    className="h-9 text-xs"
                />
                <Button size="icon" className="h-9 w-9" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    )
}

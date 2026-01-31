"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// In a real production app, this should be in an env variable
// For local, we use the port 4000 where our socket server is running
const SOCKET_URL = "http://localhost:4000";

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Initialize socket connection
        const socket = io(SOCKET_URL, {
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to socket server");
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
            setIsConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
    };
};

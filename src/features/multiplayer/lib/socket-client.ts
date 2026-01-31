import { io } from "socket.io-client";

// Singleton socket instance for the client
// Singleton socket instance for the client
export const socket = io({
    path: "/api/socket/io",
    addTrailingSlash: false,
    autoConnect: false // We connect manually when needed to ensure server is ready
});

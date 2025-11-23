"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

interface SocketContextType {
    socket: Socket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
})

export const useSocket = () => {
    return useContext(SocketContext)
}

export function SocketProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
            path: "/api/socket/io", // If using Next.js API route for socket, but we are using custom server
            // For custom server on same port, usually just io() works if served from same origin
            // But since we might run dev server separate, let's assume same origin for now
        })

        socketInstance.on("connect", () => {
            setIsConnected(true)
            console.log("Socket connected")
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false)
            console.log("Socket disconnected")
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}

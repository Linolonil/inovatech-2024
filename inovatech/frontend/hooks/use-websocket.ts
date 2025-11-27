"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"

interface WebSocketMessage {
  type: string
  data: unknown
}

export function useWebSocket(endpoint: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Mjc0Zjc4ZmMwMDEwNGM0YzI4MjA0YiIsImlhdCI6MTc2NDIzMTcyNiwiZXhwIjoxNzY0ODM2NTI2fQ.ehU6DKdzRSyP8mqBiiVROFfMcT71iVXWRtl-ZH9Wku4"
    if (!token) return

    const ws = new WebSocket(`${WS_BASE_URL}${endpoint}?token=${token}`)

    ws.onopen = () => setIsConnected(true)
    ws.onclose = () => {
      setIsConnected(false)
      setTimeout(connect, 3000) // Reconectar após 3s
    }
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        setLastMessage(message)
      } catch {
        console.error("Erro ao parsear mensagem WebSocket")
      }
    }

    wsRef.current = ws
  }, [endpoint])

  useEffect(() => {
    connect()
    return () => wsRef.current?.close()
  }, [connect])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  return { isConnected, lastMessage, sendMessage }
}

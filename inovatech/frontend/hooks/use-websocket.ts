"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"

export function useWebSocket(endpoint: string | null, subscribeDeviceId?: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    if (!endpoint) return

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Mjc0Zjc4ZmMwMDEwNGM0YzI4MjA0YiIsImlhdCI6MTc2NDIzNjg2MywiZXhwIjoxNzY0ODQxNjYzfQ.dOnVa1LBzucCSCzSHwCyvIx_ITvCC900ZWfIPFKv5a8"

    const ws = new WebSocket(`${WS_BASE_URL}${endpoint}`)

    ws.onopen = () => {
      setIsConnected(true)

      if (subscribeDeviceId) {
        ws.send(
          JSON.stringify({
            event: "subscribe",
            deviceId: subscribeDeviceId
          })
        )
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      setTimeout(connect, 3000)
    }

    ws.onmessage = event => {
      try {
        setLastMessage(JSON.parse(event.data))
      } catch {
        setLastMessage(event.data)
      }
    }

    wsRef.current = ws
  }, [endpoint, subscribeDeviceId])

  useEffect(() => {
    connect()
    return () => wsRef.current?.close()
  }, [connect])

  const sendMessage = useCallback((msg: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg))
    }
  }, [])

  return { isConnected, lastMessage, sendMessage }
}

"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { useEffect, useRef, useState } from "react"

export default function DeviceLogsPage({ params }: { params: { id: string } }) {
    const { id: deviceId } = params
    const [logs, setLogs] = useState<any[]>([])
    const wsRef = useRef<WebSocket | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const ws = new WebSocket(`wss://inovatech-2024.onrender.com/ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Mjc0Zjc4ZmMwMDEwNGM0YzI4MjA0YiIsImlhdCI6MTc2NDIzNjg2MywiZXhwIjoxNzY0ODQxNjYzfQ.dOnVa1LBzucCSCzSHwCyvIx_ITvCC900ZWfIPFKv5a8`)
        wsRef.current = ws

        ws.onopen = () => {
            setLogs(prev => [...prev, { type: "system", text: "Conectado ao WebSocket" }])

            // Assina eventos do device específico
            ws.send(JSON.stringify({ event: "subscribe", deviceId }))
        }

        ws.onmessage = (msg) => {
            try {
                const data = JSON.parse(msg.data)
                setLogs(prev => [...prev, data])
            } catch {
                setLogs(prev => [...prev, { type: "raw", text: msg.data }])
            }
        }

        ws.onerror = (err) => {
            setLogs(prev => [...prev, { type: "error", text: "Erro no WebSocket" }])
        }

        ws.onclose = () => {
            setLogs(prev => [...prev, { type: "system", text: "Conexão encerrada" }])
        }

        return () => {
            ws.close()
        }
    }, [deviceId])

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <DashboardHeader />

            <main className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Logs em tempo real – Device {deviceId}</h2>

                <div
                    ref={scrollRef}
                    className="bg-black text-green-400 font-mono p-4 rounded-lg h-[70vh] overflow-y-auto shadow-inner"
                >
                    {logs.map((log, i) => (
                        <pre key={i} className="whitespace-pre-wrap mb-2">
                            {typeof log === "string"
                                ? log
                                : JSON.stringify(log, null, 2)}
                        </pre>
                    ))}
                </div>
            </main>
        </div>
    )
}

"use client"

import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useWebSocket } from '@/hooks/use-websocket'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

interface ICombo {
  sequence: number[]
  message: string
  category: string
}

interface IDevice {
  id: string
  deviceId: string
  name: string
  config: {
    buttons: Record<number, string>
    combos: ICombo[]
  }
}

interface IDeviceEvent {
  type: string
  timestamp: string
  data: unknown
}

// MOCK APENAS TEMPORÁRIO
const makeMockDevice = (id: string): IDevice => ({
  id,
  deviceId: `DEVICE-${id.toUpperCase()}`,
  name: `Dispositivo ${id}`,
  config: {
    buttons: {
      1: "Saudações",
      2: "Emoções",
      3: "Necessidades",
      4: "Respostas",
    },
    combos: [
      { sequence: [1, 1], message: "Olá!", category: "Saudações" },
      { sequence: [2, 2], message: "Estou triste", category: "Emoções" },
    ]
  }
})

export default function DevicePage() {
  const { id } = useParams() as { id: string }

  const [device, setDevice] = useState<IDevice | null>(null)
  const [events, setEvents] = useState<IDeviceEvent[]>([])
  const [loading, setLoading] = useState(true)

  // WebSocket só inicia com o device carregado
  const endpoint = useMemo(() => {
    if (!device) return null
    return `/ws?deviceId=DEVICE-01`
  }, [device])

  const { lastMessage } = useWebSocket(endpoint)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setDevice(makeMockDevice(id))
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [id])

  useEffect(() => {
    if (!lastMessage) return

    setEvents(prev => [
      {
        type: lastMessage.event || "unknown",
        timestamp: new Date().toISOString(),
        data: lastMessage
      },
      ...prev
    ])
  }, [lastMessage])

  if (loading || !device) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/10">
        <DashboardHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-primary/5 via-background to-background">
      <DashboardHeader />

      <main className="flex-1 px-6 py-10 space-y-10">
        <section>
          <h1 className="text-3xl font-bold">{device.name}</h1>
          <p className="text-muted-foreground">ID: {device.deviceId}</p>
          <p className="text-sm text-muted-foreground">
            WebSocket: {endpoint}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Botões configurados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
            {Object.entries(device.config.buttons).map(([n, label]) => (
              <Card key={n} className="px-4 py-3">
                <p className="font-semibold">Botão {n}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Combos</h2>
            <Button><Plus className="mr-2 h-4 w-4" />Novo combo</Button>
          </div>
          <div className="space-y-4 mt-4">
            {device.config.combos.map((c, i) => (
              <Card key={i} className="p-4 flex justify-between">
                <div>
                  <p className="font-semibold">{c.message}</p>
                  <p className="text-sm">Seq: {c.sequence.join(" → ")}</p>
                  <p className="text-sm">Categoria: {c.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="pb-10">
          <h2 className="text-xl font-semibold">Eventos em tempo real</h2>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 mt-3">
            {events.map((ev, i) => (
              <Card key={i} className="p-4">
                <p className="font-semibold">{ev.type}</p>
                <p className="text-xs text-muted-foreground">{ev.timestamp}</p>
                <pre className="mt-2 text-sm bg-muted p-2 rounded">
                  {JSON.stringify(ev.data, null, 2)}
                </pre>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

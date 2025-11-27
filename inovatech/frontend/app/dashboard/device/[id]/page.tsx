"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { useWebSocket } from "@/hooks/use-websocket"
import { combosApi, devicesApi, eventsApi, type Combo, type Device, type DeviceEvent } from "@/lib/api"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"


export default function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [device, setDevice] = useState<Device | null>(null)
  const [combos, setCombos] = useState<Combo[]>([])
  const [events, setEvents] = useState<DeviceEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isComboDialogOpen, setIsComboDialogOpen] = useState(false)
  const [newComboName, setNewComboName] = useState("")
  const [selectedButtons, setSelectedButtons] = useState<number[]>([])
  const [isCreatingCombo, setIsCreatingCombo] = useState(false)

  const { lastMessage } = useWebSocket("/ws")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deviceData = await devicesApi.get(id)
        setDevice(deviceData)

        const [combosData, eventsData] = await Promise.all([
          combosApi.list(deviceData.deviceId),
          eventsApi.list(deviceData.deviceId),
        ])
        setCombos(combosData)
        setEvents(eventsData)
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, router])




  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-linear-to-br from-primary/5 via-background to-background">
        <DashboardHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
      </div>
    )
  }



  return (
    <></>
  )
}

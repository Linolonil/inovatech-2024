"use client"

import { DeviceCard } from "@/components/device-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWebSocket } from "@/hooks/use-websocket"
import { devicesApi, type Device } from "@/lib/api"
import { Plus, Smartphone } from "lucide-react"
import { useEffect, useState } from "react"

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newDeviceId, setNewDeviceId] = useState("")
  const [newDeviceName, setNewDeviceName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")

  const { lastMessage } = useWebSocket("/ws")
console.log("lastMessage", lastMessage)
  const fetchDevices = async () => {
    try {
      const data = await devicesApi.list()
      setDevices(data)
    } catch (err) {
      console.error("Erro ao carregar dispositivos:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  // Atualiza status online/offline via WebSocket
  useEffect(() => {
    if (lastMessage?.type === "deviceStatus") {
      const { deviceId, isOnline } = lastMessage.data as { deviceId: string; isOnline: boolean }
      setDevices((prev) => prev.map((d) => (d.deviceId === deviceId ? { ...d, isOnline } : d)))
    }
  }, [lastMessage])

  const handleCreateDevice = async () => {
    if (!newDeviceId.trim() || !newDeviceName.trim()) {
      setError("Preencha todos os campos")
      return
    }

    setIsCreating(true)
    setError("")

    try {
      const device = await devicesApi.create(newDeviceId, newDeviceName)
      setDevices((prev) => [...prev, device])
      setIsDialogOpen(false)
      setNewDeviceId("")
      setNewDeviceName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar dispositivo")
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Card className="w-full max-w-lg border-primary/10 text-center shadow-lg">
          <CardHeader className="pb-4 pt-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Vamos começar!</CardTitle>
            <CardDescription className="mx-auto max-w-sm text-base text-muted-foreground">
              Adicione seu primeiro dispositivo e comece a configurar a comunicação com sua criança.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-10">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 rounded-xl px-8 text-base" size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar dispositivo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Dispositivo</DialogTitle>
                  <DialogDescription>Cadastre o dispositivo da criança para começar a configurar.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceId">ID do Dispositivo</Label>
                    <Input
                      id="deviceId"
                      placeholder="Ex: CRIANCA-01"
                      value={newDeviceId}
                      onChange={(e) => setNewDeviceId(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deviceName">Nome do Dispositivo</Label>
                    <Input
                      id="deviceName"
                      placeholder="Ex: Dispositivo da Maria"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateDevice} disabled={isCreating}>
                    {isCreating ? "Criando..." : "Adicionar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Meus Dispositivos</h1>
          <p className="mt-1 text-muted-foreground">Gerencie os dispositivos conectados da sua família</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl px-6">
              <Plus className="mr-2 h-5 w-5" />
              Novo dispositivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Dispositivo</DialogTitle>
              <DialogDescription>Cadastre o dispositivo da criança para começar a configurar.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId2">ID do Dispositivo</Label>
                <Input
                  id="deviceId2"
                  placeholder="Ex: CRIANCA-01"
                  value={newDeviceId}
                  onChange={(e) => setNewDeviceId(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceName2">Nome do Dispositivo</Label>
                <Input
                  id="deviceName2"
                  placeholder="Ex: Dispositivo da Maria"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateDevice} disabled={isCreating}>
                {isCreating ? "Criando..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <DeviceCard
            key={device._id}
            device={{
              id: device._id,
              name: device.name,
              deviceId: device.deviceId,
              status: device.isOnline ? "online" : "offline",
            }}
          />
        ))}
      </div>
    </div>
  )
}

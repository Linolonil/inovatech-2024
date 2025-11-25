"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, Wifi, WifiOff, Trash2, Plus, Zap, History, Settings } from "lucide-react"
import { devicesApi, combosApi, eventsApi, type Device, type Combo, type DeviceEvent } from "@/lib/api"
import { useWebSocket } from "@/hooks/use-websocket"

const BUTTON_COLORS = [
  { id: 0, color: "bg-red-500", name: "Vermelho" },
  { id: 1, color: "bg-orange-500", name: "Laranja" },
  { id: 2, color: "bg-yellow-500", name: "Amarelo" },
  { id: 3, color: "bg-green-500", name: "Verde" },
  { id: 4, color: "bg-blue-500", name: "Azul" },
  { id: 5, color: "bg-indigo-500", name: "Índigo" },
  { id: 6, color: "bg-purple-500", name: "Roxo" },
  { id: 7, color: "bg-pink-500", name: "Rosa" },
  { id: 8, color: "bg-teal-500", name: "Turquesa" },
  { id: 9, color: "bg-cyan-500", name: "Ciano" },
  { id: 10, color: "bg-lime-500", name: "Lima" },
  { id: 11, color: "bg-amber-500", name: "Âmbar" },
  { id: 12, color: "bg-gray-800", name: "Preto" },
]

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

  const { lastMessage } = useWebSocket("/ws/dashboard")

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

  // Atualiza eventos em tempo real
  useEffect(() => {
    if (lastMessage?.type === "newEvent" && device) {
      const event = lastMessage.data as DeviceEvent
      if (event.deviceId === device.deviceId) {
        setEvents((prev) => [event, ...prev].slice(0, 50))
      }
    }
    if (lastMessage?.type === "deviceStatus" && device) {
      const { deviceId, isOnline } = lastMessage.data as { deviceId: string; isOnline: boolean }
      if (deviceId === device.deviceId) {
        setDevice((prev) => (prev ? { ...prev, isOnline } : null))
      }
    }
  }, [lastMessage, device])

  const handleButtonSelect = (buttonId: number) => {
    if (selectedButtons.includes(buttonId)) {
      setSelectedButtons(selectedButtons.filter((b) => b !== buttonId))
    } else if (selectedButtons.length < 6) {
      setSelectedButtons([...selectedButtons, buttonId])
    }
  }

  const handleCreateCombo = async () => {
    if (!newComboName.trim() || selectedButtons.length < 2 || !device) return

    setIsCreatingCombo(true)
    try {
      const combo = await combosApi.create(device.deviceId, newComboName, selectedButtons)
      setCombos((prev) => [...prev, combo])
      setIsComboDialogOpen(false)
      setNewComboName("")
      setSelectedButtons([])
    } catch (err) {
      console.error("Erro ao criar combo:", err)
    } finally {
      setIsCreatingCombo(false)
    }
  }

  const handleDeleteCombo = async (comboId: string) => {
    try {
      await combosApi.delete(comboId)
      setCombos((prev) => prev.filter((c) => c._id !== comboId))
    } catch (err) {
      console.error("Erro ao deletar combo:", err)
    }
  }

  const handleDeleteDevice = async () => {
    if (!device) return
    try {
      await devicesApi.delete(device.deviceId)
      router.push("/dashboard")
    } catch (err) {
      console.error("Erro ao deletar dispositivo:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/5 via-background to-background">
        <DashboardHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
      </div>
    )
  }

  if (!device) return null

  const isOnline = device.isOnline

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/5 via-background to-background">
      <DashboardHeader />
      <main className="container flex-1 px-6 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos dispositivos
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Settings className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{device.name}</h1>
                <p className="text-muted-foreground">ID: {device.deviceId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={isOnline ? "default" : "secondary"}
                className={`gap-1.5 px-4 py-2 text-sm ${isOnline ? "bg-green-500/10 text-green-600" : ""}`}
              >
                {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="rounded-xl">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover dispositivo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Todos os combos e histórico serão perdidos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDevice}>Remover</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <Tabs defaultValue="combos" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl bg-muted p-1">
            <TabsTrigger value="combos" className="rounded-lg gap-2">
              <Zap className="h-4 w-4" />
              Combos
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="combos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Combos Configurados</h2>
                <p className="text-sm text-muted-foreground">Combinações de botões que representam mensagens</p>
              </div>
              <Dialog open={isComboDialogOpen} onOpenChange={setIsComboDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Combo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Combo</DialogTitle>
                    <DialogDescription>
                      Selecione de 2 a 6 botões para criar uma combinação com significado.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label>Nome / Mensagem do Combo</Label>
                      <Input
                        placeholder="Ex: Eu quero água"
                        value={newComboName}
                        onChange={(e) => setNewComboName(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sequência de Botões ({selectedButtons.length}/6)</Label>
                      <div className="grid grid-cols-5 gap-3">
                        {BUTTON_COLORS.map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => handleButtonSelect(btn.id)}
                            className={`h-12 w-12 rounded-xl transition-all ${btn.color} ${
                              selectedButtons.includes(btn.id)
                                ? "ring-4 ring-primary ring-offset-2 scale-110"
                                : "opacity-70 hover:opacity-100"
                            }`}
                            title={btn.name}
                          />
                        ))}
                      </div>
                      {selectedButtons.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Ordem:</span>
                          <div className="flex gap-1">
                            {selectedButtons.map((btnId, idx) => {
                              const btn = BUTTON_COLORS.find((b) => b.id === btnId)
                              return (
                                <div
                                  key={idx}
                                  className={`h-6 w-6 rounded-lg ${btn?.color}`}
                                  title={`${idx + 1}. ${btn?.name}`}
                                />
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsComboDialogOpen(false)
                        setSelectedButtons([])
                        setNewComboName("")
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateCombo}
                      disabled={isCreatingCombo || selectedButtons.length < 2 || !newComboName.trim()}
                    >
                      {isCreatingCombo ? "Criando..." : "Criar Combo"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {combos.length === 0 ? (
              <Card className="border-dashed border-primary/20 bg-primary/5">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Zap className="mb-4 h-12 w-12 text-primary/40" />
                  <h3 className="text-lg font-medium text-foreground">Nenhum combo configurado</h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Crie combos para que a criança possa enviar mensagens complexas combinando botões.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {combos.map((combo) => (
                  <Card key={combo._id} className="border-primary/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{combo.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteCombo(combo._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        {combo.sequence.map((btnId, idx) => {
                          const btn = BUTTON_COLORS.find((b) => b.id === btnId)
                          return (
                            <div
                              key={idx}
                              className={`h-8 w-8 rounded-lg ${btn?.color || "bg-gray-400"}`}
                              title={btn?.name}
                            />
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Histórico de Eventos</h2>
              <p className="text-sm text-muted-foreground">Últimas interações registradas pelo dispositivo</p>
            </div>

            {events.length === 0 ? (
              <Card className="border-dashed border-primary/20 bg-primary/5">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <History className="mb-4 h-12 w-12 text-primary/40" />
                  <h3 className="text-lg font-medium text-foreground">Nenhum evento registrado</h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Os eventos aparecerão aqui quando a criança interagir com o dispositivo.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {events.map((event) => {
                  const btn = BUTTON_COLORS.find((b) => b.id === event.data.buttonId)
                  const time = new Date(event.timestamp).toLocaleString("pt-BR")
                  return (
                    <Card key={event._id} className="border-primary/10">
                      <CardContent className="flex items-center gap-4 py-4">
                        <div className={`h-10 w-10 rounded-xl ${btn?.color || "bg-gray-400"}`} />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            Botão {btn?.name || event.data.buttonId} pressionado
                          </p>
                          <p className="text-sm text-muted-foreground">{time}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

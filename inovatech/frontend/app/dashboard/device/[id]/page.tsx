"use client"

import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Edit, Plus, Trash2, Circle, Zap, Save, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'


interface ICombo {
  sequence: number[]
  message: string
  category: string
}

interface IDevice {
  _id: string
  deviceId: string
  name: string
  config: {
    buttons: Record<number, string>
    combos: ICombo[]
  }
}

interface ButtonPressEvent {
  id: string
  deviceId: string
  buttonId: number
  color: string
  emotion: string
  timestamp: string
  comboProgress?: number[]
  fromBuffer?: boolean
}

interface ComboCompletedEvent {
  id: string
  deviceId: string
  sequence: number[] | Array<{buttonId: number, color: string, emotion: string}>
  message: string
  category?: string
  timestamp: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'

const CATEGORIES = [
  "Saudações", "Emoções", "Necessidades", "Respostas", 
  "Atividades", "Pessoas", "Expressões", "Urgências", "Cortesia"
]

export default function DeviceMonitor() {
  // Props do device (normalmente viria do useParams)
  const deviceId = "DEVICE-01"
  
  const [device, setDevice] = useState<IDevice | null>(null)
  const [loading, setLoading] = useState(true)
  const [buttonPresses, setButtonPresses] = useState<ButtonPressEvent[]>([])
  const [combosCompleted, setCombosCompleted] = useState<ComboCompletedEvent[]>([])
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
  const [ws, setWs] = useState<WebSocket | null>(null)
  
  // Gerenciamento de combos
  const [editingCombo, setEditingCombo] = useState<{index: number, combo: ICombo} | null>(null)
  const [newCombo, setNewCombo] = useState<ICombo | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(CATEGORIES))
  const [savingCombos, setSavingCombos] = useState(false)

  // Carregar dispositivo
  useEffect(() => {
    loadDevice()
  }, [deviceId])

  const loadDevice = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token') || 'mock-token'
      const response = await fetch(`${API_URL}/devices/${deviceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) throw new Error('Erro ao carregar dispositivo')
      
      const data = await response.json()
      setDevice(data)
    } catch (error) {
      console.error('Erro ao carregar device:', error)
      // Fallback para mock
      setDevice({
        _id: '1',
        deviceId: deviceId,
        name: 'Dispositivo Mock',
        config: {
          buttons: {
            1: "vermelho", 2: "branco1", 3: "azul",
            4: "verde", 5: "branco2", 6: "preto"
          },
          combos: [
            { sequence: [1, 1], message: "Olá!", category: "Saudações" },
            { sequence: [2, 2], message: "Estou triste", category: "Emoções" },
          ]
        }
      })
    } finally {
      setLoading(false)
    }
  }

  // WebSocket
  useEffect(() => {
    if (!device) return

    const token = localStorage.getItem('token') || 'mock-token'
    const wsUrl = `${WS_URL}/ws?token=${token}`
    
    console.log('Conectando ao WebSocket:', wsUrl)
    setWsStatus('connecting')
    
    const websocket = new WebSocket(wsUrl)

    websocket.onopen = () => {
      console.log('✅ WebSocket conectado')
      setWsStatus('connected')
      
      websocket.send(JSON.stringify({
        event: 'subscribe',
        deviceId: device.deviceId
      }))
    }

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log('📨 Mensagem recebida:', message)

        if (message.event === 'buttonPress' && message.data) {
          setButtonPresses(prev => [message.data, ...prev].slice(0, 50))
        }
        
        if (message.event === 'comboCompleted' && message.data) {
          setCombosCompleted(prev => [message.data, ...prev].slice(0, 20))
        }
      } catch (error) {
        console.error('Erro ao processar mensagem:', error)
      }
    }

    websocket.onerror = (error) => {
      console.error('❌ Erro no WebSocket:', error)
      setWsStatus('disconnected')
    }

    websocket.onclose = () => {
      console.log('🔌 WebSocket desconectado')
      setWsStatus('disconnected')
    }

    setWs(websocket)
    return () => websocket.close()
  }, [device])

  // Salvar combos
  const saveCombos = async (combos: ICombo[]) => {
    if (!device) return
    
    setSavingCombos(true)
    try {
      const token = localStorage.getItem('token') || 'mock-token'
      const response = await fetch(`${API_URL}/devices/${device.deviceId}/combos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ combos })
      })
      
      if (!response.ok) throw new Error('Erro ao salvar combos')
      
      const data = await response.json()
      setDevice(prev => prev ? { ...prev, config: { ...prev.config, combos: data.combos } } : null)
      alert('Combos salvos com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar combos:', error)
      alert('Erro ao salvar combos')
    } finally {
      setSavingCombos(false)
    }
  }

  const handleAddCombo = () => {
    setNewCombo({ sequence: [], message: "", category: "Saudações" })
  }

  const handleSaveNewCombo = () => {
    if (!newCombo || !device) return
    if (newCombo.sequence.length === 0 || !newCombo.message) {
      alert('Preencha a sequência e a mensagem')
      return
    }
    
    const updatedCombos = [...device.config.combos, newCombo]
    saveCombos(updatedCombos)
    setNewCombo(null)
  }

  const handleEditCombo = (index: number) => {
    if (!device) return
    setEditingCombo({ index, combo: { ...device.config.combos[index] } })
  }

  const handleSaveEdit = () => {
    if (!editingCombo || !device) return
    
    const updatedCombos = [...device.config.combos]
    updatedCombos[editingCombo.index] = editingCombo.combo
    saveCombos(updatedCombos)
    setEditingCombo(null)
  }

  const handleDeleteCombo = (index: number) => {
    if (!device || !confirm('Deletar este combo?')) return
    
    const updatedCombos = device.config.combos.filter((_, i) => i !== index)
    saveCombos(updatedCombos)
  }

  const handleResetToDefault = async () => {
    if (!device || !confirm('Resetar todos os combos para o padrão?')) return
    
    setSavingCombos(true)
    try {
      const token = localStorage.getItem('token') || 'mock-token'
      const response = await fetch(`${API_URL}/devices/${device.deviceId}/combos/reset`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) throw new Error('Erro ao resetar')
      
      const data = await response.json()
      setDevice(prev => prev ? { ...prev, config: data.config } : null)
      alert('Combos resetados para o padrão!')
    } catch (error) {
      console.error('Erro ao resetar:', error)
      alert('Erro ao resetar combos')
    } finally {
      setSavingCombos(false)
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const getButtonColor = (buttonId: number) => {
    const colors: Record<number, string> = {
      1: 'bg-red-500', 2: 'bg-gray-100 border-2 border-gray-400', 3: 'bg-blue-500',
      4: 'bg-green-500', 5: 'bg-gray-100 border-2 border-gray-400', 6: 'bg-gray-900'
    }
    return colors[buttonId] || 'bg-gray-500'
  }

  const getButtonTextColor = (buttonId: number) => {
    return [2, 5].includes(buttonId) ? 'text-gray-700' : 'text-white'
  }

  const combosByCategory = useMemo(() => {
    if (!device) return {}
    
    const grouped: Record<string, ICombo[]> = {}
    device.config.combos.forEach(combo => {
      if (!grouped[combo.category]) grouped[combo.category] = []
      grouped[combo.category].push(combo)
    })
    return grouped
  }, [device?.config.combos])

  const SequenceInput = ({ sequence, onChange }: { sequence: number[], onChange: (seq: number[]) => void }) => {
    const [inputValue, setInputValue] = useState(sequence.join(', '))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setInputValue(val)
      
      const parsed = val.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= 6)
      onChange(parsed)
    }

    return (
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder="Ex: 1, 2, 3"
        className="font-mono"
      />
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!device) return <div className="p-6">Dispositivo não encontrado</div>

  return (
    <>
      <DashboardHeader />
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 p-6">
      {/* Header */}      
      
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{device.name}</h1>
            <p className="text-gray-600">ID: {device.deviceId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Circle 
              className={`h-3 w-3 ${
                wsStatus === 'connected' ? 'fill-green-500 text-green-500' :
                wsStatus === 'connecting' ? 'fill-yellow-500 text-yellow-500' :
                'fill-red-500 text-red-500'
              }`}
            />
            <span className="text-sm font-medium">
              {wsStatus === 'connected' ? 'Conectado' :
               wsStatus === 'connecting' ? 'Conectando...' :
               'Desconectado'}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda - Configurações */}
        <div className="lg:col-span-1 space-y-6">
          {/* Botões */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Botões</h2>
            <div className="space-y-2">
              {Object.entries(device.config.buttons).map(([num, label]) => (
                <div key={num} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`h-8 w-8 rounded-full ${getButtonColor(Number(num))} flex items-center justify-center ${getButtonTextColor(Number(num))} font-bold text-sm`}>
                    {num}
                  </div>
                  <span className="font-medium text-sm">{label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Gerenciar Combos */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Combos ({device.config.combos.length})</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleResetToDefault} disabled={savingCombos}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleAddCombo}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filtro por categoria */}
            <Select value={selectedCategory} onChange={(e: any) => setSelectedCategory(e.target.value)} className="mb-4">
              <option value="all">Todas as categorias</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat} ({combosByCategory[cat]?.length || 0})</option>
              ))}
            </Select>

            {/* Novo combo */}
            {newCombo && (
              <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Mensagem</label>
                  <Input
                    value={newCombo.message}
                    onChange={(e) => setNewCombo({ ...newCombo, message: e.target.value })}
                    placeholder="Ex: Olá!"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Sequência (1-6)</label>
                  <SequenceInput
                    sequence={newCombo.sequence}
                    onChange={(seq) => setNewCombo({ ...newCombo, sequence: seq })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Categoria</label>
                  <Select
                    value={newCombo.category}
                    onChange={(e: any) => setNewCombo({ ...newCombo, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveNewCombo} disabled={savingCombos}>
                    <Save className="h-4 w-4 mr-1" /> Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setNewCombo(null)}>
                    <X className="h-4 w-4 mr-1" /> Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Lista por categoria */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {Object.entries(combosByCategory)
                .filter(([cat]) => selectedCategory === "all" || selectedCategory === cat)
                .map(([category, combos]) => (
                  <div key={category}>
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      <span className="font-semibold text-sm">{category} ({combos.length})</span>
                      {expandedCategories.has(category) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    
                    {expandedCategories.has(category) && (
                      <div className="mt-1 space-y-2">
                        {combos.map((combo, globalIndex) => {
                          const index = device.config.combos.indexOf(combo)
                          const isEditing = editingCombo?.index === index

                          return (
                            <div key={index} className="p-3 bg-white border rounded-lg">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editingCombo.combo.message}
                                    onChange={(e) => setEditingCombo({ ...editingCombo, combo: { ...editingCombo.combo, message: e.target.value } })}
                                  />
                                  <SequenceInput
                                    sequence={editingCombo.combo.sequence}
                                    onChange={(seq) => setEditingCombo({ ...editingCombo, combo: { ...editingCombo.combo, sequence: seq } })}
                                  />
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={handleSaveEdit} disabled={savingCombos}>
                                      <Save className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingCombo(null)}>
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{combo.message}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      {combo.sequence.map((btn, idx) => (
                                        <div key={idx} className="flex items-center">
                                          <div className={`h-5 w-5 rounded-full ${getButtonColor(btn)} flex items-center justify-center ${getButtonTextColor(btn)} text-xs font-bold`}>
                                            {btn}
                                          </div>
                                          {idx < combo.sequence.length - 1 && <span className="mx-1 text-gray-400 text-xs">→</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditCombo(index)}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={() => handleDeleteCombo(index)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Coluna direita - Eventos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Combos completados */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Combos Completados</h2>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {combosCompleted.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aguardando combos...</p>
              ) : (
                combosCompleted.map((combo, i) => {
                  const sequence = Array.isArray(combo.sequence) 
                    ? combo.sequence.map(item => typeof item === 'number' ? item : item.buttonId)
                    : []
                  
                  return (
                    <div key={i} className="p-4 bg-linear-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-lg text-yellow-900">{combo.message}</p>
                          {combo.category && (
                            <p className="text-sm text-yellow-700 mt-1">📁 {combo.category}</p>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            {sequence.map((btn, idx) => (
                              <div key={idx} className="flex items-center">
                                <div className={`h-7 w-7 rounded-full ${getButtonColor(btn)} flex items-center justify-center ${getButtonTextColor(btn)} text-sm font-bold shadow-md`}>
                                  {btn}
                                </div>
                                {idx < sequence.length - 1 && <span className="mx-1 text-yellow-600">→</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-3">
                          {new Date(combo.timestamp).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </Card>

          {/* Botões pressionados */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Últimas Pressões</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {buttonPresses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aguardando pressões...</p>
              ) : (
                buttonPresses.map((press, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full ${getButtonColor(press.buttonId)} flex items-center justify-center ${getButtonTextColor(press.buttonId)} font-bold shadow-md`}>
                          {press.buttonId}
                        </div>
                        <div>
                          <p className="font-semibold">{press.emotion}</p>
                          <p className="text-xs text-gray-500">Cor: {press.color}</p>
                          {press.comboProgress && press.comboProgress.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs text-blue-600">Progresso:</span>
                              {press.comboProgress.map((btn, idx) => (
                                <span key={idx} className="text-xs font-mono bg-blue-100 px-1 rounded">
                                  {btn}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          {new Date(press.timestamp).toLocaleTimeString('pt-BR')}
                        </span>
                        {press.fromBuffer && (
                          <p className="text-xs text-orange-600 font-medium">Buffer</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}
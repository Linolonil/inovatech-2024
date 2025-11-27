const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://inovatech-2024.onrender.com/api"

// Helper para pegar o token do localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })


  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
    
    console.error("❌ API Error:", error)
    
    // Se for erro 401 (não autorizado), limpa o localStorage
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth'
    }
    
    throw new Error(error.message || "Erro na requisição")
  }

  const data = await response.json()
  console.log("✅ API Response:", data)
  
  return data
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    apiRequest<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
}

// Devices
export const devicesApi = {
  list: () => apiRequest<Device[]>("/devices"),
  get: (deviceId: string) => apiRequest<Device>(`/devices/${deviceId}`),
  create: (deviceId: string, name: string) =>
    apiRequest<Device>("/devices", {
      method: "POST",
      body: JSON.stringify({ deviceId, name }),
    }),
  delete: (deviceId: string) => apiRequest<void>(`/devices/${deviceId}`, { method: "DELETE" }),
}

// Events
export const eventsApi = {
  list: (deviceId: string) => apiRequest<DeviceEvent[]>(`/events/${deviceId}`),
}

// Combos
export const combosApi = {
  list: (deviceId: string) => apiRequest<Combo[]>(`/combos/${deviceId}`),
  create: (deviceId: string, name: string, sequence: number[]) =>
    apiRequest<Combo>("/combos", {
      method: "POST",
      body: JSON.stringify({ deviceId, name, sequence }),
    }),
  delete: (comboId: string) => apiRequest<void>(`/combos/${comboId}`, { method: "DELETE" }),
}

// Types
export interface User {
  id: string
  name: string
  email: string
}

export interface Device {
  _id: string
  deviceId: string
  name: string
  userId: string
  isOnline?: boolean
  createdAt: string
}

export interface DeviceEvent {
  _id: string
  deviceId: string
  event: string
  data: { buttonId: number; color?: string }
  timestamp: string
}

export interface Combo {
  _id: string
  deviceId: string
  name: string
  sequence: number[]
  createdAt: string
} 
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DeviceList } from "@/components/device-list"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      router.push('/auth')
    }
  }, [user, token, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-primary/5 via-background to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Não renderiza nada se não estiver autenticado (evita flash de conteúdo)
  if (!user || !token) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-linear-to-br from-primary/5 via-background to-background">
      <DashboardHeader />
      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="container flex-1 px-6 py-10">
          <DeviceList />
        </div>
      </main>
    </div>
  )
}
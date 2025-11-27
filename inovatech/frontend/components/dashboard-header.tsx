"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Bell, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md flex justify-center items-center">
      <div className="container flex h-18 items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="text-xl font-bold text-foreground">Emote Tutor</span>
        </Link>
        <div className="flex items-center gap-2">
          {user && (
            <span className="mr-2 text-sm text-muted-foreground hidden sm:block">Olá, {user.name.split(" ")[0]}</span>
          )}
          <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificações</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground">
            <User className="h-5 w-5" />
            <span className="sr-only">Perfil</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

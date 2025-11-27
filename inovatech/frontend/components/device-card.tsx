import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, WifiOff } from "lucide-react"

interface DeviceCardProps {
  device: {
    id: string
    name: string
    deviceId: string
    status: "online" | "offline"
  }
}

export function DeviceCard({ device }: DeviceCardProps) {
  const isOnline = device.status === "online"

  return (
    <Link href={`/dashboard/device/${device.id}`}>
      <Card className="group cursor-pointer border-primary/10 transition-all hover:border-primary/30 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg text-foreground">{device.name}</CardTitle>
                <p className="text-sm text-muted-foreground">ID: {device.deviceId}</p>
              </div>
            </div>
            <Badge
              variant={isOnline ? "default" : "secondary"}
              className={`gap-1.5 rounded-full px-3 ${isOnline ? "bg-green-500/10 text-green-600" : ""}`}
            >
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={`h-full rounded-full transition-all ${isOnline ? "w-full bg-green-500" : "w-0"}`} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

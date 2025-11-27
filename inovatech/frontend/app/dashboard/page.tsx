import { DeviceList } from "@/components/device-list"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/5 via-background to-background">
      <DashboardHeader />
      <main className="flex flex-1 flex-col">
        <div className="container flex-1 px-6 py-10">
          <DeviceList />
        </div>
      </main>
    </div>
  )
}

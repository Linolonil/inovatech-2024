import { DashboardHeader } from "@/components/dashboard-header"
import { DeviceList } from "@/components/device-list"

export default function DashboardPage() {
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

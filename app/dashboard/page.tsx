import { Sidebar } from "@/components/sidebar"
import { BotList } from "@/components/bot-list"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <BotList />
        </div>
      </main>
    </div>
  )
}

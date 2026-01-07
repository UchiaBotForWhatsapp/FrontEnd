import { Sidebar } from "@/components/sidebar"
import { BotForm } from "@/components/bot-form"

export default function NewBotPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-3xl mx-auto">
          <BotForm />
        </div>
      </main>
    </div>
  )
}

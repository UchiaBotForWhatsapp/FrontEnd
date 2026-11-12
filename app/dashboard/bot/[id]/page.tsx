"use client"

import { Sidebar } from "@/components/sidebar"
import { BotForm } from "@/components/bot-form"
import { Spinner } from "@/components/ui/spinner"
import { use, useEffect, useState } from "react"
import { botApi, type BotData } from "@/lib/api-client"

interface BotPageProps {
  params: Promise<{ id: string }>
}

export default function EditBotPage({ params }: BotPageProps) {
  const { id } = use(params)
  const [botData, setBotData] = useState<BotData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBot = async () => {
      try {
        const data = await botApi.get(id)
        setBotData(data.bot)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchBot()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Spinner className="size-8" />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Erro ao carregar bot: {error}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 pt-16 md:p-8 max-w-3xl mx-auto">
          <BotForm botId={id} initialData={botData ?? undefined} />
        </div>
      </main>
    </div>
  )
}

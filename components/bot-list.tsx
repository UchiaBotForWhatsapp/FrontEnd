"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBots } from "@/hooks/use-bots"
import { Trash2, Edit2, Eye, EyeOff, Plus } from "lucide-react"

export function BotList() {
  const { bots, isLoading, deleteBot, toggleBot } = useBots()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este bot?")) return

    setDeleting(id)
    try {
      await deleteBot(id)
    } finally {
      setDeleting(null)
    }
  }

  const handleToggle = async (id: string, currentActive: boolean) => {
    setToggling(id)
    try {
      await toggleBot(id, !currentActive)
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Bots</h1>
        <Link href="/dashboard/bot/new">
          <Button className="bg-accent hover:bg-accent/90 gap-2">
            <Plus className="w-4 h-4" />
            Novo Bot
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando bots...</p>
        </div>
      ) : !bots || bots.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Você ainda não tem nenhum bot criado</p>
              <Link href="/dashboard/bot/new">
                <Button className="bg-accent hover:bg-accent/90">Criar Primeiro Bot</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bots.map((bot: any) => (
            <Card key={bot.id} className="bg-card border-border hover:border-accent/50 transition">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{bot.name}</CardTitle>
                      <Badge variant={bot.active ? "default" : "secondary"} className="bg-accent">
                        {bot.active ? "Ativo" : "Inativo"}
                      </Badge>
                      {bot.plan && <Badge variant="outline">{bot.plan}</Badge>}
                    </div>
                    <CardDescription className="line-clamp-2">{bot.description || "Sem descrição"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{bot.messages_count || 0}</span> mensagens
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggle(bot.id, bot.active)}
                      disabled={toggling === bot.id}
                      className="gap-2"
                    >
                      {bot.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Link href={`/dashboard/bot/${bot.id}`}>
                      <Button size="sm" variant="ghost" className="gap-2">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(bot.id)}
                      disabled={deleting === bot.id}
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

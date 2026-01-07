"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useBots } from "@/hooks/use-bots"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BotFormProps {
  botId?: string
  initialData?: any
}

export function BotForm({ botId, initialData }: BotFormProps) {
  const router = useRouter()
  const { createBot, updateBot } = useBots()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "personal",
    greeting_message: initialData?.greeting_message || "Olá! Como posso ajudar?",
    webhook_url: initialData?.webhook_url || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Nome do bot é obrigatório")
      return
    }

    setLoading(true)
    try {
      if (botId) {
        await updateBot(botId, formData)
      } else {
        await createBot(formData)
      }
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Erro ao salvar bot")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-accent hover:underline w-fit">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{botId ? "Editar Bot" : "Criar Novo Bot"}</CardTitle>
          <CardDescription>Configure os detalhes básicos do seu bot WhatsApp</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Nome do Bot
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Bot de Atendimento"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="type" className="mb-2 block">
                  Tipo
                </Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground disabled:opacity-50"
                >
                  <option value="personal">Pessoal</option>
                  <option value="business">Negócio</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block">
                Descrição
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Descreva o propósito do seu bot"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={4}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="greeting_message" className="mb-2 block">
                Mensagem de Boas-vindas
              </Label>
              <textarea
                id="greeting_message"
                name="greeting_message"
                placeholder="Mensagem de saudação do bot"
                value={formData.greeting_message}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="webhook_url" className="mb-2 block">
                URL do Webhook (Opcional)
              </Label>
              <Input
                id="webhook_url"
                name="webhook_url"
                placeholder="https://seu-dominio.com/webhook"
                type="url"
                value={formData.webhook_url}
                onChange={handleChange}
                disabled={loading}
                className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground mt-2">Onde seu servidor receberá eventos do bot</p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Bot"}
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authApi } from "@/lib/api-client"

export function ActivationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [activationToken, setActivationToken] = useState(token || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!activationToken.trim()) {
      setError("Por favor, insira o código de ativação")
      return
    }

    setLoading(true)
    try {
      await authApi.activateAccount(activationToken)
      setSuccess(true)
      setTimeout(() => {
        router.push("/plans")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Erro ao ativar conta")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-12 pb-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold">Conta Ativada!</h2>
          <p className="text-muted-foreground">Você será redirecionado em um momento...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Ativar Conta</CardTitle>
        <CardDescription>Confirme seu email para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="token" className="block text-sm font-medium mb-2">
              Código de Ativação
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Verifique seu email para o código de ativação que enviamos
            </p>
            <Input
              id="token"
              value={activationToken}
              onChange={(e) => setActivationToken(e.target.value)}
              placeholder="Digite o código aqui"
              disabled={loading}
              className="bg-secondary border-border"
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={loading}>
            {loading ? "Ativando..." : "Ativar Conta"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Não recebeu o código?{" "}
            <button type="button" className="text-accent hover:underline" disabled={loading}>
              Reenviar email
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

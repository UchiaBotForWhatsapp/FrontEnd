"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authApi } from "@/lib/api-client"

export function ActivationForm() {
  const router = useRouter()
  const params = useParams()
  const emailEncoded = params.email as string | undefined
  const email: string | undefined = emailEncoded ? decodeURIComponent(emailEncoded) : undefined

  const [activationToken, setActivationToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email não fornecido. Verifique o link de ativação.")
      return
    }

    const code = activationToken.trim()
    if (!/^\d{4}$/.test(code)) {
      setError("Insira o código de 4 dígitos")
      return
    }

    setLoading(true)
    try {
      console.log("Activating account for email:", email, "with code:", activationToken)
      await authApi.activateAccount(email.trim(), activationToken.trim())
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

  const handleResend = async () => {
    setResendMessage("")
    if (!email) {
      setResendMessage("Email não fornecido. Verifique o link de ativação.")
      return
    }

    try {
      setResendLoading(true)
      await authApi.resendActivation(email)
      setResendMessage("Email reenviado com sucesso.")
    } catch (err: any) {
      setResendMessage(err?.message || "Erro ao reenviar email")
    } finally {
      setResendLoading(false)
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
        <CardDescription>{email}</CardDescription>
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
              Verifique o email {email} para o código de ativação enviado
            </p>
            <Input
              id="token"
              inputMode="numeric"
              maxLength={4}
              value={activationToken}
              onChange={(e) => setActivationToken(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="0000"
              disabled={loading}
              className="bg-secondary border-border"
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={loading}>
            {loading ? "Ativando..." : "Ativar Conta"}
          </Button>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <div>
              Não recebeu o código?{" "}
              <button
                type="button"
                className="text-accent hover:underline"
                disabled={loading || resendLoading}
                onClick={handleResend}
              >
                {resendLoading ? "Reenviando..." : "Reenviar email"}
              </button>
            </div>
            {resendMessage && (
              <div className="text-xs text-muted-foreground">{resendMessage}</div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

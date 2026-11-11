"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authApi } from "@/lib/api-client"
import { LoadingButton } from "./loading-button";
import { toast } from "sonner";

export function ActivationForm() {
  const router = useRouter()
  const params = useParams()
  const emailEncoded = params.email as string | undefined
  const email: string | undefined = emailEncoded ? decodeURIComponent(emailEncoded) : undefined

  const [activationToken, setActivationToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Email não fornecido. Verifique o link de ativação.")
      return
    }

    const code = activationToken.trim().toUpperCase()
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      toast.error("Insira o código de 6 caracteres (letras e números)")
      return
    }

    setLoading(true)
    try {
      await authApi.activateAccount(email.trim(), code)
      toast.success("Conta ativada com sucesso. Bem-vindo!")
      router.push("/plans")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao ativar conta")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error("Email não fornecido. Verifique o link de ativação.")
      return
    }

    try {
      setResendLoading(true)
      await authApi.resendActivation(email)
      toast.success("Email de ativação reenviado com sucesso.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao reenviar email")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Ativar Conta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium mb-2">
              Código de Ativação
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Digite o código de 6 caracteres enviado no seguinte email: {email}
            </p>
            <Input
              id="token"
              inputMode="text"
              maxLength={6}
              value={activationToken}
              onChange={(e) =>
                setActivationToken(
                  e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
                )
              }
              placeholder="ABC123"
              disabled={loading}
              className="bg-secondary border-border"
            />
          </div>

          <LoadingButton
            loading={loading} type="submit" className="w-full bg-accent hover:bg-accent/90 cursor-pointer" >
            Ativar Conta
          </LoadingButton>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <div>
              Não recebeu o código?{" "}
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0 text-accent"
                disabled={loading || resendLoading}
                onClick={handleResend}
              >
                {resendLoading && <span aria-label="Reenviando" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                Reenviar email
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authApi } from "@/lib/api-client"

const PLANS = {
  shunin: { name: "Shunin", price: 5000 },
  jounin: { name: "Jounin", price: 10000 }
}

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const requestedPlan = searchParams.get("plan")
  const planName = requestedPlan === "jounin" || requestedPlan === "jonin"
    ? "jounin"
    : "shunin"
  const plan = PLANS[planName]

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmitProof = async () => {
    setLoading(true)
    setError("")

    try {
      await authApi.updatePlan(`pending(${planName})`)
      router.push("/payment-confirmation")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao confirmar pagamento")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-accent">Pagamento do Plano</h1>
          <p className="text-xl text-muted-foreground">
            Você selecionou o plano <span className="font-semibold text-accent">{plan.name}</span>
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Métodos de Pagamento Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-4 text-lg font-semibold">Pagamento por referência</h3>
                <div className="space-y-2 text-sm">
                  <p>Entidade: <span className="font-semibold">90201</span></p>
                  <p>Referência: <span className="font-semibold">221610687</span></p>
                  <p>Montante: <span className="font-semibold">{plan.price.toLocaleString()} KZ</span></p>
                </div>
              </div>

              <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm">
                Após o pagamento, receberá o número de mensagens pagas no sistema em alguns minutos.
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSubmitProof}
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90"
              >
                {loading ? "Enviando..." : "Confirmar Pagamento"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-background to-card py-12 px-4" />
      }
    >
      <PaymentContent />
    </Suspense>
  )
}

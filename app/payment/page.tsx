"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authApi } from "@/lib/api-client"

const PLANS = {
  shunin: { name: "Shunin", price: 5000 },
  jounin: { name: "Jounin", price: 10000 }
}

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planName = searchParams.get("plan") || "shunin"
  const plan = PLANS[planName as keyof typeof PLANS] || PLANS.shunin

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmitProof = async () => {
    setLoading(true)
    setError("")

    try {
      // Here we would send the proof to the backend
      // For now, we'll simulate the API call
      await authApi.updatePlan(`pending(${planName})`) // 
      // Redirect to confirmation page
      router.push("/payment-confirmation")
    } catch (err: any) {
      setError(err.message || "Erro ao enviar comprovativo")
      setLoading(false)
    }
  }

  const whatsappNumber = "244929004469"
  const whatsappMessage = `Olá, envio o comprovativo do pagamento do plano ${plan.name}. Valor: ${plan.price} KZ.`

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
            <CardTitle className="text-2xl">Detalhes do Pagamento</CardTitle>
            <CardDescription>
              Valor a pagar: <span className="font-semibold">{plan.price.toLocaleString()} KZ</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Métodos de Pagamento Disponíveis</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Transferência IBAN Angolano</h4>
                    <p className="text-sm mb-2">Solicite os dados bancários via WhatsApp para realizar a transferência.</p>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá, gostaria de solicitar os dados bancários para transferência IBAN do plano " + plan.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button variant="outline" size="sm">
                        Solicitar Dados via WhatsApp
                      </Button>
                    </a>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Multicaixa Express</h4>
                    <p className="text-sm">Número: 929004469</p>
                    <p className="text-sm">Titular: UBot Ltd</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Após o pagamento, envie o comprovativo (foto ou documento) para o WhatsApp:
                </p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" className="mb-4">
                    Enviar via WhatsApp
                  </Button>
                </a>
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

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function PaymentConfirmationPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-4xl font-bold text-accent">Pagamento por referência</h1>
          <p className="text-xl text-muted-foreground">
            Depois de efetuar o pagamento, aguarde alguns minutos.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">O que acontece após o pagamento?</CardTitle>
            <CardDescription>
              Não é necessário enviar comprovativo pelo WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Crédito das mensagens</p>
                  <p className="text-sm text-muted-foreground">
                    Após o pagamento por referência, o número de mensagens incluído no seu plano será creditado no sistema em alguns minutos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Pode continuar a utilizar a plataforma enquanto aguarda o crédito das mensagens.
          </p>
          <Button
            onClick={() => router.push("/welcome")}
            className="bg-accent hover:bg-accent/90"
          >
            Ir para o Dashboard
          </Button>
        </div>
      </div>
    </main>
  )
}
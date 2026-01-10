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
          <h1 className="text-4xl font-bold text-accent">Comprovativo Enviado!</h1>
          <p className="text-xl text-muted-foreground">
            Obrigado pelo pagamento
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">O que acontece agora?</CardTitle>
            <CardDescription>
              Seu comprovativo foi enviado com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Verificação do Pagamento</p>
                  <p className="text-sm text-muted-foreground">
                    Nossa equipe irá verificar o comprovativo enviado.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Ativação do Plano</p>
                  <p className="text-sm text-muted-foreground">
                    O administrador irá ativar seu plano em até 3 dias úteis.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Notificação</p>
                  <p className="text-sm text-muted-foreground">
                    Você receberá uma mensagem confirmando a ativação.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Enquanto isso, você pode explorar as funcionalidades básicas da plataforma.
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
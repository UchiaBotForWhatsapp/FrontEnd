"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { planApi } from "@/lib/api-client"
import { Check } from "lucide-react"

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
}

const PLANS: Plan[] = [
  {
    id: "genin",
    name: "Genin",
    price: 0,
    description: "Plano gratuito para começar a criar bots",
    features: ["1 bot", "100 mensagens em 7 dias", "Suporte por email", "Dashboard básico"],
  },
  {
    id: "shunin",
    name: "Shunin",
    price: 5,
    description: "Para quem precisa de mais bots e mensagens",
    features: ["3 bots", "1.000 mensagens", "Suporte por email", "Dashboard completo"],
  },
  {
    id: "jounin",
    name: "Jounin",
    price: 10,
    description: "Para usuários avançados",
    features: ["5 bots", "5.000 mensagens", "Suporte prioritário", "Dashboard completo", "Automação básica"],
  },
];


export function PlanSelector() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("free")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSelectPlan = async () => {
    setLoading(true)
    setError("")

    try {
      await planApi.select(selectedPlan)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Erro ao selecionar plano")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Escolha Seu Plano</h1>
        <p className="text-muted-foreground">Comece grátis e aumente conforme necessário</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col cursor-pointer transition border-2 ${
              selectedPlan === plan.id ? "border-accent bg-card/50" : "border-border hover:border-accent/50"
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {plan.id === "pro" && <Badge className="bg-accent">Popular</Badge>}
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold">
                  kz {plan.price > 0 ? plan.price.toFixed(2) : "0"}
                  {plan.price > 0 && <span className="text-base text-muted-foreground font-normal">/mês</span>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className={selectedPlan === plan.id ? "bg-accent hover:bg-accent/90" : ""}
                disabled={loading}
              >
                {selectedPlan === plan.id ? "Selecionado" : "Selecionar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={handleSelectPlan} disabled={loading} className="bg-accent hover:bg-accent/90 min-w-48">
          {loading ? "Processando..." : "Continuar com Plano Selecionado"}
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Você pode mudar de plano a qualquer momento. Sem compromisso!
      </div>
    </div>
  )
}

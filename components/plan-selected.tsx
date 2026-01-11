"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { authApi } from "@/lib/api-client"

interface Plan {
  id: string
  name: string
}

interface User {
  id: string
  name: string
  email: string
  plan: string
  active?: boolean
}

const PLANS: Plan[] = [
  { id: "genin", name: "Genin" },
  { id: "shunin", name: "Shunin" },
  { id: "jounin", name: "Jounin" },
]

// Normaliza o plano vindo do backend para bater com plan.id
const normalizeUserPlan = (plan?: string): string => {
  if (!plan) return "genin"

  if (plan.startsWith("pending(")) {
    return plan.replace("pending(", "").replace(")", "")
  }

  return plan
}

export function PlanSelectorSelected() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>("genin")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getMe()
        const normalizedPlan = normalizeUserPlan(userData.plan)

        setUser(userData as User)
        setSelectedPlan(normalizedPlan)
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      }
    }

    fetchUser()
  }, [])

  const handleSelectPlan = async () => {
    setLoading(true)
    setError("")

    try {
      if (selectedPlan === "genin") {
        await authApi.updatePlan(selectedPlan)
        router.push("/welcome")
      } else {
        router.push(`/payment?plan=${selectedPlan}`)
      }
    } catch (err: any) {
      setError(err.message || "Erro ao selecionar plano")
    } finally {
      setLoading(false)
    }
  }

  const isPending =
    user?.plan === "pending(shunin)" || user?.plan === "pending(jounin)"

  const displayPlan = isPending
    ? "Pendente"
    : normalizeUserPlan(user?.plan).toUpperCase()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Escolha Seu Plano</h1>
        <p className="text-muted-foreground">
          Comece grátis e escale conforme sua necessidade
        </p>
      </div>

      {/* Plano atual */}
      <p
        className={`text-center text-sm font-medium ${
          isPending ? "text-yellow-500" : "text-foreground"
        }`}
      >
        Plano atual:{" "}
        <span className="font-semibold">
          {displayPlan}
        </span>
      </p>

      {/* Erro */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive text-center">
          {error}
        </div>
      )}

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id

          return (
            <Card
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`flex flex-col cursor-pointer transition border-2 ${
                isSelected
                  ? "border-accent bg-accent/10 shadow-md"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.id === "shunin" && (
                    <Badge className="bg-accent">Popular</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-4">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={isSelected ? "bg-accent hover:bg-accent/90" : ""}
                  disabled={loading}
                >
                  {isSelected ? "Selecionado" : "Selecionar"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <Button
          onClick={handleSelectPlan}
          disabled={loading}
          className="bg-accent hover:bg-accent/90 min-w-48"
        >
          {loading ? "Processando..." : "Continuar com Plano Selecionado"}
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Você pode mudar de plano a qualquer momento. Sem compromisso.
      </div>
    </div>
  )
}

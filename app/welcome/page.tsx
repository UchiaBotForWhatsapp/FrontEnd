"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Check } from "lucide-react"
import { useState, useEffect } from "react"
import { authApi } from "@/lib/api-client"
import PLANS from "@/mock/plans.mock"

interface User {
  id: string
  name: string
  email: string
  plan: string
}

// Normaliza o plano vindo do backend
const normalizeUserPlan = (plan?: string): keyof typeof PLANS => {
  if (!plan) return "genin"

  if (plan.startsWith("pending(")) {
    return plan.replace("pending(", "").replace(")", "") as keyof typeof PLANS
  }

  return plan as keyof typeof PLANS
}

export default function WelcomePage() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getMe()
        setUser(userData as User)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Erro ao carregar dados do usuário.</p>
      </main>
    )
  }

  const planKey = normalizeUserPlan(user.plan)
  const plan = PLANS[planKey]

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-accent">
            Bem-vindo ao UBot
          </h1>
          <p className="text-xl text-muted-foreground">
            Você está no plano{" "}
            <span className="font-semibold text-accent">
              {plan.name}
            </span>
          </p>
        </div>

        {/* Card do Plano */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              Seu Plano {plan.name}
            </CardTitle>
            <CardDescription>
              {plan.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold mb-4">
              kz {plan.price.toLocaleString()}
              <span className="text-base text-muted-foreground font-normal">
                /mês
              </span>
            </div>

            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Seu ambiente já está pronto. Hora de executar.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-accent hover:bg-accent/90"
          >
            Ir para o Dashboard
          </Button>
        </div>
      </div>
    </main>
  )
}

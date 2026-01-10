"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { PlanSelector } from "@/components/plan-selector"
import { useState, useEffect } from "react"
import { authApi } from "@/lib/api-client"

interface User {
  id: string
  name: string
  email: string
  active?: boolean
  plan: {
    id: string
    name: string
    price: number
  }
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      await authApi.updateMe(user.name, user.email)
      const updatedUser = await authApi.getMe()
      setUser(updatedUser as User)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <Spinner className="size-8" />
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <p>Erro ao carregar dados do usuário.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Configurações</h1>

          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Gerencie suas informações de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <Input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving} className="bg-accent hover:bg-accent/90">
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plano</CardTitle>
              <CardDescription>Gerencie seu plano de assinatura</CardDescription>
            </CardHeader>
            <CardContent>
              <PlanSelector />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function SettingsPage() {
  const [email] = useState("usuario@email.com")
  const [name, setName] = useState("João Silva")

  const handleSave = () => {
    // API call ready here
    console.log("Saving settings:", { name })
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
                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input value={email} disabled className="bg-secondary border-border bg-opacity-50" />
              </div>
              <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plano</CardTitle>
              <CardDescription>Gerencie seu plano de assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border">
                <div>
                  <p className="font-medium">Plano Profissional</p>
                  <p className="text-sm text-muted-foreground">R$ 49,90 por mês</p>
                </div>
                <Button variant="outline">Gerenciar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

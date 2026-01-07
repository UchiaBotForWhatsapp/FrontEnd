"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export function RegisterForm() {
  const router = useRouter()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [formError, setFormError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError("Por favor, preencha todos os campos")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("As senhas não correspondem")
      return
    }

    if (formData.password.length < 8) {
      setFormError("A senha deve ter pelo menos 8 caracteres")
      return
    }

    try {
      await register(formData.email, formData.password, formData.name)
      router.push("/activate")
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Comece a gerenciar seus bots WhatsApp</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(formError || error) && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
              {formError || error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nome Completo
            </label>
            <Input
              id="name"
              name="name"
              placeholder="João Silva"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="bg-secondary border-border"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="bg-secondary border-border"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="bg-secondary border-border"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirmar Senha
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="bg-secondary border-border"
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={loading}>
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
          <div className="text-center text-sm">
            Já tem conta?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Faça login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export function RegisterForm() {
  const router = useRouter()
  const { register, loading, error } = useAuth()

  const [countries, setCountries] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [allCities, setAllCities] = useState<{ country: string; cities: string[] }[]>([])
  const [formError, setFormError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    password: "",
    confirmPassword: "",
  })

  /* =====================
     Input handler
  ===================== */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /* =====================
     Fetch countries + cities
  ===================== */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries")
        const data = await res.json()

        const countriesList = data.data
          .map((c: any) => c.country)
          .sort((a: string, b: string) => a.localeCompare(b))

        setCountries(countriesList)
        setAllCities(data.data) // guardar cidades por país
      } catch (err) {
        console.error("Erro ao carregar países e cidades", err)
      }
    }

    fetchCountries()
  }, [])

  /* =====================
     Filtrar cidades por país
  ===================== */
  useEffect(() => {
    if (!formData.country) {
      setCities([])
      return
    }

    const selectedCountry = allCities.find((c) => c.country === formData.country)
    setCities(selectedCountry?.cities || [])
  }, [formData.country, allCities])

  /* =====================
     Submit
  ===================== */
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setFormError("")

  const { name, email, phone, country, city, password, confirmPassword } = formData

  // Validação básica
  if (!name || !email || !phone || !country || !city || !password || !confirmPassword) {
    setFormError("Por favor, preencha todos os campos")
    return
  }

  if (password !== confirmPassword) {
    setFormError("As senhas não correspondem")
    return
  }

  if (password.length < 8) {
    setFormError("A senha deve ter pelo menos 8 caracteres")
    return
  }

  try {
    // 🔑 Passando todos os campos para a função register
    await register(name, email, phone, country, city, password)

    // Redireciona para ativação
    router.push(`/activate/${email}`)
  } catch (err: any) {
    setFormError(err.message)
  }
}

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>
          Comece a gerenciar seus bots WhatsApp
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(formError || error) && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {formError || error}
            </div>
          )}

          <Input
            name="name"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
          />

          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
          />

          <Input
            name="phone"
            placeholder="Telefone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={loading}
          />

          {/* País */}
          <Select
            value={formData.country}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, country: value, city: "" }))
            }
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o país" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Cidade */}
          <Select
            value={formData.city}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
            disabled={!formData.country || loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a cidade" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            name="password"
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
          />

          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar senha"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={loading}
          />

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90"
            disabled={loading}
          >
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

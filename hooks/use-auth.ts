"use client"

import { useCallback, useState } from "react"
import { authApi } from "@/lib/api-client"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authApi.login(email, password)
      setUser(response.user)
      localStorage.setItem("auth_token", response.token)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

const register = useCallback(
  async (
    name: string,
    email: string,
    phone: string,
    country: string,
    city: string,
    password: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      // 🔑 Passando todos os campos para o client
      const response = await authApi.register(name, email, phone, country, city, password)

      setUser(response.user)
      localStorage.setItem("auth_token", response.token)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  },
  []
)


  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("auth_token")
  }, [])

  return { user, loading, error, login, register, logout }
}

"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { LoadingButton } from "./loading-button";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { GoogleAuthButton } from "./google-auth-button";

export function LoginForm() {
  const router = useRouter();
  const { login, googleLogin, loading, error } = useAuth();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.identifier.trim() || !formData.password) {
      setFormError("Por favor, preencha todos os campos");
      return;
    }

    try {
      await login(formData.identifier, formData.password);
      router.push("/dashboard");
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    const response = await googleLogin(idToken, "login");
    router.push(response.isNewUser ? "/plans" : "/dashboard");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Acesse sua conta Kwanza Bot</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(formError || error) && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
              {formError || error}
            </div>
          )}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium mb-2">
              Nome ou email
            </label>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              placeholder="Seu nome ou email"
              value={formData.identifier}
              onChange={handleChange}
              disabled={loading}
              required
              className="bg-secondary border-border"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Senha
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                className="bg-secondary border-border pr-10"
              />
              <button
                type="button"
                onClick={togglePassword}
                aria-label={showPassword ? "ocultar senha" : "Mostrar senha "}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500  cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5 " />}
              </button>
            </div>
          </div>
          <LoadingButton type="submit" loading={loading} className="w-full bg-accent hover:bg-accent/90 cursor-pointer">
            <LogIn />
            {loading ? "Entrando..." : "Entrar"}
          </LoadingButton>
          <GoogleAuthButton onCredential={handleGoogleLogin} mode="login" />
          <div className="text-center text-sm">
            <Link href="/forgot-password" className="text-accent hover:underline">
              Esqueci a senha
            </Link>
          </div>
          <div className="text-center text-sm">
            Não tem conta?{" "}
            <Link href="/register" className="text-accent hover:underline">
              Registre-se
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

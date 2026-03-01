"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { LoadingButton } from "./loading-button";
import { GoogleAuthButton } from "./google-auth-button";
import { Eye, EyeOff, LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { login, googleLogin, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPasword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function togglePassword() {
    setShowPasword((prev) => !prev);
  }

  const handleGoogleLogin = async (credential: string) => {
    setFormError("");
    try {
      const response = await googleLogin(credential);
      router.push(response?.isNewUser ? "/plans" : "/dashboard");
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.email || !formData.password) {
      setFormError("Por favor, preencha todos os campos");
      return;
    }

    try {
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Acesse sua conta Uchiha Bot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <GoogleAuthButton onCredential={handleGoogleLogin} text="signin_with" theme="outline" />
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(formError || error) && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
              {formError || error}
            </div>
          )}
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
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder=""
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
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

"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/lib/api-client";
import { LoadingButton } from "./loading-button";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== repeatPassword) {
      setError("As senhas não correspondem.");
      return;
    }

    const resetToken = sessionStorage.getItem("passwordResetToken");
    if (!resetToken) {
      setError("Sua sessão expirou. Solicite um novo código de redefinição.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(resetToken, password);
      sessionStorage.removeItem("passwordResetToken");
      setSuccess(true);
      window.setTimeout(() => router.push("/login"), 1800);
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Não foi possível alterar sua senha.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Nova senha</CardTitle>
        <CardDescription>
          Escolha uma nova senha para sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
              {error.includes("Solicite um novo código") && (
                <>
                  {" "}
                  <Link
                    href="/forgot-password"
                    className="underline underline-offset-4"
                  >
                    Solicitar código
                  </Link>
                </>
              )}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-border bg-secondary p-3 text-sm">
              Senha alterada com sucesso. Redirecionando para o login...
            </div>
          )}

          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-medium"
            >
              Senha
            </label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading || success}
              required
            />
          </div>
          <div>
            <label
              htmlFor="repeat-password"
              className="mb-2 block text-sm font-medium"
            >
              Repetir senha
            </label>
            <Input
              id="repeat-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
              disabled={loading || success}
              required
            />
          </div>
          <LoadingButton
            type="submit"
            loading={loading}
            disabled={success}
            className="w-full bg-accent hover:bg-accent/90"
          >
            {loading ? "Alterando..." : "Alterar senha"}
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import type React from "react";
import { useState } from "react";
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
import { toast } from "sonner";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== repeatPassword) {
      toast.error("As senhas não correspondem.");
      return;
    }

    const resetToken = sessionStorage.getItem("passwordResetToken");
    if (!resetToken) {
      toast.error("Sua sessão expirou. Solicite um novo código de redefinição.");
      router.push("/forgot-password");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(resetToken, password);
      sessionStorage.removeItem("passwordResetToken");
      setSuccess(true);
      toast.success("Senha alterada com sucesso. Faça login com sua nova senha.");
      window.setTimeout(() => router.push("/login"), 1800);
    } catch (resetError) {
      toast.error(
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
            Alterar senha
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const requestCode = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await authApi.requestPasswordReset(email.trim().toLowerCase());
      setCodeRequested(true);
      setMessage(
        "Se o email estiver associado a uma conta ativa, enviaremos um código.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível solicitar o código.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    await requestCode();
  };

  const handleVerifySubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const result = await authApi.verifyPasswordResetCode(
        email.trim().toLowerCase(),
        code,
      );
      sessionStorage.setItem("passwordResetToken", result.resetToken);
      router.push("/reset-password");
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "Não foi possível validar o código.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    await requestCode();
    setResending(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Esqueci a senha</CardTitle>
        <CardDescription>
          {codeRequested
            ? `Informe o código enviado para ${email}.`
            : "Informe o email associado à sua conta para receber um código."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={codeRequested ? handleVerifySubmit : handleRequestSubmit}
          className="space-y-4"
        >
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg border border-border bg-secondary p-3 text-sm">
              {message}
            </div>
          )}

          {!codeRequested ? (
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
                required
              />
              <LoadingButton
                type="submit"
                loading={loading}
                className="mt-4 w-full bg-accent hover:bg-accent/90"
              >
                {loading ? "Enviando..." : "Enviar código"}
              </LoadingButton>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="code" className="mb-2 block text-sm font-medium">
                  Código de verificação
                </label>
                <Input
                  id="code"
                  inputMode="text"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(event) =>
                    setCode(
                      event.target.value
                        .replace(/[^a-fA-F0-9]/g, "")
                        .toUpperCase(),
                    )
                  }
                  placeholder="ABC123"
                  disabled={loading || resending}
                  required
                />
              </div>
              <LoadingButton
                type="submit"
                loading={loading}
                disabled={code.length !== 6}
                className="w-full bg-accent hover:bg-accent/90"
              >
                {loading ? "Verificando..." : "Verificar código"}
              </LoadingButton>
              <div className="text-center text-sm">
                Não recebeu o código?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-accent"
                  onClick={handleResend}
                  disabled={loading || resending}
                >
                  {resending ? "Reenviando..." : "Enviar novamente"}
                </Button>
              </div>
            </>
          )}

          <div className="text-center text-sm">
            <Link href="/login" className="text-accent hover:underline">
              Voltar ao login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

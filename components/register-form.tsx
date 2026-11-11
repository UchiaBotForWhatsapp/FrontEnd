"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { LoadingButton } from "./loading-button";
import { TermsModal } from "./terms-modal";

type Gender = "male" | "female" | "other";

export function RegisterForm() {
  const router = useRouter();
  const { register, loading, error } = useAuth();
  const [formError, setFormError] = useState("");
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "" as Gender | "",
    password: "",
    termsAccepted: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.gender || !formData.password) {
      setFormError("Por favor, preencha todos os campos");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (!formData.termsAccepted) {
      setFormError("Você deve aceitar os Termos e Condições para continuar");
      return;
    }

    const email = formData.email.trim().toLowerCase();

    try {
      await register({
        name: formData.name,
        email,
        gender: formData.gender,
        password: formData.password,
        termsAccepted: formData.termsAccepted,
      });
      router.push(`/activate/${encodeURIComponent(email)}`);
    } catch (submitError) {
      setFormError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível criar sua conta",
      );
    }
  };

  return (
    <>
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

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Nome
              </label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="mb-2 block text-sm font-medium">
                Gênero
              </label>
              <Select
                value={formData.gender}
                onValueChange={(gender) => {
                  if (gender === "male" || gender === "female" || gender === "other") {
                    setFormData((previous) => ({ ...previous, gender }));
                  }
                }}
                disabled={loading}
              >
                <SelectTrigger id="gender" className="w-full" aria-label="Gênero">
                  <SelectValue placeholder="Selecione seu gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Pelo menos 8 caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  minLength={8}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  setFormData((previous) => ({
                    ...previous,
                    termsAccepted: checked === true,
                  }))
                }
                disabled={loading}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Eu aceito os{" "}
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(true)}
                  className="font-medium text-accent hover:underline"
                >
                  Termos e Condições
                </button>
              </label>
            </div>

            <LoadingButton
              loading={loading}
              type="submit"
              className="w-full cursor-pointer bg-accent hover:bg-accent/90"
            >
              <LogIn />
              {loading ? "Criando conta..." : "Criar Conta"}
            </LoadingButton>

            <div className="text-center text-sm">
              Já tem conta?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Faça login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <TermsModal
        open={termsModalOpen}
        onOpenChange={setTermsModalOpen}
        onAccept={() =>
          setFormData((previous) => ({ ...previous, termsAccepted: true }))
        }
      />
    </>
  );
}

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
import { GoogleAuthButton } from "./google-auth-button";
import { toast } from "sonner";

type Gender = "male" | "female" | "other";

export function RegisterForm() {
  const router = useRouter();
  const { register, googleLogin, loading } = useAuth();
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
    if (!formData.name.trim() || !formData.email.trim() || !formData.gender || !formData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (!formData.termsAccepted) {
      toast.error("Aceita os termos");
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
      toast.success("Conta criada! Verifique seu email para ativar a conta.");
      router.push(`/activate/${encodeURIComponent(email)}`);
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível criar sua conta",
      );
    }
  };

  const handleGoogleRegistration = async (idToken: string) => {
    const response = await googleLogin(idToken, "register", formData.termsAccepted);
    toast.success("Conta criada com sucesso. Bem-vindo!");
    router.push(response.isNewUser ? "/plans" : "/dashboard");
  };

  return (
    <>
      <Card className="w-full max-w-md md:gap-3 md:py-4">
        <CardHeader className="md:px-5 md:gap-1">
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>
            Comece a gerenciar seus bots WhatsApp
          </CardDescription>
        </CardHeader>

        <CardContent className="md:px-5">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium md:mb-1">
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
              <label htmlFor="email" className="mb-2 block text-sm font-medium md:mb-1">
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
              <label htmlFor="gender" className="mb-2 block text-sm font-medium md:mb-1">
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
              <label htmlFor="password" className="mb-2 block text-sm font-medium md:mb-1">
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
              Criar Conta
            </LoadingButton>
            <div className="md:col-span-2">
              <GoogleAuthButton
                onCredential={handleGoogleRegistration}
                requiresTermsAcceptance={!formData.termsAccepted}
                mode="register"
              />
            </div>

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

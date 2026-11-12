"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBots } from "@/hooks/use-bots";
import type { BotData } from "@/lib/api-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoadingButton } from "./loading-button";

interface BotFormProps {
  botId?: string;
  initialData?: BotData;
}

const languages = [
  ["pt", "Português"],
  ["en", "English"],
  ["es", "Español"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["it", "Italiano"],
  ["ar", "العربية"],
  ["ru", "Русский"],
  ["hi", "हिन्दी"],
  ["zh", "中文"],
  ["ja", "日本語"],
  ["ko", "한국어"],
] as const;

function createFormState(data?: BotData) {
  return {
    name: data?.name ?? "",
    type: data?.type ?? "business",
    description: data?.description ?? "",
    phoneNumber: data?.phoneNumber ?? "",
    language: data?.language ?? "pt",
  };
}

export function BotForm({ botId, initialData }: BotFormProps) {
  const router = useRouter();
  const { createBot, updateBot } = useBots();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => createFormState(initialData));

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = event.target.value.replace(/[^0-9 ]/g, "");
    setFormData((previous) => ({ ...previous, phoneNumber }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phoneDigits = formData.phoneNumber.replace(/\s/g, "");
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      toast.error("Informe o número de WhatsApp com DDI. Ex: 244 929 004 469");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      description: formData.description.trim(),
      phoneNumber: phoneDigits,
      language: formData.language,
    };

    setLoading(true);
    try {
      if (botId) {
        await updateBot(botId, payload);
      } else {
        await createBot(payload);
      }

      toast.success(`Bot ${payload.name} ${botId ? "atualizado" : "criado"} com sucesso!`);
      router.push("/bots");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o bot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/bots" className="flex w-fit items-center gap-2 text-accent hover:underline">
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{botId ? "Editar Bot" : "Criar Novo Bot"}</CardTitle>
          <CardDescription>Configure os dados principais do seu bot WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="bot-name" className="mb-2 block">Nome do bot</Label>
              <Input
                id="bot-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                minLength={2}
                required
                disabled={loading}
                placeholder="Ex: Bot de Atendimento"
                className="bg-secondary border-border"
              />
            </div>

            <div>
              <Label htmlFor="bot-type" className="mb-2 block">Tipo de bot</Label>
              <select
                id="bot-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground disabled:opacity-50"
              >
                <option value="personal">Pessoal</option>
                <option value="business">Negócio</option>
              </select>
            </div>

            <div>
              <Label htmlFor="bot-description" className="mb-2 block">Descrição do bot</Label>
              <textarea
                id="bot-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows={4}
                placeholder="Descreva o propósito do seu bot"
                className="w-full resize-y rounded-lg border border-border bg-secondary px-3 py-2 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <Label htmlFor="bot-phone" className="mb-2 block">Número de WhatsApp</Label>
              <Input
                id="bot-phone"
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                required
                disabled={loading}
                placeholder="244 929 004 469"
                aria-describedby="bot-phone-help"
                className="bg-secondary border-border"
              />
              <p id="bot-phone-help" className="mt-1 text-sm text-muted-foreground">
                Informe apenas o número incluindo o DDI, sem o sinal +. Ex: 244 929 004 469
              </p>
            </div>

            <div>
              <Label htmlFor="bot-language" className="mb-2 block">Idioma principal do bot</Label>
              <select
                id="bot-language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground disabled:opacity-50"
              >
                {languages.map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <LoadingButton loading={loading} type="submit" className="bg-accent hover:bg-accent/90">
                {botId ? "Salvar alterações" : "Criar bot"}
              </LoadingButton>
              <Link href="/bots">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

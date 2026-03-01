"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useBots } from "@/hooks/use-bots";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoadingButton } from "./loading-button";

interface BotFormProps {
  botId?: string;
  initialData?: any;
}

export function BotForm({ botId, initialData }: BotFormProps) {
  const router = useRouter();
  const { createBot, updateBot } = useBots();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    channel: initialData?.channel || "whatsapp",
    greeting: initialData?.greeting || "Ola! Como posso ajudar?",
    phoneNumber: initialData?.phoneNumber || "",
    language: initialData?.language || "pt",
    type: initialData?.type || "business",
    avatar: initialData?.avatar || "",
    offHoursReply: initialData?.autoReplies?.offHours || "",
    fallbackReply: initialData?.autoReplies?.fallback || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toOptionalString = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Nome do bot e obrigatorio");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: toOptionalString(formData.description),
      channel: formData.channel,
      greeting: toOptionalString(formData.greeting),
      phoneNumber: toOptionalString(formData.phoneNumber),
      language: toOptionalString(formData.language),
      type: formData.type,
      avatar: toOptionalString(formData.avatar),
      autoReplies: {
        offHours: toOptionalString(formData.offHoursReply),
        fallback: toOptionalString(formData.fallbackReply),
      },
    };

    setLoading(true);
    try {
      if (botId) {
        await updateBot(botId, payload);
      } else {
        await createBot(payload);
      }
      toast.success(
        `Bot ${formData.name} ${botId ? "atualizado" : "criado"} com sucesso!`,
      );
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar bot");
      toast.error(err.message || "Erro ao salvar bot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-accent hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{botId ? "Editar Bot" : "Criar Novo Bot"}</CardTitle>
          <CardDescription>
            Configure os detalhes basicos do seu bot WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Nome do Bot
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Bot de Atendimento"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="type" className="mb-2 block">
                  Tipo
                </Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground disabled:opacity-50"
                >
                  <option value="personal">Pessoal</option>
                  <option value="business">Negocio</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="channel" className="mb-2 block">
                  Canal
                </Label>
                <select
                  id="channel"
                  name="channel"
                  value={formData.channel}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground disabled:opacity-50"
                >
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              <div>
                <Label htmlFor="language" className="mb-2 block">
                  Idioma
                </Label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground disabled:opacity-50"
                >
                  <option value="pt">Portugues</option>
                  <option value="en">English</option>
                  <option value="es">Espanol</option>
                  <option value="fr">Francais</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="ar">Arabic</option>
                  <option value="ru">Russian</option>
                  <option value="hi">Hindi</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phoneNumber" className="mb-2 block">
                  Numero do WhatsApp
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Ex: 244900000000"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="avatar" className="mb-2 block">
                  Avatar (URL)
                </Label>
                <Input
                  id="avatar"
                  name="avatar"
                  placeholder="https://..."
                  value={formData.avatar}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block">
                Descricao
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Descreva o proposito do seu bot"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={4}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="greeting" className="mb-2 block">
                Mensagem de Boas-vindas
              </Label>
              <textarea
                id="greeting"
                name="greeting"
                placeholder="Mensagem de saudacao do bot"
                value={formData.greeting}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 resize-none"
              />
            </div>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Respostas Automaticas</CardTitle>
                <CardDescription>
                  Mensagens para horarios fora do atendimento e fallback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="offHoursReply" className="mb-2 block">
                    Fora do horario
                  </Label>
                  <textarea
                    id="offHoursReply"
                    name="offHoursReply"
                    placeholder="Mensagem fora do horario"
                    value={formData.offHoursReply}
                    onChange={handleChange}
                    disabled={loading}
                    rows={3}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="fallbackReply" className="mb-2 block">
                    Fallback
                  </Label>
                  <textarea
                    id="fallbackReply"
                    name="fallbackReply"
                    placeholder="Mensagem quando o bot nao entender"
                    value={formData.fallbackReply}
                    onChange={handleChange}
                    disabled={loading}
                    rows={3}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <LoadingButton
                loading={loading}
                type="submit"
                className="bg-accent hover:bg-accent/90 cursor-pointer"
              >
                {loading ? "Salvando..." : "Salvar Bot"}
              </LoadingButton>
              <Link href="/dashboard">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                >
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
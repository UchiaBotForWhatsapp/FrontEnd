"use client";

import type React from "react";
import { WhatsappConnectModal } from "./whatsapp-connect-modal";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { useBots } from "@/hooks/use-bots";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BotFormProps {
  botId?: string;
  initialData?: any;
}

export function BotForm({ botId, initialData }: BotFormProps) {
  const router = useRouter();
  const { createBot, updateBot, toggleBot } = useBots();
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [botActive, setBotActive] = useState(initialData?.active || false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "personal",
    greeting: initialData?.greeting || "Olá! Como posso ajudar?",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Nome do bot é obrigatório");
      return;
    }

    setLoading(true);
    try {
      if (botId) {
        await updateBot(botId, formData);
      } else {
        await createBot(formData);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar bot");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBot = async () => {
    if (!botId) return;

    setLoading(true);
    try {
      const updated = await toggleBot(botId);

      setBotActive(updated.active);
      setQrCode(updated.qr || null);

      alert(`Bot ${updated.active ? "ativado" : "desativado"} com sucesso!`);
    } catch (err: any) {
      alert("Erro ao atualizar bot: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <WhatsappConnectModal
        open={showWhatsappModal}
        loading={loading}
        qrCode={qrCode}
        status={botActive ? "connected" : "waiting"}
        onClose={() => setShowWhatsappModal(false)}
        onConfirm={async () => {
          setShowWhatsappModal(false);
        }}
      />

      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-accent hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (!botActive) {
              handleToggleBot();
               setShowWhatsappModal(true);
            } else {
              setShowWhatsappModal(false);
            }
          }}
          className="bg-accent/80 hover:bg-accent/90 text-white font-semibold px-6 py-2 rounded-md"
        >
          {botActive ? "Desativar bot" : "Ativar bot"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{botId ? "Editar Bot" : "Criar Novo Bot"}</CardTitle>
          <CardDescription>
            Configure os detalhes básicos do seu bot WhatsApp
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
                  <option value="business">Negócio</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block">
                Descrição
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Descreva o propósito do seu bot"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={4}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="greeting_message" className="mb-2 block">
                Mensagem de Boas-vindas
              </Label>
              <textarea
                id="greeting_message"
                name="greeting_message"
                placeholder="Mensagem de saudação do bot"
                value={formData.greeting}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 resize-none"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Bot"}
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="outline">
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

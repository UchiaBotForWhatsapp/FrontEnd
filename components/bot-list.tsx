"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useBots } from "@/hooks/use-bots";
import { Trash2, Edit2, Plus, Power } from "lucide-react";
import { Modal } from "./modal";
import { toast } from "sonner";
import { LoadingButton } from "./loading-button";
import { WhatsappConnectModal } from "./whatsapp-connect-modal";

export function BotList() {
  const { bots, isLoading, deleteBot, toggleBot } = useBots();
  const [botToDelete, setBotToDelete] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrStatus, setQrStatus] = useState<"waiting" | "connected" | "error">(
    "waiting",
  );

  const OpenDeleteBot = (bot: any) => {
    setBotToDelete(bot);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!botToDelete) return;

    setDeleting(true);
    try {
      await deleteBot(botToDelete._id);
      toast.success(`Bot ${botToDelete.name} excluído com sucesso!`);
      setIsDialogOpen(false);
      setBotToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar bot", error);
      toast.error("Ocorreu um erro ao excluir o bot.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleBot = async (bot: any) => {
    setTogglingId(bot._id);
    try {
      const updated: any = await toggleBot(bot._id);

      if (updated?.active) {
        setQrCode(updated?.qr || updated?.qrcode || null);
        setQrStatus("waiting");
        setQrModalOpen(true);
        toast.success(`Bot ${updated.name} ativado com sucesso!`);
      } else {
        toast.success(`Bot ${updated.name} desativado com sucesso!`);
      }
    } catch (error) {
      console.error("Erro ao atualizar bot", error);
      toast.error("Erro ao atualizar bot");
    } finally {
      setTogglingId(null);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "B";
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const second = parts.length > 1 ? parts[1]?.[0] || "" : "";
    return (first + second).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <WhatsappConnectModal
        open={qrModalOpen}
        loading={togglingId !== null}
        qrCode={qrCode}
        status={qrStatus}
        onClose={() => setQrModalOpen(false)}
        onConfirm={() => setQrModalOpen(false)}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Bots</h1>
        <Link href="/dashboard/bot/new">
          <Button className="bg-accent hover:bg-accent/90 gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Novo Bot
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Spinner className="size-8 mx-auto" />
        </div>
      ) : !bots || bots.length === 0 ? (
        <Card>
          <CardContent className="pt-12 ">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Você ainda não tem nenhum bot criado
              </p>
              <Link href="/dashboard/bot/new">
                <Button className="bg-accent hover:bg-accent/90">
                  Criar Primeiro Bot
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bots.map((bot: any) => (
            <Card
              key={bot._id}
              className="bg-card border-border hover:border-accent/50 transition"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
                      {bot.avatar ? (
                        <img
                          src={bot.avatar}
                          alt={`Avatar do bot ${bot.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-muted-foreground">
                          {getInitials(bot.name)}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{bot.name}</CardTitle>
                        <Badge
                          variant={bot.active ? "default" : "secondary"}
                          className="bg-accent"
                        >
                          {bot.active ? "Ativo" : "Inativo"}
                        </Badge>
                        {bot.plan && <Badge variant="outline">{bot.plan}</Badge>}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {bot.description || "Sem descrição"}
                      </CardDescription>
                    </div>
                  </div>

                  <LoadingButton
                    loading={togglingId === bot._id}
                    type="button"
                    onClick={() => handleToggleBot(bot)}
                    variant={bot.active ? "outline" : "default"}
                    className={
                      bot.active
                        ? "border-accent text-accent hover:bg-accent/10"
                        : "bg-accent hover:bg-accent/90"
                    }
                  >
                    <Power className="w-4 h-4" />
                    {bot.active ? "Desativar" : "Ativar"}
                  </LoadingButton>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between ">
                  <div className="text-sm text-muted-foreground cursor-pointer">
                    <span className="font-medium text-foreground">
                      {bot.messages_count || 0}
                    </span>{" "}
                    mensagens
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/bot/${bot._id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 " />
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => OpenDeleteBot(bot)}
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 cursor-pointer" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Tem certeza que deseja excluir este bot?"
        description="Essa ação é irreversível."
        confirmText="Tenho"
        onConfirm={async () => {
          await handleConfirmDelete();
        }}
      />
    </div>
  );
}
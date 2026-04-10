"use client";

import { useEffect, useState } from "react";
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
import { getWhatsAppSocket } from "@/lib/whatsapp-socket";
import { Modal } from "./modal";
import { toast } from "sonner";
import { LoadingButton } from "./loading-button";
import { BotQrModal } from "./bot-qr-modal";

export function BotList() {
  const { bots, isLoading, deleteBot, toggleBot, mutate } = useBots();
  const [botToDelete, setBotToDelete] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeBotId, setActiveBotId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<
    string,
    { active?: boolean; status?: string }
  >>({});

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
    if (!bot.active) {
      setActiveBotId(bot._id);
      setQrModalOpen(true);
      setTogglingId(bot._id);
      // Removido: await startBot(bot._id);
      return;
    }

    setTogglingId(bot._id);
    try {
      const updated: any = await toggleBot(bot._id);
      toast.success(`Bot ${updated.name} desativado com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar bot", error);
      toast.error("Erro ao atualizar bot");
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    const socket = getWhatsAppSocket();

    const handleStatusEvent = (payload: {
      botId?: string;
      active?: boolean;
      status?: string;
    }) => {
      if (!payload?.botId) return;

      setStatusMap((prev) => ({
        ...prev,
        [payload.botId]: {
          active: payload.active ?? prev[payload.botId]?.active,
          status: payload.status ?? prev[payload.botId]?.status,
        },
      }));

      mutate();
    };

    socket.on("bot:status", handleStatusEvent);

    return () => {
      socket.off("bot:status", handleStatusEvent);
    };
  }, [mutate]);

  const getInitials = (name?: string) => {
    if (!name) return "B";
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const second = parts.length > 1 ? parts[1]?.[0] || "" : "";
    return (first + second).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {activeBotId && (
        <BotQrModal
          botId={activeBotId}
          open={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setActiveBotId(null);
            setTogglingId(null);
          }}
          onSuccess={() => {
            setTogglingId(null);
            mutate();
          }}
        />
      )}

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
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {bots.map((bot: any) => {
            const isActive = statusMap[bot._id]?.active ?? bot.active;

            return (
              <Card
                key={bot._id}
                className="bg-card border-border hover:border-accent/50 transition"
              >
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
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

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <CardTitle className="text-xl">{bot.name}</CardTitle>
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className="bg-accent"
                        >
                          {isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        {bot.plan && (
                          <Badge variant="outline">{bot.plan}</Badge>
                        )}
                      </div>
                      <CardDescription
                        className="line-clamp-2"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {bot.description || "Sem descrição"}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex-shrink-0 self-start">
                    <LoadingButton
                      loading={togglingId === bot._id}
                      type="button"
                      onClick={() => handleToggleBot(bot)}
                      variant={isActive ? "outline" : "default"}
                      className={
                        isActive
                          ? "border-accent text-accent hover:bg-accent/10"
                          : "bg-accent hover:bg-accent/90"
                      }
                    >
                      <Power className="w-4 h-4" />
                      {isActive ? "Desativar" : "Ativar"}
                    </LoadingButton>
                  </div>
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
            );
          })}
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

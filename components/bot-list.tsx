"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useBots } from "@/hooks/use-bots";
import { Bot as BotIcon, Trash2, Edit2, Plus, Power } from "lucide-react";
import { Modal } from "./modal";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BotItem {
  _id: string;
  name: string;
  active?: boolean;
  description?: string;
  plan?: string;
  messages_count?: number;
  products?: unknown[];
}

export function BotList() {
  const router = useRouter();
  const { bots, isLoading, deleteBot, toggleBot } = useBots();
  const [botToDelete, setBotToDelete] = useState<BotItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [botLimitDialogOpen, setBotLimitDialogOpen] = useState(false);
  const [togglingBotId, setTogglingBotId] = useState<string | null>(null);

  const OpenDeleteBot = (bot: BotItem) => {
    setBotToDelete(bot);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!botToDelete) return;

    try {
      await deleteBot(botToDelete._id);
      toast.success(`Bot ${botToDelete.name} excluído com sucesso!`);
      setIsDialogOpen(false);
      setBotToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar bot", error);
      toast.error("Ocorreu um erro ao excluir o bot.");
    }
  };

  const handleToggleBot = async (bot: BotItem) => {
    setTogglingBotId(bot._id);
    try {
      const updatedBot = await toggleBot(bot._id);
      toast.success(updatedBot.active ? "Bot ativado" : "Bot desativado");
    } catch (error) {
      console.error("Erro ao alterar estado do bot", error);
      toast.error("Não foi possível alterar o estado do bot.");
    } finally {
      setTogglingBotId(null);
    }
  };

  const handleCreateBotClick = () => {
    if (bots.length > 0) {
      setBotLimitDialogOpen(true);
      return;
    }

    router.push("/bots/new");
  };

  return (
    <div className="space-y-6">
      <Dialog open={botLimitDialogOpen} onOpenChange={setBotLimitDialogOpen}>
        <DialogContent className="w-[95%] max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Por enquanto, apenas um bot por conta</DialogTitle>
            <DialogDescription>
              Cada conta pode ter apenas um bot neste momento. Estamos trabalhando
              para ampliar essa capacidade e permitir que você crie mais bots em
              breve. Obrigado pela compreensão!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Bots</h1>
        <Button
          onClick={handleCreateBotClick}
          className="bg-accent hover:bg-accent/90 gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Bot
        </Button>
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
              <Link href="/bots/new">
                <Button className="bg-accent hover:bg-accent/90">
                  Criar Primeiro Bot
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
          {bots.map((bot: BotItem) => {
            return (
              <Card
                key={bot._id}
                className="bg-card border-border hover:border-accent/50 transition"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <BotIcon
                        className="size-7 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <CardTitle className="min-w-0 break-words text-xl">
                        {bot.name}
                      </CardTitle>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleBot(bot)}
                      disabled={togglingBotId === bot._id}
                      aria-label={`${bot.active ? "Desconectar" : "Conectar"} bot ${bot.name}`}
                      className={
                        bot.active
                          ? "h-8 shrink-0 gap-2 rounded-full border-emerald-500/30 bg-emerald-500/10 px-3 text-emerald-500 hover:bg-emerald-500/15 hover:text-emerald-400"
                          : "h-8 shrink-0 gap-2 rounded-full px-3 text-muted-foreground hover:text-foreground"
                      }
                    >
                      {togglingBotId === bot._id ? (
                        <Spinner className="size-4" />
                      ) : (
                        <Power className="size-4" />
                      )}
                      {bot.active ? "Desconectar" : "Conectar"}
                    </Button>
                  </div>
                  <div className="min-w-0">
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
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2 text-sm text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-x-4">
                      <span className="whitespace-nowrap">
                        <span className="font-medium text-foreground">
                          {bot.messages_count || 0}
                        </span>{" "}
                        mensagens
                      </span>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        Estado:
                        <span
                          className={
                            bot.active
                              ? "font-medium text-emerald-500"
                              : "font-medium text-muted-foreground"
                          }
                        >
                          {bot.active ? "Ativo" : "Inativo"}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Link href={`/bots/${bot._id}`}>
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

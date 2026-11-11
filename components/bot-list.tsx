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
import { Bot as BotIcon, Trash2, Edit2, Plus } from "lucide-react";
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
  description?: string;
  plan?: string;
  messages_count?: number;
  products?: unknown[];
}

export function BotList() {
  const router = useRouter();
  const { bots, isLoading, deleteBot } = useBots();
  const [botToDelete, setBotToDelete] = useState<BotItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [botLimitDialogOpen, setBotLimitDialogOpen] = useState(false);

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

  const handleCreateBotClick = () => {
    if (bots.length > 0) {
      setBotLimitDialogOpen(true);
      return;
    }

    router.push("/dashboard/bot/new");
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
          {bots.map((bot: BotItem) => {
            return (
              <Card
                key={bot._id}
                className="bg-card border-border hover:border-accent/50 transition"
              >
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <BotIcon className="size-7 shrink-0 text-accent" aria-hidden="true" />
                        <CardTitle className="text-xl">{bot.name}</CardTitle>
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

                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      <span className="font-medium text-foreground">
                        {bot.messages_count || 0}
                      </span>{" "}
                      mensagens
                    </span>
                    <span>
                      <span className="font-medium text-foreground">
                        {Array.isArray(bot.products) ? bot.products.length : 0}
                      </span>{" "}
                      produtos
                    </span>
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

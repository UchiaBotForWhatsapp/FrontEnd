"use client";

import { use, useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { BotForm } from "@/components/bot-form";
import { Spinner } from "@/components/ui/spinner";
import { botApi, type BotData } from "@/lib/api-client";

interface EditBotPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBotPage({ params }: EditBotPageProps) {
  const { id } = use(params);
  const [botData, setBotData] = useState<BotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBot = async () => {
      try {
        const data = await botApi.get(id);
        setBotData(data.bot);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    void fetchBot();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center">
          <Spinner className="size-8" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl p-4 pt-16 md:p-8">
          {error ? (
            <p className="text-destructive" role="alert">
              Erro ao carregar bot: {error}
            </p>
          ) : (
            <BotForm botId={id} initialData={botData ?? undefined} />
          )}
        </div>
      </main>
    </div>
  );
}

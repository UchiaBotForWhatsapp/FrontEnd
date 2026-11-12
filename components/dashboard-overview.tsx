"use client";

import Link from "next/link";
import useSWR from "swr";
import {
  Activity,
  Bot,
  CreditCard,
  MessageSquare,
  Package,
  RefreshCw,
} from "lucide-react";
import { dashboardApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const numberFormatter = new Intl.NumberFormat("pt-PT");

export function DashboardOverview() {
  const { data, error, isLoading, mutate } = useSWR(
    "/dashboard/summary",
    dashboardApi.summary,
  );
  const summary = data?.summary;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <Card role="alert" className="border-destructive/40">
        <CardHeader>
          <CardTitle>Não foi possível carregar o dashboard</CardTitle>
          <CardDescription>
            {error instanceof Error
              ? error.message
              : "Tente novamente dentro de instantes."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" onClick={() => void mutate()}>
            <RefreshCw className="mr-2 size-4" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const plan = summary.user.plan.replace(/^pending\((.+)\)$/, "$1");
  const stats = [
    {
      label: "Bots",
      value: summary.botsCount,
      icon: Bot,
      detail: `${summary.activeBotsCount} ativo${summary.activeBotsCount === 1 ? "" : "s"}`,
    },
    {
      label: "Produtos",
      value: summary.productsCount,
      icon: Package,
      detail: "No catálogo da conta",
    },
    {
      label: "Mensagens enviadas",
      value: summary.messagesSent,
      icon: MessageSquare,
      detail: "Enviadas pelos teus bots",
    },
    {
      label: "Mensagens disponíveis",
      value: summary.messagesAvailable,
      icon: CreditCard,
      detail: "Saldo para utilização",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Visão geral da tua conta</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Olá, {summary.user.name}
          </h1>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
          <Activity className="size-4 text-accent" />
          Plano {plan}
        </span>
      </header>

      <section aria-label="Resumo da conta" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <Icon className="size-5 text-accent" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {numberFormatter.format(stat.value)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saldo de mensagens</CardTitle>
            <CardDescription>
              As contas Genin começam com 100 mensagens para testes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Mensagens disponíveis:{" "}
              <span className="font-semibold text-foreground">
                {numberFormatter.format(summary.messagesAvailable)}
              </span>
            </p>
            <Button asChild variant="outline">
              <Link href="/plans">Mudar plano</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acesso rápido</CardTitle>
            <CardDescription>Continua a gerir a tua conta.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/bots">Gerir bots</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/myproducts">Gerir produtos</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

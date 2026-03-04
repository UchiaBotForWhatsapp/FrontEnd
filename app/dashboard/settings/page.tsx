"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PlanSelectorSelected } from "@/components/plan-selected";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/api-client";
import { CheckCircle, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  active?: boolean;
  plan: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getMe();
        setUser(userData as User);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    setSuccess(false);

    try {
      await authApi.updateMe(user.name, user.email);
      const updatedUser = await authApi.getMe();
      setUser(updatedUser as User);
      setSuccess(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <p>Erro ao carregar dados do usuário.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Configurações</h1>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Gerencie suas informações de perfil</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome</label>
            <Input
              value={user.name}
              onChange={(e) => {
                setUser({ ...user, name: e.target.value });
                setSuccess(false);
              }}
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
                setSuccess(false);
              }}
              className="bg-secondary border-border"
            />
          </div>

          {/* Feedback de sucesso */}
          {success && (
            <div className="relative flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span className="flex-1">Alterações salvas com sucesso</span>

              <button
                onClick={() => setSuccess(false)}
                className="text-green-600 hover:text-green-800 transition"
                aria-label="Fechar mensagem"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-accent hover:bg-accent/90"
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardContent>
      </Card>

      {/* Plano */}
      <Card>
        <CardHeader>
          <CardTitle>Plano</CardTitle>
          <CardDescription>Gerencie seu plano de assinatura</CardDescription>
        </CardHeader>
        <CardContent>
          <PlanSelectorSelected />
        </CardContent>
      </Card>
    </div>
  );
}

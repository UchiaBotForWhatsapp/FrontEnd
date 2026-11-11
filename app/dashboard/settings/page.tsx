"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronDown } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { PlanSelectorSelected } from "@/components/plan-selected"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { authApi, clearAuthToken } from "@/lib/api-client"

type Gender = "male" | "female" | "other"
type SettingsCard = "profile" | "password" | "plan" | "delete"

interface User {
  id: string
  name: string
  email: string
  gender?: Gender
  provider?: "local" | "google"
  active?: boolean
  plan: string
}

interface ProfileForm {
  name: string
  email: string
  gender: Gender | ""
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  repeatPassword: string
}

const genderLabels: Record<Gender, string> = {
  male: "Masculino",
  female: "Feminino",
  other: "Outro",
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    gender: "",
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Record<SettingsCard, boolean>>({
    profile: false,
    password: false,
    plan: false,
    delete: false,
  })

  const toggleCard = (card: SettingsCard) => {
    setExpandedCards((current) => ({ ...current, [card]: !current[card] }))
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getMe() as User
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const beginEditing = () => {
    if (!user) return
    setForm({
      name: user.name,
      email: user.email,
      gender: user.gender ?? "",
    })
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setForm({ name: "", email: "", gender: "" })
  }

  const handleSaveProfile = async () => {
    if (!user) return
    if (!form.name.trim() || !form.email.trim() || !form.gender) {
      toast.error("Preencha nome, email e gênero.")
      return
    }

    setSaving(true)
    try {
      const updatedUser = await authApi.updateMe({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        gender: form.gender,
      }) as User
      setUser(updatedUser)
      setEditing(false)
      setForm({ name: "", email: "", gender: "" })
      toast.success("Dados atualizados com sucesso.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar os dados.")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      toast.error("As novas senhas não correspondem.")
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("A nova senha deve ter pelo menos 8 caracteres.")
      return
    }

    setChangingPassword(true)
    try {
      await authApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ currentPassword: "", newPassword: "", repeatPassword: "" })
      toast.success("Senha alterada com sucesso.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível alterar a senha.")
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDeleteAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (deleteConfirmation !== "Deletar a minha Conta") {
      toast.error("Digite exatamente: Deletar a minha Conta")
      return
    }

    setDeletingAccount(true)
    try {
      await authApi.deleteAccount(deleteConfirmation)
      clearAuthToken()
      toast.success("Conta excluída com sucesso.")
      router.replace("/login")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir a conta.")
      setDeletingAccount(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Spinner className="size-8" />
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p>Erro ao carregar dados do usuário.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 pt-16 md:p-8 max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Configurações</h1>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Perfil</CardTitle>
              <button
                type="button"
                aria-label={expandedCards.profile ? "Recolher Perfil" : "Expandir Perfil"}
                aria-expanded={expandedCards.profile}
                aria-controls="profile-card-content"
                onClick={() => toggleCard("profile")}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronDown className={`size-5 transition-transform ${expandedCards.profile ? "rotate-180" : ""}`} />
              </button>
            </CardHeader>
            {expandedCards.profile && (
            <CardContent id="profile-card-content" className="space-y-4">
              <CardDescription>Gerencie suas informações de perfil</CardDescription>
              {editing ? (
                <>
                  <div>
                    <label htmlFor="profile-name" className="mb-2 block text-sm font-medium">Nome</label>
                    <Input
                      id="profile-name"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      disabled={saving}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="mb-2 block text-sm font-medium">Email</label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      disabled={saving}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-gender" className="mb-2 block text-sm font-medium">Gênero</label>
                    <Select
                      value={form.gender}
                      onValueChange={(gender) => {
                        if (gender === "male" || gender === "female" || gender === "other") {
                          setForm({ ...form, gender })
                        }
                      }}
                      disabled={saving}
                    >
                      <SelectTrigger id="profile-gender" className="w-full bg-secondary">
                        <SelectValue placeholder="Selecione seu gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-accent hover:bg-accent/90"
                    >
                      {saving ? <Spinner className="size-4" /> : "Salvar Alterações"}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelEditing} disabled={saving}>
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <ProfileValue label="Nome" value={user.name} />
                  <ProfileValue label="Email" value={user.email} />
                  <ProfileValue
                    label="Gênero"
                    value={user.gender ? genderLabels[user.gender] : "Não informado"}
                  />
                  <Button onClick={beginEditing} className="bg-accent hover:bg-accent/90">
                    EDITAR DADOS
                  </Button>
                </>
              )}
            </CardContent>
            )}
          </Card>

          {user.provider === "local" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Redefinir senha</CardTitle>
                <button
                  type="button"
                  aria-label={expandedCards.password ? "Recolher Redefinir senha" : "Expandir Redefinir senha"}
                  aria-expanded={expandedCards.password}
                  aria-controls="password-card-content"
                  onClick={() => toggleCard("password")}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronDown className={`size-5 transition-transform ${expandedCards.password ? "rotate-180" : ""}`} />
                </button>
              </CardHeader>
              {expandedCards.password && (
              <CardContent id="password-card-content">
                <CardDescription className="mb-4">Altere a senha da sua conta</CardDescription>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="mb-2 block text-sm font-medium">
                      Senha atual
                    </label>
                    <Input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      value={passwordForm.currentPassword}
                      onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
                      disabled={changingPassword}
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="mb-2 block text-sm font-medium">
                      Senha nova
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
                      disabled={changingPassword}
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label htmlFor="repeat-new-password" className="mb-2 block text-sm font-medium">
                      Repetir senha nova
                    </label>
                    <Input
                      id="repeat-new-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      value={passwordForm.repeatPassword}
                      onChange={(event) => setPasswordForm({ ...passwordForm, repeatPassword: event.target.value })}
                      disabled={changingPassword}
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button type="submit" disabled={changingPassword} className="bg-accent hover:bg-accent/90">
                    {changingPassword ? <Spinner className="size-4" /> : "Alterar senha"}
                  </Button>
                </form>
              </CardContent>
              )}
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Plano</CardTitle>
              <button
                type="button"
                aria-label={expandedCards.plan ? "Recolher Plano" : "Expandir Plano"}
                aria-expanded={expandedCards.plan}
                aria-controls="plan-card-content"
                onClick={() => toggleCard("plan")}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronDown className={`size-5 transition-transform ${expandedCards.plan ? "rotate-180" : ""}`} />
              </button>
            </CardHeader>
            {expandedCards.plan && (
            <CardContent id="plan-card-content">
              <CardDescription className="mb-4">Gerencie seu plano de assinatura</CardDescription>
              <PlanSelectorSelected />
            </CardContent>
            )}
          </Card>

          <Card className="border-destructive/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-destructive">Excluir conta</CardTitle>
              <button
                type="button"
                aria-label={expandedCards.delete ? "Recolher Excluir conta" : "Expandir Excluir conta"}
                aria-expanded={expandedCards.delete}
                aria-controls="delete-card-content"
                onClick={() => toggleCard("delete")}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronDown className={`size-5 transition-transform ${expandedCards.delete ? "rotate-180" : ""}`} />
              </button>
            </CardHeader>
            {expandedCards.delete && (
            <CardContent id="delete-card-content">
              <CardDescription className="mb-4">
                Esta ação é permanente e exclui sua conta e os dados associados.
              </CardDescription>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                Deletar a minha Conta
              </Button>
            </CardContent>
            )}
          </Card>
        </div>
      </main>

      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="w-full max-w-md space-y-4 rounded-lg border bg-background p-6 shadow-lg"
          >
            <div className="space-y-2">
              <h2 id="delete-account-title" className="text-lg font-semibold text-destructive">
                Tem certeza que deseja excluir sua conta?
              </h2>
              <p className="text-sm text-muted-foreground">
                Esta ação é permanente e também excluirá seus bots, produtos, clientes e conversas.
                Para confirmar, digite <strong>Deletar a minha Conta</strong>.
              </p>
            </div>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <Input
                autoFocus
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                placeholder="Deletar a minha Conta"
                disabled={deletingAccount}
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false)
                    setDeleteConfirmation("")
                  }}
                  disabled={deletingAccount}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deletingAccount || deleteConfirmation !== "Deletar a minha Conta"}
                >
                  {deletingAccount ? <Spinner className="size-4" /> : "Confirmar exclusão"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

function ProfileValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  )
}

import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-card px-4">
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <span className="font-bold text-accent-foreground">S</span>
          </div>
          <h1 className="text-2xl font-bold">Sefia</h1>
        </div>
        <ResetPasswordForm />
      </div>
    </main>
  );
}

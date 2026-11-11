import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-card px-4 py-8">
      <div className="flex w-full max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between md:gap-16">
        <div className="flex flex-col items-center gap-3 md:flex-1 md:items-start">
          <div className="flex items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent md:h-24 md:w-24">
              <span className="text-3xl font-bold text-accent-foreground md:text-5xl">S</span>
            </div>
            <h1 className="text-5xl font-bold md:text-7xl">Sefia</h1>
          </div>
          <p className="text-center text-base text-muted-foreground md:text-left md:text-lg">
            Capacitando empresas com automação inteligente
          </p>
        </div>
        <div className="w-full md:flex-1 md:flex md:justify-end">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}

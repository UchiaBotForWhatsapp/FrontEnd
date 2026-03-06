import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-linear-to-brom-background to-card flex flex-col items-center justify-center p-6 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold">UB</span>
          </div>
          <h1 className="text-2xl font-bold">U Bot</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

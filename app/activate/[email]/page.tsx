import { ActivationForm } from "@/components/activation-form"

export default function ActivatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card flex items-center justify-center px-4">
      <div className="w-full flex flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold">KB</span>
          </div>
          <h1 className="text-2xl font-bold">Kwanza Bot</h1>
        </div>
        <ActivationForm />
      </div>
    </main>
  )
}

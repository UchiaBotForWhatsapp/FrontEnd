import { BotForm } from "@/components/bot-form";
import { Sidebar } from "@/components/sidebar";

export default function NewBotPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl p-4 pt-16 md:p-8">
          <BotForm />
        </div>
      </main>
    </div>
  );
}

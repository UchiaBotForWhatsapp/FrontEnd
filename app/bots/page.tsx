import { BotList } from "@/components/bot-list";
import { Sidebar } from "@/components/sidebar";

export default function BotsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-4 pt-16 md:p-8">
          <BotList />
        </div>
      </main>
    </div>
  );
}

import { PlanSelector } from "@/components/plan-selector"

export default function PlansPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <PlanSelector />
      </div>
    </main>
  )
}

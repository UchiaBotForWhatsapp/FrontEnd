"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

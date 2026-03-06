"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

export function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-background border-b border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 transition-colors hover:bg-secondary rounded-md"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">UB</span>
          </div>
          <span className="font-bold text-lg">U Bot</span>
        </Link>
      </div>
    </header>
  );
}

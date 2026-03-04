"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Package,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Meus Bots", icon: MessageCircle },
    { href: "/dashboard/myproducts", label: "Meus Produtos", icon: Package },
    { href: "/dashboard/settings", label: "Configurações", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => onOpenChange(false)}
        ></div>
      )}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out z-50
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static
        `}
      >
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">
                UB
              </span>
            </div>
            <h1 className="font-bold text-lg">U Bot</h1>
          </Link>

          <button className="md:hidden" onClick={() => onOpenChange(false)}>
            <X className="w-6 h-6 text-sidebar-primary-foreground" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
                onClick={() => onOpenChange(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/50 bg-transparent"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      </aside>
    </>
  );
}

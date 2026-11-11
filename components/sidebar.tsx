"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { authApi } from "@/lib/api-client";
import {
  LayoutDashboard,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Package,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let active = true;

    authApi.getMe()
      .then((user) => {
        if (active && typeof user?.name === "string") {
          setUserName(user.name.trim());
        }
      })
      .catch((error) => {
        console.error("Failed to load sidebar user:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/bots", label: "Meus Bots", icon: MessageCircle },
    { href: "/dashboard/myproducts", label: "Meus Produtos", icon: Package },
    { href: "/dashboard/settings", label: "Configurações", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Botão hamburger para telas pequenas */}
      {!open && (
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={open}
          className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-md"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform z-50
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static
        `}
      >
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary">
              <span className="text-sidebar-primary-foreground font-bold text-lg">
                {userName.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <span className="min-w-0">
              <span className="block truncate font-bold text-sm">
                {userName.split(/\s+/)[0] || "Usuário"}
              </span>
            </span>
          </Link>

          {/* Botão fechar só aparece em mobile */}
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X className="w-6 h-6 text-sidebar-primary-foreground" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/bots" && pathname.startsWith("/bots/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
                onClick={() => setOpen(false)} // Fecha sidebar em mobile ao clicar
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

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Wrench, FolderKanban, History, Settings, LayoutDashboard, QrCode, Users, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

type SidebarProps = {
  dictionary: Dictionary;
  role: "ADMIN";
};

type NavItem = {
  href: string;
  icon: typeof LayoutDashboard;
  key: keyof Dictionary["common"];
  label?: string;
};

const STORAGE_KEY = "dashboard.sidebar.open";

const NAV: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/tools", icon: Wrench, key: "tools" },
  { href: "/projects", icon: FolderKanban, key: "projects" },
  { href: "/users", icon: Users, key: "employees" },
  { href: "/history", icon: History, key: "history" },
  { href: "/tools/qr-print", icon: QrCode, key: "tools", label: "QR kodai" },
  { href: "/settings/profile", icon: Settings, key: "settings" },
];

export function Sidebar({ dictionary, role }: SidebarProps) {
  const navItems = role === "ADMIN" ? NAV : [];
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "0") {
      setIsOpen(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <aside
      className={`hidden min-h-screen shrink-0 border-r border-slate-200 bg-white/95 backdrop-blur transition-all duration-200 md:block ${
        isOpen ? "w-72" : "w-[72px]"
      }`}
    >
      <div className="border-b border-slate-200 px-4 py-4">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          title={isOpen ? "Close sidebar" : "Open sidebar"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>
        {isOpen ? (
          <div className="mt-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Įrankių sistema</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Administratorius</p>
          </div>
        ) : null}
      </div>
      <nav className="space-y-1 px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const label = item.label ?? dictionary.common[item.key];
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg py-2.5 text-sm transition-all ${
                isOpen ? "gap-3 px-0" : "justify-center px-2"
              } ${
                isActive
                  ? "bg-slate-100 font-medium text-slate-900"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
              title={isOpen ? undefined : label}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-slate-900" : "text-slate-500"}`} />
              {isOpen ? <span>{label}</span> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

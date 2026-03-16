import Link from "next/link";
import { Wrench, FolderKanban, History, Settings, LayoutDashboard, QrCode, Users } from "lucide-react";
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

const NAV: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/tools", icon: Wrench, key: "tools" },
  { href: "/projects", icon: FolderKanban, key: "projects" },
  { href: "/users", icon: Users, key: "employees" },
  { href: "/history", icon: History, key: "history" },
  { href: "/tools/qr-print", icon: QrCode, key: "tools", label: "QR spauda" },
  { href: "/settings/profile", icon: Settings, key: "settings" },
];

export function Sidebar({ dictionary, role }: SidebarProps) {
  const navItems = role === "ADMIN" ? NAV : [];

  return (
    <aside className="hidden w-64 border-r border-slate-200 bg-white/95 backdrop-blur md:block">
      <div className="border-b border-slate-200 px-4 py-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Irankiu sistema</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">Administravimo pultas</p>
      </div>
      <nav className="space-y-1.5 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const label = item.label ?? dictionary.common[item.key];

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              <Icon className="h-4 w-4 text-slate-500" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

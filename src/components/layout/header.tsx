import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { LogoutButton } from "@/components/layout/logout-button";
import { CalendarDays } from "lucide-react";

type HeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
  role: "ADMIN";
  showLogout?: boolean;
};

export function Header({ locale, dictionary, role, showLogout = true }: HeaderProps) {
  const today = new Intl.DateTimeFormat(locale === "lt" ? "lt-LT" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-slate-900 md:text-base">{dictionary.app.title}</h1>
          <div className="mt-0.5 hidden items-center gap-2 text-xs text-slate-500 md:flex">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{today}</span>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{role}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} />
          {showLogout ? <LogoutButton label={dictionary.common.signOut} /> : null}
        </div>
      </div>
    </header>
  );
}

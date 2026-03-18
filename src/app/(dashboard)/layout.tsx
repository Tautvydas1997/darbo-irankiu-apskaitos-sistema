import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getAuthSession } from "@/lib/auth";
import { AUTH_BYPASS } from "@/lib/env";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { isAuthenticated } from "@/lib/permissions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!isAuthenticated(session)) {
    redirect("/login");
  }

  const locale = getLocaleFromCookie();
  const dictionary = getDictionary(locale);
  const role = session?.user.role ?? "ADMIN";

  return (
    <div className="min-h-screen bg-transparent md:grid md:grid-cols-[auto_1fr]">
      <Sidebar dictionary={dictionary} role={role} />
      <div className="flex min-h-screen min-w-0 flex-col">
        <Header locale={locale} dictionary={dictionary} role={role} showLogout={!AUTH_BYPASS} />
        <main className="flex-1 px-4 py-4 sm:px-5 md:px-6 md:py-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

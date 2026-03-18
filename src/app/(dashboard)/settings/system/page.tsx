import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AUTH_BYPASS } from "@/lib/env";
import { getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { hasAdminAccess } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SystemSettingsPage() {
  const session = await getAuthSession();
  const locale = getLocaleFromCookie();
  const canManage = hasAdminAccess(session?.user.role);
  if (!canManage) {
    redirect("/dashboard");
  }

  const appBaseUrl = process.env.APP_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">{pickLocaleText(locale, "Sistemos nustatymai", "System settings")}</h2>
        <p className="page-subtitle">
          {pickLocaleText(
            locale,
            "Greita sistemos konfigūracijos apžvalga ir administravimo nuorodos.",
            "Quick system configuration overview and administration shortcuts."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{pickLocaleText(locale, "Aplinka", "Environment")}</CardTitle>
            <CardDescription>
              {pickLocaleText(locale, "Pagrindiniai diegimo ir autentifikacijos parametrai.", "Core deployment and authentication parameters.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">App base URL</p>
              <p className="mt-1 font-medium text-slate-900">{appBaseUrl}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Auth bypass</p>
              <p className={`mt-1 font-medium ${AUTH_BYPASS ? "text-amber-700" : "text-emerald-700"}`}>
                {AUTH_BYPASS
                  ? pickLocaleText(locale, "Įjungtas (tik vystymui)", "Enabled (development only)")
                  : pickLocaleText(locale, "Išjungtas", "Disabled")}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">
                {pickLocaleText(locale, "Dabartinis administratorius", "Current administrator")}
              </p>
              <p className="mt-1 font-medium text-slate-900">{session?.user?.name || "-"}</p>
              <p className="text-xs text-slate-500">{session?.user?.email || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{pickLocaleText(locale, "Greiti veiksmai", "Quick actions")}</CardTitle>
            <CardDescription>
              {pickLocaleText(locale, "Dažniausiai naudojamos nuorodos sistemos administravimui.", "Most-used shortcuts for system administration.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/settings/profile">{pickLocaleText(locale, "Redaguoti profilį", "Edit profile")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tools/qr-print">{pickLocaleText(locale, "QR kodai", "QR codes")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/history">{pickLocaleText(locale, "Peržiūrėti istoriją", "View history")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/users">{pickLocaleText(locale, "Valdyti darbuotojus", "Manage employees")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

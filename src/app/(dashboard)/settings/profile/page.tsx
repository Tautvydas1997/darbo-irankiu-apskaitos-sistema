import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { prisma } from "@/lib/prisma";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";

export default async function ProfileSettingsPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const locale = getLocaleFromCookie();
  const admin = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      language: true,
    },
  });
  if (!admin) {
    redirect("/login");
  }

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">{pickLocaleText(locale, "Profilio nustatymai", "Profile settings")}</h2>
        <p className="page-subtitle">
          {pickLocaleText(
            locale,
            "Atnaujinkite savo vardą, el. paštą, kalbą ir prisijungimo slaptažodį.",
            "Update your name, email, language, and sign-in password."
          )}
        </p>
      </div>
      <ProfileSettingsForm
        locale={locale}
        initialValues={{
          name: admin.name,
          email: admin.email,
          language: admin.language === "en" ? "en" : "lt",
        }}
      />
    </section>
  );
}

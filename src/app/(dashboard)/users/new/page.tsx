import { redirect } from "next/navigation";
import { UserForm } from "@/components/users/user-form";
import { getAuthSession } from "@/lib/auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { hasAdminAccess } from "@/lib/permissions";

export default async function NewUserPage() {
  const session = await getAuthSession();
  const locale = getLocaleFromCookie();
  const canManage = hasAdminAccess(session?.user.role);
  if (!canManage) {
    redirect("/users");
  }

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">{pickLocaleText(locale, "Naujas darbuotojas", "New employee")}</h2>
        <p className="page-subtitle">{pickLocaleText(locale, "Sukurkite darbuotojo paskyra su unikaliu ID prisijungimui prie skaitytuvo.", "Create an employee account with a unique scanner login ID.")}</p>
      </div>
      <UserForm
        mode="create"
        locale={locale}
        initialValues={{
          employeeId: "",
          firstName: "",
          lastName: "",
          isActive: true,
        }}
      />
    </section>
  );
}

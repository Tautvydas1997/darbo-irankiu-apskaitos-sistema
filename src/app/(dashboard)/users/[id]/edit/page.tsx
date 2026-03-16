import { notFound, redirect } from "next/navigation";
import { UserForm } from "@/components/users/user-form";
import { getAuthSession } from "@/lib/auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type EditUserPageProps = {
  params: {
    id: string;
  };
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await getAuthSession();
  const locale = getLocaleFromCookie();
  const canManage = hasAdminAccess(session?.user.role);
  if (!canManage) {
    redirect("/users");
  }

  const user = await prisma.employeeUser.findUnique({
    where: { id: params.id },
  });
  if (!user) {
    notFound();
  }

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">{pickLocaleText(locale, "Redaguoti darbuotoja", "Edit employee")}</h2>
        <p className="page-subtitle">{pickLocaleText(locale, "Atnaujinkite darbuotojo duomenis ir prieiga prie skaitytuvo.", "Update employee details and scanner access.")}</p>
      </div>
      <UserForm
        mode="edit"
        locale={locale}
        userId={user.id}
        initialValues={{
          employeeId: user.employeeId,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
        }}
      />
    </section>
  );
}

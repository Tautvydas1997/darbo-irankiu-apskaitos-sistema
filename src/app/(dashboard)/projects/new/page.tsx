import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { hasAdminAccess } from "@/lib/permissions";
import { ProjectForm } from "@/components/projects/project-form";

type NewProjectPageProps = {
  searchParams?: {
    code?: string;
  };
};

export default async function NewProjectPage({ searchParams }: NewProjectPageProps) {
  const session = await getAuthSession();
  const locale = getLocaleFromCookie();
  const canManage = hasAdminAccess(session?.user.role);
  if (!canManage) {
    redirect("/projects");
  }

  const prefilledCode = searchParams?.code?.trim().toUpperCase() ?? "";

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">{pickLocaleText(locale, "Naujas projektas", "New project")}</h2>
        <p className="page-subtitle">{pickLocaleText(locale, "Pridekite projekta irankiu paskirstymui ir stebejimui.", "Add a project for tool allocation and tracking.")}</p>
      </div>
      <ProjectForm
        mode="create"
        locale={locale}
        initialValues={{
          code: prefilledCode,
          name: "",
          location: "",
        }}
      />
    </section>
  );
}

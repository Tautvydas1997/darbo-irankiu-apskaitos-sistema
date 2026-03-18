import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/projects/project-form";

type EditProjectPageProps = {
  params: {
    id: string;
  };
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await getAuthSession();
  const locale = getLocaleFromCookie();
  const canManage = hasAdminAccess(session?.user.role);
  if (!canManage) {
    redirect("/projects");
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });
  if (!project) {
    notFound();
  }

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">{pickLocaleText(locale, "Redaguoti projektą", "Edit project")}</h2>
        <p className="page-subtitle">{pickLocaleText(locale, "Atnaujinkite projekto duomenis, naudojamus įrankių istorijoje.", "Update project details used by tool transactions.")}</p>
      </div>

      <ProjectForm
        mode="edit"
        locale={locale}
        projectId={project.id}
        initialValues={{
          code: project.code,
          name: project.name,
          location: project.location,
        }}
      />
    </section>
  );
}

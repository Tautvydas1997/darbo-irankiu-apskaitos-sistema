import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
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
        <h2 className="page-title">Redaguoti projekta</h2>
        <p className="page-subtitle">Atnaujinkite projekto duomenis, naudojamus irankiu istorijoje.</p>
      </div>

      <ProjectForm
        mode="edit"
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

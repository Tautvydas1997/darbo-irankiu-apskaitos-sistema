import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { ProjectForm } from "@/components/projects/project-form";

type NewProjectPageProps = {
  searchParams?: {
    code?: string;
  };
};

export default async function NewProjectPage({ searchParams }: NewProjectPageProps) {
  const session = await getAuthSession();
  const canManage = hasAdminAccess(session?.user.role);
  if (!canManage) {
    redirect("/projects");
  }

  const prefilledCode = searchParams?.code?.trim().toUpperCase() ?? "";

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">Naujas projektas</h2>
        <p className="page-subtitle">Pridekite projekta irankiu paskirstymui ir stebejimui.</p>
      </div>
      <ProjectForm
        mode="create"
        initialValues={{
          code: prefilledCode,
          name: "",
          location: "",
        }}
      />
    </section>
  );
}

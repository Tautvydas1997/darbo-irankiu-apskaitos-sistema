import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { ToolForm } from "@/components/tools/tool-form";

type EditToolPageProps = {
  params: { id: string };
};

export default async function EditToolPage({ params }: EditToolPageProps) {
  const session = await getAuthSession();
  const canManage = hasAdminAccess(session?.user.role);
  if (!canManage) {
    redirect("/tools");
  }

  const [tool, categories, projects] = await Promise.all([
    prisma.tool.findUnique({
      where: { id: params.id },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.project.findMany({ orderBy: { code: "asc" } }),
  ]);

  if (!tool) {
    notFound();
  }

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">Edit tool</h2>
        <p className="page-subtitle">Update assignments, status, and condition notes.</p>
      </div>

      <ToolForm
        mode="edit"
        toolId={tool.id}
        categories={categories.map((item) => ({ id: item.id, label: item.name }))}
        projects={projects.map((item) => ({ id: item.id, label: `${item.code} - ${item.name}` }))}
        initialValues={{
          name: tool.name,
          inventoryNumber: tool.inventoryNumber,
          status: tool.status,
          categoryId: tool.categoryId,
          projectId: tool.projectId ?? "",
          conditionNotes: tool.conditionNotes ?? "",
        }}
      />
    </section>
  );
}

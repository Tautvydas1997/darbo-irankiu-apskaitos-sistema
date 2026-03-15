import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { ToolForm } from "@/components/tools/tool-form";

export default async function NewToolPage() {
  const session = await getAuthSession();
  const canManage = hasAdminAccess(session?.user.role);
  if (!canManage) {
    redirect("/tools");
  }

  const [categories, projects] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.project.findMany({ orderBy: { code: "asc" } }),
  ]);

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">New tool</h2>
        <p className="page-subtitle">Register a tool and assign it to category/project.</p>
      </div>

      <ToolForm
        mode="create"
        categories={categories.map((item) => ({ id: item.id, label: item.name }))}
        projects={projects.map((item) => ({ id: item.id, label: `${item.code} - ${item.name}` }))}
      />
    </section>
  );
}

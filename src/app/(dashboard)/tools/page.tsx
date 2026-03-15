import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { formatEnumLabel } from "@/lib/formatters";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { DeleteToolButton } from "@/components/tools/delete-tool-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ToolsPage() {
  const locale = getLocaleFromCookie();
  const dictionary = getDictionary(locale);
  const session = await getAuthSession();
  const canManage = hasAdminAccess(session?.user.role);

  const tools = await prisma.tool.findMany({
    include: {
      category: true,
      project: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="page-title">{dictionary.common.tools}</h2>
          <p className="page-subtitle">Track and manage all inventory tools with project/category assignment.</p>
        </div>
        {canManage ? (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/tools/qr-print">QR Print</Link>
            </Button>
            <Button asChild>
              <Link href="/tools/new">Create tool</Link>
            </Button>
          </div>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
          <CardDescription>Registered tools and current assignment/status overview.</CardDescription>
        </CardHeader>
        <CardContent>
          {tools.length === 0 ? (
            <p className="text-sm text-slate-600">No tools yet.</p>
          ) : (
            <div className="table-shell">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Tool Name</th>
                    <th>Inventory Number</th>
                    <th>Category</th>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tools.map((tool) => (
                    <tr key={tool.id}>
                      <td className="font-semibold text-slate-900">
                        <Link href={`/tools/${tool.id}`} className="hover:underline">
                          {tool.name}
                        </Link>
                      </td>
                      <td>{tool.inventoryNumber}</td>
                      <td>{tool.category.name}</td>
                      <td>{tool.project ? `${tool.project.code} - ${tool.project.name}` : "Unassigned"}</td>
                      <td>
                        <span className="status-pill">
                          {formatEnumLabel(tool.status)}
                        </span>
                      </td>
                      <td>
                        {canManage ? (
                          <div className="flex items-center gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/tools/${tool.id}/edit`}>Edit</Link>
                            </Button>
                            <DeleteToolButton toolId={tool.id} />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">View only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

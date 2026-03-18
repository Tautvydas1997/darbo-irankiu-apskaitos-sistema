import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { formatEnumLabel } from "@/lib/formatters";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
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
          <p className="page-subtitle">
            {pickLocaleText(locale, "Stebėkite ir valdykite įrankius su projekto ir kategorijos priskyrimu.", "Track and manage all inventory tools with project/category assignment.")}
          </p>
        </div>
        {canManage ? (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/tools/qr-print">{pickLocaleText(locale, "QR kodai", "QR codes")}</Link>
            </Button>
            <Button asChild>
              <Link href="/tools/new">{pickLocaleText(locale, "Pridėti įrankį", "Add tool")}</Link>
            </Button>
          </div>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pickLocaleText(locale, "Įrankiai", "Tools")}</CardTitle>
          <CardDescription>{pickLocaleText(locale, "Registruoti įrankiai ir jų esamas statusas.", "Registered tools and current assignment/status overview.")}</CardDescription>
        </CardHeader>
        <CardContent>
          {tools.length === 0 ? (
            <p className="text-sm text-slate-600">{pickLocaleText(locale, "Įrankių dar nėra.", "No tools yet.")}</p>
          ) : (
            <div className="table-shell">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>{pickLocaleText(locale, "Įrankio pavadinimas", "Tool Name")}</th>
                    <th>{pickLocaleText(locale, "Inventoriaus numeris", "Inventory Number")}</th>
                    <th>{pickLocaleText(locale, "Kategorija", "Category")}</th>
                    <th>{pickLocaleText(locale, "Projektas", "Project")}</th>
                    <th>{pickLocaleText(locale, "Statusas", "Status")}</th>
                    <th>{pickLocaleText(locale, "Veiksmai", "Actions")}</th>
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
                      <td>{tool.project ? `${tool.project.code} - ${tool.project.name}` : pickLocaleText(locale, "Nepriskirta", "Unassigned")}</td>
                      <td>
                        <span className="status-pill">
                          {formatEnumLabel(tool.status)}
                        </span>
                      </td>
                      <td>
                        {canManage ? (
                          <div className="flex items-center gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/tools/${tool.id}/edit`}>{pickLocaleText(locale, "Redaguoti", "Edit")}</Link>
                            </Button>
                            <DeleteToolButton toolId={tool.id} locale={locale} />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">{pickLocaleText(locale, "Tik peržiūra", "View only")}</span>
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

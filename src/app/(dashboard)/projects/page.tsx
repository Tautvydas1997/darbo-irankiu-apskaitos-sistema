import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { prisma } from "@/lib/prisma";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProjectsPage() {
  const locale = getLocaleFromCookie();
  const dictionary = getDictionary(locale);
  const session = await getAuthSession();
  const canManage = hasAdminAccess(session?.user.role);

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="page-title">{dictionary.common.projects}</h2>
          <p className="page-subtitle">
            {pickLocaleText(locale, "Tvarkykite projektu sarasa, naudojama irankiu priskyrimui ir istorijai.", "Manage project records used in tool assignment and transaction history.")}
          </p>
        </div>
        {canManage ? (
          <Button asChild>
            <Link href="/projects/new">{pickLocaleText(locale, "Kurti projekta", "Create project")}</Link>
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pickLocaleText(locale, "Projektai", "Projects")}</CardTitle>
          <CardDescription>{pickLocaleText(locale, "Visi sistemoje registruoti projektai.", "All active and historical projects in the system.")}</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-600">{pickLocaleText(locale, "Projektu dar nera.", "No projects yet.")}</p>
          ) : (
            <div className="table-shell">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>{pickLocaleText(locale, "Pavadinimas", "Name")}</th>
                    <th>{pickLocaleText(locale, "Vieta", "Location")}</th>
                    <th>{pickLocaleText(locale, "Sukurta", "Created")}</th>
                    <th>{pickLocaleText(locale, "Veiksmai", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="font-semibold text-slate-900">{project.code}</td>
                      <td>{project.name}</td>
                      <td>{project.location}</td>
                      <td className="text-slate-500">
                        {new Intl.DateTimeFormat(locale === "lt" ? "lt-LT" : "en-US").format(project.createdAt)}
                      </td>
                      <td>
                        {canManage ? (
                          <div className="flex items-center gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/projects/${project.id}/edit`}>{pickLocaleText(locale, "Redaguoti", "Edit")}</Link>
                            </Button>
                            <DeleteProjectButton projectId={project.id} locale={locale} />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">{pickLocaleText(locale, "Tik perziura", "View only")}</span>
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

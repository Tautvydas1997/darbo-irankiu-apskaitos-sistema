import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
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
          <p className="page-subtitle">Tvarkykite projektu sarasa, naudojama irankiu priskyrimui ir istorijai.</p>
        </div>
        {canManage ? (
          <Button asChild>
            <Link href="/projects/new">Kurti projekta</Link>
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projektai</CardTitle>
          <CardDescription>Visi sistemoje registruoti projektai.</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-600">Projektu dar nera.</p>
          ) : (
            <div className="table-shell">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Pavadinimas</th>
                    <th>Vieta</th>
                    <th>Sukurta</th>
                    <th>Veiksmai</th>
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
                              <Link href={`/projects/${project.id}/edit`}>Redaguoti</Link>
                            </Button>
                            <DeleteProjectButton projectId={project.id} />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Tik perziura</span>
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

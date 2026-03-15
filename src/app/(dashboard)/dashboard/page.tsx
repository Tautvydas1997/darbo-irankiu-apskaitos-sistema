import { getLocaleFromCookie, getDictionary } from "@/lib/i18n";
import { formatEnumLabel } from "@/lib/formatters";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { ToolsPerProjectChart } from "@/components/dashboard/tools-per-project-chart";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const locale = getLocaleFromCookie();
  const dictionary = getDictionary(locale);

  const [totalTools, inStorage, checkedOut, broken, lost, projects, recentTransactions] = await Promise.all([
    prisma.tool.count(),
    prisma.tool.count({ where: { status: "IN_STORAGE" } }),
    prisma.tool.count({ where: { status: "CHECKED_OUT" } }),
    prisma.tool.count({ where: { status: "BROKEN" } }),
    prisma.tool.count({ where: { status: "LOST" } }),
    prisma.project.findMany({
      select: {
        code: true,
        name: true,
        _count: { select: { tools: true } },
      },
      orderBy: { code: "asc" },
    }),
    prisma.toolTransaction.findMany({
      include: {
        tool: { select: { name: true, inventoryNumber: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const stats = [
    { title: "Visi irankiai", value: totalTools, trend: "Bendras kiekis", tone: "slate" as const },
    { title: "Irankiai sandelyje", value: inStorage, trend: "Paruosta isdavimui", tone: "emerald" as const },
    { title: "Paimti irankiai", value: checkedOut, trend: "Siuo metu naudojami", tone: "amber" as const },
    { title: "Sugede irankiai", value: broken, trend: "Reikia patikros", tone: "rose" as const },
    { title: "Prarasti irankiai", value: lost, trend: "Kritinis stebejimas", tone: "rose" as const },
  ];

  const toolsPerProject = projects.map((project) => ({
    project: `${project.code} - ${project.name}`,
    count: project._count.tools,
  }));

  const recentActivity = recentTransactions.map((transaction) => {
    const type =
      transaction.actionType === "REPORT_BROKEN"
        ? ("broken" as const)
        : transaction.actionType === "RETURN"
          ? ("return" as const)
          : ("checkout" as const);

    return {
      id: transaction.id,
      title: `${transaction.tool.name} ${formatEnumLabel(transaction.actionType).toLowerCase()}`,
      description: `${transaction.employeeFirstName} ${transaction.employeeLastName} (${transaction.projectCode})`,
      time: new Intl.DateTimeFormat(locale === "lt" ? "lt-LT" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(transaction.createdAt),
      type,
    };
  });

  return (
    <section className="page-shell">
      <div className="page-header">
        <h2 className="page-title">{dictionary.common.dashboard}</h2>
        <p className="page-subtitle">
          Realus irankiu bukles, paskirstymo projektams ir veiksmu suvestines vaizdas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} trend={card.trend} tone={card.tone} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ToolsPerProjectChart data={toolsPerProject} />
        </div>
        <Card className="bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Operacine suvestine</CardTitle>
            <CardDescription className="text-slate-200">
              Esamos sistemos bukles santrauka administravimui.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-300">Panaudojimas</p>
              <p className="mt-1 text-2xl font-semibold">
                {totalTools > 0 ? `${Math.round((checkedOut / totalTools) * 100)}%` : "0%"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-300">Prieinamumas</p>
              <p className="mt-1 text-2xl font-semibold">
                {totalTools > 0 ? `${Math.round((inStorage / totalTools) * 100)}%` : "0%"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-300">Prieziura</p>
              <p className="mt-1 text-2xl font-semibold">{broken}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-300">Kritiniai signalai</p>
              <p className="mt-1 text-2xl font-semibold">{lost}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ActivityTimeline items={recentActivity} />
    </section>
  );
}

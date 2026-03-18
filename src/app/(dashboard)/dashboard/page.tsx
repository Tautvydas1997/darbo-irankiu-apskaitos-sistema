import { getLocaleFromCookie, getDictionary } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
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
    { title: pickLocaleText(locale, "Visi įrankiai", "Total tools"), value: totalTools, trend: pickLocaleText(locale, "Bendras kiekis", "Inventory scope"), tone: "slate" as const },
    { title: pickLocaleText(locale, "Įrankiai sandėlyje", "Tools in storage"), value: inStorage, trend: pickLocaleText(locale, "Paruošta išdavimui", "Ready for issue"), tone: "emerald" as const },
    { title: pickLocaleText(locale, "Paimti įrankiai", "Checked out tools"), value: checkedOut, trend: pickLocaleText(locale, "Šiuo metu naudojami", "Currently in use"), tone: "amber" as const },
    { title: pickLocaleText(locale, "Sugedę įrankiai", "Broken tools"), value: broken, trend: pickLocaleText(locale, "Reikia patikros", "Need inspection"), tone: "rose" as const },
    { title: pickLocaleText(locale, "Prarasti įrankiai", "Lost tools"), value: lost, trend: pickLocaleText(locale, "Kritinis stebėjimas", "Critical control"), tone: "rose" as const },
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
          {pickLocaleText(locale, "Realus įrankių būklės, paskirstymo projektams ir veiksmų suvestinės vaizdas.", "Real-time overview of inventory status, project allocation, and operational activity.")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} trend={card.trend} tone={card.tone} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ToolsPerProjectChart data={toolsPerProject} locale={locale} />
        </div>
        <Card className="bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold">{pickLocaleText(locale, "Operacine suvestine", "Operational summary")}</CardTitle>
            <CardDescription className="text-slate-200">
              {pickLocaleText(locale, "Esamos sistemos būklės santrauka administravimui.", "Current system health snapshot for management review.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-300">{pickLocaleText(locale, "Panaudojimas", "Utilization")}</p>
              <p className="mt-1 text-2xl font-semibold">
                {totalTools > 0 ? `${Math.round((checkedOut / totalTools) * 100)}%` : "0%"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-300">{pickLocaleText(locale, "Prieinamumas", "Availability")}</p>
              <p className="mt-1 text-2xl font-semibold">
                {totalTools > 0 ? `${Math.round((inStorage / totalTools) * 100)}%` : "0%"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-300">{pickLocaleText(locale, "Prieziura", "Maintenance")}</p>
              <p className="mt-1 text-2xl font-semibold">{broken}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-300">{pickLocaleText(locale, "Kritiniai signalai", "Critical alerts")}</p>
              <p className="mt-1 text-2xl font-semibold">{lost}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ActivityTimeline items={recentActivity} locale={locale} />
    </section>
  );
}

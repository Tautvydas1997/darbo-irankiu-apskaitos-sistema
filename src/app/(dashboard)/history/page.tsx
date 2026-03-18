import Link from "next/link";
import { ActionType, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { formatEnumLabel } from "@/lib/formatters";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type HistoryPageProps = {
  searchParams?: {
    toolId?: string;
    employee?: string;
    projectCode?: string;
    actionType?: ActionType;
    unknownOnly?: string;
    from?: string;
    to?: string;
  };
};

function toStartDate(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function toEndDate(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  parsed.setHours(23, 59, 59, 999);
  return parsed;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const locale = getLocaleFromCookie();
  const dictionary = getDictionary(locale);
  const session = await getAuthSession();
  const canManage = hasAdminAccess(session?.user.role);

  if (!canManage) {
    redirect("/dashboard");
  }

  const filters = {
    toolId: searchParams?.toolId ?? "",
    employee: searchParams?.employee ?? "",
    projectCode: searchParams?.projectCode ?? "",
    actionType: searchParams?.actionType ?? "",
    unknownOnly: searchParams?.unknownOnly === "1",
    from: searchParams?.from ?? "",
    to: searchParams?.to ?? "",
  };

  const fromDate = toStartDate(filters.from);
  const toDate = toEndDate(filters.to);

  const where: Prisma.ToolTransactionWhereInput = {
    ...(filters.toolId ? { toolId: filters.toolId } : {}),
    ...(filters.projectCode ? { projectCode: { contains: filters.projectCode, mode: "insensitive" } } : {}),
    ...(filters.actionType ? { actionType: filters.actionType as ActionType } : {}),
    ...(filters.unknownOnly ? { projectId: null } : {}),
    ...(filters.employee
      ? {
          OR: [
            { employeeFirstName: { contains: filters.employee, mode: "insensitive" } },
            { employeeLastName: { contains: filters.employee, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(fromDate || toDate
      ? {
          createdAt: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: toDate } : {}),
          },
        }
      : {}),
  };

  const [transactions, tools] = await Promise.all([
    prisma.toolTransaction.findMany({
      where,
      include: {
        tool: { select: { id: true, name: true, inventoryNumber: true } },
        project: { select: { id: true, code: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tool.findMany({
      select: { id: true, name: true, inventoryNumber: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <section className="page-shell">
      <div>
        <h2 className="page-title">{dictionary.common.history}</h2>
        <p className="page-subtitle">
          {pickLocaleText(locale, "Peržiūrėkite visus įrankių veiksmus su išsamiais filtrais.", "Review all tool transactions with advanced filters.")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pickLocaleText(locale, "Filtrai", "Filters")}</CardTitle>
          <CardDescription>
            {pickLocaleText(locale, "Filtruokite istoriją pagal įrankį, darbuotoją, projektą, veiksmą ir datą.", "Filter history by tool, employee, project code, action type, and date range.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="get" className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <select
              name="toolId"
              defaultValue={filters.toolId}
              className="app-select"
            >
              <option value="">{pickLocaleText(locale, "Visi įrankiai", "All tools")}</option>
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name} ({tool.inventoryNumber})
                </option>
              ))}
            </select>

            <input
              type="text"
              name="employee"
              defaultValue={filters.employee}
              className="app-select"
              placeholder={pickLocaleText(locale, "Darbuotojo vardas arba pavardė", "Employee first or last name")}
            />

            <input
              type="text"
              name="projectCode"
              defaultValue={filters.projectCode}
              className="app-select"
              placeholder={pickLocaleText(locale, "Projekto kodas (pvz. P2652)", "Project code (e.g. P2652)")}
            />

            <select name="actionType" defaultValue={filters.actionType} className="app-select">
              <option value="">{pickLocaleText(locale, "Visi veiksmų tipai", "All action types")}</option>
              {Object.values(ActionType).map((actionType) => (
                <option key={actionType} value={actionType}>
                  {formatEnumLabel(actionType)}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="from"
              defaultValue={filters.from}
              className="app-select"
            />

            <input
              type="date"
              name="to"
              defaultValue={filters.to}
              className="app-select"
            />

            <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="unknownOnly"
                value="1"
                defaultChecked={filters.unknownOnly}
                className="h-4 w-4 rounded border-slate-300"
              />
              {pickLocaleText(locale, "Rodyti tik neegzistuojančių projektų kodus", "Only unknown project codes")}
            </label>

            <div className="flex items-center gap-2 md:col-span-2 xl:col-span-5">
              <Button type="submit">{pickLocaleText(locale, "Taikyti filtrus", "Apply filters")}</Button>
              <Button asChild type="button" variant="outline">
                <Link href="/history">{pickLocaleText(locale, "Atstatyti", "Reset")}</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{pickLocaleText(locale, "Įrankių istorija", "Transactions")}</CardTitle>
          <CardDescription>{pickLocaleText(locale, "Visi su įrankiais atlikti veiksmai.", "All actions performed on tools.")}</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-slate-600">{pickLocaleText(locale, "Pagal pasirinktus filtrus įrašų nerasta.", "No transactions found for selected filters.")}</p>
          ) : (
            <div className="table-shell">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>{pickLocaleText(locale, "Įrankis", "Tool")}</th>
                    <th>{pickLocaleText(locale, "Veiksmas", "Action")}</th>
                    <th>{pickLocaleText(locale, "Darbuotojas", "Employee")}</th>
                    <th>{pickLocaleText(locale, "Projektas", "Project")}</th>
                    <th>{pickLocaleText(locale, "Data", "Date")}</th>
                    <th>{pickLocaleText(locale, "Pastabos", "Notes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium text-slate-900">
                        {item.tool.name} ({item.tool.inventoryNumber})
                      </td>
                      <td>{formatEnumLabel(item.actionType)}</td>
                      <td>{item.employeeFirstName} {item.employeeLastName}</td>
                      <td>
                        {item.project ? (
                          `${item.project.code} - ${item.project.name}`
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                              {pickLocaleText(locale, `${item.projectCode} (projekto nėra sąraše)`, `${item.projectCode} (not in projects)`)}
                            </span>
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/projects/new?code=${encodeURIComponent(item.projectCode)}`}>{pickLocaleText(locale, "Pridėti projektą", "Add project")}</Link>
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="text-slate-500">
                        {new Intl.DateTimeFormat(locale === "lt" ? "lt-LT" : "en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(item.createdAt)}
                      </td>
                      <td className="max-w-[360px] text-slate-600">{item.notes || "-"}</td>
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

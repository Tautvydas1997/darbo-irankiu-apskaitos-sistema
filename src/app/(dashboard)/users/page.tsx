import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { DeleteUserButton } from "@/components/users/delete-user-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UsersPage() {
  const locale = getLocaleFromCookie();
  const dictionary = getDictionary(locale);
  const session = await getAuthSession();
  const canManage = hasAdminAccess(session?.user.role);

  const users = await prisma.employeeUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="page-title">{dictionary.common.employees}</h2>
          <p className="page-subtitle">
            {pickLocaleText(
              locale,
              "Tvarkykite darbuotojų paskyras ir unikalius ID skaitytuvo prisijungimui.",
              "Manage employee accounts and unique IDs for scanner access."
            )}
          </p>
        </div>
        {canManage ? (
          <Button asChild>
            <Link href="/users/new">{pickLocaleText(locale, "Kurti darbuotoją", "Create employee")}</Link>
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pickLocaleText(locale, "Darbuotojai", "Employees")}</CardTitle>
          <CardDescription>{pickLocaleText(locale, "Visos darbuotojų paskyros skenerio autentifikacijai.", "All employee accounts used for scanner authentication.")}</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-slate-600">{pickLocaleText(locale, "Darbuotojų dar nėra.", "No employees yet.")}</p>
          ) : (
            <div className="table-shell">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>{pickLocaleText(locale, "Darbuotojo ID", "Employee ID")}</th>
                    <th>{pickLocaleText(locale, "Vardas", "First name")}</th>
                    <th>{pickLocaleText(locale, "Pavardė", "Last name")}</th>
                    <th>{pickLocaleText(locale, "Būsena", "Status")}</th>
                    <th>{pickLocaleText(locale, "Sukurta", "Created")}</th>
                    <th>{pickLocaleText(locale, "Veiksmai", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="font-semibold text-slate-900">{user.employeeId}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {user.isActive ? pickLocaleText(locale, "Aktyvus", "Active") : pickLocaleText(locale, "Neaktyvus", "Inactive")}
                        </span>
                      </td>
                      <td className="text-slate-500">
                        {new Intl.DateTimeFormat(locale === "lt" ? "lt-LT" : "en-US").format(user.createdAt)}
                      </td>
                      <td>
                        {canManage ? (
                          <div className="flex items-center gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/users/${user.id}/edit`}>{pickLocaleText(locale, "Redaguoti", "Edit")}</Link>
                            </Button>
                            <DeleteUserButton userId={user.id} locale={locale} />
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

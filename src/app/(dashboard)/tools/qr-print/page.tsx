import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { QrPrintBoard } from "@/components/tools/qr-print-board";

export default async function ToolQrPrintPage() {
  const locale = getLocaleFromCookie();
  const session = await getAuthSession();
  const canManage = hasAdminAccess(session?.user.role);
  if (!canManage) {
    redirect("/tools");
  }

  const tools = await prisma.tool.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      inventoryNumber: true,
    },
  });

  return <QrPrintBoard tools={tools} locale={locale} />;
}

import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { QrPrintBoard } from "@/components/tools/qr-print-board";
import { getToolQrPayload } from "@/lib/tool-qr";

export default async function ToolQrPrintPage() {
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

  const printableTools = await Promise.all(
    tools.map(async (tool) => {
      const qrDataUrl = await QRCode.toDataURL(getToolQrPayload(tool.id), {
        margin: 1,
        width: 200,
      });

      return {
        ...tool,
        qrDataUrl,
      };
    })
  );

  return <QrPrintBoard tools={printableTools} />;
}

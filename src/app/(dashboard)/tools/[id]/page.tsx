import Link from "next/link";
import QRCode from "qrcode";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { formatEnumLabel } from "@/lib/formatters";
import { getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { hasAdminAccess, isAuthenticated } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrActions } from "@/components/tools/qr-actions";
import { getToolQrPath, getToolQrPayload } from "@/lib/tool-qr";

type ToolDetailsPageProps = {
  params: { id: string };
};

export default async function ToolDetailsPage({ params }: ToolDetailsPageProps) {
  const locale = getLocaleFromCookie();
  const session = await getAuthSession();
  if (!isAuthenticated(session)) {
    redirect("/login");
  }

  const canManage = hasAdminAccess(session?.user.role);
  const tool = await prisma.tool.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      project: true,
    },
  });

  if (!tool) {
    notFound();
  }

  const qrPath = getToolQrPath(tool.id);
  const qrPayload = getToolQrPayload(tool.id);
  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    margin: 1,
    width: 300,
  });

  return (
    <section className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="page-title">{tool.name}</h2>
          <p className="page-subtitle">{pickLocaleText(locale, "Įrankio detalės ir QR kodas skenavimui.", "Tool details and QR code for scan-based access.")}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/tools">{pickLocaleText(locale, "Atgal į įrankius", "Back to tools")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{pickLocaleText(locale, "Detales", "Details")}</CardTitle>
            <CardDescription>{pickLocaleText(locale, "Pagrindinė įrankio informacija ir priskyrimo būklė.", "Core tool information and assignment status.")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-slate-500">{pickLocaleText(locale, "Inventoriaus numeris", "Inventory Number")}</p>
              <p className="mt-1 font-medium text-slate-900">{tool.inventoryNumber}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">{pickLocaleText(locale, "Statusas", "Status")}</p>
              <p className="mt-1 font-medium text-slate-900">{formatEnumLabel(tool.status)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">{pickLocaleText(locale, "Kategorija", "Category")}</p>
              <p className="mt-1 font-medium text-slate-900">{tool.category.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">{pickLocaleText(locale, "Projektas", "Project")}</p>
              <p className="mt-1 font-medium text-slate-900">
                {tool.project ? `${tool.project.code} - ${tool.project.name}` : pickLocaleText(locale, "Nepriskirta", "Unassigned")}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase text-slate-500">{pickLocaleText(locale, "Būklės pastabos", "Condition Notes")}</p>
              <p className="mt-1 text-slate-800">{tool.conditionNotes || pickLocaleText(locale, "Pastabų nėra", "No notes")}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase text-slate-500">QR Payload</p>
              <p className="mt-1 font-mono text-sm text-slate-800">{qrPayload}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>{pickLocaleText(locale, `Nuskenuokite, kad atidarytumėte įrankio įrašą ${qrPath}`, `Scan to open tool record at ${qrPath}`)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt={`QR for ${tool.name}`} className="mx-auto h-[220px] w-[220px] rounded border border-slate-200 p-2" />
            {canManage ? <QrActions dataUrl={qrDataUrl} fileName={`tool-${tool.inventoryNumber}-qr.png`} locale={locale} /> : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

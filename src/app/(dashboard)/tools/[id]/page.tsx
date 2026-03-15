import Link from "next/link";
import QRCode from "qrcode";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { formatEnumLabel } from "@/lib/formatters";
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
          <p className="page-subtitle">Irankio detales ir QR kodas skenavimui.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/tools">Atgal i irankius</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detales</CardTitle>
            <CardDescription>Pagrindine irankio informacija ir priskyrimo bukle.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-slate-500">Inventoriaus numeris</p>
              <p className="mt-1 font-medium text-slate-900">{tool.inventoryNumber}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Statusas</p>
              <p className="mt-1 font-medium text-slate-900">{formatEnumLabel(tool.status)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Kategorija</p>
              <p className="mt-1 font-medium text-slate-900">{tool.category.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Projektas</p>
              <p className="mt-1 font-medium text-slate-900">
                {tool.project ? `${tool.project.code} - ${tool.project.name}` : "Nepriskirta"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase text-slate-500">Bukles pastabos</p>
              <p className="mt-1 text-slate-800">{tool.conditionNotes || "Pastabu nera"}</p>
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
            <CardDescription>Nuskenuokite, kad atidarytumete irankio irasa {qrPath}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt={`QR for ${tool.name}`} className="mx-auto h-[220px] w-[220px] rounded border border-slate-200 p-2" />
            {canManage ? <QrActions dataUrl={qrDataUrl} fileName={`tool-${tool.inventoryNumber}-qr.png`} /> : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

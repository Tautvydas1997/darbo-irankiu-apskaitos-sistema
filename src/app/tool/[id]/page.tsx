import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { formatEnumLabel } from "@/lib/formatters";
import { getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanQuickActions } from "@/components/tools/scan-quick-actions";
import { getToolQrPayload } from "@/lib/tool-qr";

type PublicToolPageProps = {
  params: { id: string };
};

export default async function PublicToolPage({ params }: PublicToolPageProps) {
  const locale = getLocaleFromCookie();
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
  const qrDataUrl = await QRCode.toDataURL(getToolQrPayload(tool.id), {
    margin: 1,
    width: 180,
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <div className="page-shell">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{tool.name}</CardTitle>
            <CardDescription>{pickLocaleText(locale, "Paprastas puslapis darbui objekte ir greitiems veiksmams.", "Simple on-site view for fast worker actions.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2.5">
                <p>
                  <span className="font-medium text-slate-900">{pickLocaleText(locale, "Inventoriaus numeris:", "Inventory Number:")}</span> {tool.inventoryNumber}
                </p>
                <p>
                  <span className="font-medium text-slate-900">{pickLocaleText(locale, "Statusas:", "Status:")}</span> {formatEnumLabel(tool.status)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">{pickLocaleText(locale, "Kategorija:", "Category:")}</span> {tool.category.name}
                </p>
                <p>
                  <span className="font-medium text-slate-900">{pickLocaleText(locale, "Projektas:", "Project:")}</span>{" "}
                  {tool.project ? `${tool.project.code} - ${tool.project.name}` : pickLocaleText(locale, "Nepriskirta", "Unassigned")}
                </p>
                <p>
                  <span className="font-medium text-slate-900">{pickLocaleText(locale, "Bukles pastabos:", "Condition Notes:")}</span> {tool.conditionNotes || pickLocaleText(locale, "Pastabu nera", "No notes")}
                </p>
              </div>

              <div className="mx-auto w-fit rounded-lg border border-slate-200 p-2 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt={`QR preview for ${tool.name}`} className="h-[128px] w-[128px]" />
                <p className="mt-1 text-center text-[11px] text-slate-500">{pickLocaleText(locale, "QR perziura", "QR preview")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ScanQuickActions toolId={tool.id} locale={locale} />
      </div>
    </main>
  );
}

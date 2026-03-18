import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { getAuthSession } from "@/lib/auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import { pickLocaleText } from "@/lib/i18n/localize";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getToolQrPayload } from "@/lib/tool-qr";
import { Button } from "@/components/ui/button";
import { PrintSheetControls } from "@/components/tools/print-sheet-controls";

type PrintQrPageProps = {
  searchParams?: {
    ids?: string;
  };
};

function parseIds(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export default async function PrintQrPage({ searchParams }: PrintQrPageProps) {
  const session = await getAuthSession();
  if (!hasAdminAccess(session?.user.role)) {
    redirect("/login");
  }

  const locale = getLocaleFromCookie();
  const ids = parseIds(searchParams?.ids);

  const tools = ids.length
    ? await prisma.tool.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          name: true,
          inventoryNumber: true,
        },
      })
    : [];

  const toolsById = new Map(tools.map((tool) => [tool.id, tool]));
  const orderedTools = ids.map((id) => toolsById.get(id)).filter(Boolean) as typeof tools;

  const printableTools = await Promise.all(
    orderedTools.map(async (tool) => ({
      ...tool,
      qrDataUrl: await QRCode.toDataURL(getToolQrPayload(tool.id), {
        margin: 1,
        width: 220,
      }),
    }))
  );

  const idsParam = ids.join(",");

  return (
    <main className="min-h-screen bg-white px-3 py-3 print:p-0">
      <div className="no-print mx-auto mb-4 flex w-full max-w-[210mm] flex-wrap items-center gap-2">
        <PrintSheetControls locale={locale} />
        <Button asChild variant="outline">
          <Link href={`/api/tools/qr-print/pdf?ids=${encodeURIComponent(idsParam)}`}>
            {pickLocaleText(locale, "Atsisiųsti PDF", "Download PDF")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tools/qr-print">{pickLocaleText(locale, "Grįžti į QR kodus", "Back to QR codes")}</Link>
        </Button>
      </div>

      <div className="print-sheet mx-auto w-full max-w-[210mm] rounded-md border border-slate-200 bg-white p-3 shadow-sm print:border-none print:p-0 print:shadow-none">
        {printableTools.length === 0 ? (
          <p className="no-print p-2 text-sm text-slate-600">
            {pickLocaleText(locale, "Nėra pasirinktų įrankių spausdinimui.", "No tools selected for printing.")}
          </p>
        ) : (
          <div className="sticker-grid">
            {printableTools.map((tool) => (
              <article key={tool.id} className="sticker">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tool.qrDataUrl} alt={`QR for ${tool.name}`} className="sticker-qr" />
                <div className="sticker-meta">
                  <p className="sticker-name">{tool.name}</p>
                  <p className="sticker-inv">{tool.inventoryNumber}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }

        .sticker-grid {
          display: grid;
          grid-template-columns: repeat(3, 58mm);
          gap: 4mm;
          justify-content: center;
        }

        .sticker {
          width: 58mm;
          min-height: 35mm;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 2.5mm;
          display: grid;
          grid-template-columns: 22mm 1fr;
          align-items: center;
          gap: 2.5mm;
          break-inside: avoid;
          page-break-inside: avoid;
          background: #fff;
        }

        .sticker-qr {
          width: 20mm;
          height: 20mm;
          border: 1px solid #e2e8f0;
          border-radius: 3px;
          padding: 1mm;
          object-fit: contain;
          background: #fff;
        }

        .sticker-meta {
          min-width: 0;
        }

        .sticker-name {
          margin: 0;
          font-size: 10px;
          line-height: 1.25;
          font-weight: 600;
          color: #0f172a;
          word-break: break-word;
        }

        .sticker-inv {
          margin: 2px 0 0 0;
          font-size: 9px;
          line-height: 1.2;
          color: #334155;
          word-break: break-word;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          .print-sheet {
            max-width: none !important;
            width: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          body {
            background: white !important;
          }
        }
      `}</style>
    </main>
  );
}

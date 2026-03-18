"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type QrTool = {
  id: string;
  name: string;
  inventoryNumber: string;
};

type QrPrintBoardProps = {
  tools: QrTool[];
  locale: Locale;
};

export function QrPrintBoard({ tools, locale }: QrPrintBoardProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(tools.map((tool) => tool.id));

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allSelected = tools.length > 0 && selectedIds.length === tools.length;
  const selectedIdsParam = selectedIds.join(",");
  const printHref = selectedIdsParam ? `/print/qr?ids=${encodeURIComponent(selectedIdsParam)}` : "#";
  const downloadHref = selectedIdsParam
    ? `/api/tools/qr-print/pdf?ids=${encodeURIComponent(selectedIdsParam)}`
    : "#";

  const toggleTool = (toolId: string) => {
    setSelectedIds((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]));
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : tools.map((tool) => tool.id));
  };

  return (
    <section className="page-shell">
      <Card className="no-print">
        <CardHeader>
          <CardTitle>{pickLocaleText(locale, "QR kodų spauda", "QR code printing")}</CardTitle>
          <CardDescription>
            {pickLocaleText(
              locale,
              "Pasirinkite įrankius, tada atidarykite atskirą spausdinamą lapą be antraštės ir meniu.",
              "Select tools, then open a dedicated print sheet without dashboard header/sidebar."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={toggleAll}>
              {allSelected ? pickLocaleText(locale, "Nužymėti visus", "Unselect all") : pickLocaleText(locale, "Pažymėti visus", "Select all")}
            </Button>
            <Button asChild size="sm" disabled={selectedIds.length === 0}>
              <Link href={printHref} target="_blank">
                {pickLocaleText(locale, "Atidaryti spausdinimui", "Open print view")} ({selectedIds.length})
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" disabled={selectedIds.length === 0}>
              <Link href={downloadHref}>
                {pickLocaleText(locale, "Atsisiųsti PDF", "Download PDF")}
              </Link>
            </Button>
          </div>

          <div className="table-shell max-h-72 overflow-auto">
            <table className="app-table">
              <thead className="sticky top-0 bg-slate-50">
                <tr>
                  <th>{pickLocaleText(locale, "Pasirinkti", "Select")}</th>
                  <th>{pickLocaleText(locale, "Įrankio pavadinimas", "Tool Name")}</th>
                  <th>{pickLocaleText(locale, "Inventoriaus numeris", "Inventory Number")}</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => (
                  <tr key={tool.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedSet.has(tool.id)}
                        onChange={() => toggleTool(tool.id)}
                        aria-label={pickLocaleText(locale, `Pasirinkti ${tool.name}`, `Select ${tool.name}`)}
                      />
                    </td>
                    <td className="text-slate-800">{tool.name}</td>
                    <td className="text-slate-600">{tool.inventoryNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

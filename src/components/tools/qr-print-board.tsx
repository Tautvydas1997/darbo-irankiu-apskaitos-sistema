"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PrintableTool = {
  id: string;
  name: string;
  inventoryNumber: string;
  qrDataUrl: string;
};

type QrPrintBoardProps = {
  tools: PrintableTool[];
};

export function QrPrintBoard({ tools }: QrPrintBoardProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(tools.map((tool) => tool.id));

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedTools = tools.filter((tool) => selectedSet.has(tool.id));
  const allSelected = tools.length > 0 && selectedIds.length === tools.length;

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
          <CardTitle>QR lipduku spauda</CardTitle>
          <CardDescription>Pasirinkite irankius, kuriuos norite itraukti i spausdinimo lapa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={toggleAll}>
              {allSelected ? "Nuzymeti visus" : "Pazymeti visus"}
            </Button>
            <Button type="button" size="sm" onClick={() => window.print()} disabled={selectedIds.length === 0}>
              Spausdinti pazymetus ({selectedIds.length})
            </Button>
          </div>

          <div className="table-shell max-h-72 overflow-auto">
            <table className="app-table">
              <thead className="sticky top-0 bg-slate-50">
                <tr>
                  <th>Pasirinkti</th>
                  <th>Irankio pavadinimas</th>
                  <th>Inventoriaus numeris</th>
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
                        aria-label={`Pasirinkti ${tool.name}`}
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

      <div className="print-sheet mx-auto w-full max-w-[210mm] rounded-md border border-slate-200 bg-white p-3 shadow-sm print:border-none print:p-0 print:shadow-none">
        <div className="sticker-grid">
          {selectedTools.map((tool) => (
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
    </section>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type QrActionsProps = {
  dataUrl: string;
  fileName: string;
  locale: Locale;
};

export function QrActions({ dataUrl, fileName, locale }: QrActionsProps) {
  const downloadQr = () => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    link.click();
  };

  const printQr = () => {
    const printWindow = window.open("", "_blank", "width=640,height=720");
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${pickLocaleText(locale, "Spausdinti QR", "Print QR")}</title>
          <style>
            body { font-family: Arial, sans-serif; display: grid; place-items: center; margin: 0; height: 100vh; }
            .wrap { text-align: center; }
            img { width: 320px; height: 320px; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <img src="${dataUrl}" alt="Tool QR code" />
            <p>${fileName.replace(".png", "")}</p>
          </div>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex items-center gap-2">
      <Button type="button" size="sm" variant="outline" onClick={downloadQr}>
        {pickLocaleText(locale, "Atsisiusti QR", "Download QR")}
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={printQr}>
        {pickLocaleText(locale, "Spausdinti QR", "Print QR")}
      </Button>
    </div>
  );
}

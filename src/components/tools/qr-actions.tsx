"use client";

import { Button } from "@/components/ui/button";

type QrActionsProps = {
  dataUrl: string;
  fileName: string;
};

export function QrActions({ dataUrl, fileName }: QrActionsProps) {
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
          <title>Print QR</title>
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
        Download QR
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={printQr}>
        Print QR
      </Button>
    </div>
  );
}

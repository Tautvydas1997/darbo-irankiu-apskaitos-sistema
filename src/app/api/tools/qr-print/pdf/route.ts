import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getToolQrPayload } from "@/lib/tool-qr";

const MM_TO_PT = 72 / 25.4;
const PAGE_WIDTH = 210 * MM_TO_PT;
const PAGE_HEIGHT = 297 * MM_TO_PT;
const PAGE_MARGIN = 8 * MM_TO_PT;
const STICKER_WIDTH = 58 * MM_TO_PT;
const STICKER_HEIGHT = 35 * MM_TO_PT;
const GAP = 4 * MM_TO_PT;
const QR_SIZE = 20 * MM_TO_PT;
const QR_PADDING = 1.2 * MM_TO_PT;
const LEFT_PADDING = 2.5 * MM_TO_PT;
const TOP_PADDING = 2.5 * MM_TO_PT;

function parseIds(raw: string | null): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function dataUrlToPngBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  return Uint8Array.from(Buffer.from(base64, "base64"));
}

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!hasAdminAccess(session?.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const ids = parseIds(searchParams.get("ids"));
  if (ids.length === 0) {
    return NextResponse.json({ message: "No tools selected" }, { status: 400 });
  }

  const tools = await prisma.tool.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      inventoryNumber: true,
    },
  });
  const toolById = new Map(tools.map((tool) => [tool.id, tool]));
  const orderedTools = ids.map((id) => toolById.get(id)).filter(Boolean) as typeof tools;
  if (orderedTools.length === 0) {
    return NextResponse.json({ message: "No tools selected" }, { status: 400 });
  }

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const columns = 3;
  const rows = 8;
  const stickersPerPage = columns * rows;

  for (let start = 0; start < orderedTools.length; start += stickersPerPage) {
    const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    const batch = orderedTools.slice(start, start + stickersPerPage);

    for (let index = 0; index < batch.length; index += 1) {
      const tool = batch[index];
      const column = index % columns;
      const row = Math.floor(index / columns);

      const x = PAGE_MARGIN + column * (STICKER_WIDTH + GAP);
      const y = PAGE_HEIGHT - PAGE_MARGIN - (row + 1) * STICKER_HEIGHT - row * GAP;

      page.drawRectangle({
        x,
        y,
        width: STICKER_WIDTH,
        height: STICKER_HEIGHT,
        borderWidth: 1,
        borderColor: rgb(0.89, 0.91, 0.94),
      });

      const qrDataUrl = await QRCode.toDataURL(getToolQrPayload(tool.id), {
        margin: 1,
        width: 220,
      });
      const qrImage = await pdf.embedPng(dataUrlToPngBytes(qrDataUrl));

      const qrX = x + LEFT_PADDING + QR_PADDING;
      const qrY = y + STICKER_HEIGHT - TOP_PADDING - QR_SIZE - QR_PADDING;
      page.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: QR_SIZE,
        height: QR_SIZE,
      });

      const textX = x + LEFT_PADDING + 24 * MM_TO_PT;
      const nameY = y + STICKER_HEIGHT - TOP_PADDING - 8;
      const invY = nameY - 12;
      const maxTextWidth = STICKER_WIDTH - 26 * MM_TO_PT - LEFT_PADDING;

      const toolName = tool.name.length > 45 ? `${tool.name.slice(0, 42)}...` : tool.name;
      const inventoryNumber =
        tool.inventoryNumber.length > 28
          ? `${tool.inventoryNumber.slice(0, 25)}...`
          : tool.inventoryNumber;

      page.drawText(toolName, {
        x: textX,
        y: nameY,
        size: 8.6,
        font: fontBold,
        maxWidth: maxTextWidth,
      });
      page.drawText(inventoryNumber, {
        x: textX,
        y: invY,
        size: 8,
        font,
        maxWidth: maxTextWidth,
      });
    }
  }

  const pdfBytes = await pdf.save();
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="qr-kodai.pdf"',
      "Cache-Control": "no-store",
    },
  });
}

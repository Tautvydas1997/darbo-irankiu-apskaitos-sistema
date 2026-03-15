import { MobileQrScanner } from "@/components/scan/mobile-qr-scanner";
import { getLocaleFromCookie } from "@/lib/i18n";

export default function ScanPage() {
  const locale = getLocaleFromCookie();

  return (
    <main className="min-h-screen bg-transparent px-3 py-4 sm:px-4">
      <MobileQrScanner locale={locale} />
    </main>
  );
}

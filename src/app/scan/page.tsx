import { MobileQrScanner } from "@/components/scan/mobile-qr-scanner";

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-transparent px-3 py-4 sm:px-4">
      <MobileQrScanner />
    </main>
  );
}

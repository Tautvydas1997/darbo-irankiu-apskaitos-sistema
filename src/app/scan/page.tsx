import { MobileQrScanner } from "@/components/scan/mobile-qr-scanner";
import { EmployeeScanLogin } from "@/components/scan/employee-scan-login";
import { ScannerSessionControls } from "@/components/scan/scanner-session-controls";
import { getScannerSessionFromCookies } from "@/lib/employee-auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export default async function ScanPage() {
  const locale = getLocaleFromCookie();
  const scannerSession = getScannerSessionFromCookies();
  const employee = scannerSession
    ? await prisma.employeeUser.findFirst({
        where: { id: scannerSession.employeeUserId, isActive: true },
        select: {
          employeeId: true,
          firstName: true,
          lastName: true,
        },
      })
    : null;

  return (
    <main className="min-h-screen bg-transparent px-3 py-4 sm:px-4">
      {employee ? (
        <>
          <ScannerSessionControls locale={locale} employee={employee} />
          <MobileQrScanner locale={locale} />
        </>
      ) : (
        <EmployeeScanLogin locale={locale} />
      )}
    </main>
  );
}

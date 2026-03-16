"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type ScannerSessionControlsProps = {
  locale: Locale;
  employee: {
    employeeId: string;
    firstName: string;
    lastName: string;
  };
};

export function ScannerSessionControls({ locale, employee }: ScannerSessionControlsProps) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/scan-auth", { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="panel mx-auto mb-4 w-full max-w-md p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {pickLocaleText(locale, "Prisijunges darbuotojas", "Signed-in employee")}
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="text-xs text-slate-500">{employee.employeeId}</p>
        </div>
        <Button type="button" variant="outline" onClick={logout}>
          {pickLocaleText(locale, "Atsijungti", "Sign out")}
        </Button>
      </div>
    </div>
  );
}

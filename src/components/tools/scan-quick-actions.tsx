"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ComponentType } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type ScanQuickActionsProps = {
  toolId: string;
  locale: Locale;
  toolStatus: "IN_STORAGE" | "CHECKED_OUT" | "BROKEN" | "LOST" | "IN_REPAIR";
  scannerEmployee: {
    employeeId: string;
    firstName: string;
    lastName: string;
  } | null;
};

type QuickAction = "CHECK_OUT" | "RETURN" | "REPORT_BROKEN";

const ACTIONS: Array<{ key: QuickAction; icon: ComponentType<{ className?: string }> }> = [
  { key: "CHECK_OUT", icon: ClipboardCheck },
  { key: "RETURN", icon: CheckCircle2 },
  { key: "REPORT_BROKEN", icon: AlertTriangle },
];

export function ScanQuickActions({ toolId, locale, toolStatus, scannerEmployee }: ScanQuickActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<QuickAction | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [projectCode, setProjectCode] = useState("");
  const [notes, setNotes] = useState("");

  const isActionAllowed = (action: QuickAction) => {
    if (action === "CHECK_OUT") {
      return toolStatus === "IN_STORAGE";
    }
    if (action === "RETURN") {
      return toolStatus === "CHECKED_OUT" || toolStatus === "BROKEN";
    }
    return toolStatus === "CHECKED_OUT";
  };

  const actionDisabledReason = (action: QuickAction) => {
    if (isActionAllowed(action)) {
      return null;
    }
    if (action === "CHECK_OUT") {
      return pickLocaleText(
        locale,
        "Irankis jau paimtas arba nepasiekiamas. Pirma grazinkite ji i sandeli.",
        "Tool is already taken or unavailable. Return it to warehouse first."
      );
    }
    if (action === "RETURN") {
      return pickLocaleText(
        locale,
        "Grazinti galima tik paimta arba pazymeta sugedusia iranki.",
        "Only checked out or broken tools can be returned."
      );
    }
    return pickLocaleText(
      locale,
      "Gedima galima pranesti tik kai irankis yra paimtas.",
      "You can report broken only when the tool is checked out."
    );
  };

  const runAction = async (action: QuickAction) => {
    if (!scannerEmployee) {
      window.alert(pickLocaleText(locale, "Pirma prisijunkite skaitytuve su darbuotojo ID.", "Sign in with employee ID in scanner first."));
      return;
    }

    if (!isActionAllowed(action)) {
      window.alert(actionDisabledReason(action) ?? pickLocaleText(locale, "Veiksmas neleidziamas.", "Action is not allowed."));
      return;
    }

    if (!projectCode.trim()) {
      window.alert(pickLocaleText(locale, "Iveskite projekto koda.", "Please enter project code."));
      return;
    }

    setPendingAction(action);

    const response = await fetch(`/api/tools/${toolId}/quick-action`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        projectCode: projectCode.trim().toUpperCase(),
        notes: notes.trim() || null,
      }),
    });

    setPendingAction(null);

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { message?: string } | null;
      window.alert(error?.message ?? pickLocaleText(locale, "Greitas veiksmas nepavyko.", "Quick action failed."));
      return;
    }

    setSuccessMessage(
      pickLocaleText(
        locale,
        `Veiksmas "${itemLabel(action)}" sekmingai atliktas.`,
        `Action "${itemLabel(action)}" completed successfully.`
      )
    );
    router.refresh();
  };

  const itemLabel = (action: QuickAction) =>
    action === "CHECK_OUT"
      ? pickLocaleText(locale, "Paimti iranki", "Take tool")
      : action === "RETURN"
        ? pickLocaleText(locale, "Grazinti iranki", "Return tool")
        : pickLocaleText(locale, "Pranesti apie gedima", "Report broken");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pickLocaleText(locale, "Darbuotojo veiksmai", "Employee actions")}</CardTitle>
        <CardDescription>{pickLocaleText(locale, "Iveskite projekto koda ir pasirinkite veiksma.", "Enter project code and choose an action.")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {scannerEmployee ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">{pickLocaleText(locale, "Prisijunges darbuotojas", "Signed-in employee")}</p>
            <p className="text-sm font-medium text-slate-900">
              {scannerEmployee.firstName} {scannerEmployee.lastName}
            </p>
            <p className="text-xs text-slate-500">{scannerEmployee.employeeId}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            {pickLocaleText(
              locale,
              "Veiksmams atlikti pirmiausia prisijunkite skaitytuve su darbuotojo ID.",
              "Sign in with employee ID in scanner first to perform actions."
            )}
          </div>
        )}

        {successMessage ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm font-medium text-emerald-800">{successMessage}</p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                type="button"
                onClick={() => setSuccessMessage(null)}
              >
                OK
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/scan">
                  <ScanLine className="mr-2 h-4 w-4" />
                  {pickLocaleText(locale, "Skenuoti kita QR", "Scan another QR")}
                </Link>
              </Button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-2">
          <div className="form-field">
            <label htmlFor="projectCode" className="field-label">
              {pickLocaleText(locale, "Projekto kodas", "Project Code")}
            </label>
            <Input
              id="projectCode"
              value={projectCode}
              onChange={(event) => setProjectCode(event.target.value.toUpperCase())}
              placeholder="P2652"
            />
          </div>

          <div className="form-field sm:col-span-2">
            <label htmlFor="notes" className="field-label">
              {pickLocaleText(locale, "Pastabos (nebutina)", "Notes (optional)")}
            </label>
            <Input
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={pickLocaleText(locale, "Papildoma pastaba", "Additional note")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {ACTIONS.map((item) => {
            const Icon = item.icon;
            const loading = pendingAction === item.key;
            const disabledReason = actionDisabledReason(item.key);
            return (
              <div key={item.key} className="space-y-1">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 justify-start text-base"
                  onClick={() => runAction(item.key)}
                  disabled={Boolean(pendingAction) || Boolean(successMessage) || Boolean(disabledReason) || !scannerEmployee}
                  title={disabledReason ?? undefined}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {loading ? pickLocaleText(locale, "Saugoma...", "Saving...") : itemLabel(item.key)}
                </Button>
                {disabledReason ? (
                  <p className="px-1 text-xs text-amber-700">{disabledReason}</p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button asChild className="h-12 text-base">
            <Link href="/scan">
              <ScanLine className="mr-2 h-4 w-4" />
              {pickLocaleText(locale, "Skenuoti kita iranki", "Scan next tool")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ComponentType } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ScanQuickActionsProps = {
  toolId: string;
};

type QuickAction = "CHECK_OUT" | "RETURN" | "REPORT_BROKEN";

const ACTIONS: Array<{ key: QuickAction; label: string; icon: ComponentType<{ className?: string }> }> = [
  { key: "CHECK_OUT", label: "Paimti iranki", icon: ClipboardCheck },
  { key: "RETURN", label: "Grazinti iranki", icon: CheckCircle2 },
  { key: "REPORT_BROKEN", label: "Pranesti apie gedima", icon: AlertTriangle },
];

export function ScanQuickActions({ toolId }: ScanQuickActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<QuickAction | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [notes, setNotes] = useState("");

  const runAction = async (action: QuickAction) => {
    if (!firstName.trim() || !lastName.trim() || !projectCode.trim()) {
      window.alert("Iveskite varda, pavarde ir projekto koda.");
      return;
    }

    setPendingAction(action);

    const response = await fetch(`/api/tools/${toolId}/quick-action`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        projectCode: projectCode.trim().toUpperCase(),
        notes: notes.trim() || null,
      }),
    });

    setPendingAction(null);

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { message?: string } | null;
      window.alert(error?.message ?? "Greitas veiksmas nepavyko.");
      return;
    }

    setSuccessMessage(`Veiksmas "${itemLabel(action)}" sekmingai atliktas.`);
    router.refresh();
  };

  const itemLabel = (action: QuickAction) =>
    ACTIONS.find((item) => item.key === action)?.label ?? action;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Darbuotojo veiksmai</CardTitle>
        <CardDescription>Iveskite duomenis ir pasirinkite veiksma.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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
                  Skenuoti kita QR
                </Link>
              </Button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="form-field">
            <label htmlFor="firstName" className="field-label">
              Vardas
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Jonas"
            />
          </div>

          <div className="form-field">
            <label htmlFor="lastName" className="field-label">
              Pavarde
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Petrauskas"
            />
          </div>

          <div className="form-field sm:col-span-2">
            <label htmlFor="projectCode" className="field-label">
              Projekto kodas
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
              Pastabos (nebutina)
            </label>
            <Input
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Papildoma pastaba"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {ACTIONS.map((item) => {
            const Icon = item.icon;
            const loading = pendingAction === item.key;
            return (
              <Button
                key={item.key}
                type="button"
                variant="outline"
                className="h-12 justify-start text-base"
                onClick={() => runAction(item.key)}
                disabled={Boolean(pendingAction) || Boolean(successMessage)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {loading ? "Saugoma..." : item.label}
              </Button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button asChild className="h-12 text-base">
            <Link href="/scan">
              <ScanLine className="mr-2 h-4 w-4" />
              Skenuoti kita iranki
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

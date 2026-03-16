"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type EmployeeScanLoginProps = {
  locale: Locale;
  returnTo?: string;
};

export function EmployeeScanLogin({ locale, returnTo }: EmployeeScanLoginProps) {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/scan-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: employeeId.trim().toUpperCase() }),
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setErrorMessage(
          result?.message ??
            pickLocaleText(locale, "Nepavyko prisijungti prie skaitytuvo.", "Failed to sign in to scanner.")
        );
        return;
      }

      if (returnTo) {
        router.push(returnTo);
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage(
        pickLocaleText(
          locale,
          "Nepavyko susisiekti su serveriu. Patikrinkite rysi ir bandykite dar karta.",
          "Unable to reach server. Check your connection and try again."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{pickLocaleText(locale, "Skaitytuvo prisijungimas", "Scanner sign-in")}</CardTitle>
        <CardDescription>
          {pickLocaleText(
            locale,
            "Iveskite savo darbuotojo ID, kad aktyvuotumete QR skaitytuva.",
            "Enter your employee ID to unlock the QR scanner."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="employeeId" className="field-label">
              {pickLocaleText(locale, "Darbuotojo ID", "Employee ID")}
            </label>
            <Input
              id="employeeId"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value.toUpperCase())}
              placeholder="EMP-0001"
              required
            />
          </div>

          {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? pickLocaleText(locale, "Tikrinama...", "Checking...")
              : pickLocaleText(locale, "Testi i skaitytuva", "Continue to scanner")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

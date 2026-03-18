"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type ProfileSettingsFormProps = {
  locale: Locale;
  initialValues: {
    name: string;
    email: string;
    language: "lt" | "en";
  };
};

type FormValues = {
  name: string;
  email: string;
  language: "lt" | "en";
  currentPassword: string;
  newPassword: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string[]>>;

export function ProfileSettingsForm({ locale, initialValues }: ProfileSettingsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    name: initialValues.name,
    email: initialValues.email,
    language: initialValues.language,
    currentPassword: "",
    newPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const setFieldValue = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFieldErrors({});
    setSubmitError(null);
    setSuccessMessage(null);

    const response = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = (await response.json().catch(() => null)) as
      | { message?: string; fieldErrors?: FieldErrors; nextLanguage?: "lt" | "en" }
      | null;

    if (!response.ok) {
      if (result?.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
      setSubmitError(
        result?.message ??
          pickLocaleText(locale, "Nepavyko išsaugoti profilio nustatymų.", "Failed to save profile settings.")
      );
      setIsSaving(false);
      return;
    }

    const nextLanguage = result?.nextLanguage ?? values.language;
    document.cookie = `locale=${nextLanguage}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    setValues((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
    }));
    setSuccessMessage(
      pickLocaleText(locale, "Profilio nustatymai sėkmingai išsaugoti.", "Profile settings saved successfully.")
    );
    setIsSaving(false);
    router.refresh();
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{pickLocaleText(locale, "Mano profilis", "My profile")}</CardTitle>
        <CardDescription>
          {pickLocaleText(
            locale,
            "Pakeitimai taikomi jūsų administratoriaus paskyrai.",
            "Changes apply to your administrator account."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name" className="field-label">
                {pickLocaleText(locale, "Vardas ir pavardė", "Full name")}
              </label>
              <Input
                id="name"
                value={values.name}
                onChange={(event) => setFieldValue("name", event.target.value)}
                required
              />
              {fieldErrors.name?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.name[0]}</p> : null}
            </div>

            <div className="form-field">
              <label htmlFor="email" className="field-label">
                {pickLocaleText(locale, "El. paštas", "Email")}
              </label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(event) => setFieldValue("email", event.target.value)}
                required
              />
              {fieldErrors.email?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.email[0]}</p> : null}
            </div>

            <div className="form-field">
              <label htmlFor="language" className="field-label">
                {pickLocaleText(locale, "Kalba", "Language")}
              </label>
              <select
                id="language"
                className="app-select"
                value={values.language}
                onChange={(event) => setFieldValue("language", event.target.value)}
              >
                <option value="lt">Lietuvių</option>
                <option value="en">English</option>
              </select>
              {fieldErrors.language?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.language[0]}</p> : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
            <div className="form-field">
              <label htmlFor="currentPassword" className="field-label">
                {pickLocaleText(locale, "Dabartinis slaptažodis", "Current password")}
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={values.currentPassword}
                onChange={(event) => setFieldValue("currentPassword", event.target.value)}
                placeholder={pickLocaleText(locale, "Palikite tuščią, jei nekeičiate", "Leave blank if unchanged")}
              />
              {fieldErrors.currentPassword?.[0] ? (
                <p className="text-sm text-rose-600">{fieldErrors.currentPassword[0]}</p>
              ) : null}
            </div>

            <div className="form-field">
              <label htmlFor="newPassword" className="field-label">
                {pickLocaleText(locale, "Naujas slaptažodis", "New password")}
              </label>
              <Input
                id="newPassword"
                type="password"
                value={values.newPassword}
                onChange={(event) => setFieldValue("newPassword", event.target.value)}
                placeholder={pickLocaleText(locale, "Mažiausiai 8 simboliai", "At least 8 characters")}
              />
              {fieldErrors.newPassword?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.newPassword[0]}</p> : null}
            </div>
          </div>

          {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? pickLocaleText(locale, "Saugoma...", "Saving...")
                : pickLocaleText(locale, "Išsaugoti nustatymus", "Save settings")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

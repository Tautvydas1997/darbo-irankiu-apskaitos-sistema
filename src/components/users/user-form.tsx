"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type UserFormValues = {
  employeeId: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
};

type UserFormProps = {
  mode: "create" | "edit";
  locale: Locale;
  userId?: string;
  initialValues?: UserFormValues;
};

type FieldErrors = Partial<Record<keyof UserFormValues, string[]>>;

const DEFAULT_VALUES: UserFormValues = {
  employeeId: "",
  firstName: "",
  lastName: "",
  isActive: true,
};

export function UserForm({ mode, locale, userId, initialValues }: UserFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<UserFormValues>(initialValues ?? DEFAULT_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof UserFormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSubmitError(null);
    setFieldErrors({});

    const isEdit = mode === "edit";
    const url = isEdit ? `/api/users/${userId}` : "/api/users";
    const method = isEdit ? "PATCH" : "POST";
    const payload = {
      ...values,
      employeeId: values.employeeId.trim().toUpperCase(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
    };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json().catch(() => null)) as
      | { fieldErrors?: FieldErrors; message?: string }
      | null;

    if (!response.ok) {
      if (result?.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
      setSubmitError(result?.message ?? pickLocaleText(locale, "Nepavyko išsaugoti darbuotojo.", "Failed to save employee."));
      setIsSaving(false);
      return;
    }

    router.push("/users");
    router.refresh();
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? pickLocaleText(locale, "Kurti darbuotoją", "Create employee") : pickLocaleText(locale, "Redaguoti darbuotoją", "Edit employee")}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? pickLocaleText(locale, "Sukurkite darbuotojo paskyra su unikaliu ID skeneriui.", "Create an employee account with unique scanner ID.")
            : pickLocaleText(locale, "Atnaujinkite darbuotojo duomenis ir prieiga prie skenerio.", "Update employee details and scanner access.")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="employeeId" className="field-label">
              {pickLocaleText(locale, "Darbuotojo ID", "Employee ID")}
            </label>
            <Input
              id="employeeId"
              value={values.employeeId}
              onChange={(event) => handleChange("employeeId", event.target.value.toUpperCase())}
              placeholder="EMP-0001"
              required
            />
            {fieldErrors.employeeId?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.employeeId[0]}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="firstName" className="field-label">
              {pickLocaleText(locale, "Vardas", "First name")}
            </label>
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(event) => handleChange("firstName", event.target.value)}
              placeholder="Jonas"
              required
            />
            {fieldErrors.firstName?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.firstName[0]}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="lastName" className="field-label">
              {pickLocaleText(locale, "Pavarde", "Last name")}
            </label>
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(event) => handleChange("lastName", event.target.value)}
              placeholder="Petrauskas"
              required
            />
            {fieldErrors.lastName?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.lastName[0]}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="isActive" className="field-label">
              {pickLocaleText(locale, "Busena", "Status")}
            </label>
            <select
              id="isActive"
              className="app-select h-11"
              value={values.isActive ? "active" : "inactive"}
              onChange={(event) => handleChange("isActive", event.target.value === "active")}
            >
              <option value="active">{pickLocaleText(locale, "Aktyvus", "Active")}</option>
              <option value="inactive">{pickLocaleText(locale, "Neaktyvus", "Inactive")}</option>
            </select>
          </div>

          {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? pickLocaleText(locale, "Saugoma...", "Saving...")
                : mode === "create"
                  ? pickLocaleText(locale, "Kurti darbuotoją", "Create employee")
                  : pickLocaleText(locale, "Išsaugoti pakeitimus", "Save changes")}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/users")}>
              {pickLocaleText(locale, "Atšaukti", "Cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

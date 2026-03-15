"use client";

import { ToolStatus } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type OptionItem = {
  id: string;
  label: string;
};

type ToolFormValues = {
  name: string;
  inventoryNumber: string;
  status: ToolStatus;
  categoryId: string;
  projectId: string;
  conditionNotes: string;
};

type ToolFormProps = {
  mode: "create" | "edit";
  toolId?: string;
  categories: OptionItem[];
  projects: OptionItem[];
  initialValues?: ToolFormValues;
};

type FieldErrors = Partial<Record<keyof ToolFormValues, string[]>>;

const TOOL_STATUS_OPTIONS: ToolStatus[] = [
  ToolStatus.IN_STORAGE,
  ToolStatus.CHECKED_OUT,
  ToolStatus.BROKEN,
  ToolStatus.LOST,
  ToolStatus.IN_REPAIR,
];

const DEFAULT_VALUES: ToolFormValues = {
  name: "",
  inventoryNumber: "",
  status: ToolStatus.IN_STORAGE,
  categoryId: "",
  projectId: "",
  conditionNotes: "",
};

export function ToolForm({ mode, toolId, categories, projects, initialValues }: ToolFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ToolFormValues>(initialValues ?? DEFAULT_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateValue = (field: keyof ToolFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSubmitError(null);
    setFieldErrors({});

    const isEdit = mode === "edit";
    const url = isEdit ? `/api/tools/${toolId}` : "/api/tools";
    const method = isEdit ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        projectId: values.projectId || null,
        conditionNotes: values.conditionNotes || null,
      }),
    });

    const result = (await response.json().catch(() => null)) as
      | { fieldErrors?: FieldErrors; message?: string }
      | null;

    if (!response.ok) {
      if (result?.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
      setSubmitError(result?.message ?? "Nepavyko issaugoti irankio.");
      setIsSaving(false);
      return;
    }

    router.push("/tools");
    router.refresh();
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Kurti iranki" : "Redaguoti iranki"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Uzregistruokite nauja iranki apskaitos sistemoje."
            : "Atnaujinkite irankio duomenis, priskyrima ir statusa."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name" className="field-label">
                Pavadinimas
              </label>
              <Input id="name" value={values.name} onChange={(event) => updateValue("name", event.target.value)} required />
              {fieldErrors.name?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.name[0]}</p> : null}
            </div>

            <div className="form-field">
              <label htmlFor="inventoryNumber" className="field-label">
                Inventoriaus numeris
              </label>
              <Input
                id="inventoryNumber"
                value={values.inventoryNumber}
                onChange={(event) => updateValue("inventoryNumber", event.target.value)}
                required
              />
              {fieldErrors.inventoryNumber?.[0] ? (
                <p className="text-sm text-rose-600">{fieldErrors.inventoryNumber[0]}</p>
              ) : null}
            </div>

            <div className="form-field">
              <label htmlFor="status" className="field-label">
                Statusas
              </label>
              <select
                id="status"
                className="app-select"
                value={values.status}
                onChange={(event) => updateValue("status", event.target.value)}
                required
              >
                {TOOL_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="categoryId" className="field-label">
                Kategorija
              </label>
              <select
                id="categoryId"
                className="app-select"
                value={values.categoryId}
                onChange={(event) => updateValue("categoryId", event.target.value)}
                required
              >
                <option value="">Pasirinkite kategorija</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryId?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.categoryId[0]}</p> : null}
            </div>

            <div className="form-field">
              <label htmlFor="projectId" className="field-label">
                Projektas
              </label>
              <select
                id="projectId"
                className="app-select"
                value={values.projectId}
                onChange={(event) => updateValue("projectId", event.target.value)}
              >
                <option value="">Nepriskirta</option>
                {projects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="conditionNotes" className="field-label">
              Bukles pastabos
            </label>
            <textarea
              id="conditionNotes"
              className="app-textarea"
              value={values.conditionNotes}
              onChange={(event) => updateValue("conditionNotes", event.target.value)}
              placeholder="Papildomos pastabos apie esama irankio bukle"
            />
            {fieldErrors.conditionNotes?.[0] ? (
              <p className="text-sm text-rose-600">{fieldErrors.conditionNotes[0]}</p>
            ) : null}
          </div>

          {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saugoma..." : mode === "create" ? "Kurti iranki" : "Issaugoti pakeitimus"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/tools")}>
              Atsaukti
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ProjectFormValues = {
  code: string;
  name: string;
  location: string;
};

type ProjectFormProps = {
  mode: "create" | "edit";
  projectId?: string;
  initialValues?: ProjectFormValues;
};

type FieldErrors = Partial<Record<keyof ProjectFormValues, string[]>>;

const DEFAULT_VALUES: ProjectFormValues = {
  code: "",
  name: "",
  location: "",
};

export function ProjectForm({ mode, projectId, initialValues }: ProjectFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectFormValues>(initialValues ?? DEFAULT_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof ProjectFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSubmitError(null);
    setFieldErrors({});

    const isEdit = mode === "edit";
    const url = isEdit ? `/api/projects/${projectId}` : "/api/projects";
    const method = isEdit ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = (await response.json().catch(() => null)) as
      | { fieldErrors?: FieldErrors; message?: string }
      | null;

    if (!response.ok) {
      if (result?.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
      setSubmitError(result?.message ?? "Failed to save project.");
      setIsSaving(false);
      return;
    }

    router.push("/projects");
    router.refresh();
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create project" : "Edit project"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Create a new project and assign tools to it."
            : "Update project details used by inventory operations."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="code" className="field-label">
              Code
            </label>
            <Input
              id="code"
              value={values.code}
              onChange={(event) => handleChange("code", event.target.value)}
              placeholder="P2652"
              required
            />
            {fieldErrors.code?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.code[0]}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="name" className="field-label">
              Name
            </label>
            <Input
              id="name"
              value={values.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Vilnius Office Build"
              required
            />
            {fieldErrors.name?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.name[0]}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="location" className="field-label">
              Location
            </label>
            <Input
              id="location"
              value={values.location}
              onChange={(event) => handleChange("location", event.target.value)}
              placeholder="Vilnius"
              required
            />
            {fieldErrors.location?.[0] ? <p className="text-sm text-rose-600">{fieldErrors.location[0]}</p> : null}
          </div>

          {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : mode === "create" ? "Create project" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/projects")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

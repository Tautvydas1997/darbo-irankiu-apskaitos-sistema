"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type DeleteProjectButtonProps = {
  projectId: string;
  locale: Locale;
};

export function DeleteProjectButton({ projectId, locale }: DeleteProjectButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(pickLocaleText(locale, "Ar tikrai norite ištrinti šį projektą?", "Delete this project?"));
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert(pickLocaleText(locale, "Nepavyko ištrinti projekto.", "Failed to delete project."));
      return;
    }

    router.refresh();
  };

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleDelete}>
      {pickLocaleText(locale, "Ištrinti", "Delete")}
    </Button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type DeleteToolButtonProps = {
  toolId: string;
  locale: Locale;
};

export function DeleteToolButton({ toolId, locale }: DeleteToolButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(pickLocaleText(locale, "Ar tikrai norite ištrinti šį įrankį?", "Delete this tool?"));
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/tools/${toolId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert(pickLocaleText(locale, "Nepavyko ištrinti įrankio.", "Failed to delete tool."));
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

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type DeleteUserButtonProps = {
  userId: string;
  locale: Locale;
};

export function DeleteUserButton({ userId, locale }: DeleteUserButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      pickLocaleText(locale, "Ar tikrai norite istrinti si darbuotoja?", "Delete this employee?")
    );
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      window.alert(pickLocaleText(locale, "Nepavyko istrinti darbuotojo.", "Failed to delete employee."));
      return;
    }

    router.refresh();
  };

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleDelete}>
      {pickLocaleText(locale, "Istrinti", "Delete")}
    </Button>
  );
}

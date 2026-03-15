"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type DeleteToolButtonProps = {
  toolId: string;
};

export function DeleteToolButton({ toolId }: DeleteToolButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Ar tikrai norite istrinti si iranki?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/tools/${toolId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert("Nepavyko istrinti irankio.");
      return;
    }

    router.refresh();
  };

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleDelete}>
      Istrinti
    </Button>
  );
}

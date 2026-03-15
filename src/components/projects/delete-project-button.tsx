"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type DeleteProjectButtonProps = {
  projectId: string;
};

export function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Ar tikrai norite istrinti si projekta?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert("Nepavyko istrinti projekto.");
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

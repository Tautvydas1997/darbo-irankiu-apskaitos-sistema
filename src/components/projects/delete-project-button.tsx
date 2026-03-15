"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type DeleteProjectButtonProps = {
  projectId: string;
};

export function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert("Failed to delete project.");
      return;
    }

    router.refresh();
  };

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleDelete}>
      Delete
    </Button>
  );
}

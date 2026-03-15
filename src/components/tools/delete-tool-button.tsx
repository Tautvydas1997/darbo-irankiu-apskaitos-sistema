"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type DeleteToolButtonProps = {
  toolId: string;
};

export function DeleteToolButton({ toolId }: DeleteToolButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this tool?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/tools/${toolId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert("Failed to delete tool.");
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

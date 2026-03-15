"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  label: string;
};

export function LogoutButton({ label }: LogoutButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
    >
      {label}
    </Button>
  );
}

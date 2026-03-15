import type { Session } from "next-auth";
import { AUTH_BYPASS } from "@/lib/env";

export function hasAdminAccess(role?: string | null): boolean {
  return AUTH_BYPASS || role === "ADMIN";
}

export function isAuthenticated(session: Session | null): boolean {
  return AUTH_BYPASS || Boolean(session);
}

export function hasAuthenticatedActor(session: Session | null): boolean {
  return AUTH_BYPASS || Boolean(session?.user?.id);
}

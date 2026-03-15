import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AUTH_BYPASS } from "@/lib/env";

export default async function HomePage() {
  if (AUTH_BYPASS) {
    redirect("/dashboard");
  }

  const session = await getAuthSession();
  redirect(session ? "/dashboard" : "/login");
}

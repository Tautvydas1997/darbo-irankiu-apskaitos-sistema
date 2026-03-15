import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getAuthSession } from "@/lib/auth";
import { AUTH_BYPASS } from "@/lib/env";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";

export default async function LoginPage() {
  if (AUTH_BYPASS) {
    redirect("/dashboard");
  }

  const session = await getAuthSession();
  if (session) {
    redirect("/dashboard");
  }

  const locale = getLocaleFromCookie();
  const dictionary = getDictionary(locale);

  return <LoginForm dictionary={dictionary} />;
}

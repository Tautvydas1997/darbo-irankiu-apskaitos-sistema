"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLocale = async (nextLocale: Locale) => {
    const response = await fetch("/api/settings/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: nextLocale }),
    });

    // Update browser cookie immediately for predictable re-render.
    document.cookie = `locale=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Keep UI responsive even if preference API returns non-OK.
    if (!response.ok) {
      console.warn("Language preference API failed, using cookie fallback.");
    }

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant={locale === "lt" ? "default" : "outline"}
        disabled={isPending}
        onClick={() => setLocale("lt")}
      >
        LT
      </Button>
      <Button
        type="button"
        size="sm"
        variant={locale === "en" ? "default" : "outline"}
        disabled={isPending}
        onClick={() => setLocale("en")}
      >
        EN
      </Button>
    </div>
  );
}

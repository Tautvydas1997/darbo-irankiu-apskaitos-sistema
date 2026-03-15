import type { Locale } from "@/lib/i18n/config";

export function pickLocaleText(locale: Locale, lt: string, en: string): string {
  return locale === "lt" ? lt : en;
}


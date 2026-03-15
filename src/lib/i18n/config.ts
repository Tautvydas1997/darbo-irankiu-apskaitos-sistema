export const locales = ["lt", "en"] as const;
export const defaultLocale = "lt" as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  lt: "Lietuviu",
  en: "English",
};

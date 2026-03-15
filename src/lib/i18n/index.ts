import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "./config";
import { en } from "./messages/en";
import { lt } from "./messages/lt";

const dictionaries = {
  lt,
  en,
};

export type Dictionary = typeof lt;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromCookie(): Locale {
  const locale = cookies().get("locale")?.value;
  if (locale && isLocale(locale)) {
    return locale;
  }

  return defaultLocale;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

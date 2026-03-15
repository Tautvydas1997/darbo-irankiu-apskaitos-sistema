import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function ProfileSettingsPage() {
  const locale = getLocaleFromCookie();
  const dictionary = getDictionary(locale);
  return <PlaceholderPage title={dictionary.common.settings} />;
}

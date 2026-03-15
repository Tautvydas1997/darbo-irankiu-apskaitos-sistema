import type { Metadata } from "next";
import "./globals.css";
import { AppSessionProvider } from "@/components/providers/session-provider";
import { getLocaleFromCookie } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Darbo irankiu apskaita",
  description: "Darbo irankiu apskaitos valdymo sistema",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocaleFromCookie();

  return (
    <html lang={locale}>
      <body>
        <AppSessionProvider>{children}</AppSessionProvider>
      </body>
    </html>
  );
}

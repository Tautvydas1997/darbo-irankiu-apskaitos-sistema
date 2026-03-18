"use client";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { pickLocaleText } from "@/lib/i18n/localize";

type PrintSheetControlsProps = {
  locale: Locale;
};

export function PrintSheetControls({ locale }: PrintSheetControlsProps) {
  return (
    <Button type="button" onClick={() => window.print()}>
      {pickLocaleText(locale, "Spausdinti", "Print")}
    </Button>
  );
}

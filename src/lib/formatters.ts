export function formatEnumLabel(value: string): string {
  const ltMap: Record<string, string> = {
    IN_STORAGE: "Sandelyje",
    CHECKED_OUT: "Paimtas",
    BROKEN: "Sugedes",
    LOST: "Prarastas",
    IN_REPAIR: "Taisomas",
    CHECK_OUT: "Paimti",
    RETURN: "Grazinti",
    REPORT_BROKEN: "Pranesti apie gedima",
    ADMIN: "Administratorius",
  };

  if (ltMap[value]) {
    return ltMap[value];
  }

  return value
    .split("_")
    .map((part) => `${part.charAt(0)}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

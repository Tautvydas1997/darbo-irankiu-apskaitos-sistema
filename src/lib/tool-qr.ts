export function getToolQrPath(toolId: string): string {
  return `/tool/${toolId}`;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function getAppBaseUrl(): string {
  const rawBaseUrl = process.env.APP_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return normalizeBaseUrl(rawBaseUrl);
}

export function getToolQrPayload(toolId: string): string {
  return `${getAppBaseUrl()}${getToolQrPath(toolId)}`;
}

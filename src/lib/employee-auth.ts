import type { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const SCANNER_SESSION_COOKIE = "scanner_employee_session";

export type ScannerEmployeeSession = {
  employeeUserId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
};

function encodeSession(session: ScannerEmployeeSession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodeSession(rawValue: string): ScannerEmployeeSession | null {
  try {
    const decoded = Buffer.from(rawValue, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as Partial<ScannerEmployeeSession>;
    if (
      !parsed ||
      typeof parsed.employeeUserId !== "string" ||
      typeof parsed.employeeId !== "string" ||
      typeof parsed.firstName !== "string" ||
      typeof parsed.lastName !== "string"
    ) {
      return null;
    }

    return {
      employeeUserId: parsed.employeeUserId,
      employeeId: parsed.employeeId,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
    };
  } catch {
    return null;
  }
}

export function getScannerSessionFromCookies(): ScannerEmployeeSession | null {
  const rawValue = cookies().get(SCANNER_SESSION_COOKIE)?.value;
  if (!rawValue) {
    return null;
  }

  return decodeSession(rawValue);
}

export function setScannerSessionCookie(response: NextResponse, session: ScannerEmployeeSession) {
  response.cookies.set(SCANNER_SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function clearScannerSessionCookie(response: NextResponse) {
  response.cookies.set(SCANNER_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

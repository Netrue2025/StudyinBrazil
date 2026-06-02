import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const cookieName = "sib_admin";

function sessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET || "local-dev-secret";
  const password = process.env.ADMIN_PASSWORD || "change-me";
  return crypto.createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export function isAdmin() {
  return cookies().get(cookieName)?.value === sessionToken();
}

export function requireAdmin() {
  if (!isAdmin()) redirect("/admin/login");
}

export function loginAdmin(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "change-me";
  if (password !== expected) return false;
  cookies().set(cookieName, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });
  return true;
}

export function logoutAdmin() {
  cookies().delete(cookieName);
}

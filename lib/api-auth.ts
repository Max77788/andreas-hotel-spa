import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AdminSession } from "@/lib/auth";

/**
 * Shared auth helpers for CMS API routes.
 *
 * Usage in any route handler:
 *   const session = await requireAuth(req);
 *   if (session instanceof NextResponse) return session;
 *
 * Or for admin-only routes:
 *   const session = await requireAdmin(req);
 *   if (session instanceof NextResponse) return session;
 */

/** Require authenticated session (any role). */
export async function requireAuth(
  req: NextRequest
): Promise<AdminSession | NextResponse> {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

/** Require admin role session. */
export async function requireAdmin(
  req: NextRequest
): Promise<AdminSession | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
  }
  return result;
}

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { createSessionToken, sessionCookie } from "@/lib/auth";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Helper: call Convex action by string reference
async function callAction(path: string, args: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (convex as any).action(path, args) as Promise<any>;
}

async function callQuery(path: string, args: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (convex as any).query(path, args) as Promise<any>;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await callAction("adminUsers:verifyPassword", { email, password });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const token = await createSessionToken(result.user);
    const resp = NextResponse.json({
      success: true,
      user: { name: result.user.name, email: result.user.email, role: result.user.role },
    });
    resp.headers.set("Set-Cookie", sessionCookie(token));
    return resp;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

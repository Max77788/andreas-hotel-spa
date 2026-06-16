import { NextRequest, NextResponse } from "next/server";
import { verifyLogin } from "@/lib/admin-store";
import { createSessionToken, sessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await verifyLogin(email, password);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const token = await createSessionToken(result.user);
    const resp = NextResponse.json({
      success: true,
      user: {
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
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

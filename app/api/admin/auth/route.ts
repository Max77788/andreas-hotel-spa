import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_PASSWORD) {
    const resp = NextResponse.json({ success: true });
    resp.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return resp;
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

export async function GET() {
  return NextResponse.json({ status: "auth endpoint" });
}

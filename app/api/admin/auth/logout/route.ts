import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const resp = NextResponse.json({ success: true });
  resp.headers.set("Set-Cookie", clearSessionCookie());
  return resp;
}

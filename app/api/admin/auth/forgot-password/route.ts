import { NextRequest, NextResponse } from "next/server";
import { generateResetToken } from "@/lib/admin-store";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await generateResetToken(email);

    // Send reset email if OTP endpoint configured
    if (result && process.env.OTP_ENDPOINT) {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://stayatandreas.com";
      const resetUrl = `${baseUrl}/admin/reset-password?token=${result.token}`;

      await fetch(process.env.OTP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: result.token,
          chatId: process.env.CHAT_ID,
          appName: "Andreas CMS",
          secretKey: process.env.SECRET_KEY,
          subject: "Reset your Andreas CMS password",
          body: `Click here to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
        }),
      });
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { requireAdmin } from "@/lib/api-auth";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * POST /api/admin/users/reset-password
 * Admin-triggered: generates a reset token and returns the reset URL.
 * Requires admin role.
 */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await (convex as any).action("adminUsers:generateResetToken", {
      email: email.toLowerCase().trim(),
    });

    if (!result.token || !result.user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://stayatandreas.com";
    const resetUrl = `${baseUrl}/admin/reset-password?token=${result.token}`;

    // Send email via OTP endpoint if configured
    if (process.env.OTP_ENDPOINT) {
      try {
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
            body: `A CMS admin has sent you a password reset link.\n\nClick here to set your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
          }),
        });
      } catch (e) {
        console.error("Failed to send reset email:", e);
      }
    }

    return NextResponse.json({
      success: true,
      resetUrl,
      message: `Reset link generated for ${email}`,
    });
  } catch (err: any) {
    console.error("Admin reset password error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate reset link" },
      { status: 500 }
    );
  }
}

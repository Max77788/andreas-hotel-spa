import { NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT_EMAIL = process.env.CONTACT_FORM_RECIPIENT || "stay@andreashotel.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      // Log the submission for now - email not configured
      console.log("[Contact Form Submission]", { name, email, phone, message });
      return NextResponse.json(
        { success: true, note: "Email delivery not configured (missing RESEND_API_KEY). Check server logs." },
        { status: 200 }
      );
    }

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "Andreas Hotel <stay@andreashotel.com>",
      to: RECIPIENT_EMAIL,
      subject: `New Contact Form: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f5f0e8; padding: 40px;">
          <h2 style="color: #2a2118; font-weight: 300; border-bottom: 2px solid #c9a96e; padding-bottom: 12px; margin-bottom: 24px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #2a2118; font-weight: 600; width: 100px;">Name</td>
              <td style="padding: 10px 0; color: #2a2118;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #2a2118; font-weight: 600;">Email</td>
              <td style="padding: 10px 0; color: #2a2118;"><a href="mailto:${email}" style="color: #b8743d;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #2a2118; font-weight: 600;">Phone</td>
              <td style="padding: 10px 0; color: #2a2118;">${phone || "Not provided"}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #fff; border-left: 3px solid #c9a96e;">
            <p style="color: #2a2118; line-height: 1.6; margin: 0;">${message}</p>
          </div>
          <p style="margin-top: 24px; color: #2a2118; opacity: 0.5; font-size: 12px;">
            Sent from Andreas Hotel & Spa website — ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contact Form Error]", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or call us directly." },
      { status: 500 }
    );
  }
}

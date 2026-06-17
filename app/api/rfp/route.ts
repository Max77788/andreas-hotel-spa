import { NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT_EMAIL = process.env.CONTACT_FORM_RECIPIENT || "stay@andreashotel.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      organization,
      contactName,
      email,
      phone,
      eventType,
      guestCount,
      preferredDates,
      budget,
      requirements,
    } = body;

    if (!contactName || !email) {
      return NextResponse.json(
        { error: "Contact name and email are required" },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log("[RFP Form Submission]", JSON.stringify(body, null, 2));
      return NextResponse.json(
        { success: true, note: "Email delivery not configured (missing RESEND_API_KEY). Check server logs." },
        { status: 200 }
      );
    }

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "Andreas Hotel <events@email.mom-ai-agency.site>",
      to: RECIPIENT_EMAIL,
      subject: `New RFP: ${organization || contactName} — ${eventType || "Event Inquiry"}`,
      replyTo: email,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f5f0e8; padding: 40px;">
          <h2 style="color: #2a2118; font-weight: 300; border-bottom: 2px solid #c9a96e; padding-bottom: 12px; margin-bottom: 24px;">
            New RFP / Event Inquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #2a2118; font-weight: 600; width: 150px;">Organization</td><td style="padding: 8px 0; color: #2a2118;">${organization || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; color: #2a2118; font-weight: 600;">Contact Name</td><td style="padding: 8px 0; color: #2a2118;">${contactName}</td></tr>
            <tr><td style="padding: 8px 0; color: #2a2118; font-weight: 600;">Email</td><td style="padding: 8px 0; color: #2a2118;"><a href="mailto:${email}" style="color: #b8743d;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #2a2118; font-weight: 600;">Phone</td><td style="padding: 8px 0; color: #2a2118;">${phone || "Not provided"}</td></tr>
            <tr><td style="padding: 8px 0; color: #2a2118; font-weight: 600;">Event Type</td><td style="padding: 8px 0; color: #2a2118;">${eventType || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; color: #2a2118; font-weight: 600;">Guest Count</td><td style="padding: 8px 0; color: #2a2118;">${guestCount || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; color: #2a2118; font-weight: 600;">Preferred Dates</td><td style="padding: 8px 0; color: #2a2118;">${preferredDates || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; color: #2a2118; font-weight: 600;">Budget Range</td><td style="padding: 8px 0; color: #2a2118;">${budget || "Not specified"}</td></tr>
          </table>
          ${requirements ? `
          <div style="margin-top: 24px; padding: 16px; background: #fff; border-left: 3px solid #c9a96e;">
            <p style="color: #2a2118; line-height: 1.6; margin: 0;">${requirements}</p>
          </div>
          ` : ''}
          <p style="margin-top: 24px; color: #2a2118; opacity: 0.5; font-size: 12px;">
            Sent from Andreas Hotel & Spa RFP form — ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RFP Form Error]", error);
    return NextResponse.json(
      { error: "Failed to submit RFP. Please try again or call us directly." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { BRAND_CONFIG } from "@/lib/config/brand";

// In-memory sliding window rate limiter: max 5 requests per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const VALID_ENQUIRY_TYPES = [
  "Order assistance",
  "Shipping and delivery",
  "Returns and exchanges",
  "Product questions",
  "General enquiries",
] as const;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailContent(data: {
  name: string;
  email: string;
  category: string;
  orderNumber: string;
  message: string;
}) {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeCategory = escapeHtml(data.category);
  const safeOrder = data.orderNumber ? escapeHtml(data.orderNumber) : "";
  const safeMessage = escapeHtml(data.message);
  const timestamp = new Date().toUTCString();

  const text = `NEW WASTE® CUSTOMER INQUIRY
========================================

Sender Name:    ${data.name}
Email Address:  ${data.email}
Category:       ${data.category}
Order Number:   ${data.orderNumber || "None provided"}
Timestamp:      ${timestamp}

Message:
----------------------------------------
${data.message}

========================================
WASTE® — Made in India. Built for the world. 🇮🇳
Recipient: ${BRAND_CONFIG.contact.officialBusinessEmail}
`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New WASTE® Customer Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0c0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0c0c; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #141414; border: 1px solid #262626; text-align: left;">
          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #262626;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size: 22px; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; color: #ffffff;">
                      WASTE<span style="color: #0055ff;">®</span>
                    </div>
                    <div style="margin-top: 4px; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #888888;">
                      Official Customer Inquiry
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; background-color: #1f1f1f; color: #0055ff; border: 1px solid #333333; font-weight: 600;">
                      ${safeCategory}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Metadata -->
          <tr>
            <td style="padding: 24px 32px; background-color: #171717; border-bottom: 1px solid #262626;">
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 12px; line-height: 1.6;">
                <tr>
                  <td width="28%" style="color: #888888; text-transform: uppercase; letter-spacing: 0.18em; font-size: 10px;">Sender</td>
                  <td style="color: #ffffff; font-weight: 600;">${safeName}</td>
                </tr>
                <tr>
                  <td style="color: #888888; text-transform: uppercase; letter-spacing: 0.18em; font-size: 10px;">Reply-To</td>
                  <td>
                    <a href="mailto:${safeEmail}" style="color: #0055ff; text-decoration: underline; font-weight: 500;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #888888; text-transform: uppercase; letter-spacing: 0.18em; font-size: 10px;">Category</td>
                  <td style="color: #e0e0e0;">${safeCategory}</td>
                </tr>
                <tr>
                  <td style="color: #888888; text-transform: uppercase; letter-spacing: 0.18em; font-size: 10px;">Order #</td>
                  <td style="color: #e0e0e0;">${safeOrder ? safeOrder : '<span style="color: #666666;">None provided</span>'}</td>
                </tr>
                <tr>
                  <td style="color: #888888; text-transform: uppercase; letter-spacing: 0.18em; font-size: 10px;">Received</td>
                  <td style="color: #888888; font-size: 11px;">${timestamp}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 32px;">
              <div style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #888888; margin-bottom: 12px;">
                Customer Message
              </div>
              <div style="font-size: 13px; line-height: 1.7; color: #f0f0f0; white-space: pre-wrap; background-color: #0c0c0c; border: 1px solid #262626; padding: 20px; font-family: monospace;">
${safeMessage}
              </div>
            </td>
          </tr>

          <!-- Action Tip -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background-color: #1a1a1a; border-left: 2px solid #0055ff; padding: 12px 16px; font-size: 11px; color: #aaaaaa; line-height: 1.5;">
                <strong style="color: #ffffff;">Quick Reply:</strong> You can reply directly to this email in your email client to reach <span style="color: #ffffff;">${safeName}</span> (<a href="mailto:${safeEmail}" style="color: #0055ff;">${safeEmail}</a>).
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; border-top: 1px solid #262626; text-align: center; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #666666;">
              WASTE® &mdash; Made in India. Built for the world. 🇮🇳
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { text, html };
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          delivered: false,
          error: "Too many messages sent. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, enquiryType, orderNumber, message, honeypot } = body;

    // Spam bot honeypot detection
    if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
      // Return 200 without sending email or claiming delivery
      return NextResponse.json({
        success: true,
        delivered: false,
        message: "Your message has been received.",
      });
    }

    // Input Validation
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanType = typeof enquiryType === "string" ? enquiryType.trim() : "";
    const cleanOrderNumber = typeof orderNumber === "string" ? orderNumber.trim() : "";
    const cleanMessage = typeof message === "string" ? message.trim() : "";

    if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { success: false, delivered: false, error: "Please enter your full name (2–100 characters)." },
        { status: 400 }
      );
    }

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, delivered: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!cleanType || !VALID_ENQUIRY_TYPES.includes(cleanType as any)) {
      return NextResponse.json(
        { success: false, delivered: false, error: "Please select a valid enquiry category." },
        { status: 400 }
      );
    }

    if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 3000) {
      return NextResponse.json(
        { success: false, delivered: false, error: "Please write a message between 10 and 3,000 characters." },
        { status: 400 }
      );
    }

    if (cleanOrderNumber.length > 50) {
      return NextResponse.json(
        { success: false, delivered: false, error: "Order number is too long (maximum 50 characters)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();

    if (!apiKey) {
      // Server-side warning without leaking credentials or sensitive user data
      console.warn("[Contact API] RESEND_API_KEY is not configured in environment variables.");

      return NextResponse.json(
        {
          success: false,
          delivered: false,
          error:
            "Email delivery service is currently not configured. Please email wasteindiaonline@gmail.com directly.",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const fromAddress =
      process.env.RESEND_FROM_EMAIL?.trim() ||
      "WASTE® Inquiries <onboarding@resend.dev>";
    const recipientEmail =
      process.env.CONTACT_RECIPIENT_EMAIL?.trim() ||
      BRAND_CONFIG.contact.officialBusinessEmail;

    const emailSubject = `[WASTE® Inquiry] ${cleanType} - ${cleanName}${
      cleanOrderNumber ? ` (Order #${cleanOrderNumber})` : ""
    }`;

    const { text, html } = buildEmailContent({
      name: cleanName,
      email: cleanEmail,
      category: cleanType,
      orderNumber: cleanOrderNumber,
      message: cleanMessage,
    });

    const { data: sendResult, error: sendError } = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      replyTo: cleanEmail,
      subject: emailSubject,
      text,
      html,
    });

    if (sendError) {
      // Safe error logging: log error name and message, never secrets or raw keys
      console.error("[Contact API Resend Delivery Error]", {
        name: sendError.name,
        message: sendError.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          success: false,
          delivered: false,
          error:
            "Unable to deliver your message at this time. Please email wasteindiaonline@gmail.com directly.",
        },
        { status: 502 }
      );
    }

    // Success confirmed by Resend SDK
    console.log("[Contact API Delivery Accepted]", {
      emailId: sendResult?.id,
      category: cleanType,
      hasOrderNumber: Boolean(cleanOrderNumber),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      delivered: true,
      id: sendResult?.id,
      message: `Thank you for contacting WASTE®. Your message has been sent to our team at ${recipientEmail}.`,
    });
  } catch (error) {
    console.error(
      "[Contact Submission Error]",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      {
        success: false,
        delivered: false,
        error:
          "An unexpected error occurred while processing your message. Please email wasteindiaonline@gmail.com directly.",
      },
      { status: 500 }
    );
  }
}

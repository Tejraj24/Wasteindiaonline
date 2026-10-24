import { Resend } from "resend";
import { BRAND_CONFIG } from "@/lib/config/brand";

export interface OrderConfirmationEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  isPreorder: boolean;
  releaseDate?: Date | null;
  items: Array<{
    title: string;
    size?: string | null;
    quantity: number;
    price: number;
    isPreorder?: boolean;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPrice(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "orders@wasteindiaonline.com";

  if (!apiKey) {
    console.warn(
      "[Resend] RESEND_API_KEY is not set. Order confirmation email was not dispatched."
    );
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  const resend = new Resend(apiKey);

  const safeCustomerName = escapeHtml(data.customerName || "Customer");
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const arrivalNotice = data.isPreorder
    ? `<div style="background-color: #1a1a1a; border: 1px solid #333333; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #d4af37;">
          Pre-Order Confirmation
        </p>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #cccccc; line-height: 1.5;">
          This order contains pre-ordered merchandise. Your piece has been reserved and is scheduled for production dispatch.
          ${data.releaseDate ? `<br><strong>Expected release:</strong> ${data.releaseDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : ""}
        </p>
      </div>`
    : "";

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #222222;">
          <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; color: #ffffff;">
            ${escapeHtml(item.title)}
          </div>
          <div style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;">
            Size: ${escapeHtml(item.size || "M")} &times; ${item.quantity} ${item.isPreorder ? '<span style="color: #d4af37; margin-left: 8px;">[PRE-ORDER]</span>' : ''}
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #222222; text-align: right; font-family: monospace; font-size: 13px; color: #ffffff;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Order Confirmed — ${safeOrderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0c0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0c0c; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #141414; border: 1px solid #262626; text-align: left;">
          <tr>
            <td style="padding: 32px; border-bottom: 1px solid #262626;">
              <div style="font-size: 24px; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; color: #ffffff;">
                ${BRAND_CONFIG.brandName}
              </div>
              <div style="margin-top: 6px; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #888888;">
                Order Confirmation &bull; ${safeOrderNumber}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 15px; margin: 0 0 16px 0; color: #ffffff;">
                Hello ${safeCustomerName},
              </p>
              <p style="font-size: 13px; line-height: 1.6; color: #aaaaaa; margin: 0 0 24px 0;">
                Your order has been confirmed and paid. We are preparing your pieces with the utmost attention to craft.
              </p>

              ${arrivalNotice}

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px; border-top: 1px solid #222222;">
                ${itemsHtml}
                <tr>
                  <td style="padding: 16px 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #888888;">Subtotal</td>
                  <td style="padding: 16px 0 6px 0; text-align: right; font-family: monospace; font-size: 12px; color: #aaaaaa;">${formatPrice(data.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #888888;">Carbon-Neutral Shipping</td>
                  <td style="padding: 6px 0; text-align: right; font-family: monospace; font-size: 12px; color: #aaaaaa;">${data.shipping === 0 ? "Complimentary" : formatPrice(data.shipping)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #262626; font-size: 13px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; color: #ffffff;">Total Paid</td>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #262626; text-align: right; font-family: monospace; font-size: 15px; font-weight: 700; color: #ffffff;">${formatPrice(data.total)}</td>
                </tr>
              </table>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #262626; font-size: 11px; color: #777777; line-height: 1.6;">
                <strong style="color: #ffffff; text-transform: uppercase; letter-spacing: 0.1em;">Delivery Address:</strong><br>
                ${escapeHtml(data.shippingAddress.addressLine1 || "")}${data.shippingAddress.addressLine2 ? `, ${escapeHtml(data.shippingAddress.addressLine2)}` : ""}<br>
                ${escapeHtml(data.shippingAddress.city || "")}, ${escapeHtml(data.shippingAddress.state || "")} ${escapeHtml(data.shippingAddress.pincode || "")}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; background-color: #0d0d0d; border-top: 1px solid #262626; text-align: center; font-size: 10px; color: #555555; text-transform: uppercase; letter-spacing: 0.2em;">
              ${BRAND_CONFIG.tagline} &bull; ${BRAND_CONFIG.contact.officialBusinessEmail}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { data: resendData, error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: `Order Confirmed: ${data.orderNumber} — WASTE`,
      html,
    });

    if (sendError) {
      console.error("[Email Service Error]", sendError);
      return { success: false, error: sendError.message };
    }

    return { success: true, id: resendData?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[Email Service Unexpected Error]", message);
    return { success: false, error: message };
  }
}

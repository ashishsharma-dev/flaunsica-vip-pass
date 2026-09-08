/**
 * WhatStar WhatsApp API client for automated WhatsApp message delivery.
 * API Endpoint: https://whatstar.cloud/api/v1/messages
 */

export interface WhatsAppMessagePayload {
  to: string;
  text: string;
  deviceId?: string;
}

export interface WhatsAppResponse {
  ok: boolean;
  status: number;
  data?: any;
  error?: string;
}

/**
 * Normalizes phone number into international E.164 format (+91...)
 */
export function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.trim().replace(/[\s\-\(\)]/g, "");

  // If already starts with '+', return as is
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // If 10 digits (standard Indian mobile number), prepend +91
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  // If 12 digits starting with 91, prepend +
  if (/^91\d{10}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  // If 11 digits starting with 0, strip leading 0 and prepend +91
  if (/^0\d{10}$/.test(cleaned)) {
    return `+91${cleaned.slice(1)}`;
  }

  // Otherwise, ensure leading '+'
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

/**
 * Send an arbitrary message via WhatStar WhatsApp API
 */
export async function sendWhatsAppMessage({
  to,
  text,
  deviceId,
}: WhatsAppMessagePayload): Promise<WhatsAppResponse> {
  const apiUrl =
    process.env["WHATSTAR_API_URL"] || "https://whatstar.cloud/api/v1/messages";
  const apiToken =
    process.env["WHATSTAR_API_TOKEN"] ||
    "wsk_glrVicTIQsu3v9BWee8dnaidIvXRLYiraogGxdom";
  const defaultDeviceId = process.env["WHATSTAR_DEVICE_ID"] || "1";

  const targetNumber = formatWhatsAppNumber(to);
  const activeDeviceId = deviceId || defaultDeviceId;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_id: activeDeviceId,
        to: targetNumber,
        text,
      }),
    });

    const responseText = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    if (res.ok) {
      console.log(`[WhatsApp Success] Message sent to ${targetNumber}`);
      return { ok: true, status: res.status, data };
    } else {
      console.error(
        `[WhatsApp Error] Status ${res.status}:`,
        data || responseText
      );
      return {
        ok: false,
        status: res.status,
        error: typeof data === "object" ? JSON.stringify(data) : responseText,
      };
    }
  } catch (err: any) {
    console.error("[WhatsApp Exception] Failed to send message:", err);
    return {
      ok: false,
      status: 500,
      error: err?.message || "Internal WhatsApp API error",
    };
  }
}

/**
 * Send 4-digit verification code to guest via WhatsApp
 */
export async function sendWhatsAppOtp(
  phone: string,
  name: string,
  code: string
): Promise<boolean> {
  const patronName = name?.trim() || "Patron";
  const message = [
    `✨ *Flaunsica Hyderabad — 10th Refined Edition*`,
    ``,
    `Dear ${patronName},`,
    `Your VIP verification code is: *${code}*`,
    ``,
    `Valid for 10 minutes. Please enter this code on the RSVP screen to confirm your luxury exhibition invitation.`,
    ``,
    `• Venue: The Ballroom, Park Hyatt, Banjara Hills`,
    `• Date: Wednesday, 23 September 2026`,
    ``,
    `_curated by Prestha Agarwal_`,
  ].join("\n");

  const result = await sendWhatsAppMessage({
    to: phone,
    text: message,
  });

  return result.ok;
}

/**
 * Send confirmed VIP entry pass details to guest via WhatsApp
 */
export async function sendWhatsAppVipPass(
  phone: string,
  name: string,
  passCode: string,
  origin?: string
): Promise<boolean> {
  const patronName = name?.trim() || "Patron";
  const passUrl = `${origin || "https://flaunsica.com"}/pass/${passCode}`;

  const message = [
    `🎟️ *Flaunsica Exclusive Invitation Confirmed*`,
    ``,
    `Dear ${patronName},`,
    `Your Exclusive Invite for *Flaunsica Hyderabad (10th Refined Edition)* has been officially confirmed!`,
    ``,
    `• *Invite Code:* ${passCode}`,
    `• *Date:* Wednesday, 23 September 2026`,
    `• *Time:* 11:00 AM – 7:00 PM IST`,
    `• *Venue:* The Ballroom, Park Hyatt, Banjara Hills, Hyderabad`,
    ``,
    `📲 *View & Download Your Digital Exclusive Invite & QR Code:*`,
    passUrl,
    ``,
    `Please present your digital invite QR code at the reception desk for fast-track entry.`,
    ``,
    `_curated by Prestha Agarwal. We look forward to welcoming you!_`,
  ].join("\n");

  const result = await sendWhatsAppMessage({
    to: phone,
    text: message,
  });

  return result.ok;
}

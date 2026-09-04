/**
 * Delivery of the 4-digit verification code to the guest's email and mobile.
 *
 * Both channels are optional at runtime:
 *  - Email is sent through Resend via the 'vip-verification-code' template
 *    once RESEND_API_KEY is configured.
 *  - SMS is sent through Twilio once TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN /
 *    TWILIO_FROM_NUMBER are set.
 */

export interface DeliveryResult {
  email: boolean;
  sms: boolean;
}

export async function sendEmailCode(
  to: string,
  name: string,
  code: string,
): Promise<boolean> {
  if (!process.env["RESEND_API_KEY"]) {
    console.log(`[Dev OTP] Verification code for ${to} (${name}): ${code}`);
    return true;
  }

  try {
    const { sendTemplateEmail } = await import("./email-templates/send-email");
    const result = await sendTemplateEmail("vip-verification-code", to, {
      templateData: { name, code },
      idempotencyKey: `vip-verification-code-${to.toLowerCase()}-${code}`,
    });
    return result.sent;
  } catch (error) {
    console.error("email code send failed", error);
    return false;
  }
}

export async function sendSmsCode(phone: string, code: string): Promise<boolean> {
  const sid = process.env["TWILIO_ACCOUNT_SID"];
  const token = process.env["TWILIO_AUTH_TOKEN"];
  const from = process.env["TWILIO_FROM_NUMBER"];
  if (!sid || !token || !from) return false;

  try {
    const body = new URLSearchParams({
      To: `+91${phone}`,
      From: from,
      Body: `${code} is your Flaunsica VIP verification code. Valid for 10 minutes.`,
    });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    return res.ok;
  } catch (error) {
    console.error("sms code send failed", error);
    return false;
  }
}

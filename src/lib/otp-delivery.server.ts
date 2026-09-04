/**
 * Delivery of the 4-digit verification code to the guest's email and mobile.
 *
 * Both channels are optional at runtime:
 *  - Email is sent through Lovable's managed email API once an email domain is
 *    configured for the project (LOVABLE_API_KEY + EMAIL_SENDER_DOMAIN).
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
  const apiKey = process.env["LOVABLE_API_KEY"];
  const senderDomain = process.env["EMAIL_SENDER_DOMAIN"];
  if (!apiKey || !senderDomain) return false;

  const html = `<!doctype html><html><body style="background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1A1A1A;padding:24px">
    <div style="max-width:520px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden">
      <div style="background:#7B1113;color:#FAF8F5;padding:24px;text-align:center">
        <div style="font-family:Georgia,serif;font-size:24px;letter-spacing:4px">FLAUNSICA</div>
        <div style="font-size:11px;letter-spacing:2px;opacity:.85;margin-top:6px">10TH REFINED EDITION</div>
      </div>
      <div style="padding:28px;text-align:center">
        <p style="margin:0 0 8px">Hi ${escapeHtml(name)},</p>
        <p style="margin:0 0 20px;color:#6B6B6B">Use this code to verify your VIP registration.</p>
        <div style="font-family:Georgia,serif;font-size:38px;letter-spacing:12px">${code}</div>
        <p style="margin:20px 0 0;font-size:12px;color:#6B6B6B">This code expires in 10 minutes.</p>
      </div>
    </div>
  </body></html>`;

  try {
    const res = await fetch("https://api.lovable.dev/v1/email/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Flaunsica <noreply@${senderDomain}>`,
        to,
        subject: `${code} is your Flaunsica VIP verification code`,
        html,
        purpose: "transactional",
      }),
    });
    return res.ok;
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

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}

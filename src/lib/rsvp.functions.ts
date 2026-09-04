import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const guestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/),
  email: z.string().trim().email().max(255),
  isBride: z.enum(["Yes", "No"]),
  purpose: z.array(z.string().max(60)).min(1).max(10),
  attendingWith: z.array(z.string().max(60)).min(1).max(10),
  interests: z.array(z.string().max(60)).min(1).max(10),
});

function makePassCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  const body = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `FLX26-${body.slice(0, 5)}-${body.slice(5)}`;
}

function makeCode() {
  return String(crypto.getRandomValues(new Uint32Array(1))[0]! % 10000).padStart(4, "0");
}

export const startRegistration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => guestSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendEmailCode, sendSmsCode } = await import("./otp-delivery.server");

    const passCode = makePassCode();
    const { data: registration, error } = await supabaseAdmin
      .from("registrations")
      .insert({
        pass_code: passCode,
        name: data.name,
        phone: data.phone,
        email: data.email.toLowerCase(),
        is_bride: data.isBride === "Yes",
        purpose: data.purpose,
        attending_with: data.attendingWith,
        interests: data.interests,
      })
      .select("id, pass_code")
      .single();

    if (error || !registration) {
      console.error("registration insert failed", error);
      throw new Error("We could not save your registration. Please try again.");
    }

    const code = makeCode();
    const { error: codeError } = await supabaseAdmin.from("verification_codes").insert({
      registration_id: registration.id,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });
    if (codeError) {
      console.error("code insert failed", codeError);
      throw new Error("We could not send your verification code. Please try again.");
    }

    const [email, sms] = await Promise.all([
      sendEmailCode(data.email, data.name, code),
      sendSmsCode(data.phone, code),
    ]);

    return {
      registrationId: registration.id,
      passCode: registration.pass_code,
      delivery: { email, sms },
      // Only exposed while neither delivery channel is configured, so the flow
      // remains testable before email domain / SMS provider setup.
      previewCode: !email && !sms ? code : null,
    };
  });

export const resendCode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ registrationId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendEmailCode, sendSmsCode } = await import("./otp-delivery.server");

    const { data: registration } = await supabaseAdmin
      .from("registrations")
      .select("id, name, phone, email")
      .eq("id", data.registrationId)
      .maybeSingle();
    if (!registration) throw new Error("Registration not found.");

    const code = makeCode();
    await supabaseAdmin.from("verification_codes").insert({
      registration_id: registration.id,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    const [email, sms] = await Promise.all([
      sendEmailCode(registration.email, registration.name, code),
      sendSmsCode(registration.phone, code),
    ]);

    return { delivery: { email, sms }, previewCode: !email && !sms ? code : null };
  });

export const verifyCode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({ registrationId: z.string().uuid(), code: z.string().regex(/^\d{4}$/) })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row } = await supabaseAdmin
      .from("verification_codes")
      .select("id, code, attempts, expires_at, consumed_at")
      .eq("registration_id", data.registrationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row || row.consumed_at) {
      return { ok: false as const, error: "Please request a new code." };
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return { ok: false as const, error: "This code has expired. Request a new one." };
    }
    if (row.attempts >= 5) {
      return { ok: false as const, error: "Too many attempts. Request a new code." };
    }
    if (row.code !== data.code) {
      await supabaseAdmin
        .from("verification_codes")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);
      return { ok: false as const, error: "That code is incorrect." };
    }

    await supabaseAdmin
      .from("verification_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", row.id);

    const { data: registration } = await supabaseAdmin
      .from("registrations")
      .update({ phone_verified: true, email_verified: true })
      .eq("id", data.registrationId)
      .select("pass_code")
      .single();

    return { ok: true as const, passCode: registration?.pass_code ?? "" };
  });

export const getPass = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ passCode: z.string().trim().min(6).max(40) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: registration } = await supabaseAdmin
      .from("registrations")
      .select(
        "pass_code, name, phone, email, is_bride, purpose, attending_with, interests, phone_verified, email_verified, checked_in_at, created_at",
      )
      .eq("pass_code", data.passCode)
      .maybeSingle();

    if (!registration) return null;
    return registration;
  });

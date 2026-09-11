import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const guestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/),
  email: z.string().trim().email().max(255),
  isBride: z.enum(["Yes", "No"]).optional().default("No"),
  purpose: z.array(z.string().max(60)).optional().default([]),
  attendingWith: z.array(z.string().max(60)).optional().default([]),
  interests: z.array(z.string().max(60)).optional().default([]),
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

export const checkExistingRegistration = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        phone: z.string().optional(),
        email: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const conditions: string[] = [];
    const phone = data.phone?.trim();
    const email = data.email?.toLowerCase().trim();

    if (phone && phone.length === 10) conditions.push(`phone.eq.${phone}`);
    if (email && email.includes("@")) conditions.push(`email.eq.${email}`);
    if (conditions.length === 0) return null;

    const { data: existing } = await supabaseAdmin
      .from("registrations")
      .select("id, pass_code, name, phone, email, phone_verified")
      .or(conditions.join(","))
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!existing) return null;
    return {
      alreadyRegistered: true as const,
      passCode: existing.pass_code,
      name: existing.name,
      message: `You are already registered for Flaunsica 10th Refined Edition with ${
        phone && existing.phone === phone ? "mobile number +91 " + existing.phone : "email " + existing.email
      }.`,
    };
  });

export const startRegistration = createServerFn({ method: "POST" })
  .validator((input: unknown) => guestSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendEmailCode, sendSmsCode, sendWhatsAppCode } = await import("./otp-delivery.server");

    const sanitizedPhone = data.phone.trim();
    const sanitizedEmail = data.email.toLowerCase().trim();

    // Check if guest is already registered with this phone number or email
    const { data: existing } = await supabaseAdmin
      .from("registrations")
      .select("id, pass_code, name, phone, email, phone_verified")
      .or(`phone.eq.${sanitizedPhone},email.eq.${sanitizedEmail}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      return {
        alreadyRegistered: true as const,
        registrationId: existing.id,
        passCode: existing.pass_code,
        guestName: existing.name,
        delivery: { email: false, sms: false, whatsapp: false },
        previewCode: null,
        message: `You are already registered for Flaunsica 10th Refined Edition with ${
          existing.phone === sanitizedPhone ? "mobile number +91 " + existing.phone : "email " + existing.email
        }.`,
      };
    }

    const passCode = makePassCode();
    const { data: registration, error } = await supabaseAdmin
      .from("registrations")
      .insert({
        pass_code: passCode,
        name: data.name,
        phone: sanitizedPhone,
        email: sanitizedEmail,
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

    const [email, sms, whatsapp] = await Promise.all([
      sendEmailCode(data.email, data.name, code),
      sendSmsCode(data.phone, code),
      sendWhatsAppCode(data.phone, data.name, code),
    ]);

    return {
      alreadyRegistered: false as const,
      registrationId: registration.id,
      passCode: registration.pass_code,
      delivery: { email, sms, whatsapp },
      // Only exposed while neither delivery channel is configured
      previewCode: !email && !sms && !whatsapp ? code : null,
      message: "",
    };
  });

export const resendCode = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ registrationId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendEmailCode, sendSmsCode, sendWhatsAppCode } = await import("./otp-delivery.server");

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

    const [email, sms, whatsapp] = await Promise.all([
      sendEmailCode(registration.email, registration.name, code),
      sendSmsCode(registration.phone, code),
      sendWhatsAppCode(registration.phone, registration.name, code),
    ]);

    return {
      delivery: { email, sms, whatsapp },
      previewCode: !email && !sms && !whatsapp ? code : null,
    };
  });

export const verifyCode = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
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
      .select("pass_code, name, phone")
      .single();

    if (registration?.phone && registration?.pass_code) {
      try {
        const { sendWhatsAppVipPass } = await import("./whatsapp.server");
        await sendWhatsAppVipPass(
          registration.phone,
          registration.name,
          registration.pass_code,
        );
      } catch (err) {
        console.error("Failed to send WhatsApp VIP pass confirmation:", err);
      }
    }

    return { ok: true as const, passCode: registration?.pass_code ?? "" };
  });

export const getPass = createServerFn({ method: "GET" })
  .validator((input: unknown) =>
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

export const sendWhatsAppDirect = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        to: z.string().min(5),
        text: z.string().min(1),
        deviceId: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { sendWhatsAppMessage } = await import("./whatsapp.server");
    return await sendWhatsAppMessage(data);
  });

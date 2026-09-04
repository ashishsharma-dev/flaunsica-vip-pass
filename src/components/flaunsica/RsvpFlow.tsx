import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { LuxeField } from "./LuxeField";
import { PillGroup } from "./PillGroup";
import { VipPass } from "./VipPass";
import { resendCode, startRegistration, verifyCode } from "@/lib/rsvp.functions";
import {
  COMPANY_OPTIONS,
  INTEREST_OPTIONS,
  PURPOSE_OPTIONS,
  type GuestDetails,
} from "./types";

const guestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name must be under 100 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  isBride: z.string().min(1, "Please select an option"),
  purpose: z.array(z.string()).min(1, "Select at least one purpose"),
  attendingWith: z.array(z.string()).min(1, "Select who you're attending with"),
  interests: z.array(z.string()).min(1, "Select at least one category"),
});

const EMPTY: GuestDetails = {
  name: "",
  phone: "",
  email: "",
  isBride: "",
  purpose: [],
  attendingWith: [],
  interests: [],
};

type Step = "form" | "otp" | "pass";
type Delivery = { email: boolean; sms: boolean };

export function RsvpFlow() {
  const [step, setStep] = useState<Step>("form");
  const [guest, setGuest] = useState<GuestDetails>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [registrationId, setRegistrationId] = useState("");
  const [passCode, setPassCode] = useState("");
  const [delivery, setDelivery] = useState<Delivery>({ email: false, sms: false });
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const start = useServerFn(startRegistration);
  const resend = useServerFn(resendCode);
  const verify = useServerFn(verifyCode);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const set = <K extends keyof GuestDetails>(key: K, value: GuestDetails[K]) => {
    setGuest((g) => ({ ...g, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const result = guestSchema.safeParse(guest);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      const res = await start({
        data: {
          name: guest.name.trim(),
          phone: guest.phone,
          email: guest.email.trim(),
          isBride: guest.isBride as "Yes" | "No",
          purpose: guest.purpose,
          attendingWith: guest.attendingWith,
          interests: guest.interests,
        },
      });
      setRegistrationId(res.registrationId);
      setPassCode(res.passCode);
      setDelivery(res.delivery);
      setPreviewCode(res.previewCode);
      setOtp(["", "", "", ""]);
      setOtpError("");
      setResendIn(30);
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 120);
    } catch (error) {
      console.error(error);
      setFormError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError("");
    if (digit && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      setOtpError("Please enter all 4 digits");
      return;
    }
    setSubmitting(true);
    try {
      const res = await verify({ data: { registrationId, code: otp.join("") } });
      if (!res.ok) {
        setOtpError(res.error);
        return;
      }
      setPassCode(res.passCode);
      setStep("pass");
    } catch (error) {
      console.error(error);
      setOtpError("We couldn't verify that code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const requestResend = async () => {
    setResendIn(30);
    setOtpError("");
    try {
      const res = await resend({ data: { registrationId } });
      setDelivery(res.delivery);
      setPreviewCode(res.previewCode);
    } catch (error) {
      console.error(error);
      setOtpError("We couldn't resend the code. Please try again.");
    }
  };

  const sentTo = [delivery.sms ? "WhatsApp/SMS" : null, delivery.email ? "email" : null].filter(
    Boolean,
  );

  return (
    <section id="rsvp" className="scroll-mt-16 bg-background px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-xl">
        <header className="text-center">
          <p className="text-[0.65rem] uppercase tracking-luxe text-primary">Guest Registration</p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Request Your VIP Invitation
          </h2>
          <div className="rule-luxe mx-auto mt-6 w-40" />
        </header>

        <div className="mt-10">
          {step === "form" && (
            <form onSubmit={submitForm} noValidate className="animate-rise space-y-9">
              <LuxeField
                id="name"
                label="Full Name"
                autoComplete="name"
                value={guest.name}
                onChange={(e) => set("name", e.target.value)}
                error={errors["name"]}
              />
              <LuxeField
                id="phone"
                label="WhatsApp / Mobile Number"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
                prefix="+91"
                value={guest.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                error={errors["phone"]}
              />
              <LuxeField
                id="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                value={guest.email}
                onChange={(e) => set("email", e.target.value)}
                error={errors["email"]}
              />

              <PillGroup
                legend="Are you a bride?"
                options={["Yes", "No"]}
                value={guest.isBride ? [guest.isBride] : []}
                onChange={(v) => set("isBride", v[0] ?? "")}
                error={errors["isBride"]}
              />
              <PillGroup
                legend="Purpose of visit"
                options={PURPOSE_OPTIONS}
                value={guest.purpose}
                multi
                onChange={(v) => set("purpose", v)}
                error={errors["purpose"]}
              />
              <PillGroup
                legend="Who are you attending with?"
                options={COMPANY_OPTIONS}
                value={guest.attendingWith}
                onChange={(v) => set("attendingWith", v)}
                error={errors["attendingWith"]}
              />
              <PillGroup
                legend="What are you most likely to buy?"
                options={INTEREST_OPTIONS}
                value={guest.interests}
                multi
                onChange={(v) => set("interests", v)}
                error={errors["interests"]}
              />

              {formError ? (
                <p className="text-center text-xs text-destructive">{formError}</p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="shimmer-luxe inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-8 py-5 text-[0.72rem] uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-95 disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                Get My VIP QR Pass
              </button>
              <p className="text-center text-xs text-muted-foreground">
                We'll send a verification code to both your mobile number and email address.
              </p>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={verifyOtp}
              className="animate-rise rounded-lg surface-luxe p-8 text-center"
            >
              <MessageCircle className="mx-auto size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl">Verify Your Details</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {sentTo.length
                  ? `Enter the 4-digit code we sent to your ${sentTo.join(" and ")}.`
                  : "Enter the 4-digit verification code to confirm your mobile number and email."}
                <br />
                <span className="text-foreground">+91 {guest.phone}</span>
                <br />
                <span className="text-foreground">{guest.email}</span>
              </p>

              {previewCode ? (
                <p className="mx-auto mt-4 max-w-sm rounded-sm border border-dashed border-border bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
                  Delivery isn't connected yet, so here is your code for testing:{" "}
                  <strong className="font-medium text-foreground">{previewCode}</strong>
                </p>
              ) : null}

              <div className="mt-8 flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    value={digit}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Digit ${i + 1}`}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
                    }}
                    className="size-14 rounded-sm border border-input bg-background text-center font-display text-2xl outline-none transition-colors focus:border-primary"
                  />
                ))}
              </div>
              {otpError ? <p className="mt-4 text-xs text-destructive">{otpError}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="shimmer-luxe mt-8 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-8 py-4 text-[0.72rem] uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-95 disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                Verify & Generate Pass
              </button>

              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="inline-flex items-center gap-1 transition-colors hover:text-primary"
                >
                  <ArrowLeft className="size-3.5" aria-hidden="true" /> Edit details
                </button>
                <button
                  type="button"
                  disabled={resendIn > 0}
                  onClick={requestResend}
                  className="transition-colors hover:text-primary disabled:opacity-60"
                >
                  {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          {step === "pass" && <VipPass guest={guest} passCode={passCode} delivery={delivery} />}
        </div>
      </div>
    </section>
  );
}

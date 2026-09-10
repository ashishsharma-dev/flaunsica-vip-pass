import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { z } from "zod";
import { VipPass } from "./VipPass";
import {
  checkExistingRegistration,
  resendCode,
  startRegistration,
  verifyCode,
} from "@/lib/rsvp.functions";
import type { GuestDetails } from "./types";

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
  isBride: z.string().optional().default("No"),
  purpose: z.array(z.string()).min(1, "Select at least one purpose"),
  attendingWith: z.array(z.string()).min(1, "Select who you're attending with"),
  interests: z.array(z.string()).min(1, "Select at least one category"),
});

const contactSchema = z.object({
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
});

const DEFAULT_GUEST: GuestDetails = {
  name: "",
  phone: "",
  email: "",
  isBride: "No",
  purpose: ["Wedding Shopping"],
  attendingWith: ["Just me"],
  interests: ["Jewellery", "Clothing"],
};

type Step = "form" | "otp" | "pass";
type FormScreen = "contact" | "preferences";
type Delivery = { email: boolean; sms: boolean };

const GOOGLE_SHEETS_SCRIPT_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_GOOGLE_SHEETS_SCRIPT_URL"]) ||
  "https://script.google.com/macros/s/AKfycbz95TIC6yRE9vXGweCo0qZSP6yg_sLrsqQz6w2-2r7Vex8R1PCUeJS7wX8XM9EjYB1b/exec";

function submitToGoogleSheets(formEl?: HTMLFormElement | null, currentGuest?: GuestDetails) {
  try {
    const formData = formEl ? new FormData(formEl) : new FormData();
    if (currentGuest) {
      formData.set("fullName", currentGuest.name.trim());
      formData.set("mobile", currentGuest.phone);
      formData.set("email", currentGuest.email.trim());
      if (currentGuest.purpose?.length) {
        formData.set("purpose", currentGuest.purpose.join(", "));
      }
      if (currentGuest.attendingWith?.length) {
        formData.set("attendingWith", currentGuest.attendingWith.join(", "));
      }
      if (currentGuest.interests?.length) {
        formData.set("interests", currentGuest.interests.join(", "));
      }
    }

    fetch(GOOGLE_SHEETS_SCRIPT_URL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error?.message || error));
  } catch (err: any) {
    console.error("Error!", err?.message || err);
  }
}

export function RsvpFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [formScreen, setFormScreen] = useState<FormScreen>("contact");
  const [guest, setGuest] = useState<GuestDetails>(DEFAULT_GUEST);
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

  const [alreadyRegistered, setAlreadyRegistered] = useState<{
    message: string;
    passCode: string;
  } | null>(null);

  const start = useServerFn(startRegistration);
  const resend = useServerFn(resendCode);
  const verify = useServerFn(verifyCode);
  const checkExisting = useServerFn(checkExistingRegistration);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (step === "pass" && passCode) {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("flaunsica_last_guest", JSON.stringify(guest));
          sessionStorage.setItem("flaunsica_last_delivery", JSON.stringify(delivery));
          sessionStorage.setItem("flaunsica_last_pass_code", passCode);
        } catch {
          // ignore
        }
      }
      navigate({
        to: "/thank-you",
        search: { passCode },
      });
    }
  }, [step, passCode, navigate, guest, delivery]);

  const set = <K extends keyof GuestDetails>(key: K, value: GuestDetails[K]) => {
    setGuest((g) => ({ ...g, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleContinueToPreferences = async () => {
    setFormError("");
    setAlreadyRegistered(null);
    const res = contactSchema.safeParse({
      name: guest.name,
      phone: guest.phone,
      email: guest.email,
    });
    if (!res.success) {
      const next: Record<string, string> = {};
      for (const issue of res.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors((prev) => ({ ...prev, ...next }));
      return;
    }

    setSubmitting(true);
    try {
      const existing = await checkExisting({
        data: { phone: guest.phone, email: guest.email },
      });
      if (existing?.alreadyRegistered) {
        setAlreadyRegistered({
          message: existing.message,
          passCode: existing.passCode,
        });
        document.getElementById("rsvp-section")?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    } catch {
      // Proceed on error
    } finally {
      setSubmitting(false);
    }

    setFormScreen("preferences");
    document.getElementById("rsvp-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const submitForm = async () => {
    setFormError("");
    setAlreadyRegistered(null);
    const result = guestSchema.safeParse(guest);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      if (next.name || next.phone || next.email) {
        setFormScreen("contact");
      }
      return;
    }
    setSubmitting(true);
    try {
      const formEl =
        (typeof document !== "undefined" && ((document.forms as any)["guest-form"] || document.getElementById("guest-form"))) ||
        null;
      submitToGoogleSheets(formEl, guest);

      // Trigger Facebook Pixel Lead event upon form submission
      if (typeof window !== "undefined") {
        if ((window as any).fbq) {
          try {
            (window as any).fbq("track", "Lead", {
              content_name: "Flaunsica RSVP Form",
              purpose: Array.isArray(guest.purpose) ? guest.purpose.join(", ") : guest.purpose,
            });
          } catch (err) {
            console.error("Facebook Pixel Lead tracking error:", err);
          }
        }
        if ((window as any).gtag) {
          try {
            (window as any).gtag("event", "generate_lead", {
              event_category: "RSVP Form",
              purpose: Array.isArray(guest.purpose) ? guest.purpose.join(", ") : guest.purpose,
            });
          } catch (err) {
            console.error("Google tag Lead tracking error:", err);
          }
        }
      }

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

      if (res.alreadyRegistered) {
        setAlreadyRegistered({
          message: res.message || "You are already registered for Flaunsica with these details.",
          passCode: res.passCode,
        });
        document.getElementById("rsvp-section")?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      setRegistrationId(res.registrationId);
      setPassCode(res.passCode);
      setDelivery(res.delivery);
      setPreviewCode(res.previewCode);
      setOtp(["", "", "", ""]);
      setOtpError("");
      setResendIn(30);
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
    } catch (error) {
      console.error(error);
      setFormError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formScreen === "contact") {
      handleContinueToPreferences();
    } else {
      submitForm();
    }
  };

  const handleOtpChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError("");
    if (digit && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
    if (digit && index === 3) {
      const full = [...next.slice(0, 3), digit].join("");
      if (full.length === 4) {
        doVerify(full);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasteData.length > 0) {
      const digits = ["", "", "", ""];
      pasteData.split("").forEach((ch, idx) => {
        if (idx < 4) digits[idx] = ch;
      });
      setOtp(digits);
      const nextIndex = Math.min(pasteData.length, 3);
      otpRefs.current[nextIndex]?.focus();
      if (pasteData.length === 4) {
        doVerify(pasteData);
      }
    }
  };

  const doVerify = async (codeToVerify: string) => {
    if (codeToVerify.length !== 4) {
      setOtpError("Please enter all 4 digits");
      return;
    }
    setSubmitting(true);
    try {
      const res = await verify({ data: { registrationId, code: codeToVerify } });
      if (!res.ok) {
        setOtpError(res.error || "Invalid verification code. Please try again.");
        return;
      }
      setPassCode(res.passCode);
      setStep("pass");

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("flaunsica_last_guest", JSON.stringify(guest));
          sessionStorage.setItem("flaunsica_last_delivery", JSON.stringify(delivery));
          sessionStorage.setItem("flaunsica_last_pass_code", res.passCode);
        } catch {
          // ignore
        }
      }

      navigate({
        to: "/thank-you",
        search: { passCode: res.passCode },
      });
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

  if (step === "pass") {
    return (
      <VipPass
        guest={guest}
        passCode={passCode}
        delivery={delivery}
        onReset={() => {
          setStep("form");
          setFormScreen("contact");
          setGuest(DEFAULT_GUEST);
          setErrors({});
          setFormError("");
        }}
      />
    );
  }

  return (
    <section id="rsvp-section" className="registration-section">
      <div className="reg-container">
        <div className="luxury-form-card" id="form-card-container">
          {/* Submission Loading Animation Overlay */}
          {submitting && step === "form" && (
            <div className="form-submitting-overlay" aria-live="assertive" role="status">
              <div className="submitting-overlay-card">
                <div className="luxury-spinner-ring">
                  <div className="spinner-inner-circle" />
                </div>
                <div className="submitting-brand-logo">
                  <img
                    src="/assets/logos/flaunsica-logo-red.svg"
                    alt="Flaunsica"
                    className="submitting-logo-img"
                    width={140}
                    height={39}
                  />
                </div>
                <h4 className="submitting-title">Securing Your Exclusive Invite</h4>
                <p className="submitting-subtitle">
                  Confirming your guest reservation &amp; dispatching verification code...
                </p>
                <div className="submitting-progress-track">
                  <div className="submitting-progress-bar" />
                </div>
              </div>
            </div>
          )}

          {/* Progress Tracker Header */}
          <div className="form-progress-bar">
            <div
              className={`step-node ${step === "form" && formScreen === "contact" ? "active" : "completed"} ${formScreen === "preferences" && step === "form" ? "is-clickable" : ""}`}
              id="step-node-1"
              onClick={() => {
                if (formScreen === "preferences" && step === "form") {
                  setFormScreen("contact");
                }
              }}
              title={formScreen === "preferences" && step === "form" ? "Click to edit contact details" : undefined}
            >
              <span className="step-num">{step === "form" && formScreen === "contact" ? "1" : "✓"}</span>
              <span className="step-label">Contact</span>
            </div>
            <div
              className={`step-line ${formScreen === "preferences" || step !== "form" ? "completed" : ""}`}
              id="step-line-1"
            />
            <div
              className={`step-node ${step === "form" && formScreen === "preferences" ? "active" : step !== "form" ? "completed" : ""}`}
              id="step-node-2"
            >
              <span className="step-num">{step !== "form" ? "✓" : "2"}</span>
              <span className="step-label">Preferences</span>
            </div>
            <div
              className={`step-line ${step === "otp" || step === "pass" ? "completed" : ""}`}
              id="step-line-2"
            />
            <div
              className={`step-node ${step === "otp" ? "active" : step === "pass" ? "completed" : ""}`}
              id="step-node-3"
            >
              <span className="step-num">{step === "pass" ? "✓" : "3"}</span>
              <span className="step-label">Verification</span>
            </div>
            <div
              className={`step-line ${step === "pass" ? "completed" : ""}`}
              id="step-line-3"
            />
            <div
              className={`step-node ${step === "pass" ? "active" : ""}`}
              id="step-node-4"
            >
              <span className="step-num">4</span>
              <span className="step-label">Exclusive Invite</span>
            </div>
          </div>

          {/* The Registration Form */}
          <form id="guest-form" name="guest-form" className="luxury-form" noValidate onSubmit={handleFormSubmit}>
            {/* Already Registered Message Banner */}
            {alreadyRegistered && (
              <div
                className="already-registered-box animate-in fade-in slide-in-from-top-3 duration-300 mx-1 mb-6 p-4 sm:p-5 rounded-xl border border-[#d4af37]/45 bg-[#7b1113]/6 text-[#140406]"
                role="alert"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#d4af37]/25 border border-[#d4af37]/40 flex items-center justify-center shrink-0 text-[#7b1113] mt-0.5">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#7b1113] bg-[#7b1113]/10 px-2.5 py-0.5 rounded-full">
                        Already Registered
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-[#140406] leading-relaxed">
                      {alreadyRegistered.message}
                    </p>
                    <p className="mt-1 text-xs text-[#6e585b]">
                      Pass Code: <strong className="font-mono text-[#7b1113]">{alreadyRegistered.passCode}</strong>
                    </p>
                    <div className="mt-3.5 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        id="btnSeePass"
                        onClick={() => {
                          navigate({
                            to: "/thank-you",
                            search: { passCode: alreadyRegistered.passCode },
                          });
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7b1113] text-[#fffdfa] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#5e0c0e] shadow-sm transition-all cursor-pointer"
                      >
                        <span>See Pass</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAlreadyRegistered(null)}
                        className="text-xs text-[#7b1113] hover:underline cursor-pointer py-1 font-medium"
                      >
                        Register another guest
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 1: CONTACT DETAILS */}
            {formScreen === "contact" && (
              <div className="form-screen-slide">
                <div className="form-header">
                  <div className="form-stage-pill">
                    <span className="stage-pill-dot" />
                    <span>STEP 1 OF 2 • GUEST CONTACT</span>
                  </div>
                  <h2 className="form-title">Request Your Exclusive Invitation</h2>
                  <p className="form-subtitle">
                    Enter your contact details to receive your personal entry pass & schedule via WhatsApp & Email.
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  {/* 1. Full Name */}
                  <div className={`form-group floating-group ${errors.name ? "has-error" : ""}`}>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-input"
                      placeholder=" "
                      required
                      autoComplete="name"
                      value={guest.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                    <label htmlFor="fullName" className="floating-label">Full Name *</label>
                    {errors.name ? <span className="field-error">{errors.name}</span> : null}
                  </div>

                  {/* 2. WhatsApp / Mobile Number */}
                  <div className={`form-group floating-group tel-group ${errors.phone ? "has-error" : ""}`}>
                    <div className="tel-input-wrap">
                      <div className="tel-prefix-box">
                        <span className="tel-flag">🇮🇳</span>
                        <span className="tel-code">+91</span>
                      </div>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        className="form-input tel-input"
                        placeholder=" "
                        maxLength={10}
                        required
                        autoComplete="tel-national"
                        value={guest.phone}
                        onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      />
                      <label htmlFor="mobile" className="floating-label tel-label">WhatsApp / Mobile Number *</label>
                    </div>
                    {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
                    <span className="field-hint">Your QR invite will be sent to this WhatsApp number & email</span>
                  </div>

                  {/* 3. Email Address */}
                  <div className={`form-group floating-group ${errors.email ? "has-error" : ""}`}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder=" "
                      required
                      autoComplete="email"
                      value={guest.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                    <label htmlFor="email" className="floating-label">Email Address *</label>
                    {errors.email ? <span className="field-error">{errors.email}</span> : null}
                  </div>
                </div>

                {/* VIP Perks Trust Banner */}
                <div className="form-perks-banner">
                  <div className="perk-item">
                    <span className="perk-icon">🎟️</span>
                    <div className="perk-text">
                      <strong>Complimentary Exclusive Invite</strong>
                      <span>Direct QR gate admission</span>
                    </div>
                  </div>
                  <div className="perk-divider" />
                  <div className="perk-item">
                    <span className="perk-icon">⚡</span>
                    <div className="perk-text">
                      <strong>Instant Delivery</strong>
                      <span>Pass sent via WhatsApp & Email</span>
                    </div>
                  </div>
                  <div className="perk-divider" />
                  <div className="perk-item">
                    <span className="perk-icon">🥂</span>
                    <div className="perk-text">
                      <strong>Exclusive Access</strong>
                      <span>Private lounge & showcase access</span>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="form-submit-row">
                  <button
                    type="submit"
                    id="btn-next-preferences"
                    className="btn-submit-luxury"
                  >
                    <span className="btn-submit-text">Continue to Preferences</span>
                    <span className="btn-sheen" />
                    <svg className="btn-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="security-caption">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Takes only 15 seconds • 100% Confidential & Secure</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 2: EVENT PREFERENCES */}
            {formScreen === "preferences" && (
              <div className="form-screen-slide">
                {/* Hidden fields to retain Step 1 contact details in FormData(form) */}
                <input type="hidden" name="fullName" value={guest.name} />
                <input type="hidden" name="mobile" value={guest.phone} />
                <input type="hidden" name="email" value={guest.email} />
                <div className="form-header">
                  <div className="form-stage-pill">
                    <span className="stage-pill-dot" />
                    <span>STEP 2 OF 2 • EVENT PREFERENCES</span>
                  </div>
                  <h2 className="form-title">Customize Your Experience</h2>
                  <p className="form-subtitle">
                    Tell us your shopping focus so our hospitality team can tailor your previews and private lounge access.
                  </p>
                </div>

                {/* Guest Contact Mini Recap */}
                <div className="guest-recap-bar">
                  <div className="guest-recap-info">
                    <span className="recap-label">Reserving for:</span>
                    <span className="recap-name">{guest.name || "Guest"}</span>
                    <span className="recap-meta">• +91 {guest.phone} • {guest.email}</span>
                  </div>
                  <button
                    type="button"
                    className="recap-edit-btn"
                    onClick={() => setFormScreen("contact")}
                    title="Edit contact details"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Purpose of Visit */}
                  <div className={`form-group pill-group ${errors.purpose ? "has-error" : ""}`}>
                    <label className="group-legend">Purpose of Visit</label>
                    <div className="pills-grid" role="radiogroup" aria-label="Purpose of Visit">
                      {["Wedding Shopping", "Trousseau", "Casual Shopping", "Workwear"].map((item) => (
                        <label key={item} className="radio-pill">
                          <input
                            type="radio"
                            name="purpose"
                            value={item}
                            checked={guest.purpose.includes(item)}
                            onChange={() => set("purpose", [item])}
                          />
                          <span className="pill-btn">{item}</span>
                        </label>
                      ))}
                    </div>
                    {errors.purpose ? <span className="field-error">{errors.purpose}</span> : null}
                  </div>

                  {/* 6. Who are you attending with? */}
                  <div className={`form-group pill-group ${errors.attendingWith ? "has-error" : ""}`}>
                    <label className="group-legend">Who are you attending with?</label>
                    <div className="pills-row" role="radiogroup" aria-label="Who are you attending with?">
                      {["Just me", "Friends", "Family"].map((party) => (
                        <label key={party} className="radio-pill">
                          <input
                            type="radio"
                            name="attendingWith"
                            value={party}
                            checked={guest.attendingWith.includes(party)}
                            onChange={() => set("attendingWith", [party])}
                          />
                          <span className="pill-btn">{party}</span>
                        </label>
                      ))}
                    </div>
                    {errors.attendingWith ? <span className="field-error">{errors.attendingWith}</span> : null}
                  </div>

                  {/* 7. What are you most likely to buy? */}
                  <div className={`form-group pill-group ${errors.interests ? "has-error" : ""}`}>
                    <label className="group-legend">
                      What are you most likely to buy? <span className="legend-hint">(Select all that apply)</span>
                    </label>
                    <div className="pills-row" role="group" aria-label="What are you most likely to buy?">
                      {["Jewellery", "Clothing", "Accessories"].map((cat) => {
                        const isChecked = guest.interests.includes(cat);
                        return (
                          <label key={cat} className="check-pill">
                            <input
                              type="checkbox"
                              name="interests"
                              value={cat}
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  set("interests", [...guest.interests, cat]);
                                } else {
                                  set("interests", guest.interests.filter((c) => c !== cat));
                                }
                              }}
                            />
                            <span className="pill-btn">
                              <span className="check-box-indicator" /> {cat}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.interests ? <span className="field-error">{errors.interests}</span> : null}
                  </div>
                </div>

                {formError ? <p className="text-center text-xs text-red-600 font-medium">{formError}</p> : null}

                {/* Multi-action Buttons for Screen 2 */}
                <div className="form-actions-split">
                  <button
                    type="button"
                    className="btn-back-luxury"
                    onClick={() => setFormScreen("contact")}
                    disabled={submitting}
                  >
                    <svg className="btn-icon-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    id="btn-submit-rsvp"
                    disabled={submitting}
                    className={`btn-submit-luxury ${submitting ? "is-submitting" : ""}`}
                  >
                    {submitting ? (
                      <span className="btn-loading-flex">
                        <span className="btn-spinner-icon" aria-hidden="true" />
                        <span className="btn-submit-text">Securing Exclusive Invite...</span>
                      </span>
                    ) : (
                      <>
                        <span className="btn-submit-text">Get Exclusive Invite</span>
                        <span className="btn-sheen" />
                        <svg className="btn-icon-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                <div className="security-caption" style={{ justifyContent: "center", marginTop: "0.85rem" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Instant verification via WhatsApp & Email • Strictly zero spam</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Step 2: OTP Verification Modal */}
      {step === "otp" && (
        <div
          id="otp-modal"
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="otp-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setStep("form");
          }}
        >
          <div className="modal-card">
            <button
              type="button"
              className="modal-close-btn"
              id="btnCloseOtpModal"
              aria-label="Close modal"
              onClick={() => setStep("form")}
            >
              &times;
            </button>

            <div className="modal-header">
              <div className="modal-brand-seal">
                <img
                  src="/assets/logos/flaunsica-logo-red.svg"
                  alt="Flaunsica"
                  className="modal-brand-logo"
                  width={140}
                  height={39}
                />
              </div>
              <div className="modal-badge">MOBILE & EMAIL VERIFICATION</div>
              <h3 id="otp-modal-title" className="modal-title">Verify Your Details</h3>
              <p className="modal-desc">
                We have sent a 4-digit verification code to your WhatsApp / Mobile <strong id="otpDisplayMobile">+91 {guest.phone}</strong> and <strong>{guest.email}</strong>
              </p>
            </div>

            {/* Quick Demo Preview / Fallback Toast */}
            {previewCode ? (
              <div className="simulated-otp-banner" id="simulatedOtpBanner">
                <div className="sim-icon">💬</div>
                <div className="sim-text">
                  <span className="sim-title">Verification Code Preview:</span>
                  <span className="sim-code">
                    "Your Flaunsica 10th Edition exclusive invite verification code is <strong id="demoOtpCode">{previewCode}</strong>."
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-autofill-otp"
                  id="btnAutoFillOtp"
                  onClick={() => {
                    const digits = previewCode.slice(0, 4).split("");
                    setOtp(digits);
                    setOtpError("");
                    doVerify(digits.join(""));
                  }}
                >
                  Auto Fill
                </button>
              </div>
            ) : null}

            {/* 4-digit input row */}
            <div className="otp-inputs-row" id="otpInputsContainer">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="otp-box"
                  id={`otp-${i}`}
                  autoComplete={i === 0 ? "one-time-code" : undefined}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0) {
                      otpRefs.current[i - 1]?.focus();
                    }
                  }}
                  onPaste={i === 0 ? handlePaste : undefined}
                />
              ))}
            </div>

            {otpError ? (
              <div className="otp-error-msg" style={{ display: "block" }}>
                {otpError}
              </div>
            ) : null}

            {/* Modal Action Buttons */}
            <div className="modal-actions">
              <button
                type="button"
                id="btnVerifyOtp"
                disabled={submitting}
                onClick={() => doVerify(otp.join(""))}
                className={`btn-primary-luxury btn-modal-verify ${submitting ? "is-submitting" : ""}`}
              >
                {submitting ? (
                  <span className="btn-loading-flex">
                    <span className="btn-spinner-icon" aria-hidden="true" />
                    <span>Verifying Exclusive Invite...</span>
                  </span>
                ) : (
                  <span>Verify &amp; Generate Exclusive Invite</span>
                )}
              </button>

              <div className="resend-row">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  id="btnResendOtp"
                  disabled={resendIn > 0}
                  onClick={requestResend}
                  className="btn-resend"
                >
                  {resendIn > 0 ? `Resend Code in ${resendIn}s` : "Resend Code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowRight, X, Copy, Check } from "lucide-react";
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
  email: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((val) => val || "")
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Enter a valid email address",
    }),
  isBride: z.string().optional().default("No"),
  purpose: z.array(z.string()).optional().default([]),
  attendingWith: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
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
  email: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((val) => val || "")
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Enter a valid email address",
    }),
});

const DEFAULT_GUEST: GuestDetails = {
  name: "",
  phone: "",
  email: "",
  isBride: "No",
  purpose: [],
  attendingWith: [],
  interests: [],
};

type Step = "form" | "otp" | "pass";
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
  const [copiedPassCode, setCopiedPassCode] = useState(false);
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

  useEffect(() => {
    if (!alreadyRegistered) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAlreadyRegistered(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [alreadyRegistered]);

  const submitForm = async () => {
    setFormError("");
    setAlreadyRegistered(null);
    const result = contactSchema.safeParse({
      name: guest.name,
      phone: guest.phone,
      email: guest.email,
    });
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
      // 1. Instant check if guest is already registered
      try {
        const existing = await checkExisting({
          data: { phone: guest.phone, email: guest.email },
        });
        if (existing?.alreadyRegistered) {
          setAlreadyRegistered({
            message: existing.message,
            passCode: existing.passCode,
          });
          setSubmitting(false);
          return;
        }
      } catch {
        // Proceed on check error
      }

      // 2. Submit to Google Sheets
      const formEl =
        (typeof document !== "undefined" && ((document.forms as any)["guest-form"] || document.getElementById("guest-form"))) ||
        null;
      submitToGoogleSheets(formEl, guest);

      // 3. Trigger Facebook Pixel & Google Tag Lead event
      if (typeof window !== "undefined") {
        if ((window as any).fbq) {
          try {
            (window as any).fbq("track", "Lead", {
              content_name: "Flaunsica RSVP Form",
            });
          } catch (err) {
            console.error("Facebook Pixel Lead tracking error:", err);
          }
        }
        if ((window as any).gtag) {
          try {
            (window as any).gtag("event", "generate_lead", {
              event_category: "RSVP Form",
            });
          } catch (err) {
            console.error("Google tag Lead tracking error:", err);
          }
        }
      }

      // 4. Start Registration (OTP dispatch)
      const res = await start({
        data: {
          name: guest.name.trim(),
          phone: guest.phone,
          email: guest.email.trim(),
          isBride: "No",
          purpose: [],
          attendingWith: [],
          interests: [],
        },
      });

      if (res.alreadyRegistered) {
        setAlreadyRegistered({
          message: res.message || "You are already registered for Flaunsica with these details.",
          passCode: res.passCode,
        });
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
    submitForm();
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
              className={`step-node ${step === "form" ? "active" : "completed"}`}
              id="step-node-1"
            >
              <span className="step-num">{step === "form" ? "1" : "✓"}</span>
              <span className="step-label">Guest Details</span>
            </div>
            <div
              className={`step-line ${step !== "form" ? "completed" : ""}`}
              id="step-line-1"
            />
            <div
              className={`step-node ${step === "otp" ? "active" : step === "pass" ? "completed" : ""}`}
              id="step-node-2"
            >
              <span className="step-num">{step === "pass" ? "✓" : "2"}</span>
              <span className="step-label">Verification</span>
            </div>
            <div
              className={`step-line ${step === "pass" ? "completed" : ""}`}
              id="step-line-2"
            />
            <div
              className={`step-node ${step === "pass" ? "active" : ""}`}
              id="step-node-3"
            >
              <span className="step-num">3</span>
              <span className="step-label">Exclusive Invite</span>
            </div>
          </div>

          {/* The Registration Form */}
          <form id="guest-form" name="guest-form" className="luxury-form" noValidate onSubmit={handleFormSubmit}>
            <div className="form-screen-slide">
              <div className="form-header">
                <div className="form-stage-pill">
                  <span className="stage-pill-dot" />
                  <span>STEP 1 OF 2 • GUEST RESERVATION</span>
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
                  <span className="field-hint">Your QR invite will be sent to this WhatsApp number</span>
                </div>

                {/* 3. Email Address (Optional) */}
                <div className={`form-group floating-group ${errors.email ? "has-error" : ""}`}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder=" "
                    autoComplete="email"
                    value={guest.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                  <label htmlFor="email" className="floating-label">Email Address (Optional)</label>
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

              {formError ? <p className="text-center text-xs text-red-600 font-medium">{formError}</p> : null}

              {/* Get Exclusive Invite Button */}
              <div className="form-submit-row">
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
                {/* <div className="security-caption">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Takes only 15 seconds • Instant verification via WhatsApp & Email</span>
                </div> */}
              </div>
            </div>
          </form>

          {/* Already Registered Popup Modal */}
          {alreadyRegistered && (
            <div
              id="already-registered-modal"
              className="already-registered-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="already-registered-title"
              onClick={(e) => {
                if (e.target === e.currentTarget) setAlreadyRegistered(null);
              }}
            >
              <div className="already-registered-modal-card">
                {/* Top luxury crimson and gold accent line */}
                <div className="already-registered-accent-bar" />

                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setAlreadyRegistered(null)}
                  className="already-registered-close-btn"
                  aria-label="Close popup"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Luxury Seal Icon */}
                <div className="already-registered-icon-wrap">
                  <Sparkles className="w-7 h-7" />
                </div>

                {/* <div className="already-registered-badge">
                  <span>VIP Guest Record Found</span>
                </div> */}

                <h3 id="already-registered-title" className="already-registered-title">
                  Already Registered!
                </h3>

                <p className="already-registered-message">
                  {alreadyRegistered.message}
                </p>

                {/* Highlighted Pass Code Box with Copy */}
                <div className="already-registered-passcode-box">
                  <span className="already-registered-passcode-label">
                    Your Exclusive VIP Pass Code
                  </span>
                  <div className="already-registered-passcode-row">
                    <span className="already-registered-passcode-code">
                      {alreadyRegistered.passCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (alreadyRegistered?.passCode) {
                          navigator.clipboard.writeText(alreadyRegistered.passCode);
                          setCopiedPassCode(true);
                          setTimeout(() => setCopiedPassCode(false), 2000);
                        }
                      }}
                      className="already-registered-copy-btn"
                      title="Copy Pass Code"
                    >
                      {copiedPassCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>{copiedPassCode ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <span className="already-registered-passcode-hint">
                    {copiedPassCode ? "Pass code copied to clipboard!" : "Present this pass code or your QR pass at Park Hyatt."}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="already-registered-actions">
                  <button
                    type="button"
                    id="btnPopupViewPass"
                    onClick={() => {
                      navigate({
                        to: "/thank-you",
                        search: { passCode: alreadyRegistered.passCode },
                      });
                    }}
                    className="already-registered-view-btn"
                  >
                    <span>View My Exclusive Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAlreadyRegistered(null);
                      setGuest(DEFAULT_GUEST);
                      setErrors({});
                    }}
                    className="already-registered-dismiss-btn"
                  >
                    Register Another Guest
                  </button>
                </div>
              </div>
            </div>
          )}
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

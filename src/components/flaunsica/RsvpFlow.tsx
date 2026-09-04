import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { VipPass } from "./VipPass";
import { resendCode, startRegistration, verifyCode } from "@/lib/rsvp.functions";
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
  isBride: z.string().min(1, "Please select an option"),
  purpose: z.array(z.string()).min(1, "Select at least one purpose"),
  attendingWith: z.array(z.string()).min(1, "Select who you're attending with"),
  interests: z.array(z.string()).min(1, "Select at least one category"),
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
type Delivery = { email: boolean; sms: boolean };

export function RsvpFlow() {
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
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
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
      document.getElementById("rsvp-section")?.scrollIntoView({ behavior: "smooth" });
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
          {/* Progress Tracker Header */}
          <div className="form-progress-bar">
            <div className={`step-node ${step === "form" ? "active" : "completed"}`} id="step-node-1">
              <span className="step-num">{step === "form" ? "1" : "✓"}</span>
              <span className="step-label">Guest Details</span>
            </div>
            <div className={`step-line ${step !== "form" ? "completed" : ""}`} id="step-line-1" />
            <div className={`step-node ${step === "otp" ? "active" : ""}`} id="step-node-2">
              <span className="step-num">2</span>
              <span className="step-label">OTP Verification</span>
            </div>
            <div className="step-line" id="step-line-2" />
            <div className="step-node" id="step-node-3">
              <span className="step-num">3</span>
              <span className="step-label">VIP QR Pass</span>
            </div>
          </div>

          <div className="form-header">
            <span className="form-badge">INVITATION DESK</span>
            <h2 className="form-title">Request Your VIP Invitation</h2>
            <p className="form-subtitle">
              Fill in your information below to generate your personalized entry QR pass.
            </p>
          </div>

          {/* The Registration Form */}
          <form id="guest-form" className="luxury-form" noValidate onSubmit={submitForm}>
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
              {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
              <span className="field-hint">Your QR pass will be sent to this WhatsApp number & email</span>
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

            <div className="form-divider"><span>PREFERENCES</span></div>

            {/* 4. Are you a bride? */}
            <div className={`form-group pill-group ${errors.isBride ? "has-error" : ""}`}>
              <label className="group-legend">Are you a bride-to-be?</label>
              <div className="pills-row" role="radiogroup" aria-label="Are you a bride?">
                <label className="radio-pill">
                  <input
                    type="radio"
                    name="isBride"
                    value="Yes"
                    checked={guest.isBride === "Yes"}
                    onChange={() => set("isBride", "Yes")}
                  />
                  <span className="pill-btn"><span className="pill-icon">👰‍♀️</span> Yes, Bride-to-be</span>
                </label>
                <label className="radio-pill">
                  <input
                    type="radio"
                    name="isBride"
                    value="No"
                    checked={guest.isBride === "No"}
                    onChange={() => set("isBride", "No")}
                  />
                  <span className="pill-btn"><span className="pill-icon">✨</span> No, Attending Guest</span>
                </label>
              </div>
              {errors.isBride ? <span className="field-error">{errors.isBride}</span> : null}
            </div>

            {/* 5. Purpose of Visit */}
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

            {formError ? <p className="text-center text-xs text-red-600 font-medium">{formError}</p> : null}

            {/* Submit Button */}
            <div className="form-submit-row">
              <button
                type="submit"
                id="btn-submit-rsvp"
                disabled={submitting}
                className="btn-submit-luxury"
              >
                <span className="btn-submit-text">
                  {submitting ? "Securing VIP Pass..." : "Get My VIP QR Pass"}
                </span>
                <span className="btn-sheen" />
                <svg className="btn-icon-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </button>
              <div className="security-caption">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Instant verification via WhatsApp & Email • Strictly zero spam</span>
              </div>
            </div>
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
              <div className="modal-brand-seal">FLAUNSICA</div>
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
                    "Your Flaunsica 10th Edition VIP pass verification code is <strong id="demoOtpCode">{previewCode}</strong>."
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
                className="btn-primary-luxury btn-modal-verify"
              >
                <span>{submitting ? "Verifying..." : "Verify & Generate VIP Pass"}</span>
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

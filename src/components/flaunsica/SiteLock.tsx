import React, { useState, useEffect, type FormEvent } from "react";

const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD || "11223344";
const STORAGE_KEY = "flaunsica_site_unlocked";

interface SiteLockProps {
  children: React.ReactNode;
}

export function SiteLock({ children }: SiteLockProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        setIsUnlocked(true);
      }
    } catch {
      // Ignore storage errors in private mode
    }
  }, []);

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsSubmitting(true);

    const cleanInput = password.trim();
    if (cleanInput === SITE_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
        document.cookie = `${STORAGE_KEY}=true; path=/; max-age=2592000; SameSite=Lax`;
      } catch {
        // ignore
      }
      setIsUnlocked(true);
    } else {
      setError(true);
      setIsSubmitting(false);
    }
  };

  // If unlocked, render children directly
  if (isMounted && isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="site-lock-overlay">
      <div className="site-lock-bg-pattern" />

      <div className="site-lock-card">
        {/* Brand Header */}
        <div className="site-lock-brand">
          <img
            src="/assets/logos/flaunsica-logo-red.svg"
            alt="Flaunsica Hyderabad"
            className="site-lock-logo"
            width={180}
            height={50}
          />
          <div className="site-lock-edition-badge">
            10TH REFINED EDITION • HYDERABAD
          </div>
        </div>

        {/* Lock Title & Subtitle */}
        <div className="site-lock-header-text">
          <div className="site-lock-icon-circle">
            <svg
              className="site-lock-key-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="site-lock-title">Private Exhibition Preview</h1>
          <p className="site-lock-desc">
            This showcase is strictly reserved for patrons and invited guests.
            Please enter your private access code to proceed.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleUnlock} className="site-lock-form">
          <div className="site-lock-input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="site-access-code"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Enter Access Code"
              className={`site-lock-input ${error ? "has-error" : ""}`}
              autoFocus
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="site-lock-eye-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error && (
            <div className="site-lock-error-msg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Incorrect access code. Please verify and try again.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="site-lock-submit-btn"
          >
            <span>{isSubmitting ? "Verifying..." : "Enter Exhibition"}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        {/* Card Footer */}
        <div className="site-lock-footer">
          <p className="site-lock-concierge">
            Need invitation assistance?{" "}
            <a href="mailto:concierge@flaunsica.com">concierge@flaunsica.com</a>
          </p>
          <div className="site-lock-curator">
            <span>Curated by</span>
            <strong>Prestha</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

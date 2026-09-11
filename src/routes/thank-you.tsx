import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/flaunsica/Navbar";
import { VipPass } from "@/components/flaunsica/VipPass";
import { getPass } from "@/lib/rsvp.functions";
import type { GuestDetails } from "@/components/flaunsica/types";
import { CheckCircle, Calendar, MapPin, Clock, ArrowRight, Home } from "lucide-react";

interface ThankYouSearchParams {
  passCode?: string;
}

export const Route = createFileRoute("/thank-you")({
  validateSearch: (search: Record<string, unknown>): ThankYouSearchParams => {
    return {
      passCode: typeof search.passCode === "string" ? search.passCode : undefined,
    };
  },
  loaderDeps: ({ search: { passCode } }) => ({ passCode }),
  loader: async ({ deps: { passCode } }) => {
    if (!passCode) return null;
    try {
      return await getPass({ data: { passCode } });
    } catch (e) {
      console.error("Failed to fetch pass on thank-you page:", e);
      return null;
    }
  },
  head: () => ({
    meta: [
      { title: "Thank You — Exclusive VIP Invitation Confirmed | Flaunsica Hyderabad" },
      {
        name: "description",
        content:
          "Thank you for registering for Flaunsica Hyderabad – 10th Refined Edition. Your exclusive VIP invite has been confirmed.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Exclusive VIP Invitation Confirmed — Flaunsica" },
      {
        property: "og:description",
        content:
          "Your entry pass for Flaunsica Hyderabad at Park Hyatt on 23 September 2026 is confirmed.",
      },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const navigate = useNavigate();
  const { passCode: urlPassCode } = Route.useSearch();
  const registrationFromLoader = Route.useLoaderData();

  const [guest, setGuest] = useState<GuestDetails | null>(() => {
    if (registrationFromLoader) {
      return {
        name: registrationFromLoader.name,
        phone: registrationFromLoader.phone,
        email: registrationFromLoader.email,
        isBride: registrationFromLoader.is_bride ? "Yes" : "No",
        purpose: registrationFromLoader.purpose || [],
        attendingWith: registrationFromLoader.attending_with || [],
        interests: registrationFromLoader.interests || [],
      };
    }
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("flaunsica_last_guest");
        if (stored) return JSON.parse(stored) as GuestDetails;
      } catch {
        // ignore JSON parse error
      }
    }
    return null;
  });

  const [passCode, setPassCode] = useState<string>(() => {
    if (urlPassCode) return urlPassCode;
    if (registrationFromLoader?.pass_code) return registrationFromLoader.pass_code;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("flaunsica_last_pass_code") || "";
    }
    return "";
  });

  const [delivery] = useState<{ email: boolean; sms: boolean }>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("flaunsica_last_delivery");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return { email: true, sms: true };
  });

  // Fire Facebook Pixel & Google Tag conversion events on page mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ((window as any).fbq) {
        try {
          (window as any).fbq("track", "Lead", {
            content_name: "Flaunsica RSVP",
            status: "confirmed",
          });
          (window as any).fbq("track", "CompleteRegistration", {
            content_name: "Flaunsica VIP Exclusive Invite",
            status: "confirmed",
          });
        } catch (err) {
          console.error("Facebook pixel conversion tracking error:", err);
        }
      }
      if ((window as any).gtag) {
        try {
          (window as any).gtag("event", "conversion", {
            send_to: "G-1ZETJQ92GQ",
            event_category: "RSVP",
            event_label: "Flaunsica VIP Pass Confirmed",
          });
          (window as any).gtag("event", "generate_lead", {
            event_category: "RSVP",
            event_label: "Flaunsica VIP Pass Confirmed",
          });
        } catch (err) {
          console.error("Google tag conversion tracking error:", err);
        }
      }
    }
  }, []);

  // Sync if loader data arrives later
  useEffect(() => {
    if (registrationFromLoader) {
      setPassCode(registrationFromLoader.pass_code);
      setGuest({
        name: registrationFromLoader.name,
        phone: registrationFromLoader.phone,
        email: registrationFromLoader.email,
        isBride: registrationFromLoader.is_bride ? "Yes" : "No",
        purpose: registrationFromLoader.purpose || [],
        attendingWith: registrationFromLoader.attending_with || [],
        interests: registrationFromLoader.interests || [],
      });
    }
  }, [registrationFromLoader]);

  return (
    <div className="landing-page-root thank-you-page-root">
      {/* Luxury Navbar */}
      <Navbar />

      {/* Main Content Area */}
      {guest && passCode ? (
        <main className="thank-you-main" style={{ padding: 0 }}>
          <VipPass
            guest={guest}
            passCode={passCode}
            delivery={delivery}
            onReset={() => navigate({ to: "/" })}
          />
          <div className="thank-you-container" style={{ paddingBottom: "4rem" }}>
            <div className="thank-you-nav-actions">
              <Link to="/curated" className="thank-you-btn-secondary">
                <span>Explore 55+ Designers</span>
                <ArrowRight />
              </Link>
              <Link to="/" className="thank-you-btn-primary">
                <Home />
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        </main>
      ) : (
        <main className="thank-you-main">
          <div className="thank-you-container">
            <div className="thank-you-fallback-card">
              <div className="thank-you-icon-circle">
                <CheckCircle />
              </div>

              <div className="conf-badge">
                <span className="conf-icon">✓</span>
                <span>EXCLUSIVE INVITATION CONFIRMED</span>
              </div>

              <h1 className="thank-you-card-title">Thank You for Registering</h1>

              <p className="thank-you-card-desc">
                Your interest in attending{" "}
                <strong style={{ color: "var(--color-text-dark, #140406)" }}>Flaunsica Hyderabad</strong>{" "}
                has been recorded. Our VIP concierge desk has logged your request and entry
                credentials will be verified at the reception desk.
              </p>

              <div className="thank-you-meta-strip">
                <div className="thank-you-meta-item">
                  <Calendar />
                  <span>Wednesday, 23 Sept 2026</span>
                </div>
                <div className="thank-you-meta-item">
                  <MapPin />
                  <span>Park Hyatt, Hyderabad</span>
                </div>
                <div className="thank-you-meta-item">
                  <Clock />
                  <span>11:00 AM – 7:00 PM</span>
                </div>
              </div>

              <div className="thank-you-nav-actions">
                <Link to="/curated" className="thank-you-btn-secondary">
                  <span>Explore 55+ Designers</span>
                  <ArrowRight />
                </Link>
                <Link to="/" className="thank-you-btn-primary">
                  <Home />
                  <span>Return to Homepage</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Luxury Footer */}
      <footer className="site-footer-luxury mt-auto">
        <div className="footer-container">
          <div className="footer-bottom">
            <p>&copy; 2026 Flaunsica Hyderabad. Curated by Prestha Agarwal. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/">Home</Link>
              <Link to="/curated">The Curation</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

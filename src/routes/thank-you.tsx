import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/flaunsica/Navbar";
import { VipPass } from "@/components/flaunsica/VipPass";
import { getPass } from "@/lib/rsvp.functions";
import type { GuestDetails } from "@/components/flaunsica/types";
import { CheckCircle, Calendar, MapPin, Sparkles, ArrowRight, Home } from "lucide-react";

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

export default function ThankYouPage() {
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

  const [delivery, setDelivery] = useState<{ email: boolean; sms: boolean }>(() => {
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
    <div className="landing-page-root min-h-screen flex flex-col bg-[#fffdfa] text-[#140406]">
      {/* Luxury Navbar */}
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Banner */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7b1113]/8 border border-[#d4af37]/35 text-[#7b1113] text-xs uppercase tracking-[0.2em] font-semibold mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>10TH REFINED EDITION • OFFICIAL CONFIRMATION</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#140406] tracking-tight leading-tight">
              {guest?.name ? `Thank You, ${guest.name}` : "Thank You for Registering"}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#554043] max-w-2xl mx-auto font-light leading-relaxed">
              Your exclusive invitation to{" "}
              <strong className="font-semibold text-[#140406]">Flaunsica Hyderabad</strong> is
              confirmed. Your entry pass and schedule have been dispatched to your WhatsApp and email.
            </p>
          </div>

          {/* If pass details are present, display the official VIP Pass card */}
          {guest && passCode ? (
            <div className="my-8">
              <VipPass guest={guest} passCode={passCode} delivery={delivery} />
            </div>
          ) : (
            /* Fallback confirmation card when no passCode in URL */
            <div className="my-8 p-8 sm:p-12 rounded-2xl bg-white border border-[#d4af37]/30 shadow-xl text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#7b1113]/10 text-[#7b1113] flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#7b1113]" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#140406]">
                Invitation Request Confirmed
              </h2>

              <p className="mt-3 text-sm sm:text-base text-[#6b585a] leading-relaxed">
                Thank you for your interest in attending Flaunsica. Our VIP concierge desk has
                logged your request and our team will share entry credentials directly via WhatsApp
                and email.
              </p>

              <div className="mt-8 pt-6 border-t border-[#f0e6d6] flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#4a3b3d]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>Wednesday, 23 September 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span>Park Hyatt, Hyderabad</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7b1113] text-[#fffdfa] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#5e0c0e] transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Return to Flaunsica Home</span>
                </Link>
              </div>
            </div>
          )}

          {/* Quick Actions & Navigation Footer */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/curated"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[#d4af37] bg-white text-[#140406] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#faf7f2] shadow-sm transition-all"
            >
              <span>Explore 55+ Curated Designers</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37]" />
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#140406] text-[#fffdfa] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#2b0c10] shadow-md transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </main>

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

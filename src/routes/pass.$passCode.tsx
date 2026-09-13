import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CalendarDays, MapPin, ShieldAlert, ArrowRight, Home } from "lucide-react";
import { Navbar } from "@/components/flaunsica/Navbar";
import { VipPass } from "@/components/flaunsica/VipPass";
import type { GuestDetails } from "@/components/flaunsica/types";
import { EVENT } from "@/components/flaunsica/event";
import { getPass } from "@/lib/rsvp.functions";

const TITLE = "Official Exclusive Invite & VIP Pass — Flaunsica Hyderabad";
const DESCRIPTION =
  "Official scan-verified exclusive invitation and digital entry pass for Flaunsica Hyderabad 10th Refined Edition at Park Hyatt.";

export const Route = createFileRoute("/pass/$passCode")({
  loader: ({ params }) => getPass({ data: { passCode: params.passCode } }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PassDetails,
});

function PassDetails() {
  const registration = Route.useLoaderData();
  const { passCode } = Route.useParams();

  if (!registration) {
    return (
      <div className="landing-page-root thank-you-page-root pass-page-root">
        <Navbar />
        <main className="pass-verification-main">
          <div className="pass-verification-container">
            <div className="pass-not-found-card">
              <div className="pass-not-found-icon">
                <ShieldAlert />
              </div>
              <h1 className="pass-not-found-title">Exclusive Invite Not Found</h1>
              <p className="pass-not-found-desc">
                No VIP reservation was found matching invite code{" "}
                <strong className="text-foreground">{passCode}</strong>. Please check your invite
                link or request a new exclusive invitation below.
              </p>
              <div className="thank-you-nav-actions" style={{ justifyContent: "center" }}>
                <Link to="/" className="thank-you-btn-primary">
                  <Home />
                  <span>Request Exclusive Invite</span>
                </Link>
                <Link to="/curated" className="thank-you-btn-secondary">
                  <span>Explore Designers</span>
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </main>
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

  const guest: GuestDetails = {
    name: registration.name,
    phone: registration.phone,
    email: registration.email,
    isBride: registration.is_bride ? "Yes" : "No",
    purpose: registration.purpose || [],
    attendingWith: registration.attending_with || [],
    interests: registration.interests || [],
  };

  return (
    <div className="landing-page-root thank-you-page-root pass-page-root">
      <Navbar />

      <main className="pass-verification-main">
        {/* Verified Status Banner */}
        <div className="pass-status-pill-strip">
          <div className="pass-status-pill">
            <span className="pass-status-dot" />
            <span>Official Exclusive Invite • Verified Guest</span>
          </div>
        </div>

        {/* The Physical VIP Pass / Exclusive Invite Card with High-Res QR Code & Download */}
        <VipPass
          guest={guest}
          passCode={passCode}
          delivery={{ email: true, sms: true }}
        />

        {/* Gate Verification & Concierge Details Card */}
        <div className="pass-verification-container">
          <div className="pass-record-card">
            <div className="pass-record-header">
              <div className="pass-record-title-group">
                <h3>Gate Verification & Registration Details</h3>
                <p>Official Record for Reception Desk Fast-Track Entry</p>
              </div>
              <div className="pass-record-badge">
                <BadgeCheck className="size-4" />
                <span>Scan-Verified Entry</span>
              </div>
            </div>

            <div className="pass-record-grid">
              <div className="pass-record-item">
                <span className="pass-record-label">Exclusive Invite ID</span>
                <span className="pass-code-pill">{registration.pass_code}</span>
              </div>

              <div className="pass-record-item">
                <span className="pass-record-label">Registered Guest</span>
                <span className="pass-record-val font-semibold">{registration.name}</span>
              </div>

              <div className="pass-record-item">
                <span className="pass-record-label">Contact Number</span>
                <span className="pass-record-val">+91 {registration.phone}</span>
              </div>

              <div className="pass-record-item">
                <span className="pass-record-label">Email Address</span>
                <span className="pass-record-val">{registration.email || "—"}</span>
              </div>

              <div className="pass-record-item">
                <span className="pass-record-label">Registration Date</span>
                <span className="pass-record-val">
                  {new Date(registration.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="pass-record-item">
                <span className="pass-record-label">Entry Tier</span>
                <span className="pass-record-val">
                  {registration.is_bride ? "VIP Bride" : "VIP Exclusive Pass"}
                </span>
              </div>

              {registration.purpose && registration.purpose.length > 0 && (
                <div className="pass-record-item sm:col-span-2">
                  <span className="pass-record-label">Purpose of Visit</span>
                  <div className="pass-tags-list">
                    {registration.purpose.map((p, idx) => (
                      <span key={idx} className="pass-tag-pill">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {registration.interests && registration.interests.length > 0 && (
                <div className="pass-record-item sm:col-span-2">
                  <span className="pass-record-label">Shopping Interests</span>
                  <div className="pass-tags-list">
                    {registration.interests.map((i, idx) => (
                      <span key={idx} className="pass-tag-pill">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Venue Information & Google Maps Button */}
            <div className="pass-venue-strip">
              <div className="pass-venue-info">
                <div className="pass-venue-line">
                  <CalendarDays />
                  <span>Wednesday, 23 September 2026 · 11:00 AM – 7:00 PM</span>
                </div>
                <div className="pass-venue-line">
                  <MapPin />
                  <span>The Ballroom, Park Hyatt, Road No. 2, Banjara Hills, Hyderabad</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Park+Hyatt+Hyderabad+Banjara+Hills"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-maps-link"
              >
                <span>Open in Google Maps</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Return & Explore Navigation Actions */}
          <div className="thank-you-nav-actions" style={{ marginTop: "1rem" }}>
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

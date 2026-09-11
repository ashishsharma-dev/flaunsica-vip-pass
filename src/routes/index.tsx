import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/flaunsica/Navbar";
import { RsvpFlow } from "@/components/flaunsica/RsvpFlow";

const TITLE = "Flaunsica Hyderabad – 10th Refined Edition | Official Exclusive Invite & RSVP";
const DESCRIPTION =
  "Hyderabad's most coveted luxury designer trunk show returns to Park Hyatt on 23 September 2026. 55+ Brands. One Curated Edit. Request your exclusive invitation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: "/assets/hero-couture.jpg" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function scrollToRsvp() {
  const target = document.getElementById("rsvp-section");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function Index() {
  return (
    <div className="landing-page-root">
      {/* Universal Luxury Navbar */}
      <Navbar onGetVipPass={scrollToRsvp} />

      <main>
        {/* =================================================================
            HOMEPAGE SECTION 1: HERO & RSVP REGISTRATION
            ================================================================= */}
        <section className="new-hero-section" id="rsvp-section">
          <div className="new-hero-container">
            {/* Left Copy Column */}
            <div className="new-hero-copy-col">
              <h2 className="hero-invite-eyebrow">
                Register for your exclusive invite to attend the
              </h2>

              <div className="hero-10th-logo-wrap">
                <img
                  src="/assets/logos/10th-edition-logo-black.svg"
                  alt="10th Refined Edition"
                  className="hero-10th-main-logo"
                  width={340}
                  height={150}
                />
              </div>
            </div>

            {/* Right Form Column */}
            <div className="new-hero-visual-col new-hero-form-col">
              <RsvpFlow />
            </div>
          </div>
        </section>

        {/* =================================================================
            HOMEPAGE SECTION 3: THE NOTE
            ================================================================= */}
        <section className="the-note-section">
          <div className="the-note-container">
            {/* Left Column: Founder Letter */}
            <div className="the-note-left-col">
              <h2 className="note-main-heading">The Note.</h2>

              <div className="note-letter-body">
                <p className="note-letter-p">
                  I started Flaunsica because I believed there was a better way to bring fashion to the women of Hyderabad. Not more options — the right ones.
                </p>
                <p className="note-letter-p">
                  Every edition, I go looking. For collections that haven't been seen before. For designers doing something that genuinely stops me. For work that I know our audience isn't just ready for — but waiting for, without knowing it yet.
                </p>
                <p className="note-letter-p">
                  That search is what Flaunsica is built on.
                </p>
                <p className="note-letter-p">
                  Ten editions later, the belief hasn't changed. What has changed is the depth of it. The 10th Edition of Flaunsica — X, The Refined Edition — is not just a milestone. It is a declaration of what this platform stands for, of the kind of fashion conversation Hyderabad deserves to be part of, and of the designers I believe are shaping what Indian luxury looks and feels like right now.
                </p>
                <p className="note-letter-p">
                  Flaunsica has always been about curation over volume, intention over noise, and the quiet confidence of a room that knows exactly what it is. Edition X, on September 23 at Park Hyatt Hyderabad, is that room at its most considered.
                </p>
                <p className="note-letter-p">
                  I hope you'll be part of it.
                </p>
              </div>

              <div className="note-signature">
                <span className="note-author">Prestha Agarwal</span>
                <span className="note-role">Founder, Flaunsica · Est. 2014</span>
              </div>
            </div>

            {/* Right Column: Portrait Visual */}
            <div className="the-note-right-col">
              <div className="note-visual-frame">
                <img
                  src="/assets/founder-flaunsica.jpg"
                  alt="Prestha Agarwal - Founder, Flaunsica"
                  className="note-curator-img"
                  loading="lazy"
                  width={1920}
                  height={1280}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            HOMEPAGE SECTION 4: LOCATION & DIRECTIONS
            ================================================================= */}
        <section className="map-location-section" id="location-section">
          <div className="map-location-container">
            {/* Left Column: Interactive Map */}
            <div className="map-location-left-col">
              <div className="map-embed-frame">
                <iframe
                  title="Park Hyatt Hyderabad - Flaunsica Venue Location"
                  src="https://maps.google.com/maps?q=Park+Hyatt+Hyderabad,+Banjara+Hills&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right Column: Location & Directions */}
            <div className="map-location-right-col">
              {/* <div className="location-meta-tag">
                <span className="location-tag-dot" />
                VENUE &amp; DIRECTIONS
              </div> */}

              <h2 className="location-main-heading">Location &amp; Directions</h2>

              <p className="location-info-p">
                Flaunsica’s 10th Refined Edition is hosted at <strong>The Ballroom, Park Hyatt Hyderabad</strong> in Banjara Hills. Valet parking and dedicated VIP concierge reception will be available for all registered guests upon arrival.
              </p>

              <div className="location-contact-details">
                <div className="location-detail-item">
                  <span className="location-detail-label">VENUE &amp; ADDRESS</span>
                  <p className="location-detail-val">
                    The Ballroom, Park Hyatt, Road No. 2, Banjara Hills, Hyderabad, Telangana 500034
                  </p>
                </div>

                <div className="location-detail-item">
                  <span className="location-detail-label">DATE &amp; HOURS</span>
                  <p className="location-detail-val">
                    Wednesday, 23 September 2026 · 11:00 AM to 7:00 PM
                  </p>
                </div>

                <div className="location-detail-item">
                  <span className="location-detail-label">CONTACT &amp; INQUIRIES</span>
                  <p className="location-detail-val">
                    Email: <a href="mailto:flaunsica.hyderabad@gmail.com" className="location-link">flaunsica.hyderabad@gmail.com</a> · Instagram: <a href="https://instagram.com/flaunsica_hyderabad" target="_blank" rel="noopener noreferrer" className="location-link">@flaunsica_hyderabad</a>
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Park+Hyatt+Hyderabad+Road+No+2+Banjara+Hills"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-open-maps-pill"
              >
                <span>Open in Google Maps</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* =================================================================
            HOMEPAGE SECTION 5: ABOVE-FOOTER LANDSCAPE BANNER
            ================================================================= */}
        <section className="above-footer-banner-section">
          <div className="above-footer-banner-container">
            <img
              src="/assets/above-the-footer.png"
              alt="Flaunsica Hyderabad 10th Refined Edition - VIP Entry Details"
              className="above-footer-banner-img"
              loading="lazy"
              width={2431}
              height={837}
            />
          </div>
        </section>
      </main>

      {/* Luxury Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="footer-logo-wrap">
                <img
                  src="/assets/logos/flaunsica-logo-white.svg"
                  alt="Flaunsica Hyderabad"
                  className="footer-brand-logo"
                  width={175}
                  height={49}
                />
              </div>
              <p className="f-tagline">
                The premier sanctuary for luxury couture, haute jewellery, and refined pret trunk shows in Hyderabad.
              </p>
              <div className="f-curated">
                <span>Curated by</span>
                <strong>Prestha Agarwal</strong>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="f-heading">10TH REFINED EDITION</h4>
              <ul className="f-links">
                <li><span>Wednesday, 23 September 2026</span></li>
                <li><span>11:00 AM to 7:00 PM</span></li>
                <li><span>The Ballroom, Park Hyatt, Banjara Hills</span></li>
                <li>
                  <a
                    href="#rsvp-section"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToRsvp();
                    }}
                  >
                    Get Invite
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="f-heading">EXHIBITION SECTIONS</h4>
              <ul className="f-links">
                <li><a href="/curated#fashion-couture">Fashion &amp; Couture Designers</a></li>
                <li><a href="/curated#jewellery">Fine Jewellery Designers</a></li>
                <li><a href="/curated#accessories">Luxury Accessories</a></li>
                <li><a href="/curated#home-lifestyle">Home &amp; Lifestyle</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="f-heading">VIP DESK &amp; INQUIRIES</h4>
              <ul className="f-links">
                <li><a href="mailto:flaunsica.hyderabad@gmail.com">flaunsica.hyderabad@gmail.com</a></li>
                <li><span>Park Hyatt, Banjara Hills, Hyderabad</span></li>
                <li><a href="https://instagram.com/flaunsica_hyderabad" target="_blank" rel="noopener noreferrer">Official Instagram: @flaunsica_hyderabad</a></li>
                <li><a href="#location-section" className="btn-get-directions">Get Directions</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Flaunsica Hyderabad. curated by Prestha Agarwal. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Admission</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

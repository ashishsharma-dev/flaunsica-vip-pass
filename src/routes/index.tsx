import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/flaunsica/Navbar";
import { RsvpFlow } from "@/components/flaunsica/RsvpFlow";

const TITLE = "Flaunsica Hyderabad – 10th Refined Edition | Official VIP Pass & RSVP";
const DESCRIPTION =
  "Hyderabad's most coveted luxury designer trunk show returns to Park Hyatt on 23 September 2026. 55+ Brands. One Curated Edit. Request your exclusive VIP entry pass.";

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
            HOMEPAGE SECTION 1: HERO
            ================================================================= */}
        <section className="new-hero-section">
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

              <p className="hero-editorial-desc">
                55+ Brands. One Curated Edit. Hyderabad’s most coveted luxury designer trunk show returns to <strong>Park Hyatt, Banjara Hills</strong> on <strong>23 September 2026</strong>. Experience hand-picked couture, bridal trousseau, fine jewelry, and contemporary pret curated by Prestha.
              </p>
            </div>

            {/* Right Visual Column */}
            <div className="new-hero-visual-col">
              <div className="hero-visual-frame">
                <img
                  src="/assets/hero-couture.jpg"
                  alt="Flaunsica 10th Refined Edition Couture"
                  className="hero-visual-img"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            HOMEPAGE SECTION 2: INVITATION / RSVP REGISTRATION DESK
            ================================================================= */}
        <section className="new-rsvp-section" id="rsvp-section">
          <div className="new-rsvp-container">
            {/* Left Column */}
            <div className="new-rsvp-left-col">
              <h2 className="section-invite-heading">
                Register for your exclusive invite to attend the
              </h2>

              <a
                href="#form-card-container"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("fullName")?.focus();
                  document.getElementById("form-card-container")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-get-vip-pass-pill"
              >
                Get Invite
              </a>
            </div>

            {/* Right Column: RSVP Registration Form Card */}
            <div className="new-rsvp-right-col">
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
                <strong>Prestha</strong>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="f-heading">10TH REFINED EDITION</h4>
              <ul className="f-links">
                <li><span>Wednesday, 23 September 2026</span></li>
                <li><span>10:00 AM to 8:30 PM</span></li>
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
                <li><a href="mailto:concierge@flaunsica.com">concierge@flaunsica.com</a></li>
                <li><span>Park Hyatt, Banjara Hills, Hyderabad</span></li>
                <li><span>Official Instagram: @flaunsica</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Flaunsica Hyderabad. Curated by Prestha. All rights reserved.</p>
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

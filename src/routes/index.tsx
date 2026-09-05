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
                  I Started Flaunsica Because I Believed There Was A Better Way To Bring Fashion To The Women Of Hyderabad — Not More Options, But The Right Ones. Every Edition, I Go Looking. For Collections That Haven't Been Seen Before, For Designers Who Are Doing Something That Genuinely Stops Me, For Work That I Know My Audience Isn't Just Ready For — But Waiting For, Without Knowing It Yet.
                </p>
                <p className="note-letter-p">
                  That Search Is How I Found You.
                </p>
                <p className="note-letter-p">
                  The 10th Edition Of Flaunsica Is Not Just A Milestone For Me; It Is A Declaration. Of What This Platform Stands For, Of The Kind Of Fashion Conversation Hyderabad Deserves To Be Part Of, And Of The Designers I Believe Are Shaping What Indian Luxury Looks And Feels Like Right Now.
                </p>
                <p className="note-letter-p">
                  This Invitation Doesn't Go Out Broadly. Every Designer Who Walks Into A Flaunsica Is Here Because Their Work Said Something — Something I Couldn't Look Away From, And Something I Knew Our Community Of Hyderabad Needed To See.
                </p>
                <p className="note-letter-p">
                  I Hope You'll Be Part Of This.
                </p>
              </div>

              <div className="note-signature">
                <span className="note-author">- Prestha Agarwal</span>
                <span className="note-role">FOUNDER &amp; CURATOR</span>
              </div>
            </div>

            {/* Right Column: Portrait Visual */}
            <div className="the-note-right-col">
              <div className="note-visual-frame">
                <img
                  src="/assets/ad2.jpg"
                  alt="Prestha Agarwal - Founder & Curator, Flaunsica"
                  className="note-curator-img"
                  loading="lazy"
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
                    VIP Fast-Track RSVP
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

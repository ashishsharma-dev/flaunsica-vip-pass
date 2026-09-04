import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ad1Image from "@/assets/ad1.jpg";
import ad2Image from "@/assets/ad2.jpg";
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
      { property: "og:image", content: "/assets/ad2.jpg" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function scrollToRsvp() {
  document.getElementById("rsvp-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Index() {
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setStickyVisible(true);
      } else {
        setStickyVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page-root">
      {/* Top Announcement Bar */}
      <aside className="announcement-bar" role="complementary" aria-label="Event Details">
        <div className="announcement-container">
          <span className="announcement-pill">LIMITED VIP SLOTS</span>
          <span className="announcement-text">
            10th Refined Edition • 23 September 2026 • Park Hyatt, Banjara Hills, Hyderabad • Curated by Aishwarya &amp; Prestha
          </span>
          <a href="#rsvp-section" onClick={(e) => { e.preventDefault(); scrollToRsvp(); }} className="announcement-link">
            Claim Free VIP Pass &rarr;
          </a>
        </div>
      </aside>

      {/* Luxury Navigation Header */}
      <header className="site-header">
        <div className="nav-container">
          <a href="#" className="brand-group" aria-label="Flaunsica Hyderabad">
            <span className="brand-title">F<span>L</span>AUNSICA</span>
            <span className="brand-location">HYDERABAD</span>
          </a>

          <div className="header-edition-badge">
            <span className="edition-roman">10<sup>TH</sup></span>
            <span className="edition-label">REFINED<br />EDITION</span>
          </div>

          <div className="header-actions">
            <div className="event-quick-date">
              <svg className="icon-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>23.09.2026</span>
            </div>
            <a href="#rsvp-section" onClick={(e) => { e.preventDefault(); scrollToRsvp(); }} className="btn-nav-rsvp">
              Get VIP Pass
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-backdrop-grain" />
          <div className="hero-glow-orb" />

          <div className="hero-container">
            {/* Hero Copy Column */}
            <div className="hero-copy-col">
              <div className="edition-tag">
                <span className="gold-sparkle">✦</span>
                <span>10TH REFINED EDITION</span>
                <span className="gold-sparkle">✦</span>
              </div>

              <h1 className="hero-headline">
                55+ Brands.<br />
                <span className="italic-emphasis">One Curated Edit.</span>
              </h1>

              <p className="hero-subtext">
                Hyderabad’s most coveted luxury designer trunk show returns to <strong>Park Hyatt</strong>. Experience hand-picked couture, bridal trousseau, fine jewelry, and contemporary pret — all under one roof.
              </p>

              {/* Event Meta Grid */}
              <div className="event-meta-grid">
                <div className="meta-pill">
                  <div className="meta-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="meta-info">
                    <span className="meta-label">DATE</span>
                    <span className="meta-value">23 September 2026</span>
                  </div>
                </div>

                <div className="meta-pill">
                  <div className="meta-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="meta-info">
                    <span className="meta-label">VENUE</span>
                    <span className="meta-value">Park Hyatt, Banjara Hills</span>
                  </div>
                </div>

                <div className="meta-pill">
                  <div className="meta-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="meta-info">
                    <span className="meta-label">ACCESS</span>
                    <span className="meta-value">Exclusive VIP Entry by RSVP</span>
                  </div>
                </div>
              </div>

              {/* Hero CTA & Curator Seal */}
              <div className="hero-actions-row">
                <a
                  href="#rsvp-section"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToRsvp();
                  }}
                  className="btn-primary-luxury"
                >
                  <span className="btn-text">Request VIP Invitation / RSVP Now</span>
                  <span className="btn-sheen" />
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>

                <div className="curator-seal">
                  <span className="seal-caption">CURATED BY</span>
                  <span className="seal-names">Aishwarya &amp; Prestha</span>
                </div>
              </div>

              <div className="live-counter-strip">
                <span className="live-pulse-dot" />
                <span className="counter-text">
                  <strong>1,280+ VIP Passes Claimed</strong> • Fast-Track Registration Closes Soon
                </span>
              </div>
            </div>

            {/* Hero Visual Column */}
            <div className="hero-visual-col">
              <div className="visual-editorial-stack">
                {/* Main Editorial Card 1 */}
                <div className="editorial-card card-primary">
                  <div className="card-image-wrap">
                    <img
                      src={ad2Image}
                      alt="Flaunsica 10th Refined Edition - 55+ Brands"
                      loading="eager"
                      className="editorial-img"
                    />
                  </div>
                  <div className="card-glass-tag">
                    <span className="tag-title">55+ Brands</span>
                    <span className="tag-subtitle">One Curated Edit</span>
                  </div>
                </div>

                {/* Overlapping Editorial Card 2 */}
                <div className="editorial-card card-secondary">
                  <div className="card-image-wrap">
                    <img
                      src={ad1Image}
                      alt="Flaunsica Park Hyatt Jewellery & Couture"
                      loading="eager"
                      className="editorial-img"
                    />
                  </div>
                  <div className="floating-badge-gold">
                    <span className="badge-sub">SAVE THE DATE</span>
                    <span className="badge-main">23.09.2026</span>
                    <span className="badge-loc">PARK HYATT</span>
                  </div>
                </div>

                {/* Decorative Luxury Accent Frame */}
                <div className="luxury-frame-border" />
              </div>
            </div>
          </div>
        </section>

        {/* Why Pre-Register / Lead Magnet Hook */}
        <section className="lead-magnet-section">
          <div className="section-container">
            <div className="section-header-center">
              <span className="sub-lead-eyebrow">THE PRIVILEGES OF RSVP</span>
              <h2 className="section-title">Why Pre-Register?</h2>
              <p className="section-desc">Experience effortless luxury from the moment you arrive at Park Hyatt.</p>
            </div>

            <div className="benefits-grid">
              {/* Benefit 1 */}
              <div className="benefit-card">
                <div className="benefit-number">01</div>
                <div className="benefit-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M7 8h10M7 12h6M7 16h4" />
                    <circle cx="17" cy="15" r="2" />
                  </svg>
                </div>
                <h3 className="benefit-title">Priority VIP Entry</h3>
                <p className="benefit-body">
                  Fast-track queue privileges via your personal digital QR Pass. Skip the on-ground registration queue and enter directly into the exhibition hall.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="benefit-card">
                <div className="benefit-number">02</div>
                <div className="benefit-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="benefit-title">Curated Preview Access</h3>
                <p className="benefit-body">
                  First look at festive couture and runway drops from 55+ hand-picked luxury designer labels from Delhi, Mumbai, Kolkata, and Hyderabad.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="benefit-card">
                <div className="benefit-number">03</div>
                <div className="benefit-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3 className="benefit-title">Bespoke Bridal Consults</h3>
                <p className="benefit-body">
                  Dedicated styling sessions and custom bridal trousseau consultations with master couturiers and certified heritage jewelry houses.
                </p>
              </div>
            </div>

            {/* Curated Categories Tape */}
            <div className="category-strip">
              <div className="cat-pill">Haute Bridal Couture</div>
              <span className="cat-dot">◆</span>
              <div className="cat-pill">Fine Jadau &amp; Diamonds</div>
              <span className="cat-dot">◆</span>
              <div className="cat-pill">Contemporary Pret</div>
              <span className="cat-dot">◆</span>
              <div className="cat-pill">Heritage Weaves</div>
              <span className="cat-dot">◆</span>
              <div className="cat-pill">Luxury Trousseau</div>
              <span className="cat-dot">◆</span>
              <div className="cat-pill">Couture Accessories</div>
            </div>
          </div>
        </section>

        {/* Guest Registration Section (Step 1, 2, 3) */}
        <RsvpFlow />

        {/* Curated Showcase Highlights */}
        <section className="experience-section">
          <div className="section-container">
            <div className="section-header-center">
              <span className="sub-lead-eyebrow">WHAT TO EXPECT</span>
              <h2 className="section-title">Curated Showcase Highlights</h2>
              <p className="section-desc">Four premier retail verticals selected for discerning connoisseurs and modern brides.</p>
            </div>

            <div className="showcase-grid">
              <div className="showcase-card">
                <div className="showcase-badge">01 • BRIDAL &amp; COUTURE</div>
                <h3 className="showcase-heading">Bridal Lehengas &amp; Festive Ensembles</h3>
                <p className="showcase-text">
                  From intricate zardozi handcraft to contemporary silhouette gowns, browse exclusive trunk show edits by India’s sought-after ateliers.
                </p>
              </div>

              <div className="showcase-card">
                <div className="showcase-badge">02 • FINE JEWELLERY</div>
                <h3 className="showcase-heading">Polki, Jadau &amp; Certified Solitaires</h3>
                <p className="showcase-text">
                  Masterfully crafted heirloom jewelry, temple ornaments, and everyday modern diamond baubles ready for immediate acquisition.
                </p>
              </div>

              <div className="showcase-card">
                <div className="showcase-badge">03 • CONTEMPORARY PRET</div>
                <h3 className="showcase-heading">Indo-Western &amp; Luxury Resort Wear</h3>
                <p className="showcase-text">
                  Effortless coord sets, draped saris, statement jackets, and ready-to-wear pieces tailored for modern luxury living.
                </p>
              </div>

              <div className="showcase-card">
                <div className="showcase-badge">04 • ACCESSORIES &amp; GIFTS</div>
                <h3 className="showcase-heading">Embellished Clutches &amp; Footwear</h3>
                <p className="showcase-text">
                  Handcrafted potlis, designer footwear, bespoke trousseau packaging, and luxury lifestyle gifting accents.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Venue & Date Spotlight */}
        <section className="venue-spotlight">
          <div className="section-container">
            <div className="venue-box">
              <div className="venue-content">
                <span className="venue-eyebrow">THE RENDEZVOUS</span>
                <h2 className="venue-title">Park Hyatt Hyderabad</h2>
                <p className="venue-address">
                  Road No. 2, Sri Nagar Colony, Kamalapuri Colony, Banjara Hills, Hyderabad, Telangana 500034
                </p>

                <div className="venue-perks">
                  <div className="v-perk">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                    <span>Complimentary Valet Parking Available</span>
                  </div>
                  <div className="v-perk">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Doors Open 10:00 AM to 8:30 PM</span>
                  </div>
                  <div className="v-perk">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>Dedicated VIP Check-in Desk</span>
                  </div>
                </div>

                <div className="venue-actions">
                  <a
                    href="https://maps.google.com/?q=Park+Hyatt+Hyderabad+Banjara+Hills"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-venue-directions"
                  >
                    <span>Open Google Maps</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                  <a
                    href="#rsvp-section"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToRsvp();
                    }}
                    className="btn-venue-rsvp"
                  >
                    Reserve My Pass &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Col 1 */}
            <div className="footer-col brand-col">
              <div className="f-logo">FLAUNSICA</div>
              <div className="f-loc">HYDERABAD</div>
              <p className="f-tagline">
                The premier sanctuary for luxury couture, haute jewellery, and refined pret trunk shows.
              </p>
              <div className="f-curated">
                <span>Curated by</span>
                <strong>Aishwarya &amp; Prestha</strong>
              </div>
            </div>

            {/* Col 2 */}
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

            {/* Col 3 */}
            <div className="footer-col">
              <h4 className="f-heading">CATEGORIES</h4>
              <ul className="f-links">
                <li><span>Bridal Trousseau &amp; Couture</span></li>
                <li><span>Polki, Jadau &amp; Fine Jewelry</span></li>
                <li><span>Contemporary Designer Pret</span></li>
                <li><span>Luxury Clutches &amp; Footwear</span></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="footer-col">
              <h4 className="f-heading">VIP DESK &amp; INQUIRIES</h4>
              <ul className="f-links">
                <li><a href="mailto:rsvp@flaunsica.com">rsvp@flaunsica.com</a></li>
                <li><a href="tel:+919849000000">+91 (Hyderabad VIP Concierge)</a></li>
                <li><span>Official Instagram: @flaunsica</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Flaunsica Hyderabad. Curated by Aishwarya &amp; Prestha. All rights reserved.</p>
            <p className="footer-legal">Designed for High-Fashion Connoisseurs &amp; Brides-to-be.</p>
          </div>
        </div>
      </footer>

      {/* Floating Mobile Sticky RSVP Bar */}
      <div className={`mobile-sticky-bar ${stickyVisible ? "visible" : ""}`} id="mobileStickyBar">
        <div className="mobile-bar-content">
          <div className="mobile-bar-info">
            <span className="m-date">23 SEP 2026 • PARK HYATT</span>
            <span className="m-title">Flaunsica 10th Edition</span>
          </div>
          <a
            href="#rsvp-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToRsvp();
            }}
            className="btn-mobile-rsvp"
          >
            Claim VIP Pass &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

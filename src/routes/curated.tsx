import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/flaunsica/Navbar";

export const Route = createFileRoute("/curated")({
  component: CuratedPage,
});

interface BrandPartner {
  name: string;
  logo: string;
}

const FASHION_COUTURE_BRANDS: BrandPartner[] = [
  { name: "Afew Rahul Mishra", logo: "/assets/Fashion And Couture Designers/Afew Rahul Mishra.png" },
  { name: "AK-OK", logo: "/assets/Fashion And Couture Designers/Ak OK.png" },
  { name: "Amishi London", logo: "/assets/Fashion And Couture Designers/amishi london.png" },
  { name: "Ankush Jain", logo: "/assets/Fashion And Couture Designers/ankush_jain_logo.png" },
  { name: "Daatri", logo: "/assets/Fashion And Couture Designers/Daatri (1).png" },
  { name: "Dhaaga", logo: "/assets/Fashion And Couture Designers/Dhaaga.png" },
  { name: "Dusala", logo: "/assets/Fashion And Couture Designers/Dusala.png" },
  { name: "Dusha", logo: "/assets/Fashion And Couture Designers/Dusha.png" },
  { name: "Hirika D", logo: "/assets/Fashion And Couture Designers/Hirika D Logo.png" },
  { name: "Ivory Rose", logo: "/assets/Fashion And Couture Designers/Ivory Rose.png" },
  { name: "Jigya M", logo: "/assets/Fashion And Couture Designers/JIgya J.png" },
  { name: "Kalighata", logo: "/assets/Fashion And Couture Designers/Kalighata.png" },
  { name: "Kashmiraa", logo: "/assets/Fashion And Couture Designers/Kashmiraa.png" },
  { name: "Kavita B", logo: "/assets/Fashion And Couture Designers/Kavita B.png" },
  { name: "Khanijo", logo: "/assets/Fashion And Couture Designers/Khanijo.png" },
  { name: "Kliitche", logo: "/assets/Fashion And Couture Designers/Kliitche.png" },
  { name: "Kloset by K", logo: "/assets/Fashion And Couture Designers/Kloset by K logo.png" },
  { name: "Label Vee", logo: "/assets/Fashion And Couture Designers/Label Vee.png" },
  { name: "Main Atelier", logo: "/assets/Fashion And Couture Designers/main logo.png" },
  { name: "Marabu", logo: "/assets/Fashion And Couture Designers/Marabu.png" },
  { name: "Maya", logo: "/assets/Fashion And Couture Designers/Maya.png" },
  { name: "Morphe", logo: "/assets/Fashion And Couture Designers/Morphe.png" },
  { name: "Naki India", logo: "/assets/Fashion And Couture Designers/Naki India .png" },
  { name: "Nandita Bist", logo: "/assets/Fashion And Couture Designers/Nandita_bist.png" },
  { name: "Pallavi", logo: "/assets/Fashion And Couture Designers/Pallavi logo.png" },
  { name: "Phases by Alisha", logo: "/assets/Fashion And Couture Designers/Phases by Alisha.png" },
  { name: "RAH Tribe", logo: "/assets/Fashion And Couture Designers/RAH Tribe.png" },
  { name: "Redifine", logo: "/assets/Fashion And Couture Designers/Redifine.png" },
  { name: "Sainy Garg", logo: "/assets/Fashion And Couture Designers/Sainy Garg.png" },
  { name: "Sameer Patel", logo: "/assets/Fashion And Couture Designers/Sameer Patel.png" },
  { name: "Sanhi", logo: "/assets/Fashion And Couture Designers/Sanhi.png" },
  { name: "Sav. Boond", logo: "/assets/Fashion And Couture Designers/Sav. boond.png" },
  { name: "Sehar", logo: "/assets/Fashion And Couture Designers/Sehar.png" },
  { name: "Sila", logo: "/assets/Fashion And Couture Designers/Sila.png" },
  { name: "Siorai", logo: "/assets/Fashion And Couture Designers/Siorai.png" },
  { name: "Smriti", logo: "/assets/Fashion And Couture Designers/Smriti.png" },
  { name: "Store Ivory", logo: "/assets/Fashion And Couture Designers/Store Ivory.png" },
  { name: "Stotram", logo: "/assets/Fashion And Couture Designers/Stotram.png" },
  { name: "The Pink Mirror", logo: "/assets/Fashion And Couture Designers/The Pink MIrror.png" },
  { name: "Trisara", logo: "/assets/Fashion And Couture Designers/Trisara.png" },
  { name: "Vedangi", logo: "/assets/Fashion And Couture Designers/Vedangi logo.png" },
  { name: "Vivek Karunakaran", logo: "/assets/Fashion And Couture Designers/vivek Karunakaran.png" },
  { name: "Yashodhara", logo: "/assets/Fashion And Couture Designers/Yashodhara.png" },
  { name: "Zephyr", logo: "/assets/Fashion And Couture Designers/Zephyr_logo.png" },
];

const JEWELLERY_BRANDS: BrandPartner[] = [
  { name: "Deepa Gurnani", logo: "/assets/Jewellery/Deepa Gurnanai.png" },
  { name: "Ennea Jewels", logo: "/assets/Jewellery/Ennea.png" },
  { name: "MNSH", logo: "/assets/Jewellery/MNSH.png" },
  { name: "Naar Jewels", logo: "/assets/Jewellery/Naar.png" },
  { name: "Pichola", logo: "/assets/Jewellery/Pichola.png" },
  { name: "Raas Jewellers", logo: "/assets/Jewellery/Raas Jewellers.png" },
  { name: "Rah Jewels", logo: "/assets/Jewellery/Rah Jewels.png" },
  { name: "Wavelength", logo: "/assets/Jewellery/Wavelength.png" },
];

const ACCESSORIES_BRANDS: BrandPartner[] = [
  { name: "Mesh", logo: "/assets/Accessories/Mesh.png" },
  { name: "Midorii", logo: "/assets/Accessories/midorii.png" },
  { name: "Saree Sneakers", logo: "/assets/Accessories/Saree Sneaakers.png" },
  { name: "Wrap Game", logo: "/assets/Accessories/Wrapgame.png" },
];

const LIFESTYLE_BRANDS: BrandPartner[] = [
  { name: "Diva Riche", logo: "/assets/Home & Lifestyle/Diva Riche.png" },
];

function BrandGrid({ brands }: { brands: BrandPartner[] }) {
  return (
    <div className="curation-brand-grid">
      {brands.map((brand, i) => (
        <div key={i} className="curation-brand-card">
          <div className="curation-brand-logo-frame">
            <img
              src={brand.logo}
              alt={brand.name}
              className="curation-brand-logo-img"
              loading="lazy"
            />
          </div>
          <span className="curation-brand-title">{brand.name}</span>
        </div>
      ))}
    </div>
  );
}

function CuratedPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Universal Header */}
      <Navbar />

      <main className="curated-main-wrapper">
        {/* Full-width Crimson Ribbon Bar */}
        <div className="curation-ribbon-bar">
          <div className="curation-ribbon-content">
            <h1 className="curation-ribbon-title">The Curation</h1>
          </div>
        </div>

        {/* Vogue-style Category Sub-Navigation Bar */}
        <nav className="curation-subnav-bar" aria-label="Category Navigation">
          <div className="curation-subnav-links">
            <a href="#fashion-couture" className="curation-subnav-link">
              Fashion &amp; Couture ({FASHION_COUTURE_BRANDS.length})
            </a>
            <a href="#jewellery" className="curation-subnav-link">
              Jewellery ({JEWELLERY_BRANDS.length})
            </a>
            <a href="#accessories" className="curation-subnav-link">
              Accessories ({ACCESSORIES_BRANDS.length})
            </a>
            <a href="#home-lifestyle" className="curation-subnav-link">
              Home &amp; Lifestyle ({LIFESTYLE_BRANDS.length})
            </a>
          </div>
        </nav>

        {/* SECTION 1: FASHION AND COUTURE DESIGNERS */}
        <section className="curation-category-section" id="fashion-couture">
          {/* Edge-to-Edge Single Banner Image */}
          <div className="curation-edge-banner">
            <img
              src="/assets/hero-couture.jpg"
              alt="Fashion And Couture Designers"
              className="curation-edge-banner-img"
              loading="eager"
            />
            <div className="curation-edge-banner-overlay">
              {/* <span className="curation-edge-banner-badge">CATEGORY 01 • ATELIER SHOWCASE</span> */}
              {/* <h2 className="curation-edge-banner-title">Fashion And Couture Designers</h2> */}
            </div>
          </div>

          <div className="curation-brand-partners-wrap">
            <div className="curation-category-intro">
              {/* <span className="curation-category-count">{FASHION_COUTURE_BRANDS.length} Brand Partners</span> */}
              <h3 className="curation-category-headline">Fashion And Couture Designers</h3>
              <div className="curation-title-divider" />
            </div>

            {/* Brand Logos Grid */}
            <BrandGrid brands={FASHION_COUTURE_BRANDS} />
          </div>
        </section>

        {/* SECTION 2: JEWELLERY DESIGNERS */}
        <section className="curation-category-section" id="jewellery">
          {/* Edge-to-Edge Single Banner Image */}
          <div className="curation-edge-banner">
            <img
              src="/assets/ad1.jpg"
              alt="Jewellery Designers"
              className="curation-edge-banner-img"
              loading="lazy"
            />
            <div className="curation-edge-banner-overlay">
              {/* <span className="curation-edge-banner-badge">CATEGORY 02 • HIGH JEWELLERY</span> */}
              {/* <h2 className="curation-edge-banner-title">Jewellery Designers</h2> */}
            </div>
          </div>

          <div className="curation-brand-partners-wrap">
            <div className="curation-category-intro">
              {/* <span className="curation-category-count">{JEWELLERY_BRANDS.length} Brand Partners</span> */}
              <h3 className="curation-category-headline">Jewellery Designers</h3>
              <div className="curation-title-divider" />
            </div>

            {/* Brand Logos Grid */}
            <BrandGrid brands={JEWELLERY_BRANDS} />
          </div>
        </section>

        {/* SECTION 3: ACCESSORIES */}
        <section className="curation-category-section" id="accessories">
          {/* Edge-to-Edge Single Banner Image */}
          <div className="curation-edge-banner">
            <img
              src="/assets/ad2.jpg"
              alt="Artisanal Accessories"
              className="curation-edge-banner-img"
              loading="lazy"
            />
            <div className="curation-edge-banner-overlay">
              {/* <span className="curation-edge-banner-badge">CATEGORY 03 • ARTISANAL ACCESSORIES</span> */}
              {/* <h2 className="curation-edge-banner-title">Accessories</h2> */}
            </div>
          </div>

          <div className="curation-brand-partners-wrap">
            <div className="curation-category-intro">
              {/* <span className="curation-category-count">{ACCESSORIES_BRANDS.length} Brand Partners</span> */}
              <h3 className="curation-category-headline">Accessories</h3>
              <div className="curation-title-divider" />
            </div>

            {/* Brand Logos Grid */}
            <BrandGrid brands={ACCESSORIES_BRANDS} />
          </div>
        </section>

        {/* SECTION 4: HOME & LIFESTYLE */}
        <section className="curation-category-section" id="home-lifestyle">
          {/* Edge-to-Edge Single Banner Image */}
          <div className="curation-edge-banner">
            <img
              src="/assets/hero-couture.jpg"
              alt="Home & Lifestyle"
              className="curation-edge-banner-img"
              loading="lazy"
            />
            <div className="curation-edge-banner-overlay">
              {/* <span className="curation-edge-banner-badge">CATEGORY 04 • CURATED LIVING</span> */}
              {/* <h2 className="curation-edge-banner-title">Home &amp; Lifestyle</h2> */}
            </div>
          </div>

          <div className="curation-brand-partners-wrap">
            <div className="curation-category-intro">
              {/* <span className="curation-category-count">{LIFESTYLE_BRANDS.length} Brand Partner</span> */}
              <h3 className="curation-category-headline">Home &amp; Lifestyle</h3>
              <div className="curation-title-divider" />
            </div>

            {/* Brand Logos Grid */}
            <BrandGrid brands={LIFESTYLE_BRANDS} />
          </div>
        </section>

        {/* Bottom VIP Invitation Call to Action */}
        <section className="curation-cta-section">
          <div className="curation-cta-card">
            <span className="curation-cta-badge">10TH REFINED EDITION • 23 SEPT 2026</span>
            <h2 className="curation-cta-title">Experience The Curation in Person</h2>
            <p className="curation-cta-subtitle">
              Join Hyderabad’s most discerning tastemakers and collectors at Park Hyatt, Banjara Hills. Complimentary VIP passes are strictly limited.
            </p>
            <a href="/#rsvp-section" className="btn-submit-luxury curation-cta-btn">
              <span>Get Invite</span>
              <span className="btn-sheen" />
              <svg className="btn-icon-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </a>
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
                  <a href="/#rsvp-section">
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

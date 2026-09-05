import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/flaunsica/Navbar";
import { CuratedSlider, type SlideItem } from "@/components/flaunsica/CuratedSlider";

export const Route = createFileRoute("/curated")({
  component: CuratedPage,
});

const FASHION_SLIDES: SlideItem[] = [
  {
    id: "f1",
    image: "/assets/hero-couture.jpg",
    title: "Couture Bridal & Royal Trousseau",
    designer: "Prestha Curations",
    tagline: "Hand-embellished zardozi, ethereal silks, and timeless silhouettes.",
    category: "Couture Fashion",
  },
  {
    id: "f2",
    image: "/assets/ad1.jpg",
    title: "Contemporary Pret & Resort Wear",
    designer: "Leading Indian Ateliers",
    tagline: "Modern luxury draping, handcrafted weaves, and festive elegance.",
    category: "Designer Pret",
  },
  {
    id: "f3",
    image: "/assets/ad2.jpg",
    title: "Heritage Weaves & Banarasi Masterpieces",
    designer: "Master Artisans",
    tagline: "Reviving authentic handlooms with regal gold & silver zari work.",
    category: "Heritage Textiles",
  },
];

const JEWELLERY_SLIDES: SlideItem[] = [
  {
    id: "j1",
    image: "/assets/ad1.jpg",
    title: "High Jewellery & Polki Heirlooms",
    designer: "Heritage Master Jewellers",
    tagline: "Uncut diamonds, syndicate polki, and Zambian emeralds crafted for royalty.",
    category: "Fine Jewellery",
  },
  {
    id: "j2",
    image: "/assets/hero-couture.jpg",
    title: "Solitaire Diamonds & Modern Elegance",
    designer: "Connoisseur Vault",
    tagline: "Certified high-grade solitaires set in delicate rose & platinum designs.",
    category: "Diamond Couture",
  },
  {
    id: "j3",
    image: "/assets/ad2.jpg",
    title: "Temple & Antique Gold Artistry",
    designer: "Southern Heritage Goldsmiths",
    tagline: "Detailed nakashi engraving and authentic South Indian heirloom necklaces.",
    category: "Antique Gold",
  },
];

const ACCESSORIES_SLIDES: SlideItem[] = [
  {
    id: "a1",
    image: "/assets/ad2.jpg",
    title: "Artisanal Clutches & Minaudières",
    designer: "Bespoke Luxury Ateliers",
    tagline: "Hand-embroidered box clutches, mother-of-pearl inlays, and jeweled handles.",
    category: "Luxury Bags",
  },
  {
    id: "a2",
    image: "/assets/hero-couture.jpg",
    title: "Handcrafted Bridal Footwear & Juttis",
    designer: "Couture Cordwainers",
    tagline: "Plush leather insoles embellished with dabka, gota, and fine crystals.",
    category: "Couture Footwear",
  },
];

const LIFESTYLE_SLIDES: SlideItem[] = [
  {
    id: "l1",
    image: "/assets/ad1.jpg",
    title: "Haute Parfumerie & Pure Oudhs",
    designer: "Ajmal & Master Noses",
    tagline: "Intoxicating amber, rare Damask rose, and ceremonial incense creations.",
    category: "Fragrance & Scents",
  },
  {
    id: "l2",
    image: "/assets/ad2.jpg",
    title: "Heirloom Living & Artisanal Tableware",
    designer: "Luxury Decor Collectives",
    tagline: "Hand-blown glassware, gold leaf servers, and bespoke porcelain sets.",
    category: "Home & Living",
  },
];

// Brand Partners
const FASHION_BRANDS = [
  "Aadyam Handwoven",
  "Ahujasons",
  "Ajmal Dubai",
  "Dyson",
  "Indian Heirloom Co.",
  "Merci",
  "Momentz",
  "Moroccanoil",
  "Nebula by Titan",
  "Nespresso",
  "Rivvaz",
  "Shynora",
  "Shakkar",
];

const JEWELLERY_BRANDS = [
  "Bishan Since 1933",
  "Charu Jewels",
  "De Beers Group",
  "Diva Jewels",
  "Gajraj Jewellers",
  "Forevermark",
];

const ACCESSORIES_BRANDS = [
  "Rivvaz Luxury",
  "Shynora Handcrafted",
  "Indian Heirloom Co.",
  "Merci Accessories",
  "Ahujasons Shawls",
];

const LIFESTYLE_BRANDS = [
  "Ajmal Dubai Fragrances",
  "Dyson Luxury Living",
  "Momentz Silver & Decor",
  "Nespresso Coffee Connoisseur",
  "Nebula Fine Timepieces",
];

function BrandStrip({ brands }: { brands: string[] }) {
  return (
    <div className="curated-brand-strip">
      <div className="curated-brand-grid">
        {brands.map((brand, i) => (
          <div key={i} className="curated-brand-badge">
            <span className="brand-badge-name">{brand}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CuratedPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      {/* Universal Navbar */}
      <Navbar />

      <main className="curated-main-wrapper">
        {/* Full-width Crimson Sub-Banner */}
        <div className="curation-ribbon-bar">
          <div className="curation-ribbon-content">
            <span className="ribbon-sparkle">✦</span>
            <h1 className="curation-ribbon-title">The Curation</h1>
            <span className="ribbon-sparkle">✦</span>
          </div>
        </div>

        {/* Section 1: Fashion And Couture Designers */}
        <section className="curation-category-section" id="fashion-couture">
          <div className="curation-container">
            <div className="curation-section-header">
              <h2 className="curation-category-title">Fashion And Couture Designers</h2>
              <div className="curation-title-divider" />
            </div>

            {/* Interactive Touch Slider */}
            <CuratedSlider items={FASHION_SLIDES} autoplayInterval={4500} />

            {/* Brand Logos Strip */}
            <BrandStrip brands={FASHION_BRANDS} />
          </div>
        </section>

        {/* Section 2: Jewellery Designers */}
        <section className="curation-category-section" id="jewellery">
          <div className="curation-container">
            <div className="curation-section-header">
              <h2 className="curation-category-title">Jewellery Designers</h2>
              <div className="curation-title-divider" />
            </div>

            {/* Interactive Touch Slider */}
            <CuratedSlider items={JEWELLERY_SLIDES} autoplayInterval={5000} />

            {/* Brand Logos Strip */}
            <BrandStrip brands={JEWELLERY_BRANDS} />
          </div>
        </section>

        {/* Section 3: Accessories */}
        <section className="curation-category-section" id="accessories">
          <div className="curation-container">
            <div className="curation-section-header">
              <h2 className="curation-category-title">Accessories</h2>
              <div className="curation-title-divider" />
            </div>

            {/* Interactive Touch Slider */}
            <CuratedSlider items={ACCESSORIES_SLIDES} autoplayInterval={4800} />

            {/* Brand Logos Strip */}
            <BrandStrip brands={ACCESSORIES_BRANDS} />
          </div>
        </section>

        {/* Section 4: Home & Lifestyle */}
        <section className="curation-category-section" id="home-lifestyle">
          <div className="curation-container">
            <div className="curation-section-header">
              <h2 className="curation-category-title">Home & Lifestyle</h2>
              <div className="curation-title-divider" />
            </div>

            {/* Interactive Touch Slider */}
            <CuratedSlider items={LIFESTYLE_SLIDES} autoplayInterval={5200} />

            {/* Brand Logos Strip */}
            <BrandStrip brands={LIFESTYLE_BRANDS} />
          </div>
        </section>

        {/* Bottom VIP Pass Call to Action */}
        <section className="curation-cta-section">
          <div className="curation-cta-card">
            <span className="curation-cta-badge">10TH REFINED EDITION • 23 SEPT 2026</span>
            <h2 className="curation-cta-title">Experience The Curation in Person</h2>
            <p className="curation-cta-subtitle">
              Join Hyderabad’s most discerning tastemakers and collectors at Park Hyatt, Banjara Hills. Complimentary VIP passes are strictly limited.
            </p>
            <a href="/#rsvp-section" className="btn-submit-luxury curation-cta-btn">
              <span>Request Your VIP Invitation</span>
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
            <div className="brand-col">
              <img
                src="/assets/logos/flaunsica-logo-white.svg"
                alt="Flaunsica Hyderabad"
                className="footer-brand-logo"
                width={175}
                height={40}
              />
              <p className="f-tagline">
                The 10th Refined Edition. Hyderabad’s premier exhibition of bespoke luxury, couture fashion, and fine jewellery.
              </p>
              <div className="f-curated">
                <span>Curated By</span>
                <strong>Prestha</strong>
              </div>
            </div>

            <div className="footer-col">
              <h3 className="f-heading">Exhibition Venue</h3>
              <p className="f-detail-line"><strong>Park Hyatt Hyderabad</strong></p>
              <p className="f-detail-line">Road No. 2, Banjara Hills</p>
              <p className="f-detail-line">Hyderabad, Telangana 500034</p>
            </div>

            <div className="footer-col">
              <h3 className="f-heading">Date & Concierge</h3>
              <p className="f-detail-line"><strong>Wednesday, 23 September 2026</strong></p>
              <p className="f-detail-line">10:00 AM – 8:30 PM IST</p>
              <p className="f-detail-line">concierge@flaunsica.com</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copy-text">© 2026 Flaunsica. All Rights Reserved. Curated by Prestha.</p>
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

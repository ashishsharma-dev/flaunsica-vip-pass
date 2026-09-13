import { Sparkles, Tag } from "lucide-react";

export interface BrandDiscount {
  name: string;
  discount: string;
  note?: string;
  logo?: string;
  category?: string;
}

export const BRAND_DISCOUNTS: BrandDiscount[] = [
  {
    name: "Nandita Bist",
    discount: "15% – 20% OFF",
    logo: "/assets/Fashion And Couture Designers/Nandita_bist.png",
    category: "Couture & Pret",
  },
  {
    name: "Akriti Gulati",
    discount: "10% OFF",
    category: "Designer Wear",
  },
  {
    name: "Dareiss",
    discount: "15% OFF",
    category: "Contemporary Fashion",
  },
  {
    name: "Dusha + Amai",
    discount: "20% OFF",
    logo: "/assets/Fashion And Couture Designers/Dusha.png",
    category: "Luxury Pret",
  },
  {
    name: "Ankush Jain",
    discount: "10% OFF",
    logo: "/assets/Fashion And Couture Designers/ankush_jain_logo.png",
    category: "Haute Couture",
  },
  {
    name: "Sav Boond",
    discount: "5% OFF",
    logo: "/assets/Fashion And Couture Designers/Sav. boond.png",
    category: "Artisanal Pret",
  },
  {
    name: "MNSH",
    discount: "FLAT 15% OFF",
    logo: "/assets/Jewellery/MNSH.png",
    category: "Fine Jewellery",
  },
  {
    name: "Auric Jewels",
    discount: "10% OFF",
    category: "Precious Jewellery",
  },
  {
    name: "Wavelength",
    discount: "5% OFF",
    logo: "/assets/Jewellery/Wavelength.png",
    category: "Fine Jewellery",
  },
  {
    name: "Phases by Alisha",
    discount: "10% OFF",
    logo: "/assets/Fashion And Couture Designers/Phases by Alisha.png",
    category: "Designer Pret",
  },
  {
    name: "Klitchee",
    discount: "5% OFF",
    logo: "/assets/Fashion And Couture Designers/Kliitche.png",
    category: "Luxury Fashion",
  },
  {
    name: "Tina Ranka",
    discount: "12% OFF",
    category: "Occasion Wear",
  },
  {
    name: "Kashmiraa",
    discount: "10% OFF",
    logo: "/assets/Fashion And Couture Designers/Kashmiraa.png",
    category: "Couture Fashion",
  },
  {
    name: "Midorii",
    discount: "5% OFF",
    note: "On Festive Collection",
    logo: "/assets/Accessories/midorii.png",
    category: "Accessories & Bags",
  },
  {
    name: "Sole Affair",
    discount: "10% OFF",
    category: "Designer Footwear",
  },
  {
    name: "Store Ivory",
    discount: "15% OFF",
    logo: "/assets/Fashion And Couture Designers/Store Ivory.png",
    category: "Luxury Pret",
  },
  {
    name: "Dhaaga & Co",
    discount: "10% OFF",
    logo: "/assets/Fashion And Couture Designers/Dhaaga.png",
    category: "Handcrafted Fashion",
  },
  {
    name: "The Label Vee",
    discount: "5% OFF",
    logo: "/assets/Fashion And Couture Designers/Label Vee.png",
    category: "Contemporary Wear",
  },
  {
    name: "Smriti Apparels",
    discount: "10% OFF",
    logo: "/assets/Fashion And Couture Designers/Smriti.png",
    category: "Festive Couture",
  },
  {
    name: "Vedangi Agarwal",
    discount: "10% OFF",
    logo: "/assets/Fashion And Couture Designers/Vedangi logo.png",
    category: "Designer Couture",
  },
  {
    name: "Pallavi Jaipur",
    discount: "10% – 20% OFF",
    logo: "/assets/Fashion And Couture Designers/Pallavi logo.png",
    category: "Heritage Couture",
  },
  {
    name: "Rah Tribe",
    discount: "5% OFF",
    logo: "/assets/Fashion And Couture Designers/RAH Tribe.png",
    category: "Luxury Pret",
  },
  {
    name: "Ritu Kedia",
    discount: "5% OFF",
    category: "Bespoke Couture",
  },
  {
    name: "Deepa Gurnani",
    discount: "10% OFF",
    logo: "/assets/Jewellery/Deepa Gurnanai.png",
    category: "Fine Accessories",
  },
  {
    name: "Stotram",
    discount: "10% OFF",
    logo: "/assets/Fashion And Couture Designers/Stotram.png",
    category: "Luxury Wear",
  },
  {
    name: "Daatri by MK",
    discount: "10% OFF",
    logo: "/assets/Fashion And Couture Designers/Daatri (1).png",
    category: "Festive & Bridal",
  },
];

interface BrandDiscountsProps {
  variant?: "full" | "compact";
  className?: string;
}

export function BrandDiscounts({ variant = "full", className = "" }: BrandDiscountsProps) {
  const isCompact = variant === "compact";

  return (
    <section
      id="brand-discounts-section"
      className={`brand-discounts-section ${isCompact ? "brand-discounts-compact" : "brand-discounts-full"} ${className}`}
      aria-label="Exhibition Brand Discounts & Privileges"
    >
      <div className={isCompact ? "brand-discounts-compact-container" : "brand-discounts-container"}>
        {/* Section Header */}
        <div className="brand-discounts-header">
          <div className="brand-discounts-eyebrow">
            <Sparkles className="size-3.5 text-[#d4af37]" />
            <span>EXCLUSIVE EXHIBITION PRIVILEGES</span>
            <Sparkles className="size-3.5 text-[#d4af37]" />
          </div>

          <h2 className="brand-discounts-title">
            Special Brand Discounts &amp; Privileges
          </h2>

          <p className="brand-discounts-subtitle">
            Exclusive privileges curated for registered guests attending Flaunsica 10th Refined Edition on 23rd September at Park Hyatt, Banjara Hills.
          </p>
        </div>

        {/* Brand Cards Grid */}
        <div className="brand-discounts-grid">
          {BRAND_DISCOUNTS.map((item, index) => (
            <div key={index} className="brand-discount-card">
              {/* Discount Tag */}
              <div className="brand-discount-badge-wrap">
                <span className="brand-discount-badge">
                  <Tag className="size-3 shrink-0" />
                  <span>{item.discount}</span>
                </span>
              </div>

              {/* Logo or Brand Visual */}
              <div className="brand-discount-visual">
                {item.logo ? (
                  <img
                    src={encodeURI(item.logo)}
                    alt={item.name}
                    className="brand-discount-logo"
                    loading="lazy"
                  />
                ) : (
                  <div className="brand-discount-monogram">
                    <span className="monogram-text">
                      {item.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 3)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Brand Information */}
              <div className="brand-discount-info">
                <h3 className="brand-discount-name">{item.name}</h3>
                {item.category && (
                  <span className="brand-discount-category">{item.category}</span>
                )}
                {item.note && (
                  <span className="brand-discount-note">*{item.note}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote / Privilege Notice */}
        <div className="brand-discounts-footer-note">
          <span>✦ Present your official Flaunsica Exclusive Invite at the respective designer stalls during exhibition hours to claim your discount.</span>
        </div>
      </div>
    </section>
  );
}

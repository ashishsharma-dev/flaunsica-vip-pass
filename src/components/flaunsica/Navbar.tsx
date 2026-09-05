import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export function Navbar({ onGetVipPass }: { onGetVipPass?: () => void }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCuratedPage = location.pathname === "/curated" || location.pathname === "/the-curation";

  const handleVipPassClick = (e: React.MouseEvent) => {
    if (onGetVipPass) {
      e.preventDefault();
      onGetVipPass();
    }
  };

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Announcement Bar */}
      <aside className="announcement-bar" aria-label="Event Notice">
        <div className="announcement-marquee-track">
          <div className="announcement-marquee-content">
            <span className="announcement-marquee-item">
              <span className="announcement-sparkle">✦</span>
              Park Hyatt Hyderabad 23.09.2026 • Park Hyatt Hyderabad 23.09.2026 • Park Hyatt Hyderabad 23.09.2026 • Curated by Prestha
            </span>
            <span className="announcement-marquee-item">
              <span className="announcement-sparkle">✦</span>
              Park Hyatt Hyderabad 23.09.2026 • Park Hyatt Hyderabad 23.09.2026 • Park Hyatt Hyderabad 23.09.2026 • Curated by Prestha
            </span>
            <span className="announcement-marquee-item">
              <span className="announcement-sparkle">✦</span>
              Park Hyatt Hyderabad 23.09.2026 • Park Hyatt Hyderabad 23.09.2026 • Park Hyatt Hyderabad 23.09.2026 • Curated by Prestha
            </span>
            <span className="announcement-marquee-item">
              <span className="announcement-sparkle">✦</span>
              Park Hyatt Hyderabad 23.09.2026 • Park Hyatt Hyderabad 23.09.2026 • Park Hyatt Hyderabad 23.09.2026 • Curated by Prestha
            </span>
          </div>
        </div>
      </aside>

      {/* Luxury Navigation Header */}
      <header className="site-header">
        <div className="nav-container">
          <Link to="/" className="header-edition-badge" aria-label="10th Refined Edition">
            <img
              src="/assets/logos/10th-edition-logo-red.svg"
              alt="10th Refined Edition"
              className="edition-logo-badge"
              width={90}
              height={40}
            />
          </Link>

          <Link to="/" className="brand-group" aria-label="Flaunsica Hyderabad">
            <img
              src="/assets/logos/flaunsica-logo-red.svg"
              alt="Flaunsica Hyderabad"
              className="brand-logo-img"
              width={175}
              height={49}
            />
          </Link>

          {/* Desktop Navigation Actions */}
          <div className="header-actions desktop-only">
            <Link
              to="/curated"
              className={`btn-nav-curation ${isCuratedPage ? "active" : ""}`}
              aria-current={isCuratedPage ? "page" : undefined}
            >
              The Curation
            </Link>

            {isCuratedPage ? (
              <a href="/#rsvp-section" className="btn-nav-rsvp">
                Get VIP Pass
              </a>
            ) : (
              <a
                href="#rsvp-section"
                onClick={handleVipPassClick}
                className="btn-nav-rsvp"
              >
                Get VIP Pass
              </a>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            className="hamburger-menu-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger-line ${mobileMenuOpen ? "open-top" : ""}`} />
            <span className={`hamburger-line ${mobileMenuOpen ? "open-mid" : ""}`} />
            <span className={`hamburger-line ${mobileMenuOpen ? "open-bot" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer Modal */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-top-bar">
              <img
                src="/assets/logos/10th-edition-logo-red.svg"
                alt="10th Refined Edition"
                className="drawer-edition-logo"
                width={75}
                height={32}
              />
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="drawer-menu-links">
              <Link
                to="/curated"
                className={`drawer-link-curation ${isCuratedPage ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="drawer-sparkle">✦</span>
                <span>The Curation</span>
              </Link>

              {isCuratedPage ? (
                <a
                  href="/#rsvp-section"
                  className="drawer-btn-rsvp"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get VIP Pass
                </a>
              ) : (
                <a
                  href="#rsvp-section"
                  className="drawer-btn-rsvp"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleVipPassClick(e);
                  }}
                >
                  Get VIP Pass
                </a>
              )}
            </nav>

            <div className="drawer-bottom-info">
              <div className="drawer-event-meta">
                <span className="meta-date">Wednesday, 23 September 2026</span>
                <span className="meta-venue">Park Hyatt, Banjara Hills, Hyderabad</span>
              </div>
              <p className="drawer-curator-tag">Curated by Prestha</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

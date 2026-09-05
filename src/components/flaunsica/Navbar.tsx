import { Link, useLocation } from "@tanstack/react-router";

export function Navbar({ onGetVipPass }: { onGetVipPass?: () => void }) {
  const location = useLocation();
  const isCuratedPage = location.pathname === "/curated" || location.pathname === "/the-curation";

  const handleVipPassClick = (e: React.MouseEvent) => {
    if (onGetVipPass) {
      e.preventDefault();
      onGetVipPass();
    }
  };

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

          <div className="header-actions">
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
        </div>
      </header>
    </>
  );
}

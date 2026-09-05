import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import type { GuestDetails } from "./types";

function getTier(guest: GuestDetails) {
  return guest.purpose?.includes("Wedding Shopping") || guest.purpose?.includes("Trousseau")
    ? "VIP BRIDE & TROUSSEAU GUEST"
    : "VIP CONNOISSEUR GUEST";
}

export function VipPass({
  guest,
  passCode,
  delivery,
  onReset,
}: {
  guest: GuestDetails;
  passCode: string;
  delivery?: { email: boolean; sms: boolean };
  onReset?: () => void;
}) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const passCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const origin = typeof window === "undefined" ? "https://flaunsica.com" : window.location.origin;
    const verificationUrl = `${origin}/pass/${passCode}`;
    QRCode.toDataURL(verificationUrl, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#140406", light: "#ffffff" },
    })
      .then(setQrUrl)
      .catch(() => setQrUrl(""));
  }, [passCode]);

  const downloadPassPng = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High DPI dimensions (1200x760 for crisp luxury pass print)
    canvas.width = 1200;
    canvas.height = 760;

    // 1. Dark Velvet Burgundy Luxury Background
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, "#1b0708");
    bgGradient.addColorStop(0.45, "#2b0c10");
    bgGradient.addColorStop(1, "#160406");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Gold Foil Outer Border
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner thin border
    ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // 3. Brand Header
    ctx.fillStyle = "#f3e5ab";
    ctx.font = 'bold 44px "New Baskerville", Georgia, serif';
    ctx.fillText("FLAUNSICA", 70, 95);

    ctx.fillStyle = "#c5a880";
    ctx.font = '600 16px "Coco Gothic", sans-serif';
    ctx.fillText("HYDERABAD", 72, 125);

    // Edition Badge on Right
    ctx.fillStyle = "#d4af37";
    ctx.font = 'bold 36px "New Baskerville", Georgia, serif';
    ctx.fillText("10TH REFINED EDITION", 750, 95);

    ctx.fillStyle = "#ffffff";
    ctx.font = '15px "Coco Gothic", sans-serif';
    ctx.fillText("PARK HYATT • BANJARA HILLS", 750, 125);

    // Divider line
    ctx.strokeStyle = "rgba(212, 175, 55, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(60, 155);
    ctx.lineTo(1140, 155);
    ctx.stroke();

    // 4. Guest Tier Strip
    const tierText = getTier(guest);
    ctx.fillStyle = "rgba(212, 175, 55, 0.15)";
    ctx.fillRect(60, 175, 1080, 48);
    ctx.fillStyle = "#f3e5ab";
    ctx.font = 'bold 18px "Coco Gothic", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(`✦   ${tierText}   ✦`, canvas.width / 2, 206);
    ctx.textAlign = "left";

    // 5. Guest Information Columns
    ctx.fillStyle = "#c5a880";
    ctx.font = 'bold 13px "Coco Gothic", sans-serif';
    ctx.fillText("GUEST NAME", 70, 270);
    ctx.fillText("MOBILE NUMBER", 70, 370);
    ctx.fillText("PURPOSE OF VISIT", 70, 460);
    ctx.fillText("ATTENDING WITH", 440, 370);
    ctx.fillText("PASS SERIAL ID", 440, 460);

    // Values
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 38px "New Baskerville", Georgia, serif';
    ctx.fillText(guest.name || "VIP Guest", 70, 318);

    ctx.font = 'bold 22px "Coco Gothic", sans-serif';
    ctx.fillText(`+91 ${guest.phone}`, 70, 405);
    ctx.fillText(guest.purpose?.join(", ") || "Wedding Shopping", 70, 495);
    ctx.fillText(guest.attendingWith?.join(", ") || "Just me", 440, 405);

    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 22px Courier, monospace";
    ctx.fillText(passCode, 440, 495);

    const finishDownload = () => {
      // Perforation
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 560);
      ctx.lineTo(1140, 560);
      ctx.stroke();
      ctx.setLineDash([]);

      // Footer
      ctx.fillStyle = "#c5a880";
      ctx.font = 'bold 14px "Coco Gothic", sans-serif';
      ctx.fillText("📅 WEDNESDAY, 23 SEPT 2026", 70, 615);
      ctx.fillText("📍 PARK HYATT, HYDERABAD", 460, 615);
      ctx.fillText("⏱ 10:00 AM – 8:30 PM", 860, 615);

      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(
        "Curated by Prestha • 55+ Premier Luxury Designer Brands",
        600,
        680
      );
      ctx.textAlign = "left";

      const link = document.createElement("a");
      const safeName = guest.name.replace(/[^a-zA-Z0-9]/g, "_") || "Guest";
      link.download = `Flaunsica_VIP_Pass_${safeName}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if (qrUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(840, 255, 250, 250);
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 3;
        ctx.strokeRect(840, 255, 250, 250);
        ctx.drawImage(img, 855, 270, 220, 220);

        ctx.fillStyle = "#7b1113";
        ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("SCAN AT VIP DESK", 965, 525);
        ctx.textAlign = "left";

        finishDownload();
      };
      img.src = qrUrl;
    } else {
      finishDownload();
    }
  };

  const addToCalendar = () => {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Flaunsica Hyderabad//10th Refined Edition//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${passCode}@flaunsica.com`,
      "DTSTAMP:20260903T100000Z",
      "DTSTART:20260923T043000Z", // 10:00 AM IST is 04:30 UTC
      "DTEND:20260923T150000Z", // 08:30 PM IST is 15:00 UTC
      "SUMMARY:Flaunsica Hyderabad – 10th Refined Edition (VIP Pass)",
      `DESCRIPTION:VIP Fast-Track Entry Pass ID: ${passCode}\\nGuest Name: ${guest.name}\\nCurated by Prestha.\\n55+ luxury brands in couture, bridal trousseau, fine jewelry, and pret.`,
      "LOCATION:The Ballroom, Park Hyatt, Road No. 2, Banjara Hills, Hyderabad, Telangana 500034",
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-PT24H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder: Flaunsica Hyderabad is tomorrow at Park Hyatt!",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Flaunsica_Hyderabad_23Sept2026.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareWhatsApp = () => {
    const shareText = `Hey! I just got my VIP Pass for *Flaunsica Hyderabad – 10th Refined Edition* (23 Sept 2026 at Park Hyatt). 55+ luxury designer brands under one roof! Curated by Prestha. Get your complimentary VIP pass here: https://flaunsica.com`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, "_blank");
  };

  const tier = getTier(guest);
  const party = guest.attendingWith?.length ? guest.attendingWith.join(", ") : "Just me";
  const focus = guest.interests?.length ? guest.interests.join(" & ") : "Jewellery & Couture";

  return (
    <section id="vip-pass-section" className="pass-result-section" aria-live="polite">
      <div className="pass-container">
        {/* Confirmation Banner */}
        <div className="confirmation-banner">
          <div className="conf-badge">
            <span className="conf-icon">✓</span>
            <span>VIP INVITATION CONFIRMED</span>
          </div>
          <h2 className="conf-title">You're on the Guest List!</h2>
          <p className="conf-desc">
            Present your digital pass barcode or QR at the Park Hyatt VIP reception for fast-track
            entry.
          </p>
        </div>

        {/* The Physical Digital Pass Card */}
        <div className="pass-ticket-outer">
          <div className="pass-ticket-card" id="pass-ticket-node" ref={passCardRef}>
            {/* Metallic Ticket Border & Header */}
            <div className="ticket-header">
              <div className="ticket-brand">
                <img
                  src="/assets/logos/flaunsica-logo-white.svg"
                  alt="Flaunsica Hyderabad"
                  className="ticket-brand-logo-img"
                  width={165}
                  height={46}
                />
              </div>

              <div className="ticket-edition-badge">
                <img
                  src="/assets/logos/10th-edition-logo-white.svg"
                  alt="10th Refined Edition"
                  className="ticket-edition-logo-img"
                  width={96}
                  height={42}
                />
              </div>
            </div>

            {/* Pass Tier Banner */}
            <div className="ticket-tier-strip">
              <span className="tier-sparkle">✦</span>
              <span className="tier-title">{tier}</span>
              <span className="tier-sparkle">✦</span>
            </div>

            {/* Ticket Body Info */}
            <div className="ticket-main-grid">
              {/* Left: Guest Details */}
              <div className="guest-info-block">
                <div className="tk-field">
                  <span className="tk-label">GUEST NAME</span>
                  <span className="tk-val tk-name">{guest.name || "Aanya Sharma"}</span>
                </div>

                <div className="tk-row-2">
                  <div className="tk-field">
                    <span className="tk-label">MOBILE</span>
                    <span className="tk-val">+91 {guest.phone}</span>
                  </div>
                  <div className="tk-field">
                    <span className="tk-label">PARTY SIZE</span>
                    <span className="tk-val">{party}</span>
                  </div>
                </div>

                <div className="tk-row-2">
                  <div className="tk-field">
                    <span className="tk-label">PRIMARY FOCUS</span>
                    <span className="tk-val">{focus}</span>
                  </div>
                  <div className="tk-field">
                    <span className="tk-label">PASS ID</span>
                    <span className="tk-val tk-pass-id">{passCode}</span>
                  </div>
                </div>
              </div>

              {/* Right: Dynamic QR Code */}
              <div className="qr-code-block">
                <div className="qr-code-card">
                  <div className="qr-svg-holder">
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt={`VIP Pass QR for ${passCode}`}
                        className="size-full rounded object-contain"
                      />
                    ) : (
                      <div className="flex size-40 items-center justify-center bg-white text-xs text-gray-400">
                        Generating QR...
                      </div>
                    )}
                  </div>
                  <span className="qr-caption">SCAN AT VIP DESK</span>
                </div>
              </div>
            </div>

            {/* Perforated Tear Line with Notches */}
            <div className="ticket-perforation">
              <span className="perf-notch notch-left"></span>
              <div className="perf-dashed-line"></div>
              <span className="perf-notch notch-right"></span>
            </div>

            {/* Event Details Footer on Card */}
            <div className="ticket-footer-meta">
              <div className="tf-item">
                <span className="tf-icon">📅</span>
                <div className="tf-col">
                  <span className="tf-label">DATE</span>
                  <span className="tf-val">Wednesday, 23 Sept 2026</span>
                </div>
              </div>

              <div className="tf-item">
                <span className="tf-icon">📍</span>
                <div className="tf-col">
                  <span className="tf-label">VENUE</span>
                  <span className="tf-val">Park Hyatt, Banjara Hills</span>
                </div>
              </div>

              <div className="tf-item">
                <span className="tf-icon">⏱</span>
                <div className="tf-col">
                  <span className="tf-label">HOURS</span>
                  <span className="tf-val">10:00 AM – 8:30 PM</span>
                </div>
              </div>
            </div>

            <div className="ticket-curator-seal">
              Curated by Prestha • Official 10th Edition Fast-Track Pass
            </div>
          </div>
        </div>

        {/* Dispatch Notification Notice */}
        <div className="dispatch-notice-card">
          <div className="dispatch-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div className="dispatch-text">
            <strong>Instant WhatsApp & Email Copy Dispatched</strong>
            <p>
              A digital copy of your VIP entry QR pass has been dispatched via WhatsApp to{" "}
              <span>+91 {guest.phone}</span> and emailed to <span>{guest.email}</span>.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pass-actions-grid">
          <button
            type="button"
            onClick={downloadPassPng}
            className="btn-action btn-gold-fill"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download Pass (PNG)</span>
          </button>

          <button
            type="button"
            onClick={addToCalendar}
            className="btn-action btn-outline-luxury"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Add to Calendar (.ics)</span>
          </button>

          <button
            type="button"
            onClick={shareWhatsApp}
            className="btn-action btn-whatsapp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.067-2.072-.502-1.614-.666-2.66-2.317-2.74-2.424-.08-.107-.645-.858-.645-1.636 0-.777.408-1.16.552-1.317.144-.158.312-.198.416-.198.104 0 .208.002.296.007.096.005.224-.037.352.27.128.307.44 1.072.48 1.152.04.08.064.175.016.273-.048.098-.072.158-.144.241-.072.083-.152.186-.216.25-.072.072-.148.151-.064.296.084.144.372.614.798.994.548.488 1.01.639 1.154.711.144.072.228.064.312-.033.084-.096.36-.421.456-.565.096-.144.192-.12.32-.072.128.048.816.385.956.455.14.07.234.105.268.163.034.058.034.339-.11.744z" />
            </svg>
            <span>Share Invitation</span>
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="btn-action btn-subtle"
            >
              <span>Register Another Guest &rarr;</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

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

  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const downloadPassPng = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsDownloading(false);
        return;
      }

      // High DPI dimensions (1200x760 for crisp luxury pass print)
      canvas.width = 1200;
      canvas.height = 760;

      // 1. Logo Red Luxury Background
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, "#9a2828");
      bgGradient.addColorStop(0.5, "#8b2020");
      bgGradient.addColorStop(1, "#7a1818");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. White Luxury Outer Border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 5;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Inner thin border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // 3. Brand Header
      ctx.fillStyle = "#ffffff";
      ctx.font = 'bold 44px "New Baskerville", Georgia, serif';
      ctx.fillText("FLAUNSICA", 70, 95);

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = '600 16px "Coco Gothic", sans-serif';
      ctx.fillText("HYDERABAD", 72, 125);

      // Edition Badge on Right
      ctx.fillStyle = "#ffffff";
      ctx.font = 'bold 30px "New Baskerville", Georgia, serif';
      ctx.fillText("10TH REFINED EDITION", 750, 95);

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = '15px "Coco Gothic", sans-serif';
      ctx.fillText("PARK HYATT • BANJARA HILLS", 750, 125);

      // Divider line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 155);
      ctx.lineTo(1140, 155);
      ctx.stroke();

      // 4. Guest Tier Strip
      const tierText = getTier(guest);
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(60, 175, 1080, 48);
      ctx.fillStyle = "#ffffff";
      ctx.font = 'bold 18px "Coco Gothic", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(`✦   ${tierText}   ✦`, canvas.width / 2, 206);
      ctx.textAlign = "left";

      // 5. Guest Information Columns
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
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

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px Courier, monospace";
      ctx.fillText(passCode, 440, 495);

      // 6. Draw QR Code if available
      if (qrUrl) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(840, 255, 250, 250);
            ctx.strokeStyle = "#9a2828";
            ctx.lineWidth = 3;
            ctx.strokeRect(840, 255, 250, 250);
            ctx.drawImage(img, 855, 270, 220, 220);

            ctx.fillStyle = "#9a2828";
            ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = "center";
            ctx.fillText("SCAN AT VIP DESK", 965, 525);
            ctx.textAlign = "left";
            resolve();
          };
          img.onerror = () => resolve();
          img.src = qrUrl;
          if (img.complete) {
            img.onload(null as any);
          }
        });
      }

      // Perforation
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 560);
      ctx.lineTo(1140, 560);
      ctx.stroke();
      ctx.setLineDash([]);

      // Footer
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = 'bold 14px "Coco Gothic", sans-serif';
      ctx.fillText("📅 WEDNESDAY, 23 SEPT 2026", 70, 615);
      ctx.fillText("📍 PARK HYATT, HYDERABAD", 460, 615);
      ctx.fillText("⏱ 10:00 AM – 8:30 PM", 860, 615);

      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(
        "curated by Prestha Agarwal • 55+ Premier Luxury Designer Brands",
        600,
        680
      );
      ctx.textAlign = "left";

      const safeName = guest.name.replace(/[^a-zA-Z0-9]/g, "_") || "Guest";
      const fileName = `Flaunsica_VIP_Pass_${safeName}.png`;
      const isIOS =
        typeof navigator !== "undefined" &&
        (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

      // 1. Primary mobile path: Web Share API
      // On iOS Safari 15+, this invokes the native Share sheet with direct "Save Image" to Photos
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (blob && typeof navigator !== "undefined" && typeof navigator.canShare === "function") {
        try {
          const file = new File([blob], fileName, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Flaunsica VIP Pass",
              text: `Flaunsica VIP Pass for ${guest.name} – 23 Sept 2026 at Park Hyatt`,
            });
            setIsDownloading(false);
            return;
          }
        } catch (err: any) {
          if (err.name === "AbortError") {
            setIsDownloading(false);
            return;
          }
          console.warn("Web Share API failed, using fallback", err);
        }
      }

      const dataUrl = canvas.toDataURL("image/png");

      // 2. iOS fallback (in-app browsers like Instagram, Facebook, or if share is denied)
      // Opens high-res pass modal allowing "Tap & hold to Save to Photos"
      if (isIOS) {
        setPreviewImageUrl(dataUrl);
        setIsDownloading(false);
        return;
      }

      // 3. Desktop / Android standard download
      const link = document.createElement("a");
      link.download = fileName;
      link.href = blob ? URL.createObjectURL(blob) : dataUrl;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        if (blob) URL.revokeObjectURL(link.href);
      }, 200);
    } catch (err) {
      console.error("Failed to generate pass PNG", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const addToCalendar = () => {
    const isIOS =
      typeof navigator !== "undefined" &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    if (isIOS) {
      // On iOS Safari, navigating directly to a valid .ics URL with Content-Type: text/calendar
      // immediately triggers the native Apple Calendar event sheet.
      window.location.href = "/Flaunsica_Hyderabad_23Sept2026.ics";
      return;
    }

    // On Desktop / Android: trigger download of the .ics file
    const link = document.createElement("a");
    link.href = "/Flaunsica_Hyderabad_23Sept2026.ics";
    link.setAttribute("download", "Flaunsica_Hyderabad_23Sept2026.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Flaunsica Hyderabad – 10th Refined Edition (VIP Invite)"
  )}&dates=20260923T043000Z/20260923T150000Z&details=${encodeURIComponent(
    `Exclusive VIP Invitation ID: ${passCode}\nGuest Name: ${guest.name}\nCurated by Prestha Agarwal.\n55+ Premier Luxury Designer Brands in couture, bridal trousseau, fine jewelry, and pret.\nPresent your digital pass QR at VIP desk.`
  )}&location=${encodeURIComponent(
    "The Ballroom, Park Hyatt, Road No. 2, Banjara Hills, Hyderabad, Telangana 500034"
  )}`;

  const shareWhatsApp = () => {
    const shareText = `Hey! I just got my Exclusive Invite for *Flaunsica Hyderabad – 10th Refined Edition* (23 Sept 2026 at Park Hyatt). 55+ luxury designer brands under one roof! curated by Prestha Agarwal. Get your complimentary Exclusive Invite here: https://flaunsica.com`;
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
            <span>EXCLUSIVE INVITATION CONFIRMED</span>
          </div>
          <h2 className="conf-title">You're on the Guest List!</h2>
          <p className="conf-desc">
            Present your digital invite barcode or QR at the Park Hyatt VIP reception for fast-track
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
                    <span className="tk-label">INVITE ID</span>
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
                        alt={`Exclusive Invite QR for ${passCode}`}
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
                  <span className="tf-val">11:00 AM – 7:00 PM</span>
                </div>
              </div>
            </div>

            <div className="ticket-curator-seal">
              curated by Prestha Agarwal • Official 10th Edition Exclusive Invite
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
              A digital copy of your Exclusive Invite QR code has been dispatched via WhatsApp to{" "}
              <span>+91 {guest.phone}</span> and emailed to <span>{guest.email}</span>.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pass-actions-grid">
          <button
            type="button"
            onClick={downloadPassPng}
            disabled={isDownloading}
            className="btn-action btn-gold-fill"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>{isDownloading ? "Preparing Pass..." : "Download Exclusive Invite (PNG)"}</span>
          </button>

          <button
            type="button"
            onClick={addToCalendar}
            className="btn-action btn-outline-luxury"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

        {/* Google Calendar Quick Link */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
          <span>Prefer Google Calendar?</span>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#9a2828] underline underline-offset-4 hover:text-[#7a1818] transition-colors"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
            </svg>
            Add to Google Calendar &rarr;
          </a>
        </div>
      </div>

      {/* iOS Pass Image Preview Modal (Fallback for iOS in-app browsers) */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImageUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#140808] p-5 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#9a2828] text-xs font-bold text-white">
                  ✓
                </span>
                <h3 className="font-serif text-lg font-bold">Your VIP Pass</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="my-3 rounded-lg bg-[#9a2828]/25 border border-[#9a2828]/50 p-2.5 text-xs text-rose-100">
              📱 <strong>Save to Photos:</strong> Tap and hold the pass image below, then choose <strong>&ldquo;Save to Photos&rdquo;</strong>.
            </div>

            <div className="overflow-hidden rounded-xl border border-white/15 bg-black/50 shadow-inner">
              <img
                src={previewImageUrl}
                alt="Flaunsica VIP Pass"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="mt-4 flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.canShare) {
                    fetch(previewImageUrl)
                      .then((res) => res.blob())
                      .then((blob) => {
                        const file = new File(
                          [blob],
                          `Flaunsica_VIP_Pass_${guest.name.replace(/[^a-zA-Z0-9]/g, "_") || "Guest"}.png`,
                          { type: "image/png" }
                        );
                        if (navigator.canShare({ files: [file] })) {
                          navigator.share({ files: [file], title: "Flaunsica VIP Pass" });
                        }
                      })
                      .catch(() => {});
                  }
                }}
                className="flex-1 rounded-full bg-[#9a2828] py-2.5 text-xs font-bold text-white shadow hover:bg-[#852020] transition-colors"
              >
                Share / Save via iOS
              </button>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

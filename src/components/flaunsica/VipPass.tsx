import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { CalendarPlus, Download, ShieldCheck } from "lucide-react";
import { EVENT } from "./event";
import type { GuestDetails } from "./types";

function passId(guest: GuestDetails) {
  const digits = guest.phone.replace(/\D/g, "").slice(-4) || "0000";
  return `FLX-26-${digits}-${guest.name.trim().slice(0, 2).toUpperCase() || "VP"}`;
}

function category(guest: GuestDetails) {
  if (guest.isBride === "Yes") return "Bride";
  return guest.purpose[0] ?? "Guest";
}

export function VipPass({ guest }: { guest: GuestDetails }) {
  const [qr, setQr] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const id = passId(guest);

  useEffect(() => {
    const payload = JSON.stringify({
      pass: id,
      event: EVENT.name,
      edition: EVENT.edition,
      date: EVENT.dateLabel,
      venue: EVENT.venue,
      name: guest.name,
      phone: `+91 ${guest.phone}`,
      email: guest.email,
      bride: guest.isBride === "Yes",
      purpose: guest.purpose,
      attendingWith: guest.attendingWith[0] ?? "",
      interests: guest.interests,
      checkin: `https://flaunsica.com/checkin/${id}`,
    });
    QRCode.toDataURL(payload, {
      width: 640,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#1A1A1A", light: "#FFFFFF" },
    })
      .then(setQr)
      .catch(() => setQr(""));
  }, [guest, id]);

  const downloadPass = async () => {
    const canvas = canvasRef.current ?? document.createElement("canvas");
    const W = 900;
    const H = 1400;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FAF8F5";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#7B1113";
    ctx.fillRect(0, 0, W, 300);
    ctx.fillStyle = "#FAF8F5";
    ctx.textAlign = "center";
    ctx.font = "600 74px Georgia, serif";
    ctx.fillText("FLAUNSICA", W / 2, 140);
    ctx.font = "400 24px Helvetica, Arial, sans-serif";
    ctx.fillText("10TH REFINED EDITION  ·  HYDERABAD", W / 2, 196);
    ctx.fillStyle = "#D9BC8C";
    ctx.fillRect(W / 2 - 90, 232, 180, 2);

    ctx.fillStyle = "#1A1A1A";
    ctx.font = "600 56px Georgia, serif";
    ctx.fillText(guest.name, W / 2, 390);
    ctx.font = "400 26px Helvetica, Arial, sans-serif";
    ctx.fillStyle = "#6B6B6B";
    ctx.fillText(`${category(guest)}  ·  Pass ${id}`, W / 2, 436);
    ctx.fillText(`+91 ${guest.phone}  ·  ${guest.email}`, W / 2, 478);

    if (qr) {
      const img = new Image();
      img.src = qr;
      await new Promise((res) => {
        img.onload = res;
        img.onerror = res;
      });
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(W / 2 - 280, 540, 560, 560);
      ctx.drawImage(img, W / 2 - 260, 560, 520, 520);
    }

    ctx.fillStyle = "#1A1A1A";
    ctx.font = "500 30px Helvetica, Arial, sans-serif";
    ctx.fillText(EVENT.dateLabel, W / 2, 1185);
    ctx.fillStyle = "#6B6B6B";
    ctx.font = "400 24px Helvetica, Arial, sans-serif";
    ctx.fillText(EVENT.venue, W / 2, 1228);
    ctx.fillText("Present this pass at the VIP fast-track desk.", W / 2, 1300);

    const link = document.createElement("a");
    link.download = `flaunsica-vip-pass-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const addToCalendar = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Flaunsica//VIP Pass//EN",
      "BEGIN:VEVENT",
      `UID:${id}@flaunsica.com`,
      `DTSTART:${EVENT.icsStart}`,
      `DTEND:${EVENT.icsEnd}`,
      `SUMMARY:${EVENT.name} — ${EVENT.edition}`,
      `LOCATION:${EVENT.venue}`,
      `DESCRIPTION:VIP Pass ${id} for ${guest.name}. Present your QR pass at the fast-track desk.`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "flaunsica-vip-pass.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="animate-rise">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <p className="mb-6 text-center text-[0.68rem] uppercase tracking-luxe text-primary">
        Invitation Confirmed
      </p>

      <article className="overflow-hidden rounded-lg surface-luxe">
        <header className="gradient-crimson px-6 py-8 text-center text-primary-foreground">
          <h3 className="font-display text-3xl tracking-[0.18em]">FLAUNSICA</h3>
          <p className="mt-2 text-[0.6rem] uppercase tracking-luxe opacity-90">
            10th Refined Edition
          </p>
          <div className="mx-auto mt-4 h-px w-20 bg-champagne" />
        </header>

        <div className="px-6 py-7">
          <div className="text-center">
            <p className="font-display text-2xl">{guest.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {category(guest)}
            </p>
          </div>

          <div className="mt-7 flex justify-center">
            <div className="rounded-md border border-border bg-card p-3">
              {qr ? (
                <img
                  src={qr}
                  alt={`VIP entry QR code for ${guest.name}`}
                  width={208}
                  height={208}
                  className="h-52 w-52"
                />
              ) : (
                <div className="h-52 w-52 animate-pulse bg-muted" />
              )}
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Pass ID
              </dt>
              <dd className="mt-1 font-medium">{id}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Date
              </dt>
              <dd className="mt-1 font-medium">{EVENT.dateLabel}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Mobile
              </dt>
              <dd className="mt-1 font-medium">+91 {guest.phone}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 truncate font-medium">{guest.email}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Venue
              </dt>
              <dd className="mt-1 font-medium">{EVENT.venue}</dd>
            </div>
          </dl>
        </div>

        <footer className="border-t border-dashed border-border bg-secondary/60 px-6 py-5">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              A copy of this digital entry QR pass has been dispatched via WhatsApp to{" "}
              <strong className="font-medium text-foreground">+91 {guest.phone}</strong> and emailed
              to <strong className="font-medium text-foreground">{guest.email}</strong>.
            </span>
          </p>
        </footer>
      </article>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={downloadPass}
          className="shimmer-luxe inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-95"
        >
          <Download className="size-4" aria-hidden="true" /> Download QR Pass
        </button>
        <button
          type="button"
          onClick={addToCalendar}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-foreground/25 px-6 py-4 text-[0.7rem] uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
        >
          <CalendarPlus className="size-4" aria-hidden="true" /> Add to Wallet / Calendar
        </button>
      </div>
    </div>
  );
}

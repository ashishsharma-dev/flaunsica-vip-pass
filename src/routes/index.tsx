import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Gem, MapPin, ScanLine, Sparkles, Ticket } from "lucide-react";
import heroImage from "@/assets/hero-couture.jpg";
import { EVENT } from "@/components/flaunsica/event";
import { RsvpFlow } from "@/components/flaunsica/RsvpFlow";

const TITLE = "Flaunsica Hyderabad 2026 — VIP RSVP | 10th Refined Edition";
const DESCRIPTION =
  "55+ luxury designer labels at Park Hyatt, Banjara Hills on 23 September 2026. Pre-register for priority VIP entry and your digital QR pass.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

const META_PILLS = [
  { icon: CalendarDays, label: EVENT.dateLabel },
  { icon: MapPin, label: EVENT.venue },
  { icon: Ticket, label: EVENT.access },
];

const BENEFITS = [
  {
    icon: ScanLine,
    title: "Priority VIP Entry",
    body: "Fast-track the queue with your personal digital QR pass — scanned and cleared in seconds at the VIP desk.",
  },
  {
    icon: Sparkles,
    title: "Curated Preview Access",
    body: "Walk the floor ahead of the crowd across 55+ premier designer labels, hand-picked for this edition.",
  },
  {
    icon: Gem,
    title: "Private Styling Consults",
    body: "Direct styling sessions and custom bridal trousseau consultations with the designers themselves.",
  },
];

function scrollToRsvp() {
  document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Index() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-0 lg:grid-cols-2 lg:items-center">
          <div className="px-5 pb-14 pt-14 sm:px-8 sm:pt-20 lg:py-24">
            <p className="font-display text-lg tracking-[0.3em] text-primary">FLAUNSICA</p>
            <p className="mt-1 text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">
              {EVENT.curators}
            </p>

            <span className="mt-8 inline-block rounded-full border border-champagne-deep/60 px-4 py-1.5 text-[0.6rem] uppercase tracking-luxe text-champagne-deep">
              10th Refined Edition
            </span>

            <h1 className="mt-6 font-display text-[2.7rem] leading-[1.05] text-balance-luxe sm:text-6xl lg:text-[4.2rem]">
              55+ Brands.
              <br />
              <em className="not-italic text-primary">One Curated Edit.</em>
            </h1>

            <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
              Hyderabad's most coveted luxury designer trunk show returns to Park Hyatt. Experience
              hand-picked couture, bridal trousseau, fine jewelry, and contemporary pret — all under
              one roof.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {META_PILLS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-foreground"
                >
                  <Icon className="size-3.5 text-primary" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={scrollToRsvp}
              className="shimmer-luxe mt-10 inline-flex w-full items-center justify-center rounded-sm bg-primary px-9 py-5 text-[0.72rem] uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-95 sm:w-auto"
            >
              Request VIP Invitation / RSVP Now
            </button>
          </div>

          <div className="relative h-[62vh] min-h-[380px] lg:h-[88vh]">
            <img
              src={heroImage}
              alt="Deep crimson bridal couture with gold zari embroidery on a luxury display rack"
              width={1408}
              height={1760}
              className="size-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-background lg:via-background/10 lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="border-y border-border bg-secondary/50 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <header className="text-center">
            <p className="text-[0.65rem] uppercase tracking-luxe text-primary">The VIP Advantage</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">Why Pre-Register?</h2>
            <div className="rule-luxe mx-auto mt-6 w-40" />
          </header>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-lg surface-luxe p-7">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-5 font-display text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RsvpFlow />

      <footer className="gradient-crimson px-5 py-14 text-center text-primary-foreground">
        <p className="font-display text-2xl tracking-[0.2em]">FLAUNSICA</p>
        <div className="mx-auto mt-4 h-px w-16 bg-champagne" />
        <p className="mt-5 text-xs uppercase tracking-[0.2em] opacity-85">{EVENT.curators}</p>
        <p className="mt-3 text-xs opacity-75">
          {EVENT.dateLabel} · {EVENT.venue}
        </p>
        <p className="mt-6 text-[0.65rem] uppercase tracking-[0.2em] opacity-60">
          © 2026 Flaunsica Hyderabad. Entry by invitation only.
        </p>
      </footer>
    </main>
  );
}

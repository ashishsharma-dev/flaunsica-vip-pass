import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CalendarDays, MapPin, ShieldAlert } from "lucide-react";
import { EVENT } from "@/components/flaunsica/event";
import { getPass } from "@/lib/rsvp.functions";

const TITLE = "VIP Pass Verification — Flaunsica Hyderabad";
const DESCRIPTION =
  "Scan-verified guest details for the Flaunsica Hyderabad 10th Refined Edition VIP entry pass.";

export const Route = createFileRoute("/pass/$passCode")({
  loader: ({ params }) => getPass({ data: { passCode: params.passCode } }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PassDetails,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium">{value || "—"}</dd>
    </div>
  );
}

function PassDetails() {
  const registration = Route.useLoaderData();
  const { passCode } = Route.useParams();

  if (!registration) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="max-w-sm text-center">
          <ShieldAlert className="mx-auto size-7 text-destructive" aria-hidden="true" />
          <h1 className="mt-5 font-display text-3xl">Pass Not Found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            No VIP registration matches pass code{" "}
            <span className="text-foreground">{passCode}</span>. Please check with the registration
            desk.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex rounded-sm border border-foreground/25 px-6 py-3 text-[0.7rem] uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
          >
            Back to RSVP
          </Link>
        </div>
      </main>
    );
  }

  const verified = registration.phone_verified && registration.email_verified;

  return (
    <main className="min-h-screen bg-background px-5 py-14">
      <div className="mx-auto max-w-xl">
        <article className="overflow-hidden rounded-lg surface-luxe">
          <header className="gradient-crimson px-6 py-8 text-center text-primary-foreground">
            <h1 className="font-display text-3xl tracking-[0.18em]">FLAUNSICA</h1>
            <p className="mt-2 text-[0.6rem] uppercase tracking-luxe opacity-90">
              {EVENT.edition} · Guest Verification
            </p>
            <div className="mx-auto mt-4 h-px w-20 bg-champagne" />
          </header>

          <div className="px-6 py-7">
            <div className="text-center">
              <p className="font-display text-3xl">{registration.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {registration.is_bride ? "Bride" : (registration.purpose[0] ?? "Guest")}
              </p>
              <p
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] ${
                  verified
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                {verified ? "Verified Guest" : "Verification Pending"}
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
              <Row label="Pass ID" value={registration.pass_code} />
              <Row
                label="Registered On"
                value={new Date(registration.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
              <Row label="Mobile" value={`+91 ${registration.phone}`} />
              <Row label="Email" value={registration.email} />
              <div className="col-span-2">
                <Row label="Purpose of Visit" value={registration.purpose.join(", ")} />
              </div>
              <div className="col-span-2">
                <Row label="Attending With" value={registration.attending_with.join(", ")} />
              </div>
              <div className="col-span-2">
                <Row label="Shopping Interests" value={registration.interests.join(", ")} />
              </div>
            </dl>
          </div>

          <footer className="space-y-2 border-t border-dashed border-border bg-secondary/60 px-6 py-5 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-3.5 text-primary" aria-hidden="true" />
              {EVENT.dateLabel}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5 text-primary" aria-hidden="true" />
              {EVENT.venue}
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}

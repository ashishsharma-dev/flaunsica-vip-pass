import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/the-curation")({
  beforeLoad: () => {
    throw redirect({ to: "/curated" });
  },
  component: () => null,
});

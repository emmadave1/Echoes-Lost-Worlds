import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ECHOES — The Museum of Lost Civilizations" },
      {
        name: "description",
        content:
          "An interactive cinematic 3D journey through five lost civilizations. Explore Atlantis, Neo Tokyo, Verdantis, Celestia, and the Unknown.",
      },
      { property: "og:title", content: "ECHOES — The Museum of Lost Civilizations" },
      {
        property: "og:description",
        content: "A cinematic, interactive 3D museum exploring imagined civilizations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexPage,
});

const EchoesApp = lazy(() => import("@/components/echoes/EchoesApp"));

function IndexPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ClientOnly>
        <EchoesApp />
      </ClientOnly>
    </Suspense>
  );
}

import { useEffect, useState, type ReactNode } from "react";
function ClientOnly({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  if (!ok) return <div className="min-h-screen bg-black" />;
  return <>{children}</>;
}

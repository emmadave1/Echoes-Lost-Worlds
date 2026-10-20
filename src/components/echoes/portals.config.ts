export const PORTALS = [
  {
    id: "atlantis",
    name: "Atlantis",
    tagline: "The Sunken Kingdom",
    color: "#4aa3ff",
    glow: "#7ec8ff",
    angle: 0,
  },
  {
    id: "neotokyo",
    name: "Neo Tokyo",
    tagline: "The Neon Requiem",
    color: "#c47bff",
    glow: "#ff5cf0",
    angle: (Math.PI * 2) / 5,
  },
  {
    id: "verdantis",
    name: "Verdantis",
    tagline: "The Living Forest",
    color: "#6bffb0",
    glow: "#a8ffcf",
    angle: (Math.PI * 4) / 5,
  },
  {
    id: "celestia",
    name: "Celestia",
    tagline: "The Sky Temples",
    color: "#ffd579",
    glow: "#ffe9a8",
    angle: (Math.PI * 6) / 5,
  },
  {
    id: "unknown",
    name: "Unknown",
    tagline: "The Impossible",
    color: "#ffffff",
    glow: "#e0e6ff",
    angle: (Math.PI * 8) / 5,
  },
] as const;

export type PortalId = (typeof PORTALS)[number]["id"];
export type PortalConfig = (typeof PORTALS)[number];

export const getPortal = (id: PortalId): PortalConfig =>
  PORTALS.find((p) => p.id === id)!;

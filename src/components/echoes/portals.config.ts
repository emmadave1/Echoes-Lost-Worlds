export const PORTALS = [
  {
    id: "atlantis",
    name: "Atlantis",
    tagline: "The Sunken Kingdom",
    color: "#4aa3ff",
    glow: "#7ec8ff",
  },
  {
    id: "neotokyo",
    name: "Neo Tokyo",
    tagline: "The Neon Requiem",
    color: "#c47bff",
    glow: "#ff5cf0",
  },
  {
    id: "verdantis",
    name: "Verdantis",
    tagline: "The Living Forest",
    color: "#6bffb0",
    glow: "#a8ffcf",
  },
  {
    id: "celestia",
    name: "Celestia",
    tagline: "The Sky Temples",
    color: "#ffd579",
    glow: "#ffe9a8",
  },
  {
    id: "unknown",
    name: "Unknown",
    tagline: "The Impossible",
    color: "#ffffff",
    glow: "#e0e6ff",
  },
    {
    id: "mars",
    name: "Mars",
    tagline: "The Lost Martian Civilization",
    color: "#ff5733",
    glow: "#ff8c69",
  },
  {
    id: "earth",
    name: "Earth",
    tagline: "The Cradle of Humanity",
    color: "#36a3ff",
    glow: "#7dd3fc",
  },
  {
    id: "saturn",
    name: "Saturn",
    tagline: "The Rings of Eternity",
    color: "#e6bd75",
    glow: "#ffe4a3",
  },
] as const;

export type PortalId = (typeof PORTALS)[number]["id"];

export type PortalConfig = (typeof PORTALS)[number];

export const getPortal = (id: PortalId): PortalConfig =>
  PORTALS.find((p) => p.id === id)!;
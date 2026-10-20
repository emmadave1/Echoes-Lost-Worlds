# ECHOES — The Museum of Lost Civilizations

An immersive, cinematic 3D experience exploring the remnants of forgotten worlds.

**ECHOES** is an experimental interactive web experience that invites visitors to explore a mysterious museum containing portals to lost civilizations. Combining real-time 3D graphics, atmospheric environments, cinematic camera movements, and interactive storytelling, the project explores how the web can become a medium for immersive digital experiences.

Rather than following the conventions of a traditional website, ECHOES is designed as an interactive journey through imagined worlds, ancient mysteries, and futuristic landscapes.

---

## Overview

At the center of ECHOES stands an immense architectural monument surrounding a mysterious glowing orb. Five portals connect the museum to distinct civilizations, each with its own atmosphere, visual identity, and narrative.

Visitors begin their journey at the museum, discover its portals, and explore the worlds hidden beyond them.

The experience draws inspiration from cinematic science fiction, surreal architecture, atmospheric games, and experimental 3D web design.

### The Five Civilizations

| Civilization | Theme | Visual Direction |
| Atlantis | The lost underwater city | Ancient ruins, deep blue lighting, aquatic life, and drifting particles |
| Neo Tokyo | A futuristic metropolis | Purple neon, holographic architecture, rain, and cyberpunk environments |
| Verdantis | A forgotten natural world | Enchanted forests, monumental trees, glowing flora, and floating leaves |
| Celestia | A civilization above the clouds | Floating islands, golden temples, waterfalls, and celestial landscapes |
| Unknown | A world beyond comprehension | Impossible geometry, abstract structures, spatial distortions, and mysterious light |

Each civilization is conceived as a distinct environment within a connected interactive experience.

---

## Experience Design

### The Introduction

The experience opens in darkness, gradually revealing distant stars and a luminous portal.

Cinematic typography introduces the museum before visitors enter the main environment.

### The Museum

The central environment is envisioned as a monumental structure combining classical architecture with futuristic design.

Key visual elements include:

- Massive architectural pillars.
- Marble-inspired surfaces and gold accents.
- Floating geometric structures.
- A luminous central orb.
- Circular architectural forms.
- Atmospheric fog and floating particles.
- Soft lighting and reflective surfaces.

### Portal Exploration

Five portals surround the central monument.

Each portal has a unique visual identity and is designed to respond to user interaction through hover effects, animated energy, and cinematic camera movement.

Entering a portal transitions the visitor from the museum into another civilization.

### Cinematic Transitions

Camera movements, scene transitions, particle effects, and animated lighting help connect the environments.

The goal is to create a continuous sense of exploration rather than a collection of disconnected web pages.

### The Ending

The journey culminates in a return to the central museum.

The central orb becomes the focus of the final sequence, leading to a closing reflection:

> Every civilization began with imagination.
> What will humanity build next?

---

## Technology Stack

ECHOES is built with modern web technologies for interactive graphics, animation, and component-based development.

### Core

- **React** — Component-based user interfaces.
- **TypeScript** — Type safety and maintainable application code.
- **Vite** — Development server and build tooling.
- **TanStack Start** — Application framework and server-side rendering infrastructure.

### 3D Graphics

- **Three.js** — Real-time 3D rendering.
- **React Three Fiber** — Declarative Three.js scenes in React.
- **@react-three/drei** — Utilities and helpers for 3D environments.
- **@react-three/postprocessing** — Post-processing effects for cinematic visuals.
- **postprocessing** — Rendering effects and visual enhancements.

### Animation

- **GSAP** — Timeline-based animation and cinematic transitions.
- **Framer Motion** — Interface animations and interaction feedback.

### Styling and Interface

- **Tailwind CSS** — Utility-first styling.
- **Lucide React** — Interface icons.
- **React Icons** — Additional icon collections.
- **Leva** — Interactive development controls for tuning scene parameters.

### Development Tools

- **ESLint** — Code quality and linting.
- **Prettier** — Consistent code formatting.
- **TypeScript** — Static type checking.

---

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Install the following software before proceeding:

- [Node.js](https://nodejs.org/) — Use a version compatible with the project's Vite and TanStack Start dependencies.
- npm — Included with Node.js.
- Git — For version control.

### Installation

***1. Clone the repository**

```bash
git clone <your-repository-url>
```

***2. Navigate to the project directory**

```bash
cd <repository-name>
```

***3. Install dependencies**

```bash
npm install
```

***4. Start the development server**

```bash
npm run dev
```

Open the local URL displayed in your terminal to view the application.

### Available Scripts

| Command | Description |
| `npm run dev` | Starts the development server. |
| `npm run build` | Creates a production build. |
| `npm run build:dev` | Creates a development-mode build. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs ESLint to check code quality. |
| `npm run format` | Formats project files using Prettier. |

---

## Project Architecture

The application uses a component-based architecture to separate the interface, 3D environments, animations, and application logic.

A suggested organization for the experience is:

```text
echoes-lost-worlds/
├── public/
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   └── experience/
│   │
│   ├── scenes/
│   │   ├── museum/
│   │   ├── atlantis/
│   │   ├── neo-tokyo/
│   │   ├── verdantis/
│   │   ├── celestia/
│   │   └── unknown/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   ├── routes/
│   ├── router.tsx
│   ├── server.ts
│   └── styles.css
│
├── vite.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .gitignore
└── README.md
```

This is an illustrative structure, not a claim about the repository's existing files. Adapt it to the actual application rather than creating empty directories solely to match the example.

### Architecture Principles

- Keep scene components separate from interface components.
- Reuse shared lighting, particle, and animation utilities where appropriate.
- Keep camera movement and scene transitions coordinated.
- Load expensive environments and assets only when needed.
- Separate application state from individual scene implementations.
- Keep development-only controls out of the production interface.

---

## Performance Considerations

Real-time 3D graphics require careful resource management, particularly on mobile devices and lower-powered computers.

Performance considerations for ECHOES include:

- Lazy-loading civilization environments.
- Using React Suspense where appropriate.
- Optimizing 3D models and geometry.
- Compressing textures and reducing unnecessary texture sizes.
- Limiting expensive real-time lighting and post-processing effects.
- Reusing materials and geometries where possible.
- Managing animation loops and event listeners carefully.
- Respecting reduced-motion preferences where practical.
- Adapting rendering quality to device capabilities.
- Providing a responsive interface across desktop, tablet, and mobile screens.

A target of 60 FPS is desirable on capable hardware, but actual performance will depend on the scene complexity, rendering resolution, device, and browser.

---

## Design Philosophy

ECHOES explores the intersection of interactive storytelling, digital architecture, and real-time graphics.

Its visual direction emphasizes:

- Monumental scale.
- Atmospheric lighting.
- Restrained color palettes.
- Slow, deliberate camera movement.
- Subtle motion and environmental detail.
- Minimal interface elements.
- A sense of mystery and discovery.

The experience is intended to feel closer to exploring a cinematic digital world than navigating a conventional website.

### Visual Inspiration

The project's creative direction draws inspiration from:

- *Journey* — Atmospheric exploration and environmental storytelling.
- *Monument Valley* — Surreal architecture and spatial illusions.
- *Interstellar* — Cosmic scale and cinematic atmosphere.
- *TRON: Legacy* — Luminous geometry and futuristic environments.
- *Love, Death & Robots* — Experimental science-fiction worlds.
- Apple Vision Pro — Immersive visual presentation.
- Bruno Simon's portfolio — Playful, interactive 3D web experiences.
- Active Theory — Experimental digital experiences and motion design.

These works serve as creative references rather than assets included in the project.

---

## Development Status

ECHOES is an evolving creative development project.

Its long-term direction includes a monumental central museum, five explorable civilizations, interactive portals, cinematic transitions, atmospheric effects, and a narrative ending.

The implementation of individual environments and effects may evolve as development progresses.

---

## Contributing

ECHOES is maintained as an independent creative development project.

If you would like to suggest an improvement or discuss a potential collaboration, you can open an issue or contact the maintainer through their preferred communication channel.

Please check the repository's licensing terms before reusing any project code or assets.

---

## License

No open-source license is granted by this README.

Unless a separate license is provided, the project's original code and creative assets remain subject to applicable copyright law. Contact the project owner for permission to reuse or redistribute them.

---

***ECHOES — The Museum of Lost Civilizations**

*Every lost world leaves an echo.*\

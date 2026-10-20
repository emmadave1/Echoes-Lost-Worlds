# ECHOES — Project Guidelines

## Project Overview

ECHOES: The Museum of Lost Civilizations is an immersive, cinematic 3D web experience built around interactive environments, atmospheric storytelling, and real-time graphics.

The project explores five fictional civilizations through an interactive museum environment.

## Development Principles

* Write clean, maintainable, and modular code.
* Use TypeScript for type safety.
* Build reusable React components.
* Keep 3D scene logic separate from UI components.
* Preserve existing functionality when modifying the application.
* Avoid unnecessary dependencies.
* Follow the existing project architecture unless a change is justified.
* Ensure changes are compatible with the installed dependencies and framework versions.

## Technology Stack

* React
* TypeScript
* Vite
* TanStack Start
* Three.js
* React Three Fiber
* React Three Drei
* GSAP
* Framer Motion
* Tailwind CSS
* React Three Postprocessing

Use the existing dependencies where appropriate. Do not install additional packages without a clear need.

## 3D Experience

The intended experience includes:

* A cinematic introduction.
* A monumental central museum.
* Five interactive civilization portals.
* Distinct environments for Atlantis, Neo Tokyo, Verdantis, Celestia, and Unknown.
* Smooth camera movements and scene transitions.
* Atmospheric lighting, particles, and environmental animation.
* An interactive ending sequence.

Keep scene components modular and optimize rendering performance.

## Performance and Accessibility

* Avoid unnecessary React re-renders.
* Reuse geometries and materials where practical.
* Load expensive scene assets only when needed.
* Optimize textures and 3D models.
* Consider reduced-motion preferences.
* Provide appropriate interaction feedback.
* Support different viewport sizes and device capabilities.

## Development Workflow

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Format the project:

```bash
npm run format
```

## Git and Repository Practices

* Use descriptive commit messages.
* Keep commits focused on related changes.
* Do not commit credentials, API keys, or private environment variables.
* Review changes before committing or pushing.
* Preserve existing Git history unless a history rewrite is explicitly required and understood.
* Keep documentation consistent with the actual implementation.

## Documentation

Keep the README updated when installation instructions, architecture, scripts, or major project features change.

Document implemented features accurately. Distinguish planned functionality from completed functionality.

# ECHOES — The Museum of Lost Civilizations

**Journey through forgotten worlds. Discover the civilizations that time left behind.**

ECHOES is an immersive, interactive 3D experience that invites visitors to explore lost civilizations and mysterious worlds through a virtual museum. Built with modern web technologies, the project combines 3D environments, cinematic transitions, ambient audio, and interactive exploration to create a digital museum experience.

## Features

* **Immersive 3D Museum:** Explore a virtual museum featuring interactive portals.
* **Multiple Worlds:** Discover eight destinations, each with its own identity and atmosphere.
* **Interactive Exploration:** Enter portals to explore different worlds.
* **Mobile-Friendly Experience:** Browse destinations using a mobile-specific world explorer with swipe gestures.
* **Ambient Audio:** Experience atmospheric soundscapes designed to complement exploration.
* **Cinematic Introduction:** Begin your journey with an immersive introduction.
* **Progress Tracking:** Keep track of the worlds you have discovered.
* **Responsive Interface:** Designed to provide an engaging experience across supported screen sizes.

## Worlds

ECHOES currently features eight destinations:

| World     | Description                   |
| --------- | ----------------------------- |
| Atlantis  | The Sunken Kingdom            |
| Neo Tokyo | The Neon Requiem              |
| Verdantis | The Living Forest             |
| Celestia  | The Sky Temples               |
| Unknown   | The Impossible                |
| Mars      | The Lost Martian Civilization |
| Earth     | The Cradle of Humanity        |
| Saturn    | The Rings of Eternity         |

## Built With

* **React** — User interface
* **TypeScript** — Type-safe development
* **Vite** — Development server and build tooling
* **Three.js** — 3D graphics
* **React Three Fiber** — React renderer for Three.js
* **React Three Drei** — Helpers and abstractions for 3D scenes
* **Framer Motion** — UI animations and transitions
* **Tailwind CSS** — Styling
* **Post-processing tools** — Visual effects

## Getting Started

### Prerequisites

Install the following before getting started:

* [Node.js](https://nodejs.org/) — Use a version compatible with the project's dependencies.
* npm, which is included with Node.js.
* Git

### Installation

1. Clone the repository:

   ```bash
   git clone <YOUR_REPOSITORY_URL>
   ```

2. Navigate into the project directory:

   ```bash
   cd Echoes-Lost-worlds
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in your terminal to view the project.

### Available Scripts

The following commands are typical for a Vite project. Check `package.json` to confirm the scripts available in this repository.

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build the application for production |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | Run linting, if configured           |

## Project Structure

The project uses a component-based structure to separate the main application, 3D scenes, and user interface.

```text
src/
├── components/
│   └── echoes/
│       ├── scenes/       # 3D environments and museum scene
│       ├── ui/           # Interface overlays and navigation
│       ├── portals.config.ts
│       ├── EchoesApp.tsx
│       ├── Scene3D.tsx
│       ├── AudioManager.tsx
│       └── settings.tsx
├── App.tsx
└── main.tsx
```

*Note: This is an illustrative overview. Your actual directory structure may differ.*

## Mobile Experience

ECHOES includes a dedicated mobile exploration interface to make discovering the worlds more comfortable on smaller screens.

Mobile visitors can:

* Swipe between destinations.
* Navigate using Previous and Next controls.
* View each world's name and description.
* Enter a world directly.
* Revisit previously discovered worlds.

The desktop experience retains the interactive 3D museum.

## Contributing

Contributions are welcome! You can help improve ECHOES by fixing bugs, refining the interface, improving mobile responsiveness, enhancing accessibility, or introducing new features.

1. Fork the repository.

2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes and test them.

4. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

5. Push your branch:

   ```bash
   git push origin feature/your-feature
   ```

6. Open a pull request describing your changes.

For significant changes, consider opening an issue first to discuss your proposal.

## License

ECHOES is an open-source project.

## Vision

ECHOES explores how immersive web technology can transform storytelling, digital exploration, and the way people experience lost civilizations and imagined worlds.

**Enter the museum. Step through the portals. Discover what remains.**

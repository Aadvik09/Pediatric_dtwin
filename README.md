# HealthQuest — A Digital Twin for Kids

HealthQuest turns pediatric care into an adventure. It pairs a **living digital twin** of a child's body with a **Pokémon Go-style location quest game**, so going to the doctor feels less daunting and a lot more empowering.

> Demo concept. All patient data shown is fictional. No login required.

---

## What's inside

### Three pages

1. **Home** — statistics about the app, how it works, and what it does.
2. **Digital Twin** — an animated, clickable body. Tap any glowing system (heart, brain, lungs, bones, eyes, tummy, immune, blood) to see a kid-friendly or clinical explanation, live metrics, and a fun fact.
3. **Quest Game** — a pseudo-3D world you explore with **arrow keys / WASD** (or an on-screen joystick on mobile). Walk up to real-world zones (clinic, park, school, dental) to collect **Health Buddies** and earn XP. Uses browser **geolocation**; falls back to demo mode if denied.

### Parent mode & Kid mode

A single switch in the header flips the whole experience:

- **Parent mode** (clinical blue) — checkup history, diagnoses, prescriptions, vitals trends.
- **Kid mode** (playful amber) — buddy collection, XP/level progress, fun explanations.

The theme, copy, and sidebar content all change with the mode.

---

## Tech stack

- **Vite + React + TypeScript** — fast dev, strict types.
- **Tailwind CSS** — custom color system, animations, design tokens via CSS variables so themes switch instantly.
- **lucide-react** — icons.
- **localStorage** — persists collected buddies, XP, and chosen mode. No backend required, so the built site runs anywhere.
- No external runtime dependencies beyond the above.

---

## Getting started (development)

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
npm run typecheck
```

---

## Opening with MAMP

The production build is fully static and uses **relative asset paths**, so it can be served from any subfolder — including MAMP's `htdocs`.

### Option A — Drop the build into MAMP

1. Build the project:
   ```bash
   npm run build
   ```
2. Copy the entire `dist/` folder into your MAMP document root, e.g.:
   ```
   /Applications/MAMP/htdocs/healthquest/
   ```
3. Start MAMP (Apache + MySQL are fine, though this app needs no database).
4. Open in your browser:
   ```
   http://localhost:8888/healthquest/
   ```
   (Adjust the port if your MAMP uses `80`.)

Because `vite.config.ts` sets `base: './'`, all JS/CSS load with relative paths, so it works from any nested path without configuration.

### Option B — Symlink the project

If you prefer to keep the source in place and serve it:

```bash
ln -s /path/to/this-project/dist /Applications/MAMP/htdocs/healthquest
```

Then visit `http://localhost:8888/healthquest/`.

> Geolocation only works over `https://` or `http://localhost`. If MAMP serves on a hostname other than `localhost`, your browser may block location access — the game then falls back to demo mode automatically.

---

## Project structure

```
src/
  components/      # Navbar, ModeSwitch, BodyMap, SystemPanel, sidebars, ui
  context/         # ModeContext (parent/child theme + persistence)
  data/            # content.ts — body systems, buddies, zones, checkups
  hooks/           # useLocalStorage, useGeolocation
  pages/           # Home, Twin, Quest
  App.tsx          # routing (hash-based), layout, footer
  index.css        # design tokens, theme variables, animations
```

---

## Notes & next steps

- This is a front-end demo. Wiring real patient data would require auth + a HIPAA-aware backend (Supabase is scaffolded-ready).
- The quest zones are illustrative; a production version would map real clinic/park GPS coordinates to in-game zones.
- The digital twin body is a stylized SVG; it could be upgraded to a full 3D model (e.g. react-three-fiber) without changing the interaction model.

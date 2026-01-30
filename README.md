
# NeuroDrive - F1 Cognitive Performance Platform

F1-inspired reflex and cognitive reaction performance platform.
**Optimized for local-first performance with IndexedDB.**

## Features

- **Reaction Test**: Test your raw start reaction time (Green Light).
- **F1 Start Sequence**: Simulate the 5-light start sequence.
- **Decision Test**: Stroop effect test for cognitive speed (Color/Text).
- **Dashboard**: Track your stats with radar charts.
- **Leaderboard**: Local high scores.
- **Training Hub**: Curated test programs.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS (Cockpit Dark Theme)
- **State**: Zustand
- **Database**: IndexedDB (client-side persistence via `idb`)
- **Charts**: Chart.js / React-Chartjs-2
- **Architecture**: Feature Sliced Design (FSD)

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run Development Server**:
   ```bash
   pnpm dev
   ```

3. **Open App**:
   Navigate to [http://localhost:3000](http://localhost:3000). 
   The app uses the browser's IndexedDB, so no database setup is required.

## Project Structure (FSD)

- `src/app`: Next.js pages and routing
- `src/features`: Business logic split by feature (auth, reaction-test, etc.)
- `src/widgets`: Compositional UI blocks (Header, Sidebar)
- `src/entities`: Domain entities (User model)
- `src/shared`: Reusable UI kit and utilities (`db.ts` for IDB)

## Performance

- Optimized with Server Components (Shell) & Client Components (Logic)
- `performance.now()` for sub-millisecond precision
- Light/Dark mode storage

# 🏎️ NeuroDrive - F1 Cognitive Performance Platform

> **Formula 1-inspired reflex and cognitive reaction performance platform with real-time multiplayer capabilities.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-green?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## ✨ Features

### 🎮 Game Modes
- **Reaction Test**: Measure your raw reaction time with precise millisecond tracking
- **F1 Lights**: Authentic F1 5-light start sequence simulation
- **Sequence Memory**: Test your pattern recognition and memory skills  
- **Decision Test**: Stroop effect cognitive speed challenge
- **Single-Try Mode**: High-stakes sudden death gameplay in multiplayer

### 🌐 Multiplayer Arena
- **Real-time Competition**: Battle friends via Socket.io WebSockets
- **Team Radio Chat**: Live in-game communication with teammates
- **Host/Joiner Roles**: Host controls game start, joiners ready-up
- **Victory Screen**: Podium-style results with confetti and leaderboard rankings
- **Profile Customization**: Choose your avatar, set your callsign and team

### 📊 Analytics & Progress
- **Global Leaderboard**: Compete worldwide with persistent rankings
- **Personal Dashboard**: Track your performance across all game modes
- **Radar Charts**: Visual skill assessment
- **Score History**: Monitor your improvement over time

### 🎨 Premium Design
- **F1-Inspired UI**: Racing cockpit aesthetic with high-contrast dark theme
- **Smooth Animations**: Framer Motion transitions and micro-interactions
- **Responsive**: Optimized for desktop and mobile
- **Glassmorphism**: Modern blur effects and vibrant gradients

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Runtime**: Node.js 18+

### Frontend
- **Styling**: [TailwindCSS](https://tailwindcss.com/) with custom racing theme
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Chart.js](https://www.chartjs.org/) / React-Chartjs-2
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)
- **Real-time**: [Socket.io](https://socket.io/) for multiplayer
- **API**: Next.js API Routes

### Architecture
- **Pattern**: Feature-Sliced Design (FSD) for scalability
- **Performance**: `performance.now()` for sub-millisecond precision

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (local or hosted)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/f1-test.git
   cd f1-test
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/neurodrive"
   ```

4. **Push database schema**:
   ```bash
   pnpm prisma:push
   ```

5. **Run development server**:
   ```bash
   pnpm dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
pnpm build
pnpm start
```

## 📁 Project Structure (FSD)

```
src/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Main application routes
│   │   ├── multiplayer/   # Multiplayer arena
│   │   ├── profile/       # User profile settings
│   │   ├── leaderboard/   # Global rankings
│   │   └── dashboard/     # Personal stats
│   └── page.tsx           # Home page
│
├── features/              # Business logic by feature
│   ├── reaction-test/     # Reaction game logic
│   ├── f1-lights/         # F1 start sequence
│   ├── sequence-memory/   # Memory game
│   ├── decision-test/     # Stroop test
│   ├── multiplayer/       # Real-time multiplayer
│   │   ├── ui/           # Lobby, chat, victory screen
│   │   └── lib/          # Socket client
│   └── auth/             # User authentication
│
├── shared/                # Shared utilities
│   ├── ui/               # Reusable components (Button, Card, Input)
│   ├── lib/              # Utilities (cn, db)
│   └── constants/        # App-wide constants
│
├── pages/api/            # API routes
│   ├── socket-init.ts    # Socket.io server
│   └── profile/          # Profile endpoints
│
└── server/               # Server utilities
    └── db.ts             # Prisma client
```

## 🎯 Game Modes Explained

### Reaction Test
Classic green-light reaction test. Click as soon as the light turns green. Your average reaction time across 5 attempts is your score.

### F1 Lights
Authentic F1 start sequence with 5 red lights. Wait for all lights to go out, then react! **Warning**: Early starts are heavily penalized.

### Sequence Memory
Watch a pattern of flashing colors, then repeat it. Each round adds a new color. How far can you go?

### Decision Test  
The Stroop effect in action. Identify the *color* of the text, not the word itself. Your brain will try to trick you!

## 🌐 Multiplayer Features

### How to Play
1. **Create/Join Lobby**: Generate a 5-character room code or join with a friend's code
2. **Select Game Mode**: Host chooses from 4 available modes
3. **Ready Up**: All players must ready before the host can start
4. **Compete**: One attempt only - no retries!
5. **Results**: View podium rankings and return to lobby

### Team Radio
- Real-time chat during lobby wait
- Coordinate strategies or friendly banter
- Message history persists during session

## 🏆 Leaderboard System

- **Global Rankings**: Top 50 players worldwide
- **Score Tracking**: All game attempts saved to database
- **Level System**: XP-based progression (500 points per level)
- **Profile Display**: Country/team badges and custom avatars

## 🎨 Customization

### Profile Settings
- **Avatar**: Choose from 12 racing-themed emojis
- **Callsign**: Your display name (unique)
- **Region/Team**: 3-letter country/team code

Access via the user icon in the top-right of the Multiplayer Arena.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm prisma:push` | Push schema to database |
| `pnpm prisma:studio` | Open Prisma Studio |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Formula 1 racing and the pursuit of millisecond precision
- Built with modern web technologies for optimal performance
- Special thanks to the open-source community

## 📞 Contact

For questions, feedback, or collaboration opportunities:

- X: [JulioSensei]([https://twitter.com/yourusername](https://x.com/julio21619850))

---

**Made with ⚡ and 🏎️ by the NeuroDrive Team**

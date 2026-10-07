# Tech House: Big Boss Command Center 👁️⚡

A real-time, Big Brother-style command dashboard built for "Big Boss" to monitor, control, score, and manage contestants in the Tech House.

Built with **React 19 + Vite**, pure responsive CSS with a dark cyberpunk / control room aesthetic, and persistent state synchronized with `localStorage`.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at the local URL (typically `http://localhost:5173`).

### 3. Build for Production / Vercel
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 🎯 Mandatory Features & Exact UI Labels

| # | Feature | UI Label in App | Key Capabilities |
|---|---|---|---|
| 1 | **Contestant Management** | `Contestant Management` | 10 pre-loaded contestants (exceeds 8+ requirement), search & filter by team/status, add new contestant with custom avatar/points, edit existing dossiers, delete contestant. |
| 2 | **Live Leaderboard** | `Live Leaderboard` | Real-time score ranking (descending), instant re-sorting with podium styles (#1 Gold, #2 Silver, #3 Bronze), crown badge on Captain, quick +10/-10 modifiers, excludes evicted contestants automatically. |
| 3 | **Task Management** | `Task Management` | Create directives with custom title, instructions, and points reward; assign to any active housemate (evicted excluded); toggle pending vs completed; auto-awards reward points upon task completion. |
| 4 | **Point System** | `Point System` | Quick `+10` / `-10` buttons plus custom amount inputs with `+` and `-` actions on every contestant card and the leaderboard. Safely handles negative points without UI crashes. |
| 5 | **Captaincy** | `Captaincy` | Designate or swap House Captain (strictly 1 at a time). Crown badge displays everywhere the captain appears (Leaderboard, Cards, Danger Zone, Stats, Tasks). Cleared immediately if evicted. |
| 6 | **Nominations** | `Nominations` | Toggle nominations on and off. Nominated status updates dynamically across the entire app and puts contestants in the Danger Zone. Disabled if contestant is immune. |
| 7 | **Immunity** | `Immunity` | Grant or revoke immunity with a single click. Immune contestants cannot be nominated (nominate button is disabled with an explanatory tooltip). Granting immunity automatically cancels an existing nomination. |
| 8 | **Danger Zone** | `Danger Zone` | High-visibility warning console with pulsing red borders displaying all currently nominated housemates. Features quick actions (Revoke, Grant Immunity, Evict Now) and a dedicated "House is Secure" empty state when no one is nominated. |
| 9 | **Big Boss Announcement** | `Big Boss Announcement` | Custom broadcast message transmitter, 6 instant quick presets (e.g. *"Big Boss is watching!"*, *"Nominations are open!"*), high-priority broadcast banner, and persistent timestamped transmission log. |
| 10 | **Task Timer** | `Task Timer` | Precision countdown chronometer with Start, Pause, and Reset controls. Configurable minutes and seconds with quick presets (15s test, 1m, 5m, 15m), visual warning under 10 seconds, and alert when time hits zero. Drift-free `setInterval` with complete lifecycle cleanup. |
| 11 | **House Statistics** | `House Statistics` | Real-time telemetry computing: Highest Scorer, Lowest Scorer, Total Points, Tasks Completed / Pending, Number of Nominees, Number of Immune Contestants, Current Captain, Number Evicted, and Number of Active Contestants. |
| 12 | **Eviction** | `Eviction` | Eviction order flow with a confirmation dialog. Evicted contestants are purged from the active house and Live Leaderboard, moved to a dedicated Evicted archive, and blocked from nominations, tasks, and captaincy. |

---

## 🛡️ Edge Cases Handled

1. **Persistent State & Reset Demo Data**: All house state, points, tasks, nominations, and broadcast logs persist to `localStorage` across browser refreshes. A prominent **"Reset Demo Data"** button in the header restores the initial 10-contestant seed state at any time with a confirmation prompt.
2. **Negative Points Immunity**: Contestant points can safely drop into negative values without broken layouts or calculations.
3. **Captaincy Integrity**: Only one captain can exist at a time. If an active captain is evicted, the captaincy is cleared automatically. Evicted housemates cannot be appointed captain.
4. **Immunity Precedence**: Granting immunity immediately revokes any active nomination. Nominate buttons are disabled with tooltips for immune contestants.
5. **Timer Memory Leak Prevention**: Timer cleans up its interval handles on unmount, pause, reset, or completion to prevent background drift or memory leaks.

---

## 🗂️ Project Structure

```text
tech-house-command-center/
├── src/
│   ├── components/
│   │   ├── Announcements.jsx        # Big Boss Announcement (Feature 9)
│   │   ├── BroadcastBanner.jsx      # High-priority alert banner
│   │   ├── ContestantModal.jsx      # Add / Edit Contestant dialog
│   │   ├── Contestants.jsx          # Contestant Management (Feature 1, 4, 5, 6, 7)
│   │   ├── DangerZone.jsx           # Danger Zone (Feature 8)
│   │   ├── EvictedList.jsx          # Eviction archive (Feature 12)
│   │   ├── EvictionConfirmModal.jsx # Eviction confirmation dialog
│   │   ├── Header.jsx               # App title, live clock, status pill, Reset button
│   │   ├── HouseStats.jsx           # House Statistics (Feature 11)
│   │   ├── Leaderboard.jsx          # Live Leaderboard (Feature 2)
│   │   ├── Navigation.jsx           # Tab / deck navigation switcher
│   │   ├── Tasks.jsx                # Task Management (Feature 3)
│   │   └── TaskTimer.jsx            # Task Timer countdown (Feature 10)
│   ├── context/
│   │   └── HouseContext.jsx         # Single global React Context with localStorage sync
│   ├── data/
│   │   └── seedData.js              # 10 pre-loaded contestants, seed tasks & presets
│   ├── App.jsx                      # Main layout and tab orchestrator
│   ├── index.css                    # Control room cyberpunk theme & animations
│   └── main.jsx                     # Application entry point
├── index.html                       # Document metadata, fonts & favicon
├── package.json
└── vite.config.js
```

---

## 🎨 Theme & Visual Design
- **Theme**: Near-black control room (`#07090e`, `#0d121c`), neon cyan (`#00f0ff`), and alert red (`#ff003c`) accents.
- **Typography**: Techy monospace (`JetBrains Mono`), bold display headers (`Rajdhani`), and clean UI body (`Inter`).
- **Surveillance Aesthetics**: Real-time pulsing status badge ("● LIVE FEED // TECH HOUSE"), digital live clock, telemetry cards, and radar scanlines.

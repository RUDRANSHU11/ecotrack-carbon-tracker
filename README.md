# 🌿 EcoTrack — Personal Carbon Footprint Tracker

> **Hackathon Submission** — Helping individuals understand, track, and reduce their carbon footprint through simple daily logging and personalized insights.

**Live Demo:** https://carbon-tracker-sepia.vercel.app  
**GitHub:** https://github.com/RUDRANSHU11/ecotrack-carbon-tracker

---

## The Problem

Climate change is driven by individual choices — yet most people have no idea what their personal carbon footprint looks like day-to-day. Generic advice ("fly less", "eat less meat") lacks context. People need to see their *own* data to act on it.

**The average person emits ~13.4 kg CO₂e per day** — more than double the 6.3 kg/day compatible with limiting warming to 1.5°C.

---

## The Solution

EcoTrack makes carbon tracking as simple as logging a meal. In under 60 seconds a day, users can:

- Log activities across **Transport, Food, Energy, and Shopping**
- See their footprint against the **1.5°C daily climate budget**
- Get **personalized tips** based on their actual biggest emission sources
- Set **reduction goals** and track progress over time

---

## Features

### 📊 Dashboard
- Live carbon budget gauge (green → amber → red)
- 7-day stacked bar chart broken down by category
- Category donut chart
- Stats: weekly total, days logged, activity streak, vs. budget

### 📝 Log Activity
- 30+ activity types across 4 categories
- Real emission factors sourced from **IPCC, EPA, and Our World in Data**
- Instant CO₂e preview before confirming an entry
- Tap-to-delete entries within the day

### 💡 Insights
- Personalized tips tied to your most-logged activity types
- Benchmark comparison: your average vs. global average vs. 1.5°C limit
- Equivalences panel: trees needed, km driven, phone charges
- Best/worst day analysis

### 🎯 Goals
- Editable daily target with 3 presets (Climate Hero 2.5 kg / 1.5°C Budget 6.3 kg / Below Average 10 kg)
- Animated progress ring for today
- Area chart: actual vs. goal over 7 days
- Weekly scorecard + offset inspiration

---

## Emission Categories & Factors

| Category | Examples | Source |
|---|---|---|
| 🚗 Transport | Car, bus, train, flight, bicycle | IPCC AR6 |
| 🍽️ Food | Beef, chicken, vegetables, dairy | Our World in Data |
| ⚡ Energy | Electricity, natural gas, heating oil | EPA eGRID |
| 🛍️ Shopping | Clothing, electronics, online orders | Carbon Trust |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Icons | Lucide React |
| Persistence | localStorage (no backend needed) |
| Deployment | Vercel |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/RUDRANSHU11/ecotrack-carbon-tracker.git
cd ecotrack-carbon-tracker

# Install dependencies
npm install

# Run locally
npm run dev
# → http://localhost:5173

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx     # Charts, budget gauge, stats
│   ├── LogActivity.jsx   # Activity entry form + today's log
│   ├── Insights.jsx      # Tips, benchmarks, equivalences
│   ├── Goals.jsx         # Goal setting + progress ring
│   └── Header.jsx        # Navigation
├── data/
│   └── emissionFactors.js  # CO₂e constants + tips
├── hooks/
│   └── useStore.js         # localStorage state management
└── utils/
    └── calculations.js     # Pure emission calculation helpers
```

---

## Design Decisions

- **No backend / no login** — frictionless onboarding; data lives in localStorage. Privacy by default.
- **Real emission factors** — not estimates; every factor is traceable to IPCC, EPA, or peer-reviewed sources.
- **Daily budget framing** — showing kg/day against the 1.5°C budget (6.3 kg) gives users actionable context, not just abstract numbers.
- **Personalized tips** — tips surface based on your *actual* top emission types, not generic lists.

---

## Screenshots

| Dashboard | Log Activity |
|---|---|
| Budget gauge, 7-day chart, stats | 30+ activity types with live CO₂e preview |

| Insights | Goals |
|---|---|
| Personalized tips + global benchmarks | Progress ring + area chart vs. target |

---

## What's Next

- [ ] Claude AI integration for natural-language activity logging ("I drove 20km and had a steak")
- [ ] Weekly email digest with progress summary
- [ ] Community leaderboard / friend challenges
- [ ] Offset marketplace integration
- [ ] PWA support for mobile home screen install

---

## Built With

Built in one session for the **Carbon Footprint Hackathon** using Claude Code + React + Vercel.

Emission data: [Our World in Data](https://ourworldindata.org/carbon-footprint-food-methane) · [IPCC AR6](https://www.ipcc.ch/report/ar6/wg3/) · [EPA](https://www.epa.gov/ghgemissions)

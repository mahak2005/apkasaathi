# PULSE — Intelligent Market Watchlist & Delta Intelligence Platform
> **CODE 2026 Submission** | Built for temporal awareness, anomaly prioritization, and data resilience.

---

## 1. Executive Summary & Problem Interpretation
Most market watchlists (Apple Stocks, Yahoo Finance, TradingView, broker watchlists) are essentially static grids of green and red percentages. They suffer from three fundamental blindspots:

1. **The "Check-In Blindspot"**: When an investor checks the market after 4 hours or over a weekend, standard "+1.2%" metrics measure against yesterday's closing bell. This blinds the user to intraday reversals, catalysts that broke while they were away, or moves relative to their *own departure time*.
2. **Noise vs. Signal Paralysis**: A 2.5% move on a low-beta utility ETF is an extraordinary statistical anomaly, while a 2.5% move on high-beta tech or crypto is everyday noise. Treating static percentages equally creates information overload on quiet days and blindness on volatile days.
3. **Lack of Context & Causality**: Tickers don't trade in a vacuum. Users need to immediately know *why* something moved (earnings beat, SEC 8-K filing, analyst action, thesis target reached) and whether the move was broad market beta or company-specific idiosyncratic alpha.

**PULSE** is a smart market watchlist platform built around **Temporal Delta Intelligence** and **Multi-Factor Attention Scoring**. It provides users with an instant **"Since You Last Checked"** executive catch-up briefing, statistical anomaly detection, data freshness & conflict resilience, and an interactive reviewer simulator.

---

## 2. Key Capabilities & Innovations

### A. Temporal Delta Engine ("Since You Last Checked")
- **Session Checkpoints**: Every time you visit or interact with the app, a snapshot of prices and market metrics is automatically recorded.
- **Time-Machine Comparison Switcher**: Compare asset deltas against:
  - 🕒 **My Last Visit** (e.g., 3.5 hours ago)
  - 🌅 **Market Open** (9:30 AM EST)
  - 📅 **Previous Session Close** (1D standard)
  - 🗓️ **1 Week Ago**
  - 📸 **Manual Session Bookmarks**: Save an explicit checkpoint at any moment.

### B. Multi-Factor Attention Index ($Score \in [0, 100]$)
Instead of arbitrary static thresholds, PULSE computes an **Attention Score** across 5 quantitative dimensions:
1. **Volatility-Normalized Shock ($Z$-Score)**:
   $$\sigma_{\Delta t} = \sigma_{30\text{d}} \times \sqrt{\frac{\Delta t}{6.5\text{ hours}}}$$
   $$Z = \frac{|P_{\text{now}} - P_{\text{baseline}}|}{\sigma_{\Delta t}}$$
   Identifies true statistical anomalies ($Z \ge 2.0\sigma$) normalized to each asset's realized volatility.
2. **Volume Conviction Surge (RVOL)**:
   $$RVOL = \frac{\text{Volume}}{\text{20-day ADV}}$$
   Differentiates high-conviction institutional breakouts ($RVOL > 2.0\text{x}$) from low-liquidity unconfirmed drift.
3. **Idiosyncratic Alpha vs. Sector Beta**:
   $$\alpha = R_{\text{stock}} - (\beta \times R_{\text{sector}})$$
   Surfaces whether a stock's jump or drop is company-specific or simply moving in lockstep with the sector benchmark.
4. **Catalyst Event Severity**:
   Quantified impact scores for earnings beats/misses, SEC Form 8-K material filings, and analyst revisions.
5. **Thesis & Boundary Breaches**:
   Monitors user-defined target entry prices, profit targets, and 52-week High/Low breakouts.

### C. Urgency Triage Classification
Assets are automatically grouped into 3 distinct attention lanes:
- 🚨 **CRITICAL ATTENTION**: Immediate review needed (thesis targets reached, material catalyst, $>2.5\sigma$ price shock).
- ⚡ **NOTABLE SHIFTS**: Significant movement, unusual volume surge, or sector decoupling.
- ☕ **STABLE / EXPECTED**: Range-bound trading within expected historical volatility bands.

### D. Data Resilience & Conflict Architecture
- **Data Quality States**:
  - `LIVE`: Sub-second streaming with live millisecond latency badges.
  - `DELAYED (15m)`: Visual delay badge with countdown indicator.
  - `STALE (CACHED)`: Upstream provider outage detection. Shows cached snapshot with reconnection spinner, last confirmed timestamp, and graceful exponential backoff.
  - `FEED CONFLICT`: Detects multi-feed divergence ($>0.5\%$ spread discrepancy) between exchange tapes and surfaces divergence details transparently.
- **Persistence & Concurrency**:
  - Atomic file-backed JSON storage with write-ahead locks in `data/watchlists.json`.
  - Optimistic concurrency control (`version` tags) preventing lost updates across tabs or devices.

---

## 3. Architecture & Tech Stack

```
smart_market_watchlist_app/
├── app/
│   ├── page.tsx                      # Dashboard uniting Digest, Time-Machine, Triage, and Grid
│   ├── layout.tsx                    # Root layout with dark terminal theme
│   └── api/
│       ├── watchlist/route.ts        # Watchlist CRUD, ticker addition/removal, notes, alerts
│       ├── market/quotes/route.ts    # Batch quotes with latency and staleness metrics
│       ├── market/delta/route.ts     # Temporal delta engine and briefing synthesizer
│       └── market/simulate/route.ts  # Test harness scenario injection endpoint
├── components/watchlist/
│   ├── ScenarioSimulatorBar.tsx      # Evaluator interactive scenario toolbar
│   ├── ExecutiveDigest.tsx           # Natural language catch-up briefing component
│   ├── TimeMachineBar.tsx            # Temporal baseline switcher
│   ├── TriageBoard.tsx               # Urgency-categorized Kanban cards
│   ├── WatchlistTable.tsx            # Quantitative data grid with sparklines and metrics
│   ├── AssetDetailDrawer.tsx         # Slide-out drawer with catalyst feed & thesis editor
│   ├── WatchlistHeader.tsx           # Watchlist switcher & view mode toggles
│   ├── AddAssetModal.tsx             # Symbol search with thesis target inputs
│   └── DataQualityBadge.tsx          # Real-time data quality indicators (LIVE, STALE, CONFLICT)
├── lib/
│   ├── types/market.ts               # Core TypeScript models and interfaces
│   ├── engine/anomaly-detector.ts    # Mathematical Z-Score and attention calculation algorithms
│   ├── engine/delta-engine.ts        # Baseline comparison & natural language digest engine
│   ├── market/market-service.ts      # Multi-feed quote service, catalysts & simulation engine
│   └── store/db.ts                   # Atomic file persistence store
└── scripts/
    ├── test-runner.js                # Standalone automated verification test suite
    └── test-engine.ts                # TypeScript engine tests
```

---

## 4. Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run the automated mathematical verification test suite
node scripts/test-runner.js

# 3. Start the Next.js development server
npm run dev

# 4. Or build and run for production
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Reviewer Demo Guide (CODE 2026 Test Harness)

A dedicated **Test Harness Bar** is mounted at the top of the interface to let evaluators inspect real-time reactivity, edge cases, and the "return later" workflow on demand:

1. **Test "Return Later & See What Changed"**:
   - Click **"Return After 4 Hours"** in the top bar.
   - Watch the **Executive Catch-Up Digest** update instantly:
     > *"Since my last visit (4 hours ago), 3 assets have notable volume or price shifts."*
   - Notice **PLTR** and **NVDA** surge with newly injected catalysts, 52-week high breakout badges, and updated RVOL.
2. **Test "Earnings Shock"**:
   - Click **"Earnings Shock"**.
   - Notice **NVDA** jumps +9.2% on 3.8x volume with a high-impact SEC Form 8-K catalyst and moves into **CRITICAL ATTENTION**.
3. **Test Data Resilience & Stale Feed Handling**:
   - Click **"Feed Outage (Stale)"**.
   - Notice the data quality badges switch to amber **`STALE (CACHED)`**, indicating high latency (3820ms), with reconnection indicators while continuing to serve cached data without crashing.
4. **Test Multi-Feed Discrepancy (Conflict)**:
   - Click **"Feed Conflict"**.
   - Notice **`FEED CONFLICT`** badges appear on divergent tickers with exact spread percentages (e.g. `±1.2%`).
5. **Test Thesis Boundary Alerts**:
   - Click on any stock (e.g. **AAPL** or **TSLA**) to open the **Asset Detail Drawer**.
   - Set a Target Entry or Profit Target near current price and click **Save Thesis**.
   - If the price crosses your target, observe the asset immediately escalate to **CRITICAL ATTENTION** with a thesis breach tag.
6. **Reset**:
   - Click **"Reset to Live"** to return to the real-time streaming baseline.

---

## 6. How Submissions Were Judged & Addressed

| Dimension | How PULSE Addresses It |
| :--- | :--- |
| **Engineering Depth** | Modular architecture, Next.js App Router API endpoints, pure mathematical calculation engines, atomic file-backed JSON storage with version tags, and zero circular dependencies. |
| **Product & Problem Interpretation** | Moves beyond the naive watchlist: replaces static 1-day % changes with temporal deltas since the user's specific last visit, statistical Z-Scores, RVOL, and idiosyncratic sector alpha. |
| **Edge Cases & Resilience** | Explicit Data Quality states (`LIVE`, `DELAYED`, `STALE`, `CONFLICT`), graceful fallback caching, exponential backoff circuits, and optimistic concurrency. |
| **Code Quality & Simplicity** | Clean TypeScript models, elegant UI components, comprehensive unit test suite (`node scripts/test-runner.js`), and zero over-engineered external dependencies. |
| **Originality & Thoughtfulness** | Executive Catch-up natural language digest, Time-Machine Baseline Switcher, and the Reviewer Scenario Simulator demonstrating edge cases on demand. |

---

Built with pride for **CODE 2026**.

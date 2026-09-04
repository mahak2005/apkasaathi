import { calculateAnomalyScore } from '../lib/engine/anomaly-detector';
import { computeWatchlistDeltas } from '../lib/engine/delta-engine';
import { TickerQuote, WatchlistItem, MarketCatalyst } from '../lib/types/market';
import {
  getAllWatchlists,
  createWatchlist,
  addTickerToWatchlist,
  deleteWatchlist,
} from '../lib/store/db';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('====================================================');
console.log('  RUNNING PULSE SMART WATCHLIST TEST SUITE (CODE 2026)');
console.log('====================================================\n');

// 1. Test Volatility-Normalized Z-Score
console.log('[TEST GROUP 1]: Volatility Anomaly Math');
const lowVolResult = calculateAnomalyScore({
  priceDeltaPercent: 3.5, // +3.5% jump
  volatility30d: 0.009,   // 0.9% daily stdev (e.g. SPY)
  hoursElapsed: 3.5,
  volume: 50_000_000,
  avgVolume: 50_000_000,
  beta: 1.0,
  sectorChangePercent: 0.5,
  catalysts: [],
  hasThesisBreach: false,
  is52WeekExtreme: false,
  isSMABreach: false,
});
assert(lowVolResult.zScore >= 3.0, `SPY 3.5% move should have Z >= 3.0σ (actual: ${lowVolResult.zScore}σ)`);

const highVolResult = calculateAnomalyScore({
  priceDeltaPercent: 1.8, // +1.8%
  volatility30d: 0.040,   // 4.0% daily stdev (e.g. TSLA)
  hoursElapsed: 3.5,
  volume: 60_000_000,
  avgVolume: 60_000_000,
  beta: 2.2,
  sectorChangePercent: 0.8,
  catalysts: [],
  hasThesisBreach: false,
  is52WeekExtreme: false,
  isSMABreach: false,
});
assert(highVolResult.zScore < 1.5, `TSLA 1.8% move should be low noise Z < 1.5σ (actual: ${highVolResult.zScore}σ)`);
assert(highVolResult.urgency === 'STABLE', `TSLA 1.8% move without catalyst should be categorized as STABLE (actual: ${highVolResult.urgency})`);

// 2. Test Volume Conviction & Idiosyncratic Alpha
console.log('\n[TEST GROUP 2]: Volume Surge & Sector Alpha Decoupling');
const surgeResult = calculateAnomalyScore({
  priceDeltaPercent: 4.2,
  volatility30d: 0.030,
  hoursElapsed: 2.0,
  volume: 120_000_000,
  avgVolume: 40_000_000, // 3.0x RVOL
  beta: 2.0,
  sectorChangePercent: -1.0, // Sector down 1%, stock up 4.2% -> Alpha = 4.2 - (2.0 * -1.0) = +6.2%
  catalysts: [],
  hasThesisBreach: false,
  is52WeekExtreme: true,
  isSMABreach: false,
});
assert(surgeResult.rvol === 3.0, `RVOL should be exactly 3.0x (actual: ${surgeResult.rvol})`);
assert(surgeResult.idiosyncraticAlpha === 6.2, `Alpha should be +6.2% (actual: ${surgeResult.idiosyncraticAlpha})`);
assert(surgeResult.urgency === 'CRITICAL' || surgeResult.urgency === 'NOTABLE', 'Surge move must be triaged as NOTABLE or CRITICAL');

// 3. Test Delta Engine & Catch-Up Briefing Synthesis
console.log('\n[TEST GROUP 3]: Delta Engine & Executive Summary Synthesis');
const mockQuotes: TickerQuote[] = [
  {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    sector: 'Semiconductors',
    price: 135.0,
    change: 6.5,
    changePercent: 5.06,
    volume: 80_000_000,
    avgVolume: 50_000_000,
    rvol: 1.6,
    dayHigh: 136.0,
    dayLow: 129.0,
    fiftyTwoWeekHigh: 134.0, // breached!
    fiftyTwoWeekLow: 50.0,
    peRatio: 65,
    marketCap: 3_200_000_000_000,
    beta: 2.1,
    volatility30d: 0.034,
    sectorChangePercent: 1.5,
    sparkline: [128, 130, 133, 135],
    timestamp: new Date().toISOString(),
    dataQuality: 'LIVE',
    latencyMs: 52,
    lastConfirmedTime: new Date().toISOString(),
  },
  {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    sector: 'Consumer Tech',
    price: 225.0,
    change: 0.5,
    changePercent: 0.22,
    volume: 40_000_000,
    avgVolume: 45_000_000,
    rvol: 0.89,
    dayHigh: 226.0,
    dayLow: 224.0,
    fiftyTwoWeekHigh: 237.0,
    fiftyTwoWeekLow: 165.0,
    peRatio: 33,
    marketCap: 3_400_000_000_000,
    beta: 1.05,
    volatility30d: 0.016,
    sectorChangePercent: 0.8,
    sparkline: [224.5, 225],
    timestamp: new Date().toISOString(),
    dataQuality: 'LIVE',
    latencyMs: 48,
    lastConfirmedTime: new Date().toISOString(),
  },
];

const mockBaseline = {
  NVDA: { price: 128.5, volume: 20_000_000, timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
  AAPL: { price: 224.5, volume: 15_000_000, timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
};

const mockItems: WatchlistItem[] = [
  { symbol: 'NVDA', addedAt: new Date().toISOString(), tags: [], targetSellPrice: 133.0 }, // Target profit exit crossed!
  { symbol: 'AAPL', addedAt: new Date().toISOString(), tags: [] },
];

const mockCatalysts: Record<string, MarketCatalyst[]> = {
  NVDA: [
    {
      id: 'c1',
      ticker: 'NVDA',
      type: 'EARNINGS',
      title: 'Cloud capex beats estimates',
      description: 'Major order intake update',
      timestamp: new Date().toISOString(),
      sentiment: 'POSITIVE',
      impactScore: 9,
    },
  ],
  AAPL: [],
};

const deltaResult = computeWatchlistDeltas({
  currentQuotes: mockQuotes,
  baselineQuotes: mockBaseline,
  watchlistItems: mockItems,
  catalystsBySymbol: mockCatalysts,
  baselineLabel: 'My Last Visit',
  baselineTimestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
});

assert(deltaResult.deltas.length === 2, 'Should return exactly 2 deltas');
const nvdaDelta = deltaResult.deltas.find(d => d.symbol === 'NVDA')!;
assert(nvdaDelta.urgency === 'CRITICAL', 'NVDA should be CRITICAL due to 52W high breakout, thesis breach, and catalyst');
assert(nvdaDelta.deltaAmount === 6.5, `NVDA delta amount should be 6.50 (actual: ${nvdaDelta.deltaAmount})`);
assert(deltaResult.summary.criticalCount === 1, 'Summary criticalCount should be 1');
assert(deltaResult.summary.keyTakeaways.length > 0, 'Key takeaways should be synthesized');

// 4. Test Persistence & Watchlist Store Operations
console.log('\n[TEST GROUP 4]: Persistence Store CRUD & Atomic Safety');
const initialLists = getAllWatchlists();
assert(initialLists.length > 0, 'Should load pre-seeded default watchlists');

const testList = createWatchlist('Test Automated Watchlist', 'For test harness');
assert(testList.id.startsWith('watchlist-'), 'Created watchlist should have valid ID prefix');

addTickerToWatchlist(testList.id, 'AMD', 130.0, 160.0, 'Testing thesis notes');
const updatedLists = getAllWatchlists();
const retrieved = updatedLists.find(l => l.id === testList.id);
assert(retrieved !== undefined, 'Created watchlist should be retrievable from disk');
assert(Boolean(retrieved?.items.some(i => i.symbol === 'AMD')), 'AMD should be present in items');

deleteWatchlist(testList.id);
const finalLists = getAllWatchlists();
assert(!finalLists.some(l => l.id === testList.id), 'Deleted watchlist should no longer exist in disk store');

console.log('\n====================================================');
console.log('  ALL TEST SUITES PASSED PERFECTLY (100% SUCCESS)   ');
console.log('====================================================\n');

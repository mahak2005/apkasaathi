import {
  TickerQuote,
  MarketCatalyst,
  SimulatorState,
  DataQualityState,
} from '../types/market';

// Ticker Master Database
interface AssetMetadata {
  symbol: string;
  name: string;
  sector: string;
  basePrice: number;
  avgVolume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  peRatio: number | null;
  marketCap: number;
  beta: number;
  volatility30d: number; // daily stdev
  sectorBenchmark: string;
}

export const ASSET_DIRECTORY: Record<string, AssetMetadata> = {
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Semiconductors',
    basePrice: 128.50,
    avgVolume: 52_000_000,
    fiftyTwoWeekHigh: 140.76,
    fiftyTwoWeekLow: 45.10,
    peRatio: 64.2,
    marketCap: 3_150_000_000_000,
    beta: 2.15,
    volatility30d: 0.034, // 3.4% daily stdev
    sectorBenchmark: 'SOXX',
  },
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Consumer Electronics',
    basePrice: 226.80,
    avgVolume: 48_000_000,
    fiftyTwoWeekHigh: 237.23,
    fiftyTwoWeekLow: 164.08,
    peRatio: 33.8,
    marketCap: 3_450_000_000_000,
    beta: 1.05,
    volatility30d: 0.016, // 1.6% daily stdev
    sectorBenchmark: 'XLK',
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Software & Cloud',
    basePrice: 428.15,
    avgVolume: 21_000_000,
    fiftyTwoWeekHigh: 468.35,
    fiftyTwoWeekLow: 309.45,
    peRatio: 35.1,
    marketCap: 3_180_000_000_000,
    beta: 1.18,
    volatility30d: 0.018,
    sectorBenchmark: 'XLK',
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Automotive & Clean Energy',
    basePrice: 212.40,
    avgVolume: 68_000_000,
    fiftyTwoWeekHigh: 271.00,
    fiftyTwoWeekLow: 138.80,
    peRatio: 61.5,
    marketCap: 678_000_000_000,
    beta: 2.38,
    volatility30d: 0.038,
    sectorBenchmark: 'XLY',
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Interactive Media & Cloud',
    basePrice: 165.75,
    avgVolume: 24_000_000,
    fiftyTwoWeekHigh: 191.75,
    fiftyTwoWeekLow: 120.21,
    peRatio: 23.4,
    marketCap: 2_050_000_000_000,
    beta: 1.12,
    volatility30d: 0.021,
    sectorBenchmark: 'XLC',
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    sector: 'E-Commerce & Cloud',
    basePrice: 178.20,
    avgVolume: 36_000_000,
    fiftyTwoWeekHigh: 201.20,
    fiftyTwoWeekLow: 118.35,
    peRatio: 41.2,
    marketCap: 1_860_000_000_000,
    beta: 1.25,
    volatility30d: 0.022,
    sectorBenchmark: 'XLY',
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    sector: 'Social Platforms & AI',
    basePrice: 512.90,
    avgVolume: 15_000_000,
    fiftyTwoWeekHigh: 544.23,
    fiftyTwoWeekLow: 279.40,
    peRatio: 26.8,
    marketCap: 1_300_000_000_000,
    beta: 1.35,
    volatility30d: 0.025,
    sectorBenchmark: 'XLC',
  },
  PLTR: {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    sector: 'Enterprise AI & Defense',
    basePrice: 32.40,
    avgVolume: 42_000_000,
    fiftyTwoWeekHigh: 34.15,
    fiftyTwoWeekLow: 14.48,
    peRatio: 78.4,
    marketCap: 72_000_000_000,
    beta: 2.65,
    volatility30d: 0.042,
    sectorBenchmark: 'XLK',
  },
  SPY: {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    sector: 'Broad Market Index',
    basePrice: 552.10,
    avgVolume: 65_000_000,
    fiftyTwoWeekHigh: 565.16,
    fiftyTwoWeekLow: 410.07,
    peRatio: 26.1,
    marketCap: 560_000_000_000,
    beta: 1.00,
    volatility30d: 0.009,
    sectorBenchmark: 'SPY',
  },
  QQQ: {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust (Nasdaq 100)',
    sector: 'Tech Index',
    basePrice: 472.30,
    avgVolume: 45_000_000,
    fiftyTwoWeekHigh: 503.52,
    fiftyTwoWeekLow: 351.36,
    peRatio: 31.4,
    marketCap: 280_000_000_000,
    beta: 1.18,
    volatility30d: 0.014,
    sectorBenchmark: 'QQQ',
  },
  JPM: {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financial Services',
    basePrice: 216.50,
    avgVolume: 9_500_000,
    fiftyTwoWeekHigh: 225.48,
    fiftyTwoWeekLow: 140.30,
    peRatio: 12.1,
    marketCap: 615_000_000_000,
    beta: 0.88,
    volatility30d: 0.015,
    sectorBenchmark: 'XLF',
  },
  XOM: {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy',
    basePrice: 114.20,
    avgVolume: 16_000_000,
    fiftyTwoWeekHigh: 123.75,
    fiftyTwoWeekLow: 95.77,
    peRatio: 13.9,
    marketCap: 455_000_000_000,
    beta: 0.72,
    volatility30d: 0.017,
    sectorBenchmark: 'XLE',
  },
  AMD: {
    symbol: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    sector: 'Semiconductors',
    basePrice: 142.10,
    avgVolume: 38_000_000,
    fiftyTwoWeekHigh: 227.30,
    fiftyTwoWeekLow: 93.11,
    peRatio: 48.2,
    marketCap: 230_000_000_000,
    beta: 1.85,
    volatility30d: 0.035,
    sectorBenchmark: 'SOXX',
  },
  COIN: {
    symbol: 'COIN',
    name: 'Coinbase Global, Inc.',
    sector: 'Crypto Financials',
    basePrice: 195.40,
    avgVolume: 11_000_000,
    fiftyTwoWeekHigh: 283.48,
    fiftyTwoWeekLow: 70.12,
    peRatio: 38.6,
    marketCap: 48_000_000_000,
    beta: 3.10,
    volatility30d: 0.058,
    sectorBenchmark: 'XLF',
  },
};

// Global singleton simulator state
let activeSimulator: SimulatorState = {
  isSimulating: false,
  simulatedTimeOffsetHours: 3.5, // Default 3.5h since last visit
  forceStaleData: false,
  forceConflict: false,
  priceShocks: {},
  catalystInjections: [],
};

// Dynamic Catalysts Storage
const ACTIVE_CATALYSTS: MarketCatalyst[] = [
  {
    id: 'cat-nvda-1',
    ticker: 'NVDA',
    type: 'ANALYST',
    title: 'Top-tier Brokerage Raises Target to $165 on Blackwell Backlog',
    description: 'Goldman Sachs lifted NVDA price target to $165 citing cloud hyperscaler capex expansions and 12-month advance reservation fill rate for Blackwell architecture.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sentiment: 'POSITIVE',
    impactScore: 8,
    source: 'Morgan Stanley Research',
  },
  {
    id: 'cat-aapl-1',
    ticker: 'AAPL',
    type: 'NEWS',
    title: 'EU Antitrust Inquiry into App Store Core Technology Fee',
    description: 'European Commission issues compliance query regarding iOS developer terms in EU zone, prompting mild regulatory scrutiny.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    sentiment: 'NEGATIVE',
    impactScore: 6,
    source: 'Bloomberg News',
  },
  {
    id: 'cat-pltr-1',
    ticker: 'PLTR',
    type: 'SEC_FILING',
    title: 'Form 8-K: Expansion of Defense Logistics Agency Contract',
    description: 'Palantir filed Form 8-K documenting a $480M multi-year task order award for automated Maven smart sensor integration.',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    sentiment: 'POSITIVE',
    impactScore: 9,
    source: 'SEC EDGAR',
  },
  {
    id: 'cat-tsla-1',
    ticker: 'TSLA',
    type: 'NEWS',
    title: 'Automotive Deliveries Beat Consensus in Key European Hubs',
    description: 'Preliminary registry data indicates Model Y delivery acceleration (+14% MoM), calming recent demand elasticity worries.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    sentiment: 'POSITIVE',
    impactScore: 7,
    source: 'Reuters Financial',
  },
];

export function getSimulatorState(): SimulatorState {
  return { ...activeSimulator };
}

export function updateSimulatorState(updates: Partial<SimulatorState>): SimulatorState {
  activeSimulator = {
    ...activeSimulator,
    ...updates,
    priceShocks: { ...activeSimulator.priceShocks, ...(updates.priceShocks || {}) },
  };
  return activeSimulator;
}

export function resetSimulatorState(): SimulatorState {
  activeSimulator = {
    isSimulating: false,
    simulatedTimeOffsetHours: 3.5,
    forceStaleData: false,
    forceConflict: false,
    priceShocks: {},
    catalystInjections: [],
  };
  return activeSimulator;
}

/**
 * Generate 20 realistic trendline sparkline points
 */
function generateSparkline(basePrice: number, currentPrice: number, volatility: number): number[] {
  const points: number[] = [basePrice];
  let p = basePrice;
  const step = (currentPrice - basePrice) / 19;
  for (let i = 1; i < 19; i++) {
    const randomNoise = (Math.random() - 0.49) * basePrice * volatility * 0.4;
    p = p + step + randomNoise;
    points.push(Number(p.toFixed(2)));
  }
  points.push(Number(currentPrice.toFixed(2)));
  return points;
}

/**
 * Fetch batch quotes with resilience metrics and simulation injection
 */
export async function fetchBatchQuotes(symbols: string[]): Promise<TickerQuote[]> {
  const quotes: TickerQuote[] = [];
  const now = new Date();

  // Sector benchmarks changes
  const sectorChanges: Record<string, number> = {
    XLK: 0.85,
    SOXX: 1.95,
    XLC: 0.40,
    XLY: -0.25,
    XLF: 0.15,
    XLE: -0.60,
    SPY: 0.45,
    QQQ: 0.90,
  };

  for (const sym of symbols) {
    const upperSym = sym.toUpperCase();
    const meta = ASSET_DIRECTORY[upperSym] || {
      symbol: upperSym,
      name: `${upperSym} Inc.`,
      sector: 'General Equities',
      basePrice: 100.0,
      avgVolume: 10_000_000,
      fiftyTwoWeekHigh: 120.0,
      fiftyTwoWeekLow: 80.0,
      peRatio: 25.0,
      marketCap: 50_000_000_000,
      beta: 1.0,
      volatility30d: 0.02,
      sectorBenchmark: 'SPY',
    };

    // Calculate simulated price with any active scenario shocks
    let currentPrice = meta.basePrice;
    if (activeSimulator.priceShocks[upperSym] !== undefined) {
      currentPrice = meta.basePrice * (1 + activeSimulator.priceShocks[upperSym] / 100);
    } else {
      // Realistic default slight intra-day drift
      const seedOffsets: Record<string, number> = {
        NVDA: 4.80,   // +3.7% strong breakout
        AAPL: -1.90,  // -0.8% slight dip
        MSFT: 2.10,   // +0.5% calm
        TSLA: 5.60,   // +2.6% active
        GOOGL: 0.40,  // +0.2% rangebound
        PLTR: 2.30,   // +7.1% huge breakout
        SPY: 1.80,    // +0.3%
        QQQ: 3.40,    // +0.7%
        JPM: -0.40,   // -0.2%
        XOM: -0.80,   // -0.7%
        AMD: 2.50,    // +1.8%
        COIN: 6.20,   // +3.2%
      };
      const offset = seedOffsets[upperSym] || 0;
      currentPrice = meta.basePrice + offset;
    }

    const change = currentPrice - meta.basePrice;
    const changePercent = (change / meta.basePrice) * 100;

    // Simulated Volume with RVOL
    let rvol = 1.0;
    if (upperSym === 'NVDA') rvol = 2.4;
    else if (upperSym === 'PLTR') rvol = 3.1;
    else if (upperSym === 'TSLA') rvol = 1.8;
    else if (upperSym === 'AAPL') rvol = 0.9;
    else rvol = 1.1;

    const volume = Math.round(meta.avgVolume * rvol * 0.75);

    // Data Quality logic
    let dataQuality: DataQualityState = 'LIVE';
    let latencyMs = Math.floor(45 + Math.random() * 50);
    let lastConfirmed = now.toISOString();

    if (activeSimulator.forceStaleData) {
      dataQuality = 'STALE';
      latencyMs = 3820;
      // Last confirmed 9 minutes ago
      lastConfirmed = new Date(now.getTime() - 9 * 60 * 1000).toISOString();
    } else if (activeSimulator.forceConflict && (upperSym === 'NVDA' || upperSym === 'TSLA')) {
      dataQuality = 'CONFLICT';
    }

    // Conflict details if active
    let conflictDetails = undefined;
    if (dataQuality === 'CONFLICT') {
      const feedA = currentPrice;
      const feedB = currentPrice * 1.012; // 1.2% divergence
      conflictDetails = {
        feedA: Number(feedA.toFixed(2)),
        feedB: Number(feedB.toFixed(2)),
        spreadPercent: 1.2,
        divergenceReason: 'Primary NYSE Consolidated tape ($' + feedA.toFixed(2) + ') vs Direct Edge ECN ($' + feedB.toFixed(2) + ') feed divergence > 0.5%',
      };
    }

    const sparkline = generateSparkline(meta.basePrice, currentPrice, meta.volatility30d);
    const sectorChange = sectorChanges[meta.sectorBenchmark] || 0.4;

    quotes.push({
      symbol: upperSym,
      companyName: meta.name,
      sector: meta.sector,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume,
      avgVolume: meta.avgVolume,
      rvol: Number(rvol.toFixed(2)),
      dayHigh: Math.max(meta.basePrice, currentPrice) * 1.006,
      dayLow: Math.min(meta.basePrice, currentPrice) * 0.994,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
      peRatio: meta.peRatio,
      marketCap: meta.marketCap,
      beta: meta.beta,
      volatility30d: meta.volatility30d,
      sectorChangePercent: sectorChange,
      sparkline,
      timestamp: now.toISOString(),
      dataQuality,
      latencyMs,
      lastConfirmedTime: lastConfirmed,
      conflictDetails,
    });
  }

  return quotes;
}

export function getAllCatalysts(): MarketCatalyst[] {
  return [...ACTIVE_CATALYSTS, ...activeSimulator.catalystInjections];
}

export function getCatalystsForSymbols(symbols: string[]): Record<string, MarketCatalyst[]> {
  const all = getAllCatalysts();
  const res: Record<string, MarketCatalyst[]> = {};
  for (const sym of symbols) {
    res[sym.toUpperCase()] = all.filter(c => c.ticker.toUpperCase() === sym.toUpperCase());
  }
  return res;
}

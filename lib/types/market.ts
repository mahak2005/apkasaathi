export type DataQualityState = 'LIVE' | 'DELAYED' | 'STALE' | 'CONFLICT';

export type MarketSession = 'PRE_MARKET' | 'REGULAR' | 'AFTER_HOURS' | 'CLOSED';

export type UrgencyLevel = 'CRITICAL' | 'NOTABLE' | 'STABLE';

export type CatalystType = 
  | 'EARNINGS' 
  | 'SEC_FILING' 
  | 'ANALYST' 
  | 'NEWS' 
  | 'TECHNICAL' 
  | 'THESIS';

export interface MarketCatalyst {
  id: string;
  ticker: string;
  type: CatalystType;
  title: string;
  description: string;
  timestamp: string; // ISO string
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impactScore: number; // 1-10
  source?: string;
  sourceUrl?: string;
}

export interface ConflictDetails {
  feedA: number;
  feedB: number;
  spreadPercent: number;
  divergenceReason: string;
}

export interface TickerQuote {
  symbol: string;
  companyName: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  rvol: number; // Relative volume ratio
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  peRatio: number | null;
  marketCap: number; // in USD
  beta: number;
  volatility30d: number; // annualised or daily stdev
  sectorChangePercent: number;
  sparkline: number[]; // 20 data points for mini trend chart
  timestamp: string; // ISO string of quote time
  dataQuality: DataQualityState;
  latencyMs: number;
  lastConfirmedTime: string;
  conflictDetails?: ConflictDetails;
}

export interface BaselineDelta {
  symbol: string;
  companyName: string;
  currentPrice: number;
  baselinePrice: number;
  deltaAmount: number;
  deltaPercent: number;
  zScore: number; // Volatility normalized move
  rvol: number;
  idiosyncraticAlpha: number; // Beta-adjusted excess move vs sector
  attentionScore: number; // 0 to 100
  urgency: UrgencyLevel;
  reasons: string[];
  catalysts: MarketCatalyst[];
  levelBreaches: string[];
  thesisBreach?: string;
}

export interface WatchlistItem {
  symbol: string;
  addedAt: string;
  targetBuyPrice?: number;
  targetSellPrice?: number;
  notes?: string;
  tags: string[];
}

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  items: WatchlistItem[];
  createdAt: string;
  updatedAt: string;
  version: number; // Optimistic locking
}

export interface SessionCheckpoint {
  id: string;
  userId: string;
  timestamp: string;
  label?: string;
  snapshotQuotes: Record<string, {
    price: number;
    volume: number;
    timestamp: string;
  }>;
}

export interface ExecutiveCatchUpSummary {
  headline: string;
  baselineLabel: string;
  timeSinceBaselineFormatted: string;
  totalTracked: number;
  criticalCount: number;
  notableCount: number;
  stableCount: number;
  keyTakeaways: string[];
  marketContext: string;
}

export interface SimulatorState {
  isSimulating: boolean;
  scenarioName?: string;
  simulatedTimeOffsetHours: number; // hours added to baseline
  forceStaleData: boolean;
  forceConflict: boolean;
  priceShocks: Record<string, number>; // symbol -> % shock
  catalystInjections: MarketCatalyst[];
}

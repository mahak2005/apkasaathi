import {
  TickerQuote,
  WatchlistItem,
  BaselineDelta,
  MarketCatalyst,
  ExecutiveCatchUpSummary,
  UrgencyLevel,
} from '../types/market';
import { calculateAnomalyScore } from './anomaly-detector';

export interface ComputeDeltasInput {
  currentQuotes: TickerQuote[];
  baselineQuotes: Record<string, { price: number; volume: number; timestamp: string }>;
  watchlistItems: WatchlistItem[];
  catalystsBySymbol: Record<string, MarketCatalyst[]>;
  baselineLabel: string;
  baselineTimestamp: string;
}

export interface ComputeDeltasResult {
  deltas: BaselineDelta[];
  summary: ExecutiveCatchUpSummary;
}

/**
 * Formats elapsed duration into a human-friendly string (e.g. "3h 15m ago", "Yesterday 4:00 PM")
 */
export function formatTimeElapsed(isoDateString: string): string {
  const past = new Date(isoDateString).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - past);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 5) return 'Just moments ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

/**
 * Computes comparative deltas against any historical baseline checkpoint
 * and generates the executive natural-language briefing.
 */
export function computeWatchlistDeltas(input: ComputeDeltasInput): ComputeDeltasResult {
  const {
    currentQuotes,
    baselineQuotes,
    watchlistItems,
    catalystsBySymbol,
    baselineLabel,
    baselineTimestamp,
  } = input;

  const now = Date.now();
  const baselineTime = new Date(baselineTimestamp).getTime();
  const hoursElapsed = Math.max(0.1, (now - baselineTime) / (1000 * 60 * 60));

  const itemsMap = new Map<string, WatchlistItem>();
  watchlistItems.forEach(item => itemsMap.set(item.symbol, item));

  const deltas: BaselineDelta[] = [];

  for (const quote of currentQuotes) {
    const baseline = baselineQuotes[quote.symbol];
    // If no explicit baseline snapshot is available, fallback to today's open or previous close
    const baselinePrice = baseline ? baseline.price : (quote.price - quote.change);
    const deltaAmount = quote.price - baselinePrice;
    const deltaPercent = baselinePrice > 0 ? (deltaAmount / baselinePrice) * 100 : 0;

    const catalysts = catalystsBySymbol[quote.symbol] || [];
    const itemConfig = itemsMap.get(quote.symbol);

    // Check thesis breach
    let hasThesisBreach = false;
    let thesisBreachDesc: string | undefined = undefined;

    if (itemConfig?.targetBuyPrice && quote.price <= itemConfig.targetBuyPrice) {
      hasThesisBreach = true;
      thesisBreachDesc = `Fell below target entry of $${itemConfig.targetBuyPrice.toFixed(2)} (Current: $${quote.price.toFixed(2)})`;
    } else if (itemConfig?.targetSellPrice && quote.price >= itemConfig.targetSellPrice) {
      hasThesisBreach = true;
      thesisBreachDesc = `Reached target profit exit of $${itemConfig.targetSellPrice.toFixed(2)} (Current: $${quote.price.toFixed(2)})`;
    }

    // Check technical extremes
    const is52WeekHigh = quote.price >= quote.fiftyTwoWeekHigh * 0.995;
    const is52WeekLow = quote.price <= quote.fiftyTwoWeekLow * 1.005;
    const is52WeekExtreme = is52WeekHigh || is52WeekLow;

    const levelBreaches: string[] = [];
    if (is52WeekHigh) levelBreaches.push('52-Week High Breakout');
    if (is52WeekLow) levelBreaches.push('52-Week Low Breakdown');
    if (thesisBreachDesc) levelBreaches.push(thesisBreachDesc);

    // Anomaly & Attention Scoring
    const anomaly = calculateAnomalyScore({
      priceDeltaPercent: deltaPercent,
      volatility30d: quote.volatility30d,
      hoursElapsed,
      volume: quote.volume,
      avgVolume: quote.avgVolume,
      beta: quote.beta,
      sectorChangePercent: quote.sectorChangePercent,
      catalysts,
      hasThesisBreach,
      is52WeekExtreme,
      isSMABreach: false,
    });

    deltas.push({
      symbol: quote.symbol,
      companyName: quote.companyName,
      currentPrice: quote.price,
      baselinePrice,
      deltaAmount: Number(deltaAmount.toFixed(2)),
      deltaPercent: Number(deltaPercent.toFixed(2)),
      zScore: anomaly.zScore,
      rvol: anomaly.rvol,
      idiosyncraticAlpha: anomaly.idiosyncraticAlpha,
      attentionScore: anomaly.attentionScore,
      urgency: anomaly.urgency,
      reasons: anomaly.reasons,
      catalysts,
      levelBreaches,
      thesisBreach: thesisBreachDesc,
    });
  }

  // Sort deltas: Critical first, then by Attention Score descending
  const urgencyWeight: Record<UrgencyLevel, number> = {
    CRITICAL: 3,
    NOTABLE: 2,
    STABLE: 1,
  };

  deltas.sort((a, b) => {
    if (urgencyWeight[b.urgency] !== urgencyWeight[a.urgency]) {
      return urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
    }
    return b.attentionScore - a.attentionScore;
  });

  const criticalCount = deltas.filter(d => d.urgency === 'CRITICAL').length;
  const notableCount = deltas.filter(d => d.urgency === 'NOTABLE').length;
  const stableCount = deltas.filter(d => d.urgency === 'STABLE').length;

  // Synthesize Executive Catch-Up Briefing
  const timeFormatted = formatTimeElapsed(baselineTimestamp);
  let headline = '';
  if (criticalCount > 0) {
    headline = `Since ${baselineLabel.toLowerCase()} (${timeFormatted}), ${criticalCount} asset${criticalCount > 1 ? 's require' : ' requires'} immediate attention.`;
  } else if (notableCount > 0) {
    headline = `Since ${baselineLabel.toLowerCase()} (${timeFormatted}), ${notableCount} asset${notableCount > 1 ? 's have' : ' has'} notable volume or price shifts.`;
  } else {
    headline = `All ${deltas.length} assets are trading within normal expected bounds since ${baselineLabel.toLowerCase()} (${timeFormatted}).`;
  }

  // Top Key Takeaways
  const keyTakeaways: string[] = [];
  const highestAttention = deltas.slice(0, 3);

  for (const delta of highestAttention) {
    if (delta.urgency === 'STABLE' && keyTakeaways.length >= 2) break;
    const sign = delta.deltaPercent >= 0 ? '+' : '';
    const mainReason = delta.reasons[0] || 'Price move within volatility band';
    keyTakeaways.push(
      `**${delta.symbol}** (${sign}${delta.deltaPercent}%): ${mainReason}`
    );
  }

  // Sector / Macro Context Synthesis
  const avgDelta = deltas.reduce((acc, d) => acc + d.deltaPercent, 0) / (deltas.length || 1);
  const marketContext = avgDelta >= 0.5
    ? `Watchlist average is positive (+${avgDelta.toFixed(1)}%), showing broad strength across holdings.`
    : avgDelta <= -0.5
    ? `Watchlist average is defensive (${avgDelta.toFixed(1)}%), with pressure concentrated in high-beta holdings.`
    : `Watchlist is largely range-bound with neutral market momentum (${avgDelta >= 0 ? '+' : ''}${avgDelta.toFixed(1)}%).`;

  return {
    deltas,
    summary: {
      headline,
      baselineLabel,
      timeSinceBaselineFormatted: timeFormatted,
      totalTracked: deltas.length,
      criticalCount,
      notableCount,
      stableCount,
      keyTakeaways,
      marketContext,
    },
  };
}

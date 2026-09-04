import { MarketCatalyst, UrgencyLevel } from '../types/market';

export interface AnomalyScoreInput {
  priceDeltaPercent: number; // e.g. 3.5 for +3.5%
  volatility30d: number;     // daily stdev e.g. 0.02 (2%)
  hoursElapsed: number;      // hours since baseline
  volume: number;            // current volume
  avgVolume: number;         // 20-day ADV
  beta: number;              // stock beta
  sectorChangePercent: number; // sector benchmark % change
  catalysts: MarketCatalyst[];
  hasThesisBreach: boolean;
  is52WeekExtreme: boolean;
  isSMABreach: boolean;
}

export interface AnomalyScoreOutput {
  zScore: number;
  rvol: number;
  idiosyncraticAlpha: number;
  attentionScore: number; // 0 - 100
  urgency: UrgencyLevel;
  reasons: string[];
}

/**
 * Calculates statistically grounded anomaly metrics and attention priority.
 */
export function calculateAnomalyScore(input: AnomalyScoreInput): AnomalyScoreOutput {
  const {
    priceDeltaPercent,
    volatility30d,
    hoursElapsed,
    volume,
    avgVolume,
    beta,
    sectorChangePercent,
    catalysts,
    hasThesisBreach,
    is52WeekExtreme,
    isSMABreach,
  } = input;

  const reasons: string[] = [];

  // 1. Compute Volatility-Adjusted Z-Score
  // Assume a trading day is ~6.5 hours of regular market
  const effectiveHours = Math.max(0.2, Math.min(hoursElapsed, 40));
  const timeScale = Math.sqrt(effectiveHours / 6.5);
  // volatility30d is daily stdev (e.g. 0.02 = 2%)
  const expectedMovePercent = Math.max(volatility30d * 100 * timeScale, 0.4);
  const zScore = Math.abs(priceDeltaPercent) / expectedMovePercent;

  let zScoreComponent = 0;
  if (zScore >= 3.0) {
    zScoreComponent = 35;
    reasons.push(`Statistical anomaly: ${zScore.toFixed(1)}σ deviation from expected volatility`);
  } else if (zScore >= 2.0) {
    zScoreComponent = 25;
    reasons.push(`Elevated volatility: ${zScore.toFixed(1)}σ price move`);
  } else if (zScore >= 1.2) {
    zScoreComponent = 12;
  }

  // 2. Compute RVOL (Relative Volume)
  const safeAvgVol = Math.max(avgVolume, 10000);
  const rvol = volume > 0 ? volume / safeAvgVol : 1.0;
  let rvolComponent = 0;
  if (rvol >= 2.5) {
    rvolComponent = 25;
    reasons.push(`High institutional volume surge: ${rvol.toFixed(1)}x normal 20-day ADV`);
  } else if (rvol >= 1.6) {
    rvolComponent = 15;
    reasons.push(`Above average volume: ${rvol.toFixed(1)}x expected volume`);
  } else if (rvol <= 0.4 && Math.abs(priceDeltaPercent) > 2.0) {
    // Low volume divergence warning
    reasons.push(`Low volume drift (${rvol.toFixed(1)}x ADV): unconfirmed price move`);
  }

  // 3. Idiosyncratic Alpha (Decoupling from Sector/Market Beta)
  // Alpha = Stock Return - (Beta * Sector Return)
  const expectedSectorMove = beta * sectorChangePercent;
  const idiosyncraticAlpha = priceDeltaPercent - expectedSectorMove;
  let alphaComponent = 0;
  if (Math.abs(idiosyncraticAlpha) >= 3.0) {
    alphaComponent = 20;
    const dir = idiosyncraticAlpha > 0 ? 'outperforming' : 'lagging';
    reasons.push(`Beta decoupling: ${dir} sector benchmark by ${Math.abs(idiosyncraticAlpha).toFixed(1)}%`);
  } else if (Math.abs(idiosyncraticAlpha) >= 1.5) {
    alphaComponent = 10;
  }

  // 4. Catalyst Impact
  let catalystComponent = 0;
  if (catalysts.length > 0) {
    const highestImpact = Math.max(...catalysts.map(c => c.impactScore));
    catalystComponent = Math.min(25, highestImpact * 2.5);
    const topCatalyst = catalysts.find(c => c.impactScore === highestImpact);
    if (topCatalyst) {
      reasons.push(`Catalyst: ${topCatalyst.title} (${topCatalyst.type})`);
    }
  }

  // 5. Technical & Thesis Breaches
  let breachComponent = 0;
  if (hasThesisBreach) {
    breachComponent += 25;
    reasons.push(`Thesis boundary breached: target price trigger crossed`);
  }
  if (is52WeekExtreme) {
    breachComponent += 15;
    reasons.push(priceDeltaPercent > 0 ? `52-week high breakout` : `52-week low breakdown`);
  }
  if (isSMABreach) {
    breachComponent += 10;
    reasons.push(`Key technical moving average test`);
  }

  // Composite Attention Score capped at 100
  const rawScore = zScoreComponent + rvolComponent + alphaComponent + catalystComponent + breachComponent;
  const attentionScore = Math.min(100, Math.round(rawScore));

  // Determine Triage Category
  let urgency: UrgencyLevel = 'STABLE';
  if (attentionScore >= 70 || hasThesisBreach || (zScore >= 2.5 && catalysts.length > 0)) {
    urgency = 'CRITICAL';
  } else if (attentionScore >= 35 || rvol >= 1.8 || Math.abs(idiosyncraticAlpha) >= 2.0) {
    urgency = 'NOTABLE';
  } else {
    urgency = 'STABLE';
    if (reasons.length === 0) {
      reasons.push(`Trading within expected historical volatility bounds`);
    }
  }

  return {
    zScore: Number(zScore.toFixed(2)),
    rvol: Number(rvol.toFixed(2)),
    idiosyncraticAlpha: Number(idiosyncraticAlpha.toFixed(2)),
    attentionScore,
    urgency,
    reasons,
  };
}

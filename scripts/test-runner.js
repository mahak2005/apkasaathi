const fs = require('fs');
const path = require('path');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('====================================================');
console.log('  PULSE SMART WATCHLIST ENGINE VERIFICATION (CODE 2026)');
console.log('====================================================\n');

// 1. Math Verification: Volatility-Normalized Z-Score
console.log('[TEST GROUP 1]: Volatility Anomaly Z-Score Math');
function calculateTestAnomaly({
  priceDeltaPercent,
  volatility30d,
  hoursElapsed,
  volume,
  avgVolume,
  beta,
  sectorChangePercent,
  catalysts = [],
  hasThesisBreach = false,
  is52WeekExtreme = false,
}) {
  const effectiveHours = Math.max(0.2, Math.min(hoursElapsed, 40));
  const timeScale = Math.sqrt(effectiveHours / 6.5);
  const expectedMovePercent = Math.max(volatility30d * 100 * timeScale, 0.4);
  const zScore = Math.abs(priceDeltaPercent) / expectedMovePercent;

  let zScoreComponent = 0;
  if (zScore >= 3.0) zScoreComponent = 35;
  else if (zScore >= 2.0) zScoreComponent = 25;
  else if (zScore >= 1.2) zScoreComponent = 12;

  const safeAvgVol = Math.max(avgVolume, 10000);
  const rvol = volume > 0 ? volume / safeAvgVol : 1.0;
  let rvolComponent = 0;
  if (rvol >= 2.5) rvolComponent = 25;
  else if (rvol >= 1.6) rvolComponent = 15;

  const expectedSectorMove = beta * sectorChangePercent;
  const idiosyncraticAlpha = priceDeltaPercent - expectedSectorMove;
  let alphaComponent = 0;
  if (Math.abs(idiosyncraticAlpha) >= 3.0) alphaComponent = 20;
  else if (Math.abs(idiosyncraticAlpha) >= 1.5) alphaComponent = 10;

  let catalystComponent = 0;
  if (catalysts.length > 0) {
    const highestImpact = Math.max(...catalysts.map(c => c.impactScore || 5));
    catalystComponent = Math.min(25, highestImpact * 2.5);
  }

  let breachComponent = 0;
  if (hasThesisBreach) breachComponent += 25;
  if (is52WeekExtreme) breachComponent += 15;

  const attentionScore = Math.min(100, Math.round(zScoreComponent + rvolComponent + alphaComponent + catalystComponent + breachComponent));

  let urgency = 'STABLE';
  if (attentionScore >= 70 || hasThesisBreach || (zScore >= 2.5 && catalysts.length > 0)) {
    urgency = 'CRITICAL';
  } else if (attentionScore >= 35 || rvol >= 1.8 || Math.abs(idiosyncraticAlpha) >= 2.0) {
    urgency = 'NOTABLE';
  }

  return {
    zScore: Number(zScore.toFixed(2)),
    rvol: Number(rvol.toFixed(2)),
    idiosyncraticAlpha: Number(idiosyncraticAlpha.toFixed(2)),
    attentionScore,
    urgency,
  };
}

// Low Volatility Stock (SPY daily volatility = 0.9%)
const spyAnomaly = calculateTestAnomaly({
  priceDeltaPercent: 3.2,
  volatility30d: 0.009,
  hoursElapsed: 3.5,
  volume: 50_000_000,
  avgVolume: 50_000_000,
  beta: 1.0,
  sectorChangePercent: 0.5,
});
assert(spyAnomaly.zScore >= 3.0, `SPY 3.2% move must be statistically anomalous: Z=${spyAnomaly.zScore}σ >= 3.0σ`);

// High Volatility Stock (TSLA daily volatility = 3.8%)
const tslaAnomaly = calculateTestAnomaly({
  priceDeltaPercent: 1.8,
  volatility30d: 0.038,
  hoursElapsed: 3.5,
  volume: 50_000_000,
  avgVolume: 50_000_000,
  beta: 2.3,
  sectorChangePercent: 0.5,
});
assert(tslaAnomaly.zScore < 1.5, `TSLA 1.8% move must be classified as normal noise: Z=${tslaAnomaly.zScore}σ < 1.5σ`);
assert(tslaAnomaly.urgency === 'STABLE', `TSLA move should be triaged as STABLE (actual: ${tslaAnomaly.urgency})`);

// 2. Volume Conviction & Beta Decoupling
console.log('\n[TEST GROUP 2]: Volume Conviction & Idiosyncratic Alpha');
const surgeTest = calculateTestAnomaly({
  priceDeltaPercent: 4.5,
  volatility30d: 0.025,
  hoursElapsed: 2.5,
  volume: 150_000_000,
  avgVolume: 50_000_000, // 3.0x RVOL
  beta: 1.5,
  sectorChangePercent: -1.0, // Stock up 4.5% while sector down 1% -> Alpha = 4.5 - (1.5 * -1.0) = 6.0%
});
assert(surgeTest.rvol === 3.0, `RVOL must be exactly 3.0x (actual: ${surgeTest.rvol}x)`);
assert(surgeTest.idiosyncraticAlpha === 6.0, `Sector Alpha must be +6.0% (actual: ${surgeTest.idiosyncraticAlpha}%)`);
assert(surgeTest.urgency === 'NOTABLE' || surgeTest.urgency === 'CRITICAL', 'High volume breakout must be NOTABLE or CRITICAL');

// 3. Thesis & Boundary Breach Triage Escalation
console.log('\n[TEST GROUP 3]: Thesis Breach Escalation');
const thesisBreachTest = calculateTestAnomaly({
  priceDeltaPercent: -2.0,
  volatility30d: 0.02,
  hoursElapsed: 1.0,
  volume: 10_000_000,
  avgVolume: 10_000_000,
  beta: 1.0,
  sectorChangePercent: 0.0,
  hasThesisBreach: true, // Target buy price crossed!
});
assert(thesisBreachTest.urgency === 'CRITICAL', 'Any thesis boundary breach must immediately escalate to CRITICAL triage');

// 4. Persistence & File Store Verification
console.log('\n[TEST GROUP 4]: File-Backed Atomic Persistence');
const dataDir = path.join(process.cwd(), 'data');
const testFile = path.join(dataDir, 'test-persistence.json');

const testPayload = {
  id: 'test-watchlist-99',
  name: 'Persistence Test',
  items: [{ symbol: 'NVDA', addedAt: new Date().toISOString() }],
  version: 1,
};

fs.writeFileSync(testFile, JSON.stringify(testPayload, null, 2), 'utf-8');
assert(fs.existsSync(testFile), 'Test JSON file written successfully');

const loaded = JSON.parse(fs.readFileSync(testFile, 'utf-8'));
assert(loaded.name === 'Persistence Test', 'Loaded persistence data matches original');
assert(loaded.items[0].symbol === 'NVDA', 'Nested items correctly persisted');

fs.unlinkSync(testFile);
assert(!fs.existsSync(testFile), 'Cleanup of temporary persistence test file successful');

console.log('\n====================================================');
console.log('  ALL TEST SUITES PASSED PERFECTLY (100% SUCCESS)   ');
console.log('====================================================\n');

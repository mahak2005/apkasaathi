import { NextRequest, NextResponse } from 'next/server';
import {
  getSimulatorState,
  updateSimulatorState,
  resetSimulatorState,
} from '@/lib/market/market-service';
import { MarketCatalyst } from '@/lib/types/market';

export const dynamic = 'force-dynamic';

export async function GET() {
  const state = getSimulatorState();
  return NextResponse.json({ simulatorState: state });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario } = body;

    let updated;

    switch (scenario) {
      case 'time_jump_4h': {
        const injectedCatalysts: MarketCatalyst[] = [
          {
            id: 'sim-cat-1',
            ticker: 'NVDA',
            type: 'EARNINGS',
            title: 'Hyperscaler Order Surge for B200 Server Racks',
            description: 'Unscheduled OEM supplier update confirms massive cloud cluster order intake.',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            sentiment: 'POSITIVE',
            impactScore: 9,
            source: 'TechSupply Wire',
          },
        ];
        updated = updateSimulatorState({
          isSimulating: true,
          scenarioName: '4-Hour Departure with Market Shift',
          simulatedTimeOffsetHours: 4.5,
          forceStaleData: false,
          forceConflict: false,
          priceShocks: {
            NVDA: 6.8, // +6.8%
            PLTR: 8.5, // +8.5% breakout
            TSLA: -3.2, // -3.2%
            AAPL: -1.2,
          },
          catalystInjections: injectedCatalysts,
        });
        break;
      }

      case 'earnings_shock': {
        const shockCatalyst: MarketCatalyst = {
          id: 'sim-cat-shock',
          ticker: 'NVDA',
          type: 'EARNINGS',
          title: 'Q3 Data Center Revenue Beats Whisper Numbers by $1.8B',
          description: 'Gross margin expanded to 76.2% as next-gen enterprise networking accelerated.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          sentiment: 'POSITIVE',
          impactScore: 10,
          source: 'SEC 8-K',
        };
        updated = updateSimulatorState({
          isSimulating: true,
          scenarioName: 'Earnings Shock on NVDA (+9.2%)',
          simulatedTimeOffsetHours: 2.0,
          forceStaleData: false,
          forceConflict: false,
          priceShocks: {
            NVDA: 9.2,
            PLTR: 4.1,
            AMD: 3.5,
          },
          catalystInjections: [shockCatalyst],
        });
        break;
      }

      case 'feed_outage_stale': {
        updated = updateSimulatorState({
          isSimulating: true,
          scenarioName: 'Vendor Feed Outage (Stale Data)',
          forceStaleData: true,
          forceConflict: false,
        });
        break;
      }

      case 'feed_conflict': {
        updated = updateSimulatorState({
          isSimulating: true,
          scenarioName: 'Multi-Source Exchange Tape Discrepancy',
          forceStaleData: false,
          forceConflict: true,
        });
        break;
      }

      case 'reset':
      default: {
        updated = resetSimulatorState();
        break;
      }
    }

    return NextResponse.json({
      success: true,
      simulatorState: updated,
    });
  } catch (error: any) {
    console.error('Error in POST /api/market/simulate:', error);
    return NextResponse.json({ error: error.message || 'Simulation failed' }, { status: 500 });
  }
}

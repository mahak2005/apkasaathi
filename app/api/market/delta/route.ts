import { NextRequest, NextResponse } from 'next/server';
import { getWatchlistById, getLatestCheckpoint, saveCheckpoint } from '@/lib/store/db';
import { fetchBatchQuotes, getCatalystsForSymbols, getSimulatorState } from '@/lib/market/market-service';
import { computeWatchlistDeltas } from '@/lib/engine/delta-engine';
import { SessionCheckpoint } from '@/lib/types/market';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const watchlistId = searchParams.get('watchlistId') || 'watchlist-core-tech';
    const baselineMode = searchParams.get('baseline') || 'last_visit';
    const customTimestamp = searchParams.get('timestamp');

    const watchlist = getWatchlistById(watchlistId);
    if (!watchlist) {
      return NextResponse.json({ error: 'Watchlist not found' }, { status: 404 });
    }

    const symbols = watchlist.items.map(i => i.symbol);
    const currentQuotes = await fetchBatchQuotes(symbols);
    const catalysts = getCatalystsForSymbols(symbols);

    // Determine baseline timestamp and baseline quote values
    let baselineTimestamp: string;
    let baselineLabel: string;
    const sim = getSimulatorState();

    const now = Date.now();
    const baselineQuotes: Record<string, { price: number; volume: number; timestamp: string }> = {};

    if (baselineMode === 'last_visit') {
      const latestCheckpoint = getLatestCheckpoint('default_user');
      const offsetMs = sim.simulatedTimeOffsetHours * 60 * 60 * 1000;
      baselineTimestamp = latestCheckpoint 
        ? latestCheckpoint.timestamp 
        : new Date(now - offsetMs).toISOString();
      baselineLabel = 'My Last Visit';

      if (latestCheckpoint?.snapshotQuotes) {
        Object.assign(baselineQuotes, latestCheckpoint.snapshotQuotes);
      } else {
        // Generate realistic baseline 3.5 hours ago based on basePrice and sparklines
        for (const q of currentQuotes) {
          const midPrice = q.sparkline && q.sparkline.length > 5 
            ? q.sparkline[Math.floor(q.sparkline.length / 2)] 
            : q.price - (q.change * 0.6);
          baselineQuotes[q.symbol] = {
            price: Number(midPrice.toFixed(2)),
            volume: Math.round(q.volume * 0.4),
            timestamp: baselineTimestamp,
          };
        }
      }
    } else if (baselineMode === 'market_open') {
      baselineTimestamp = new Date(now - 5 * 60 * 60 * 1000).toISOString();
      baselineLabel = 'Market Open (9:30 AM)';
      for (const q of currentQuotes) {
        const openPrice = q.sparkline && q.sparkline.length > 0 ? q.sparkline[0] : (q.price - q.change);
        baselineQuotes[q.symbol] = {
          price: Number(openPrice.toFixed(2)),
          volume: Math.round(q.volume * 0.15),
          timestamp: baselineTimestamp,
        };
      }
    } else if (baselineMode === 'prev_close') {
      baselineTimestamp = new Date(now - 24 * 60 * 60 * 1000).toISOString();
      baselineLabel = 'Previous Session Close (1D)';
      for (const q of currentQuotes) {
        const prevClose = q.price - q.change;
        baselineQuotes[q.symbol] = {
          price: Number(prevClose.toFixed(2)),
          volume: 0,
          timestamp: baselineTimestamp,
        };
      }
    } else if (baselineMode === 'one_week') {
      baselineTimestamp = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
      baselineLabel = '1 Week Ago';
      for (const q of currentQuotes) {
        // Approximate 1-week baseline
        const weekPrice = q.price * (1 - (q.changePercent * 0.01) * 2.2);
        baselineQuotes[q.symbol] = {
          price: Number(weekPrice.toFixed(2)),
          volume: 0,
          timestamp: baselineTimestamp,
        };
      }
    } else {
      baselineTimestamp = customTimestamp || new Date(now - 3 * 60 * 60 * 1000).toISOString();
      baselineLabel = 'Custom Checkpoint';
      for (const q of currentQuotes) {
        baselineQuotes[q.symbol] = {
          price: Number((q.price - q.change * 0.5).toFixed(2)),
          volume: Math.round(q.volume * 0.5),
          timestamp: baselineTimestamp,
        };
      }
    }

    const { deltas, summary } = computeWatchlistDeltas({
      currentQuotes,
      baselineQuotes,
      watchlistItems: watchlist.items,
      catalystsBySymbol: catalysts,
      baselineLabel,
      baselineTimestamp,
    });

    return NextResponse.json({
      watchlist,
      baselineLabel,
      baselineTimestamp,
      summary,
      deltas,
      currentQuotes,
    });
  } catch (error: any) {
    console.error('Error in GET /api/market/delta:', error);
    return NextResponse.json({ error: error.message || 'Failed to compute market deltas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Commit a new checkpoint (e.g. user leaves or updates baseline)
  try {
    const body = await request.json();
    const { userId = 'default_user', label = 'Manual Checkpoint', currentQuotes } = body;

    const snapshotQuotes: Record<string, { price: number; volume: number; timestamp: string }> = {};
    const now = new Date().toISOString();

    if (Array.isArray(currentQuotes)) {
      for (const q of currentQuotes) {
        snapshotQuotes[q.symbol] = {
          price: q.price,
          volume: q.volume,
          timestamp: now,
        };
      }
    }

    const checkpoint: SessionCheckpoint = {
      id: `checkpoint-${Date.now()}`,
      userId,
      timestamp: now,
      label,
      snapshotQuotes,
    };

    saveCheckpoint(checkpoint);
    return NextResponse.json({ success: true, checkpoint });
  } catch (error: any) {
    console.error('Error in POST /api/market/delta (checkpoint):', error);
    return NextResponse.json({ error: error.message || 'Failed to save session checkpoint' }, { status: 500 });
  }
}

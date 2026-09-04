import { NextRequest, NextResponse } from 'next/server';
import { fetchBatchQuotes } from '@/lib/market/market-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');

    let symbols: string[] = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'GOOGL', 'PLTR'];
    if (symbolsParam) {
      symbols = symbolsParam
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(Boolean);
    }

    const quotes = await fetchBatchQuotes(symbols);
    const serverProcessingTimeMs = Date.now() - startTime;

    return NextResponse.json({
      quotes,
      count: quotes.length,
      serverProcessingTimeMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in GET /api/market/quotes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch market quotes' },
      { status: 500 }
    );
  }
}

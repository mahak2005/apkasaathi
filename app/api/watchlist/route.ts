import { NextRequest, NextResponse } from 'next/server';
import {
  getAllWatchlists,
  getWatchlistById,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addTickerToWatchlist,
  removeTickerFromWatchlist,
} from '@/lib/store/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const list = getWatchlistById(id);
      if (!list) {
        return NextResponse.json({ error: 'Watchlist not found' }, { status: 404 });
      }
      return NextResponse.json({ watchlist: list });
    }

    const lists = getAllWatchlists();
    return NextResponse.json({ watchlists: lists });
  } catch (error: any) {
    console.error('Error in GET /api/watchlist:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, initialSymbols } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Watchlist name is required' }, { status: 400 });
    }

    const created = createWatchlist(name.trim(), description || '', initialSymbols || []);
    return NextResponse.json({ watchlist: created }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/watchlist:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, watchlistId, symbol, targetBuy, targetSell, notes, tags, updates } = body;

    if (!watchlistId) {
      return NextResponse.json({ error: 'watchlistId is required' }, { status: 400 });
    }

    if (action === 'add_ticker') {
      if (!symbol) return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
      const updated = addTickerToWatchlist(watchlistId, symbol, targetBuy, targetSell, notes, tags);
      return NextResponse.json({ watchlist: updated });
    }

    if (action === 'remove_ticker') {
      if (!symbol) return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
      const updated = removeTickerFromWatchlist(watchlistId, symbol);
      return NextResponse.json({ watchlist: updated });
    }

    if (action === 'update_metadata' && updates) {
      const updated = updateWatchlist(watchlistId, updates);
      return NextResponse.json({ watchlist: updated });
    }

    if (action === 'update_ticker_thesis') {
      const list = getWatchlistById(watchlistId);
      if (!list) return NextResponse.json({ error: 'Watchlist not found' }, { status: 404 });
      const upper = symbol.toUpperCase();
      const item = list.items.find(i => i.symbol === upper);
      if (item) {
        if (targetBuy !== undefined) item.targetBuyPrice = targetBuy;
        if (targetSell !== undefined) item.targetSellPrice = targetSell;
        if (notes !== undefined) item.notes = notes;
        if (tags !== undefined) item.tags = tags;
        const updated = updateWatchlist(watchlistId, { items: list.items });
        return NextResponse.json({ watchlist: updated });
      }
      return NextResponse.json({ error: 'Ticker not found in watchlist' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in PUT /api/watchlist:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Watchlist id is required' }, { status: 400 });
    }
    const success = deleteWatchlist(id);
    if (!success) {
      return NextResponse.json({ error: 'Watchlist not found or could not be deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('Error in DELETE /api/watchlist:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

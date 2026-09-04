import fs from 'fs';
import path from 'path';
import { Watchlist, SessionCheckpoint } from '../types/market';

const DATA_DIR = path.join(process.cwd(), 'data');
const WATCHLISTS_FILE = path.join(DATA_DIR, 'watchlists.json');
const CHECKPOINTS_FILE = path.join(DATA_DIR, 'checkpoints.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed watchlists
const DEFAULT_WATCHLISTS: Watchlist[] = [
  {
    id: 'watchlist-core-tech',
    name: 'AI & Core Tech Leaders',
    description: 'High-conviction artificial intelligence, cloud, and semiconductor leaders',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    version: 1,
    items: [
      {
        symbol: 'NVDA',
        addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        targetBuyPrice: 110.0,
        targetSellPrice: 145.0,
        notes: 'Watching Blackwell GPU rack deployment cadence and datacenter backlog.',
        tags: ['AI', 'Semis', 'MegaCap'],
      },
      {
        symbol: 'AAPL',
        addedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        targetBuyPrice: 215.0,
        targetSellPrice: 250.0,
        notes: 'iPhone 16 upgrade cycle and Apple Intelligence monetization rollout.',
        tags: ['Hardware', 'Services'],
      },
      {
        symbol: 'MSFT',
        addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        targetBuyPrice: 400.0,
        targetSellPrice: 470.0,
        notes: 'Azure cloud growth rate vs capex spend guidance.',
        tags: ['Cloud', 'Enterprise', 'AI'],
      },
      {
        symbol: 'TSLA',
        addedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        targetBuyPrice: 195.0,
        targetSellPrice: 260.0,
        notes: 'Robotaxi regulatory approvals and automotive gross margins.',
        tags: ['EV', 'Autonomy', 'High-Beta'],
      },
      {
        symbol: 'GOOGL',
        addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        targetBuyPrice: 155.0,
        targetSellPrice: 190.0,
        notes: 'Search ad revenue resilience and Gemini API developer ecosystem.',
        tags: ['Search', 'AI', 'Cloud'],
      },
      {
        symbol: 'PLTR',
        addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        targetBuyPrice: 28.0,
        targetSellPrice: 38.0,
        notes: 'AIP bootcamps converting to large enterprise commercial contracts.',
        tags: ['Software', 'Defense', 'AI'],
      },
    ],
  },
  {
    id: 'watchlist-macro-hedges',
    name: 'Macro & Defensive Yield',
    description: 'Indices, energy hedges, and financial institutions',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
    items: [
      {
        symbol: 'SPY',
        addedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Broad market benchmark tracking S&P 500.',
        tags: ['Index', 'Core'],
      },
      {
        symbol: 'JPM',
        addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        targetBuyPrice: 200.0,
        targetSellPrice: 235.0,
        notes: 'Net interest income trajectory in Fed rate-cut environment.',
        tags: ['Financials', 'Yield'],
      },
      {
        symbol: 'XOM',
        addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Crude price hedge and Pioneer Natural Resources merger synergies.',
        tags: ['Energy', 'Hedge'],
      },
    ],
  },
];

// Helper for atomic file write
function atomicWriteJson(filePath: string, data: any) {
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, filePath);
}

function readJsonSafely<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      atomicWriteJson(filePath, fallback);
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}, falling back:`, err);
    return fallback;
  }
}

// Watchlist Store Operations
export function getAllWatchlists(): Watchlist[] {
  return readJsonSafely<Watchlist[]>(WATCHLISTS_FILE, DEFAULT_WATCHLISTS);
}

export function getWatchlistById(id: string): Watchlist | undefined {
  const lists = getAllWatchlists();
  return lists.find(l => l.id === id);
}

export function saveWatchlists(lists: Watchlist[]): void {
  atomicWriteJson(WATCHLISTS_FILE, lists);
}

export function createWatchlist(name: string, description = '', initialSymbols: string[] = []): Watchlist {
  const lists = getAllWatchlists();
  const newId = `watchlist-${Date.now()}`;
  const now = new Date().toISOString();

  const newList: Watchlist = {
    id: newId,
    name,
    description,
    createdAt: now,
    updatedAt: now,
    version: 1,
    items: initialSymbols.map(sym => ({
      symbol: sym.toUpperCase(),
      addedAt: now,
      tags: [],
    })),
  };

  lists.push(newList);
  saveWatchlists(lists);
  return newList;
}

export function updateWatchlist(id: string, updates: Partial<Watchlist>): Watchlist | null {
  const lists = getAllWatchlists();
  const index = lists.findIndex(l => l.id === id);
  if (index === -1) return null;

  const current = lists[index];
  const updated: Watchlist = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
    version: current.version + 1,
  };

  lists[index] = updated;
  saveWatchlists(lists);
  return updated;
}

export function deleteWatchlist(id: string): boolean {
  const lists = getAllWatchlists();
  const filtered = lists.filter(l => l.id !== id);
  if (filtered.length === lists.length) return false;
  saveWatchlists(filtered);
  return true;
}

export function addTickerToWatchlist(
  watchlistId: string,
  symbol: string,
  targetBuy?: number,
  targetSell?: number,
  notes?: string,
  tags: string[] = []
): Watchlist | null {
  const lists = getAllWatchlists();
  const index = lists.findIndex(l => l.id === watchlistId);
  if (index === -1) return null;

  const list = lists[index];
  const upperSymbol = symbol.toUpperCase();
  if (list.items.some(i => i.symbol === upperSymbol)) {
    return list; // Already present
  }

  list.items.push({
    symbol: upperSymbol,
    addedAt: new Date().toISOString(),
    targetBuyPrice: targetBuy,
    targetSellPrice: targetSell,
    notes,
    tags,
  });

  list.updatedAt = new Date().toISOString();
  list.version += 1;
  saveWatchlists(lists);
  return list;
}

export function removeTickerFromWatchlist(watchlistId: string, symbol: string): Watchlist | null {
  const lists = getAllWatchlists();
  const index = lists.findIndex(l => l.id === watchlistId);
  if (index === -1) return null;

  const list = lists[index];
  const upperSymbol = symbol.toUpperCase();
  list.items = list.items.filter(i => i.symbol !== upperSymbol);
  list.updatedAt = new Date().toISOString();
  list.version += 1;
  saveWatchlists(lists);
  return list;
}

// Session Checkpoints (Persisting points in time for Delta Time Machine)
export function getAllCheckpoints(userId = 'default_user'): SessionCheckpoint[] {
  const all = readJsonSafely<SessionCheckpoint[]>(CHECKPOINTS_FILE, []);
  return all.filter(c => c.userId === userId);
}

export function saveCheckpoint(checkpoint: SessionCheckpoint): void {
  const all = readJsonSafely<SessionCheckpoint[]>(CHECKPOINTS_FILE, []);
  // Keep maximum 50 checkpoints per user to conserve disk
  all.push(checkpoint);
  const trimmed = all.slice(-100);
  atomicWriteJson(CHECKPOINTS_FILE, trimmed);
}

export function getLatestCheckpoint(userId = 'default_user'): SessionCheckpoint | null {
  const userCheckpoints = getAllCheckpoints(userId);
  if (userCheckpoints.length === 0) return null;
  return userCheckpoints[userCheckpoints.length - 1];
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Watchlist,
  BaselineDelta,
  TickerQuote,
  ExecutiveCatchUpSummary,
  SimulatorState,
} from '@/lib/types/market';
import { ScenarioSimulatorBar } from '@/components/watchlist/ScenarioSimulatorBar';
import { ExecutiveDigest } from '@/components/watchlist/ExecutiveDigest';
import { TimeMachineBar, BaselineOption } from '@/components/watchlist/TimeMachineBar';
import { WatchlistHeader } from '@/components/watchlist/WatchlistHeader';
import { TriageBoard } from '@/components/watchlist/TriageBoard';
import { WatchlistTable } from '@/components/watchlist/WatchlistTable';
import { AssetDetailDrawer } from '@/components/watchlist/AssetDetailDrawer';
import { AddAssetModal } from '@/components/watchlist/AddAssetModal';
import { Activity, Cpu } from 'lucide-react';

export default function SmartWatchlistDashboard() {
  // Watchlist & Market State
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>('watchlist-core-tech');
  const [baseline, setBaseline] = useState<BaselineOption>('last_visit');
  const [baselineTimestamp, setBaselineTimestamp] = useState<string>('');
  const [baselineLabel, setBaselineLabel] = useState<string>('My Last Visit');
  const [deltas, setDeltas] = useState<BaselineDelta[]>([]);
  const [summary, setSummary] = useState<ExecutiveCatchUpSummary | null>(null);
  const [quotesMap, setQuotesMap] = useState<Record<string, TickerQuote>>({});

  // Simulator State
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    isSimulating: false,
    simulatedTimeOffsetHours: 3.5,
    forceStaleData: false,
    forceConflict: false,
    priceShocks: {},
    catalystInjections: [],
  });

  // UI state
  const [viewMode, setViewMode] = useState<'triage' | 'table'>('triage');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);
  const [snapshotSavedSuccess, setSnapshotSavedSuccess] = useState(false);
  const [isSavingThesis, setIsSavingThesis] = useState(false);

  // Active watchlist object
  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0] || null;

  // Load Watchlists & Simulator State
  const fetchInitialData = async () => {
    try {
      const [wlRes, simRes] = await Promise.all([
        fetch('/api/watchlist'),
        fetch('/api/market/simulate'),
      ]);
      const wlData = await wlRes.json();
      const simData = await simRes.json();

      if (wlData.watchlists && wlData.watchlists.length > 0) {
        setWatchlists(wlData.watchlists);
        if (!activeWatchlistId) {
          setActiveWatchlistId(wlData.watchlists[0].id);
        }
      }

      if (simData.simulatorState) {
        setSimulatorState(simData.simulatorState);
      }
    } catch (err) {
      console.error('Error fetching initial watchlist data:', err);
    }
  };

  // Fetch Deltas and Quotes for active watchlist & baseline
  const fetchDeltas = useCallback(async (silent = false) => {
    if (!activeWatchlistId) return;
    if (!silent) setIsLoading(true);

    try {
      const url = `/api/market/delta?watchlistId=${encodeURIComponent(
        activeWatchlistId
      )}&baseline=${encodeURIComponent(baseline)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.deltas) {
        setDeltas(data.deltas);
        setSummary(data.summary);
        setBaselineTimestamp(data.baselineTimestamp);
        setBaselineLabel(data.baselineLabel);

        // Build quotes map
        const qMap: Record<string, TickerQuote> = {};
        if (Array.isArray(data.currentQuotes)) {
          for (const q of data.currentQuotes) {
            qMap[q.symbol] = q;
          }
        }
        setQuotesMap(qMap);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Error loading deltas:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [activeWatchlistId, baseline]);

  // Initial mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch deltas whenever activeWatchlistId or baseline changes
  useEffect(() => {
    if (activeWatchlistId) {
      fetchDeltas();
    }
  }, [activeWatchlistId, baseline, fetchDeltas]);

  // Periodic polling every 12s for live market updates (silent background refresh)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDeltas(true);
    }, 12000);
    return () => clearInterval(interval);
  }, [fetchDeltas]);

  // Actions
  const handleSelectBaseline = (newBaseline: BaselineOption) => {
    setBaseline(newBaseline);
  };

  const handleSelectWatchlist = (id: string) => {
    setActiveWatchlistId(id);
  };

  const handleCreateWatchlist = async (name: string, description: string) => {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (data.watchlist) {
        setWatchlists(prev => [...prev, data.watchlist]);
        setActiveWatchlistId(data.watchlist.id);
      }
    } catch (err) {
      console.error('Failed to create watchlist:', err);
    }
  };

  const handleAddTicker = async (
    symbol: string,
    targetBuy?: number,
    targetSell?: number,
    notes?: string
  ) => {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_ticker',
          watchlistId: activeWatchlistId,
          symbol,
          targetBuy,
          targetSell,
          notes,
        }),
      });
      const data = await res.json();
      if (data.watchlist) {
        setWatchlists(prev =>
          prev.map(w => (w.id === data.watchlist.id ? data.watchlist : w))
        );
        fetchDeltas();
      }
    } catch (err) {
      console.error('Failed to add ticker:', err);
    }
  };

  const handleRemoveTicker = async (symbol: string) => {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_ticker',
          watchlistId: activeWatchlistId,
          symbol,
        }),
      });
      const data = await res.json();
      if (data.watchlist) {
        setWatchlists(prev =>
          prev.map(w => (w.id === data.watchlist.id ? data.watchlist : w))
        );
        fetchDeltas();
      }
    } catch (err) {
      console.error('Failed to remove ticker:', err);
    }
  };

  const handleSaveThesis = async (
    symbol: string,
    targetBuy?: number,
    targetSell?: number,
    notes?: string
  ) => {
    setIsSavingThesis(true);
    try {
      const res = await fetch('/api/watchlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_ticker_thesis',
          watchlistId: activeWatchlistId,
          symbol,
          targetBuy,
          targetSell,
          notes,
        }),
      });
      const data = await res.json();
      if (data.watchlist) {
        setWatchlists(prev =>
          prev.map(w => (w.id === data.watchlist.id ? data.watchlist : w))
        );
        fetchDeltas(true);
      }
    } catch (err) {
      console.error('Failed to update thesis:', err);
    } finally {
      setIsSavingThesis(false);
    }
  };

  const handleTriggerScenario = async (scenario: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/market/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      const data = await res.json();
      if (data.simulatorState) {
        setSimulatorState(data.simulatorState);
      }
      await fetchDeltas();
    } catch (err) {
      console.error('Failed to trigger scenario:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSnapshot = async () => {
    setIsSavingSnapshot(true);
    try {
      const quotesList = Object.values(quotesMap);
      await fetch('/api/market/delta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default_user',
          label: 'Manual User Checkpoint',
          currentQuotes: quotesList,
        }),
      });
      setSnapshotSavedSuccess(true);
      setTimeout(() => setSnapshotSavedSuccess(false), 3000);
      if (baseline === 'last_visit') {
        fetchDeltas(true);
      }
    } catch (err) {
      console.error('Failed to save snapshot:', err);
    } finally {
      setIsSavingSnapshot(false);
    }
  };

  // Selected item for drawer
  const selectedDelta = selectedTicker
    ? deltas.find(d => d.symbol === selectedTicker) || null
    : null;
  const selectedQuote = selectedTicker ? quotesMap[selectedTicker] || null : null;
  const selectedWatchlistItem =
    activeWatchlist?.items.find(i => i.symbol === selectedTicker) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Test Harness / Simulator Toolbar */}
      <ScenarioSimulatorBar
        simulatorState={simulatorState}
        onTriggerScenario={handleTriggerScenario}
        isLoading={isLoading}
      />

      {/* Main Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-mono">
                  PULSE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
                  DELTA ENGINE
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Smart Temporal Market Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Engine Status: <strong>Operational</strong></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {lastUpdated && (
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Sync: {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Executive Catch-Up Summary */}
        <ExecutiveDigest
          summary={summary}
          onSelectTicker={sym => setSelectedTicker(sym)}
        />

        {/* Time-Machine Comparison Bar */}
        <TimeMachineBar
          currentBaseline={baseline}
          onSelectBaseline={handleSelectBaseline}
          baselineTimestamp={baselineTimestamp}
          onSaveSnapshot={handleSaveSnapshot}
          isSavingSnapshot={isSavingSnapshot}
          snapshotSavedSuccess={snapshotSavedSuccess}
        />

        {/* Watchlist Header & Controls */}
        <WatchlistHeader
          watchlists={watchlists}
          activeWatchlist={activeWatchlist}
          onSelectWatchlist={handleSelectWatchlist}
          onCreateWatchlist={handleCreateWatchlist}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onRefresh={() => fetchDeltas()}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
        />

        {/* Active Watchlist Views */}
        {isLoading && deltas.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono">
              Computing temporal anomalies and statistical deltas...
            </p>
          </div>
        ) : viewMode === 'triage' ? (
          <TriageBoard
            deltas={deltas}
            quotes={quotesMap}
            onSelectTicker={sym => setSelectedTicker(sym)}
          />
        ) : (
          <WatchlistTable
            deltas={deltas}
            quotes={quotesMap}
            baselineLabel={baselineLabel}
            onSelectTicker={sym => setSelectedTicker(sym)}
            onRemoveTicker={handleRemoveTicker}
          />
        )}
      </main>

      {/* Slide-out Asset Detail Drawer */}
      {selectedTicker && selectedDelta && (
        <AssetDetailDrawer
          symbol={selectedTicker}
          delta={selectedDelta}
          quote={selectedQuote}
          watchlistItem={selectedWatchlistItem}
          baselineLabel={baselineLabel}
          onClose={() => setSelectedTicker(null)}
          onSaveThesis={handleSaveThesis}
          isSavingThesis={isSavingThesis}
        />
      )}

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingSymbols={activeWatchlist?.items.map(i => i.symbol) || []}
        onAddTicker={handleAddTicker}
        isAdding={isLoading}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <p>
          PULSE Smart Market Watchlist Platform • CODE 2026 Submission
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Engineered for temporal awareness, anomaly prioritization, and data resilience.
        </p>
      </footer>
    </div>
  );
}
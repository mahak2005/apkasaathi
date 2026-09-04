'use client';

import React, { useState } from 'react';
import { ASSET_DIRECTORY } from '@/lib/market/market-service';
import { X, Search, Plus, Check } from 'lucide-react';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSymbols: string[];
  onAddTicker: (
    symbol: string,
    targetBuy?: number,
    targetSell?: number,
    notes?: string
  ) => Promise<void>;
  isAdding: boolean;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({
  isOpen,
  onClose,
  existingSymbols,
  onAddTicker,
  isAdding,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [targetBuy, setTargetBuy] = useState('');
  const [targetSell, setTargetSell] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const existingUpper = new Set(existingSymbols.map(s => s.toUpperCase()));

  const allAssets = Object.values(ASSET_DIRECTORY);
  const filtered = allAssets.filter(asset => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      asset.symbol.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      asset.sector.toLowerCase().includes(q)
    );
  });

  const handleSelect = (sym: string) => {
    setSelectedSymbol(sym);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymbol) return;
    const buy = targetBuy ? parseFloat(targetBuy) : undefined;
    const sell = targetSell ? parseFloat(targetSell) : undefined;
    await onAddTicker(selectedSymbol, buy, sell, notes);
    onClose();
    setSelectedSymbol(null);
    setSearchQuery('');
    setTargetBuy('');
    setTargetSell('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Add Asset to Watchlist</h3>
            <p className="text-xs text-slate-400">
              Track real-time quotes, statistical deltas, and catalyst alerts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ticker symbol, company name, or sector..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition placeholder:text-slate-500"
          />
        </div>

        {/* Ticker List */}
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/40">
          {filtered.map(asset => {
            const isAlreadyAdded = existingUpper.has(asset.symbol);
            const isSelected = selectedSymbol === asset.symbol;

            return (
              <div
                key={asset.symbol}
                onClick={() => !isAlreadyAdded && handleSelect(asset.symbol)}
                className={`flex items-center justify-between p-2.5 rounded-lg transition text-xs ${
                  isAlreadyAdded
                    ? 'opacity-50 cursor-not-allowed bg-slate-950/40'
                    : isSelected
                    ? 'bg-indigo-950/80 border border-indigo-600 text-indigo-200'
                    : 'hover:bg-slate-800/60 cursor-pointer text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold font-mono text-slate-100 text-sm">
                    {asset.symbol}
                  </span>
                  <div>
                    <span className="text-xs text-slate-300 font-medium block truncate max-w-[180px]">
                      {asset.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {asset.sector}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="font-mono font-bold text-slate-200 block">
                      ${asset.basePrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      β: {asset.beta}
                    </span>
                  </div>

                  {isAlreadyAdded ? (
                    <span className="text-[11px] text-slate-400 font-semibold px-2 py-0.5 bg-slate-800 rounded">
                      Added
                    </span>
                  ) : isSelected ? (
                    <span className="p-1 rounded bg-indigo-600 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-center py-4 text-xs text-slate-400">
              No matching assets found. Try searching for NVDA, AAPL, or TSLA.
            </p>
          )}
        </div>

        {/* Optional Thesis Inputs for Selected Symbol */}
        {selectedSymbol && (
          <form onSubmit={handleAdd} className="pt-2 border-t border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-300">
              Optional: Set Alert Triggers for <strong className="text-indigo-400">{selectedSymbol}</strong>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Target Entry ($)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 120.00"
                  value={targetBuy}
                  onChange={e => setTargetBuy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Profit Exit ($)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 150.00"
                  value={targetSell}
                  onChange={e => setTargetSell(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Thesis / Key Catalyst to Watch
              </label>
              <input
                type="text"
                placeholder="e.g. Monitoring datacenter capex & margins"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAdding ? 'Adding...' : `Add ${selectedSymbol}`}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

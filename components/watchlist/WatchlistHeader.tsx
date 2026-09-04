'use client';

import React, { useState } from 'react';
import { Watchlist } from '@/lib/types/market';
import {
  Kanban,
  Table as TableIcon,
  Plus,
  RefreshCw,
  ChevronDown,
  Layers,
  FolderPlus,
} from 'lucide-react';

interface WatchlistHeaderProps {
  watchlists: Watchlist[];
  activeWatchlist: Watchlist | null;
  onSelectWatchlist: (id: string) => void;
  onCreateWatchlist: (name: string, description: string) => Promise<void>;
  viewMode: 'triage' | 'table';
  onToggleViewMode: (mode: 'triage' | 'table') => void;
  onOpenAddModal: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: string | null;
}

export const WatchlistHeader: React.FC<WatchlistHeaderProps> = ({
  watchlists,
  activeWatchlist,
  onSelectWatchlist,
  onCreateWatchlist,
  viewMode,
  onToggleViewMode,
  onOpenAddModal,
  onRefresh,
  isLoading,
  lastUpdated,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    await onCreateWatchlist(newListName.trim(), newListDesc.trim());
    setNewListName('');
    setNewListDesc('');
    setShowCreateModal(false);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Watchlist Switcher Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition text-left group"
            >
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                  Active Watchlist
                </span>
                <span className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition flex items-center gap-1.5">
                  {activeWatchlist?.name || 'Select Watchlist'}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </div>
            </button>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-40 divide-y divide-slate-800/60">
              <div className="py-1">
                {watchlists.map(list => {
                  const isActive = activeWatchlist?.id === list.id;
                  return (
                    <button
                      key={list.id}
                      onClick={() => {
                        onSelectWatchlist(list.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition ${
                        isActive
                          ? 'bg-indigo-950/60 text-indigo-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-200">{list.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                          {list.items.length} assets • {list.description || 'Custom watchlist'}
                        </div>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-1.5">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-indigo-400 hover:bg-slate-800 transition"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create New Watchlist</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher (Triage vs Quant Table) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onToggleViewMode('triage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'triage'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Attention triage view categorized by urgency"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Triage Board</span>
            </button>

            <button
              onClick={() => onToggleViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Quantitative full-width sortable table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Quant Grid</span>
            </button>
          </div>

          {/* Add Asset Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Asset</span>
          </button>

          {/* Refresh Button & Timestamp */}
          <div className="flex items-center gap-1.5">
            {lastUpdated && (
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                {lastUpdated}
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition disabled:opacity-50"
              title="Refresh latest market data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Create New Watchlist */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Create New Watchlist</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Watchlist Name</label>
                <input
                  type="text"
                  placeholder="e.g. Clean Energy or High-Dividend"
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Description (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Long-term core holdings"
                  value={newListDesc}
                  onChange={e => setNewListDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

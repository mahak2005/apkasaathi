'use client';

import React, { useState, useEffect } from 'react';
import { BaselineDelta, TickerQuote, WatchlistItem } from '@/lib/types/market';
import { DataQualityBadge } from './DataQualityBadge';
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Save,
  Target,
  Sparkles,
} from 'lucide-react';

interface AssetDetailDrawerProps {
  symbol: string | null;
  delta: BaselineDelta | null;
  quote: TickerQuote | null;
  watchlistItem?: WatchlistItem | null;
  baselineLabel: string;
  onClose: () => void;
  onSaveThesis: (symbol: string, targetBuy?: number, targetSell?: number, notes?: string) => Promise<void>;
  isSavingThesis: boolean;
}

export const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({
  symbol,
  delta,
  quote,
  watchlistItem,
  baselineLabel,
  onClose,
  onSaveThesis,
  isSavingThesis,
}) => {
  const [targetBuy, setTargetBuy] = useState<string>('');
  const [targetSell, setTargetSell] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (watchlistItem) {
      setTargetBuy(watchlistItem.targetBuyPrice ? String(watchlistItem.targetBuyPrice) : '');
      setTargetSell(watchlistItem.targetSellPrice ? String(watchlistItem.targetSellPrice) : '');
      setNotes(watchlistItem.notes || '');
    } else {
      setTargetBuy('');
      setTargetSell('');
      setNotes('');
    }
    setSaveSuccess(false);
  }, [watchlistItem, symbol]);

  if (!symbol || !delta) return null;

  const isPos = delta.deltaPercent >= 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const buy = targetBuy ? parseFloat(targetBuy) : undefined;
    const sell = targetSell ? parseFloat(targetSell) : undefined;
    await onSaveThesis(symbol, buy, sell, notes);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // 52-week position
  let rangePercent = 50;
  if (quote && quote.fiftyTwoWeekHigh > quote.fiftyTwoWeekLow) {
    rangePercent = Math.min(
      100,
      Math.max(
        0,
        ((quote.price - quote.fiftyTwoWeekLow) / (quote.fiftyTwoWeekHigh - quote.fiftyTwoWeekLow)) * 100
      )
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md md:max-w-lg bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
          {/* Top Section */}
          <div className="space-y-6">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black font-mono text-slate-100 tracking-tight">
                    {delta.symbol}
                  </h2>
                  {quote && (
                    <DataQualityBadge
                      status={quote.dataQuality}
                      latencyMs={quote.latencyMs}
                      conflictDetails={quote.conflictDetails}
                    />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {delta.companyName} • {quote?.sector}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price & Delta Banner */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Current Price</span>
                <span className="text-2xl font-bold font-mono text-slate-100">
                  ${delta.currentPrice.toFixed(2)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">
                  Δ vs {baselineLabel}
                </span>
                <div
                  className={`inline-flex items-center gap-0.5 font-mono text-base font-bold ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>
                    {isPos ? '+' : ''}
                    {delta.deltaPercent.toFixed(2)}% (${delta.deltaAmount.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>

            {/* 52-Week Range Bar */}
            {quote && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>52W Low: ${quote.fiftyTwoWeekLow.toFixed(2)}</span>
                  <span>52W High: ${quote.fiftyTwoWeekHigh.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${rangePercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Quantitative Anomaly Analysis */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Anomaly & Attention Breakdown</span>
              </span>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Z-Score</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      delta.zScore >= 2.0 ? 'text-rose-400' : 'text-slate-200'
                    }`}
                  >
                    {delta.zScore.toFixed(1)}σ
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Statistical shock</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Relative Vol</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      delta.rvol >= 2.0 ? 'text-cyan-400' : 'text-slate-200'
                    }`}
                  >
                    {delta.rvol.toFixed(1)}x
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">vs 20d ADV</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Sector Alpha</span>
                  <span className="font-mono font-bold text-sm text-purple-300">
                    {delta.idiosyncraticAlpha > 0 ? '+' : ''}
                    {delta.idiosyncraticAlpha.toFixed(1)}%
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Beta decoupled</span>
                </div>
              </div>

              {/* Rationale bullet points */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Identified Signals:
                </span>
                {delta.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catalysts & News */}
            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Catalysts & Developments</span>
              </span>

              {delta.catalysts.length > 0 ? (
                <div className="space-y-2">
                  {delta.catalysts.map(c => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            c.sentiment === 'POSITIVE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : c.sentiment === 'NEGATIVE'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {c.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Impact: {c.impactScore}/10
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-200 text-xs mt-1">
                        {c.title}
                      </h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {c.description}
                      </p>
                      {c.source && (
                        <div className="text-[10px] text-slate-400 pt-1">
                          Source: {c.source}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  No high-impact material catalyst recorded for this ticker today.
                </p>
              )}
            </div>

            {/* User Thesis & Alert Target Editor */}
            <form onSubmit={handleSave} className="space-y-3 pt-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Investment Thesis & Custom Triggers</span>
              </span>

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
                    Profit Target ($)
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
                  Thesis / Attention Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="What key metric or condition are you monitoring?"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-400 font-medium">
                    ✓ Thesis triggers updated!
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Triggers trigger critical triage alerts when crossed.
                  </span>
                )}

                <button
                  type="submit"
                  disabled={isSavingThesis}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingThesis ? 'Saving...' : 'Save Thesis'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

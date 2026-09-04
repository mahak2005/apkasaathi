'use client';

import React from 'react';
import { BaselineDelta, TickerQuote } from '@/lib/types/market';
import { DataQualityBadge } from './DataQualityBadge';
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';

interface TriageBoardProps {
  deltas: BaselineDelta[];
  quotes: Record<string, TickerQuote>;
  onSelectTicker: (symbol: string) => void;
}

export const TriageBoard: React.FC<TriageBoardProps> = ({
  deltas,
  quotes,
  onSelectTicker,
}) => {
  const criticalDeltas = deltas.filter(d => d.urgency === 'CRITICAL');
  const notableDeltas = deltas.filter(d => d.urgency === 'NOTABLE');
  const stableDeltas = deltas.filter(d => d.urgency === 'STABLE');

  const renderCard = (delta: BaselineDelta) => {
    const quote = quotes[delta.symbol];
    const isPositive = delta.deltaPercent >= 0;

    return (
      <div
        key={delta.symbol}
        onClick={() => onSelectTicker(delta.symbol)}
        className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-md hover:shadow-indigo-950/20 group relative overflow-hidden flex flex-col justify-between"
      >
        {/* Accent bar on left edge */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${
            delta.urgency === 'CRITICAL'
              ? 'bg-rose-500'
              : delta.urgency === 'NOTABLE'
              ? 'bg-amber-500'
              : 'bg-slate-700'
          }`}
        />

        {/* Top: Header & Data Quality */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition font-mono">
                  {delta.symbol}
                </span>
                {quote && (
                  <DataQualityBadge
                    status={quote.dataQuality}
                    latencyMs={quote.latencyMs}
                    compact={true}
                    conflictDetails={quote.conflictDetails}
                  />
                )}
              </div>
              <span className="text-xs text-slate-400 truncate block max-w-[170px]">
                {delta.companyName}
              </span>
            </div>

            {/* Price & Delta */}
            <div className="text-right">
              <div className="text-sm font-bold text-slate-100 font-mono">
                ${delta.currentPrice.toFixed(2)}
              </div>
              <div
                className={`inline-flex items-center text-xs font-mono font-bold ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {delta.deltaPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Attention Metrics Tags */}
          <div className="flex flex-wrap items-center gap-1.5 my-2.5">
            {delta.zScore >= 1.5 && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                  delta.zScore >= 2.5
                    ? 'bg-rose-950/70 border-rose-800/80 text-rose-300'
                    : 'bg-amber-950/70 border-amber-800/80 text-amber-300'
                }`}
                title="Volatility-adjusted Z-score"
              >
                {delta.zScore}σ shock
              </span>
            )}

            {delta.rvol >= 1.5 && (
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-semibold"
                title="Relative Volume vs 20-day Average"
              >
                {delta.rvol}x Vol
              </span>
            )}

            {Math.abs(delta.idiosyncraticAlpha) >= 1.5 && (
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 font-semibold"
                title="Idiosyncratic Alpha vs Sector"
              >
                {delta.idiosyncraticAlpha > 0 ? '+' : ''}
                {delta.idiosyncraticAlpha}% α
              </span>
            )}

            {delta.levelBreaches.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 font-semibold truncate max-w-[130px]">
                {delta.levelBreaches[0]}
              </span>
            )}
          </div>

          {/* Primary Reason / Catalyst */}
          <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 mt-1">
            <p className="line-clamp-2 leading-relaxed text-[11.5px]">
              {delta.reasons[0] || 'Trading in expected volatility band'}
            </p>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="pt-3 mt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Attention Score:</span>
            <span className="font-mono font-bold text-slate-200">
              {delta.attentionScore}/100
            </span>
          </div>

          <div className="flex items-center gap-0.5 text-indigo-400 group-hover:translate-x-0.5 transition font-medium">
            <span>Inspect</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Col 1: CRITICAL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm font-bold text-rose-300 tracking-wide">
              CRITICAL ATTENTION
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-950 border border-rose-800 text-rose-300">
            {criticalDeltas.length}
          </span>
        </div>

        <div className="space-y-3">
          {criticalDeltas.length > 0 ? (
            criticalDeltas.map(renderCard)
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
              No critical shocks or thesis breaches detected.
            </div>
          )}
        </div>
      </div>

      {/* Col 2: NOTABLE SHIFTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-amber-900/40">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="text-sm font-bold text-amber-300 tracking-wide">
              NOTABLE SHIFTS
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950 border border-amber-800 text-amber-300">
            {notableDeltas.length}
          </span>
        </div>

        <div className="space-y-3">
          {notableDeltas.length > 0 ? (
            notableDeltas.map(renderCard)
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
              No notable volume or sector divergences.
            </div>
          )}
        </div>
      </div>

      {/* Col 3: STABLE / IN-LINE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-bold text-slate-300 tracking-wide">
              STABLE / RANGE-BOUND
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 border border-slate-700 text-slate-400">
            {stableDeltas.length}
          </span>
        </div>

        <div className="space-y-3">
          {stableDeltas.length > 0 ? (
            stableDeltas.map(renderCard)
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
              All assets are experiencing non-standard volatility.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

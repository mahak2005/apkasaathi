'use client';

import React, { useState } from 'react';
import { BaselineDelta, TickerQuote } from '@/lib/types/market';
import { DataQualityBadge } from './DataQualityBadge';
import {
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
} from 'lucide-react';

interface WatchlistTableProps {
  deltas: BaselineDelta[];
  quotes: Record<string, TickerQuote>;
  baselineLabel: string;
  onSelectTicker: (symbol: string) => void;
  onRemoveTicker: (symbol: string) => void;
}

type SortField = 'symbol' | 'price' | 'deltaPercent' | 'zScore' | 'rvol' | 'alpha' | 'attention';

export const WatchlistTable: React.FC<WatchlistTableProps> = ({
  deltas,
  quotes,
  baselineLabel,
  onSelectTicker,
  onRemoveTicker,
}) => {
  const [sortField, setSortField] = useState<SortField>('attention');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedDeltas = [...deltas].sort((a, b) => {
    let diff = 0;
    if (sortField === 'symbol') diff = a.symbol.localeCompare(b.symbol);
    else if (sortField === 'price') diff = a.currentPrice - b.currentPrice;
    else if (sortField === 'deltaPercent') diff = a.deltaPercent - b.deltaPercent;
    else if (sortField === 'zScore') diff = a.zScore - b.zScore;
    else if (sortField === 'rvol') diff = a.rvol - b.rvol;
    else if (sortField === 'alpha') diff = a.idiosyncraticAlpha - b.idiosyncraticAlpha;
    else diff = a.attentionScore - b.attentionScore;

    return sortAsc ? diff : -diff;
  });

  // Render SVG mini sparkline
  const renderSparkline = (points: number[] = [], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const pathData = points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * (height - 6) - 3;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#34d399' : '#f87171';

    return (
      <svg width={width} height={height} className="overflow-visible inline-block">
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold text-[10.5px]">
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition"
              >
                Asset
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 transition"
              >
                Price
              </th>
              <th
                onClick={() => handleSort('deltaPercent')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 transition"
              >
                Δ vs {baselineLabel}
              </th>
              <th className="py-3 px-3 text-right hidden sm:table-cell">1D Move</th>
              <th
                onClick={() => handleSort('zScore')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 transition"
              >
                Z-Score (σ)
              </th>
              <th
                onClick={() => handleSort('rvol')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 transition hidden md:table-cell"
              >
                RVOL
              </th>
              <th
                onClick={() => handleSort('alpha')}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-200 transition hidden lg:table-cell"
              >
                Sector Alpha
              </th>
              <th className="py-3 px-3 text-center hidden xl:table-cell">Trend</th>
              <th className="py-3 px-3 text-center hidden md:table-cell">Data State</th>
              <th
                onClick={() => handleSort('attention')}
                className="py-3 px-3 text-center cursor-pointer hover:text-slate-200 transition"
              >
                Attention
              </th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedDeltas.map(delta => {
              const quote = quotes[delta.symbol];
              const isDeltaPositive = delta.deltaPercent >= 0;
              const isDayPositive = quote ? quote.changePercent >= 0 : isDeltaPositive;

              return (
                <tr
                  key={delta.symbol}
                  onClick={() => onSelectTicker(delta.symbol)}
                  className="hover:bg-slate-800/50 transition cursor-pointer group"
                >
                  {/* Asset */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 font-mono text-sm group-hover:text-indigo-400 transition">
                        {delta.symbol}
                      </span>
                      {delta.levelBreaches.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950/70 border border-rose-800/70 text-rose-300 font-semibold hidden sm:inline">
                          Breach
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 truncate block max-w-[140px]">
                      {delta.companyName}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                    ${delta.currentPrice.toFixed(2)}
                  </td>

                  {/* Delta vs Baseline */}
                  <td className="py-3 px-3 text-right">
                    <div
                      className={`inline-flex items-center gap-0.5 font-mono font-bold ${
                        isDeltaPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isDeltaPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span>
                        {isDeltaPositive ? '+' : ''}
                        {delta.deltaPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {delta.deltaAmount >= 0 ? '+' : ''}${delta.deltaAmount.toFixed(2)}
                    </div>
                  </td>

                  {/* 1D Move */}
                  <td className="py-3 px-3 text-right hidden sm:table-cell font-mono">
                    {quote ? (
                      <span
                        className={
                          isDayPositive ? 'text-emerald-400/90' : 'text-rose-400/90'
                        }
                      >
                        {isDayPositive ? '+' : ''}
                        {quote.changePercent.toFixed(2)}%
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Z-Score */}
                  <td className="py-3 px-3 text-right font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        delta.zScore >= 2.5
                          ? 'bg-rose-950/70 text-rose-300 border border-rose-800'
                          : delta.zScore >= 1.5
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {delta.zScore.toFixed(1)}σ
                    </span>
                  </td>

                  {/* RVOL */}
                  <td className="py-3 px-3 text-right font-mono hidden md:table-cell">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        delta.rvol >= 2.0
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {delta.rvol.toFixed(1)}x
                    </span>
                  </td>

                  {/* Sector Alpha */}
                  <td className="py-3 px-3 text-right font-mono hidden lg:table-cell">
                    <span
                      className={
                        delta.idiosyncraticAlpha > 0.5
                          ? 'text-purple-300'
                          : delta.idiosyncraticAlpha < -0.5
                          ? 'text-slate-400'
                          : 'text-slate-400'
                      }
                    >
                      {delta.idiosyncraticAlpha > 0 ? '+' : ''}
                      {delta.idiosyncraticAlpha.toFixed(1)}%
                    </span>
                  </td>

                  {/* Sparkline */}
                  <td className="py-3 px-3 text-center hidden xl:table-cell">
                    {quote && renderSparkline(quote.sparkline, isDeltaPositive)}
                  </td>

                  {/* Data Quality */}
                  <td className="py-3 px-3 text-center hidden md:table-cell">
                    {quote && (
                      <DataQualityBadge
                        status={quote.dataQuality}
                        latencyMs={quote.latencyMs}
                        compact={true}
                        conflictDetails={quote.conflictDetails}
                      />
                    )}
                  </td>

                  {/* Attention Score */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                        delta.urgency === 'CRITICAL'
                          ? 'bg-rose-950 border border-rose-800 text-rose-300'
                          : delta.urgency === 'NOTABLE'
                          ? 'bg-amber-950 border border-amber-800 text-amber-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}
                    >
                      {delta.attentionScore}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onRemoveTicker(delta.symbol);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

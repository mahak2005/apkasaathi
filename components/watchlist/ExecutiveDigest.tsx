'use client';

import React from 'react';
import { ExecutiveCatchUpSummary } from '@/lib/types/market';
import { Sparkles, AlertCircle, TrendingUp, CheckCircle2, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ExecutiveDigestProps {
  summary: ExecutiveCatchUpSummary | null;
  onSelectTicker?: (symbol: string) => void;
}

export const ExecutiveDigest: React.FC<ExecutiveDigestProps> = ({
  summary,
  onSelectTicker,
}) => {
  if (!summary) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 animate-pulse">
        <div className="h-6 w-1/3 bg-slate-800 rounded mb-4" />
        <div className="h-4 w-2/3 bg-slate-800/60 rounded" />
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                Executive Catch-Up Digest
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60 font-mono">
                {summary.baselineLabel} ({summary.timeSinceBaselineFormatted})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              {summary.headline}
            </p>
          </div>
        </div>

        {/* Triage Count Chips */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${
              summary.criticalCount > 0
                ? 'bg-rose-950/50 border-rose-800/60 text-rose-300 shadow-sm shadow-rose-950'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{summary.criticalCount} Critical</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${
              summary.notableCount > 0
                ? 'bg-amber-950/50 border-amber-800/60 text-amber-300 shadow-sm shadow-amber-950'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{summary.notableCount} Notable</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border bg-slate-800/60 border-slate-700/50 text-slate-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{summary.stableCount} Stable</span>
          </div>
        </div>
      </div>

      {/* Main Insights Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
        {/* Left 2 Cols: Key Catalyst Takeaways */}
        <div className="lg:col-span-2 space-y-2.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            What Changed & Why It Matters
          </span>
          <div className="space-y-2">
            {summary.keyTakeaways.length > 0 ? (
              summary.keyTakeaways.map((takeaway, idx) => {
                // Parse symbol if present e.g. "**NVDA** (+4.8%): ..."
                const match = takeaway.match(/\*\*([A-Z]+)\*\*\s*\(([^)]+)\):\s*(.+)/);
                if (match) {
                  const [, sym, deltaStr, desc] = match;
                  const isPos = deltaStr.startsWith('+');
                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectTicker && onSelectTicker(sym)}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-slate-600 transition cursor-pointer text-xs"
                    >
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono font-bold text-[11px] ${
                          isPos
                            ? 'bg-emerald-950 border border-emerald-700/50 text-emerald-400'
                            : 'bg-rose-950 border border-rose-700/50 text-rose-400'
                        }`}
                      >
                        {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {sym} {deltaStr}
                      </span>
                      <p className="text-slate-300 leading-relaxed pt-0.5">
                        {desc}
                      </p>
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 text-slate-300 text-xs leading-relaxed"
                  >
                    {takeaway}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">
                No abnormal price movements or catalysts reported since baseline.
              </p>
            )}
          </div>
        </div>

        {/* Right Col: Macro Context & Thesis Check */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-2">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Macro & Sector Flow Context</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {summary.marketContext}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
            <span>Portfolio Baseline:</span>
            <span className="font-mono text-slate-300">{summary.baselineLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

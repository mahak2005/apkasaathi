'use client';

import React from 'react';
import { History, Camera, Check } from 'lucide-react';

export type BaselineOption = 'last_visit' | 'market_open' | 'prev_close' | 'one_week';

interface TimeMachineBarProps {
  currentBaseline: BaselineOption;
  onSelectBaseline: (baseline: BaselineOption) => void;
  baselineTimestamp?: string;
  onSaveSnapshot: () => Promise<void>;
  isSavingSnapshot: boolean;
  snapshotSavedSuccess: boolean;
}

export const TimeMachineBar: React.FC<TimeMachineBarProps> = ({
  currentBaseline,
  onSelectBaseline,
  baselineTimestamp,
  onSaveSnapshot,
  isSavingSnapshot,
  snapshotSavedSuccess,
}) => {
  const options: { id: BaselineOption; label: string; tooltip: string }[] = [
    {
      id: 'last_visit',
      label: 'My Last Visit',
      tooltip: 'Calculates price and catalyst deltas since your specific previous session',
    },
    {
      id: 'market_open',
      label: 'Market Open (9:30 AM)',
      tooltip: 'Compare intraday delta against the 9:30 AM EST opening bell',
    },
    {
      id: 'prev_close',
      label: 'Yesterday Close (1D)',
      tooltip: 'Standard 1-day comparative return against yesterday 4:00 PM close',
    },
    {
      id: 'one_week',
      label: '1 Week Ago',
      tooltip: 'Trailing 7-day performance and structural catalyst delta',
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
      {/* Left: Baseline Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold px-1 whitespace-nowrap">
          <History className="w-3.5 h-3.5 text-indigo-400" />
          <span>Compare Against:</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {options.map(opt => {
            const isActive = currentBaseline === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectBaseline(opt.id)}
                title={opt.tooltip}
                className={`px-3 py-1 text-xs font-medium rounded-md transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Snapshot Save trigger */}
      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
        {baselineTimestamp && (
          <span className="text-slate-400 font-mono text-[11px] hidden md:inline">
            Ref: {new Date(baselineTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}

        <button
          onClick={onSaveSnapshot}
          disabled={isSavingSnapshot}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
            snapshotSavedSuccess
              ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-slate-600'
          }`}
          title="Save a new checkpoint now so your next return compares against this exact moment"
        >
          {snapshotSavedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Snapshot Saved!</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isSavingSnapshot ? 'Saving...' : 'Bookmark Session'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

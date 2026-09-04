'use client';

import React from 'react';
import { FlaskConical, Play, RefreshCcw, Zap, AlertTriangle, Radio } from 'lucide-react';
import { SimulatorState } from '@/lib/types/market';

interface ScenarioSimulatorBarProps {
  simulatorState: SimulatorState;
  onTriggerScenario: (scenario: string) => Promise<void>;
  isLoading: boolean;
}

export const ScenarioSimulatorBar: React.FC<ScenarioSimulatorBarProps> = ({
  simulatorState,
  onTriggerScenario,
  isLoading,
}) => {

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur px-4 py-2.5 transition-all text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Badge and description */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded text-indigo-400 font-semibold tracking-wide">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>CODE 2026 TEST HARNESS</span>
          </div>

          {simulatorState.isSimulating ? (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Active Scenario: <strong>{simulatorState.scenarioName}</strong></span>
            </div>
          ) : (
            <span className="text-slate-400 hidden sm:inline">
              Simulate market events, return intervals, and edge cases on demand:
            </span>
          )}
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTriggerScenario('time_jump_4h')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition disabled:opacity-50"
            title="Fast forward 4.5 hours with intra-day volatility and catalyst changes"
          >
            <Play className="w-3 h-3 text-cyan-400" />
            <span>Return After 4 Hours</span>
          </button>

          <button
            onClick={() => onTriggerScenario('earnings_shock')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition disabled:opacity-50"
            title="Inject an unexpected earnings beat on NVDA with +9.2% surge"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Earnings Shock</span>
          </button>

          <button
            onClick={() => onTriggerScenario('feed_outage_stale')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition disabled:opacity-50"
            title="Simulate upstream exchange feed dropping to test stale cache handling"
          >
            <Radio className="w-3 h-3 text-orange-400" />
            <span>Feed Outage (Stale)</span>
          </button>

          <button
            onClick={() => onTriggerScenario('feed_conflict')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition disabled:opacity-50"
            title="Simulate divergent quotes from multiple feeds (>1% spread)"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Feed Conflict</span>
          </button>

          {simulatorState.isSimulating && (
            <button
              onClick={() => onTriggerScenario('reset')}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 transition disabled:opacity-50 font-medium"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>Reset to Live</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { DataQualityState, ConflictDetails } from '@/lib/types/market';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

interface DataQualityBadgeProps {
  status: DataQualityState;
  latencyMs?: number;
  lastConfirmedTime?: string;
  conflictDetails?: ConflictDetails;
  compact?: boolean;
}

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({
  status,
  latencyMs = 60,
  lastConfirmedTime,
  conflictDetails,
  compact = false,
}) => {
  switch (status) {
    case 'LIVE':
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/70 border border-emerald-700/50 text-emerald-400"
          title={`Streaming live feed • Latency: ${latencyMs}ms`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {!compact && <span>LIVE</span>}
          <span className="text-[10px] text-emerald-500 font-mono hidden sm:inline">
            {latencyMs}ms
          </span>
        </span>
      );

    case 'DELAYED':
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-950/70 border border-sky-700/50 text-sky-400"
          title="15-minute standard exchange delayed data feed"
        >
          <Clock className="w-3 h-3 text-sky-400" />
          <span>DELAYED (15m)</span>
        </span>
      );

    case 'STALE':
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-950/80 border border-amber-600/70 text-amber-300"
          title={`Feed connection degraded. Latency: ${latencyMs}ms. Showing cached snapshot.`}
        >
          <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
          <span>STALE (CACHED)</span>
          {lastConfirmedTime && (
            <span className="text-[10px] text-amber-400/80 hidden md:inline">
              reconnecting...
            </span>
          )}
        </span>
      );

    case 'CONFLICT':
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-950/80 border border-rose-600 text-rose-300"
          title={
            conflictDetails?.divergenceReason ||
            'Multiple market data feeds report divergent quotes (>0.5% spread)'
          }
        >
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>FEED CONFLICT</span>
          {conflictDetails && (
            <span className="text-[10px] font-mono text-rose-300/90 hidden sm:inline">
              ±{conflictDetails.spreadPercent}%
            </span>
          )}
        </span>
      );

    default:
      return null;
  }
};

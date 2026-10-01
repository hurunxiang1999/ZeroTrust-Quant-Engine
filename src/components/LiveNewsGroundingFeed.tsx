/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Newspaper,
  Radio,
  ExternalLink,
  RefreshCw,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  AlertCircle,
  Activity,
  Zap,
} from 'lucide-react';
import { LiveNewsItem, ApiConnectionStatus } from '../types/alpha';

interface LiveNewsGroundingFeedProps {
  newsItems?: LiveNewsItem[];
  connectionStatus: ApiConnectionStatus;
  lastSyncTime?: string;
  onLiveSync: () => void;
  isLiveSyncing: boolean;
  eventTrigger: string;
}

export const LiveNewsGroundingFeed: React.FC<LiveNewsGroundingFeedProps> = ({
  newsItems = [],
  connectionStatus,
  lastSyncTime,
  onLiveSync,
  isLiveSyncing,
  eventTrigger,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const isConnected = connectionStatus === 'CONNECTED';

  return (
    <div className="bg-[#080d18] border border-[#1d2b45] rounded-lg overflow-hidden shadow-xl font-mono text-xs">
      {/* Telemetry & Control Bar */}
      <div className="px-3.5 py-2.5 bg-[#0c1424] border-b border-[#1c2940] flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold uppercase tracking-wider text-xs">
              LIVE NEWS & MACRO GROUNDING WIRE
            </span>
          </div>

          {/* Connection Status Telemetry Badge */}
          {isConnected ? (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500 shadow-[0_0_10px_rgba(0,230,118,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="font-bold text-[10px] tracking-wide">LIVE API CONNECTED</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              <span className="font-bold text-[10px] tracking-wide">DEGRADED: FALLBACK TO HEURISTICS</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Live Sync Trigger Button */}
          <button
            onClick={onLiveSync}
            disabled={isLiveSyncing}
            className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#0b1f2e] hover:bg-[#102d42] border border-cyan-500/70 text-cyan-300 hover:text-cyan-100 font-bold text-xs transition shadow-[0_0_8px_rgba(0,229,255,0.2)] active:scale-95 cursor-pointer disabled:opacity-50"
            title="Re-fetch live real-time prices & RSS news feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLiveSyncing ? 'animate-spin' : ''}`} />
            <span>{isLiveSyncing ? 'SYNCING API...' : 'LIVE SYNC'}</span>
          </button>

          {/* Last Sync Timestamp */}
          {lastSyncTime && (
            <div className="hidden sm:flex items-center space-x-1 text-[10px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>
                Synced: {new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          )}

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-[#131d2e] transition cursor-pointer"
            title={isExpanded ? 'Collapse News Wire' : 'Expand News Wire'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Grounding Source Explainer */}
      <div className="px-3.5 py-1.5 bg-[#060a14] border-b border-[#141e30] text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-sans">
        <div className="flex items-center space-x-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong>Grounding Source:</strong> Real-time RSS feeds parsed from CNBC, Yahoo Finance, and Reuters. The quantitative engine explicitly bases Alternative Data Alpha and Confidence Scores on this empirical text.
          </span>
        </div>
        <span className="text-cyan-400 font-mono text-[10px] shrink-0">
          {newsItems.length} Real-Time Items Ingested
        </span>
      </div>

      {/* Expanded News Items Feed */}
      {isExpanded && (
        <div className="p-3 divide-y divide-[#131e33] max-h-64 overflow-y-auto space-y-2">
          {newsItems.length > 0 ? (
            newsItems.map((item, idx) => (
              <div
                key={idx}
                className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2 group hover:bg-[#0c1424]/60 p-1.5 rounded transition"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {item.source || 'PUBLIC RSS WIRE'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.pubDate ? new Date(item.pubDate).toLocaleString() : 'Just now'}
                    </span>
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-slate-200 group-hover:text-cyan-300 text-xs transition flex items-center space-x-1.5"
                  >
                    <span>{item.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                  </a>

                  {item.snippet && (
                    <p className="text-[11px] font-sans text-slate-400 line-clamp-2 leading-snug">
                      {item.snippet}
                    </p>
                  )}
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#111c2e] hover:bg-[#182842] text-[10px] text-slate-300 hover:text-white border border-slate-700 transition"
                  >
                    <span>Primary Wire</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-slate-500 text-xs">
              <span>Awaiting real-time news wire ingestion for &quot;{eventTrigger}&quot;... Click &quot;Live Sync&quot; to fetch fresh headlines.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

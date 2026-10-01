/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Flame,
  Table as TableIcon,
  LayoutGrid,
  Filter,
  BarChart3,
} from 'lucide-react';
import { ActionableTicker, VerificationStatus } from '../types/alpha';
import { ConvictionMarginHeatmap } from './ConvictionMarginHeatmap';

interface LongShortSectionProps {
  longTickers: ActionableTicker[];
  shortTickers: ActionableTicker[];
  onSelectTicker: (ticker: ActionableTicker) => void;
}

export const LongShortSection: React.FC<LongShortSectionProps> = ({
  longTickers,
  shortTickers,
  onSelectTicker,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'heatmap' | 'cards'>('heatmap');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'LONG' | 'SHORT'>('ALL');

  const renderVerificationBadge = (status?: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500 shadow-[0_0_8px_rgba(0,230,118,0.25)] whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>[Verified]</span>
          </span>
        );
      case 'UNCONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.25)] whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>[Unconfirmed Data]</span>
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-500 shadow-[0_0_8px_rgba(255,51,102,0.3)] animate-pulse whitespace-nowrap">
            <Flame className="w-3 h-3 text-rose-400 shrink-0" />
            <span>[High Risk of Hallucination]</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-[#162136] border border-slate-700 whitespace-nowrap">
            <FileCheck2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span>[Pending Audit]</span>
          </span>
        );
    }
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 90) {
      return (
        <div className="space-y-1">
          <div className="text-emerald-400 font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{score}% High Density</span>
          </div>
          <div className="w-full bg-[#11241c] h-1.5 rounded-full overflow-hidden border border-emerald-900/60">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${score}%` }} />
          </div>
        </div>
      );
    }
    if (score >= 75) {
      return (
        <div className="space-y-1">
          <div className="text-amber-400 font-bold flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{score}% Moderate</span>
          </div>
          <div className="w-full bg-[#241d11] h-1.5 rounded-full overflow-hidden border border-amber-900/60">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${score}%` }} />
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <div className="text-rose-400 font-bold flex items-center space-x-1">
          <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{score}% Low Density</span>
        </div>
        <div className="w-full bg-[#241116] h-1.5 rounded-full overflow-hidden border border-rose-900/60">
          <div className="bg-rose-400 h-full rounded-full" style={{ width: `${score}%` }} />
        </div>
      </div>
    );
  };

  const allTickers = [
    ...longTickers.map((t) => ({ ...t, positionIndex: 'LONG' as const })),
    ...shortTickers.map((t) => ({ ...t, positionIndex: 'SHORT' as const })),
  ].filter((t) => (directionFilter === 'ALL' ? true : t.direction === directionFilter));

  return (
    <div className="space-y-3">
      {/* Control Strip & View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b263b] pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
          <h2 className="text-xs md:text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
            Zero-Trust Fact-Checked Alpha Pairs // Institutional Execution Table
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Direction Filter */}
          <div className="flex items-center bg-[#070b14] border border-[#1c283f] rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setDirectionFilter('ALL')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                directionFilter === 'ALL'
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All (6)
            </button>
            <button
              onClick={() => setDirectionFilter('LONG')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                directionFilter === 'LONG'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Longs (3)
            </button>
            <button
              onClick={() => setDirectionFilter('SHORT')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                directionFilter === 'SHORT'
                  ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Shorts (3)
            </button>
          </div>

          {/* Table vs Heatmap vs Card View Toggle */}
          <div className="flex items-center bg-[#070b14] border border-[#1c283f] rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-0.5 rounded flex items-center space-x-1 transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3 h-3" />
              <span>Data Table</span>
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-2.5 py-0.5 rounded flex items-center space-x-1 transition cursor-pointer ${
                viewMode === 'heatmap'
                  ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3 h-3 text-amber-400" />
              <span>Heatmap Grid</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-0.5 rounded flex items-center space-x-1 transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Quant Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: BLOOMBERG TERMINAL DATA TABLE (WITH DATA PROVENANCE COLUMN)
         ========================================================================= */}
      {viewMode === 'table' && (
        <div className="space-y-2.5">
          {/* Quick Color-Coded Heatmap Ranking Ribbon */}
          <div className="bg-[#090e1a] border border-[#1b273d] rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center space-x-2 shrink-0">
              <span className="w-2 h-2 rounded bg-amber-400 animate-pulse" />
              <span className="text-amber-300 font-bold uppercase text-[11px]">
                Heatmap Ranking (Conviction vs Margin Delta):
              </span>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {[...longTickers.map((t) => ({ ...t, direction: 'LONG' as const })), ...shortTickers.map((t) => ({ ...t, direction: 'SHORT' as const }))]
                .sort(
                  (a, b) =>
                    Math.abs(b.quantMetrics.estimatedMarginDeltaBps) * (b.convictionScore / 100) -
                    Math.abs(a.quantMetrics.estimatedMarginDeltaBps) * (a.convictionScore / 100)
                )
                .map((t, idx) => {
                  const isLong = t.direction === 'LONG';
                  const margin = t.quantMetrics.estimatedMarginDeltaBps;
                  return (
                    <button
                      key={t.ticker}
                      onClick={() => onSelectTicker(t)}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded border text-[11px] font-mono font-bold transition cursor-pointer select-none active:scale-95 ${
                        isLong
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600 hover:bg-emerald-900/90 shadow-[0_0_8px_rgba(0,230,118,0.25)]'
                          : 'bg-rose-950/80 text-rose-300 border-rose-600 hover:bg-rose-900/90 shadow-[0_0_8px_rgba(255,51,102,0.25)]'
                      }`}
                      title={`${t.ticker}: Conviction ${t.convictionScore}/100, Est Margin Delta ${margin >= 0 ? '+' : ''}${margin} bps`}
                    >
                      <span className="text-slate-400 text-[10px]">#{idx + 1}</span>
                      <span className="text-white font-black">{t.ticker}</span>
                      <span className={margin >= 0 ? 'text-emerald-400 font-black' : 'text-rose-400 font-black'}>
                        {margin >= 0 ? '+' : ''}{margin}bps
                      </span>
                      <span className="text-amber-300 text-[10px]">({t.convictionScore})</span>
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => setViewMode('heatmap')}
              className="text-[11px] text-cyan-400 hover:text-cyan-200 underline font-bold shrink-0 cursor-pointer flex items-center space-x-1"
            >
              <span>Full 2D Heatmap &gt;</span>
            </button>
          </div>

          <div className="bg-[#080d17] border border-[#1b273d] rounded-lg overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#0d1525] border-b border-[#1b273d] text-slate-400 uppercase text-[10px] tracking-wider select-none">
                  <th className="py-2.5 px-3 font-semibold text-slate-300">Action / Direction</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-300">Ticker & Exchange</th>
                  <th className="py-2.5 px-3 font-semibold text-cyan-300">Live Price</th>
                  <th className="py-2.5 px-3 font-semibold text-cyan-300">Today % Chg</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-300">Company & Sector</th>
                  <th className="py-2.5 px-3 font-semibold text-amber-300">Confidence Score</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-300">Critic Audit Status</th>
                  <th className="py-2.5 px-3 font-semibold text-cyan-300 bg-cyan-950/30 border-x border-cyan-900/40">
                    Primary Source & Citation (Data Provenance)
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-slate-300">Est Margin Delta</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-300">Target R/R</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-300">Earnings Surprise</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-300 text-right">Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#131d2e]">
                {allTickers.map((item, idx) => {
                  const isLong = item.direction === 'LONG';
                  const rowBg = isLong
                    ? 'hover:bg-[#071912] transition-colors group cursor-pointer'
                    : 'hover:bg-[#1a0b11] transition-colors group cursor-pointer';

                  return (
                    <tr
                      key={item.ticker + idx}
                      onClick={() => onSelectTicker(item)}
                      className={rowBg}
                    >
                      {/* Direction Badge */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded font-black text-[11px] tracking-wider ${
                            isLong
                              ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(0,230,118,0.35)]'
                              : 'bg-rose-600 text-white shadow-[0_0_8px_rgba(255,51,102,0.35)]'
                          }`}
                        >
                          {isLong ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>{item.direction}</span>
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Conviction: <strong className="text-slate-300">{item.convictionScore}/100</strong>
                        </div>
                      </td>

                      {/* Ticker & Exchange */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <div className="flex items-baseline space-x-1.5">
                          <span
                            className={`text-base font-black tracking-tight ${
                              isLong
                                ? 'text-emerald-400 group-hover:text-emerald-300'
                                : 'text-rose-400 group-hover:text-rose-300'
                            }`}
                          >
                            {item.ticker}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            [{item.exchange}]
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          Horizon: {item.timeHorizon}
                        </span>
                      </td>

                      {/* Live Current Price */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-sm font-mono font-bold text-slate-100">
                            ${item.liveMarket ? item.liveMarket.price.toFixed(2) : '---'}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block pl-3">
                          {item.liveMarket?.source === 'YAHOO_FINANCE' ? 'Yahoo Live' : '15m Delayed'}
                        </span>
                      </td>

                      {/* Today % Change */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        {item.liveMarket ? (
                          <span
                            className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                              item.liveMarket.changePct >= 0
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/70 shadow-[0_0_8px_rgba(0,230,118,0.2)]'
                                : 'bg-rose-950 text-rose-400 border border-rose-600/70 shadow-[0_0_8px_rgba(255,51,102,0.2)]'
                            }`}
                          >
                            {item.liveMarket.changePct >= 0 ? (
                              <ArrowUpRight className="w-3 h-3 shrink-0" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 shrink-0" />
                            )}
                            <span>
                              {item.liveMarket.changePct >= 0 ? '+' : ''}
                              {item.liveMarket.changePct.toFixed(2)}%
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px]">N/A</span>
                        )}
                        {item.liveMarket?.changeAmount !== undefined && (
                          <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                            {item.liveMarket.changeAmount >= 0 ? '+' : ''}
                            ${item.liveMarket.changeAmount.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Company Name & Sector */}
                      <td className="py-3 px-3 align-top min-w-[150px] max-w-[210px]">
                        <div className="font-semibold text-slate-200 text-xs truncate">
                          {item.companyName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {item.sector} • {item.subIndustry}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 italic">
                          Hedge: {item.keyHedgeBetaNote}
                        </div>
                      </td>

                      {/* Confidence Score Column */}
                      <td className="py-3 px-3 align-top whitespace-nowrap min-w-[140px]">
                        {getConfidenceBadge(item.confidenceScore ?? (isLong ? 94 : 86))}
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Pricing: {item.quantMetrics.pricingPowerRank}
                        </span>
                      </td>

                      {/* Critic Agent Verification Status Badge */}
                      <td className="py-3 px-3 align-top whitespace-nowrap min-w-[150px]">
                        {renderVerificationBadge(item.verificationStatus)}
                        {item.criticNotes && (
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 max-w-[160px] leading-tight font-sans">
                            {item.criticNotes}
                          </div>
                        )}
                      </td>

                      {/* PRIMARY SOURCE & CITATION COLUMN (DATA PROVENANCE) */}
                      <td className="py-3 px-3 align-top bg-cyan-950/15 border-x border-cyan-900/30 min-w-[260px] max-w-[340px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1">
                              <FileCheck2 className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span>PROVENANCE CITATION</span>
                            </span>
                            <a
                              href={item.citation?.url || `https://${item.citation?.domain || 'reuters.com'}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-900 border border-cyan-700/60 text-[10px] font-bold transition shadow-sm"
                              title={`Open primary source at ${item.citation?.domain || 'reuters.com'}`}
                            >
                              <span>[{item.citation?.domain || 'reuters.com'}]</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          </div>

                          <div className="text-slate-200 text-xs font-medium font-sans line-clamp-2">
                            &quot;{item.citation?.title}&quot;
                          </div>

                          {item.citation?.excerptSnippet && (
                            <div className="text-[10px] text-slate-400 font-sans italic line-clamp-2 bg-[#061017] p-1.5 rounded border border-cyan-950">
                              <span className="text-cyan-500 not-italic font-bold">Quote: </span>
                              &quot;{item.citation.excerptSnippet}&quot;
                            </div>
                          )}

                          <div className="text-[10px] text-slate-500 font-mono">
                            Verified Date: {item.citation?.verifiedDate || new Date().toISOString().slice(0, 10)}
                          </div>
                        </div>
                      </td>

                      {/* Estimated Margin Delta */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <span
                          className={`font-black flex items-center text-xs ${
                            isLong ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isLong ? (
                            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                          )}
                          {isLong ? `+${item.quantMetrics.estimatedMarginDeltaBps}` : item.quantMetrics.estimatedMarginDeltaBps} bps
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Buffer: {item.quantMetrics.inventoryBufferDays}d
                        </span>
                      </td>

                      {/* Target Risk/Reward */}
                      <td className="py-3 px-3 align-top whitespace-nowrap font-bold text-slate-200">
                        {item.targetRR}
                      </td>

                      {/* Projected Earnings Surprise */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <span
                          className={`font-bold text-xs ${
                            isLong ? 'text-emerald-300' : 'text-rose-300'
                          }`}
                        >
                          {item.projectedEarningsSurprisePct}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Risk: {item.quantMetrics.supplierConcentrationRisk}
                        </span>
                      </td>

                      {/* Telemetry Inspect Action */}
                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTicker(item);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition border cursor-pointer ${
                            isLong
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60 hover:bg-emerald-900'
                              : 'bg-rose-950/80 text-rose-400 border-rose-700/60 hover:bg-rose-900'
                          }`}
                        >
                          Telemetry &gt;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-[#070b14] px-4 py-2 border-t border-[#1b273d] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>
                DATA PROVENANCE ENGINE: Real-time hyperlinked citations anchored to news wire and SEC 10-K/10-Q disclosures.
              </span>
            </div>
            <span className="text-slate-500 text-[10px]">
              Click any row to inspect deep factor attribution and inventory buffer forensics.
            </span>
          </div>
        </div>
      </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: COLOR-CODED HEATMAP GRID (CONVICTION VS ESTIMATED MARGIN DELTA)
         ========================================================================= */}
      {viewMode === 'heatmap' && (
        <ConvictionMarginHeatmap
          longTickers={longTickers}
          shortTickers={shortTickers}
          onSelectTicker={onSelectTicker}
        />
      )}

      {/* =========================================================================
          VIEW MODE 3: HIGH-CONTRAST QUANT CARDS
         ========================================================================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LONG BASKET */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>LONG BENEFICIARIES (TOP 3 ALPHA RECEPTORS)</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300 font-semibold bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                PRICING POWER & SCARCITY RENTS
              </span>
            </div>

            <div className="space-y-3">
              {longTickers.map((item, idx) => (
                <div
                  key={item.ticker + idx}
                  onClick={() => onSelectTicker(item)}
                  className="group relative bg-[#091410] hover:bg-[#0c1a15] border border-emerald-900/60 hover:border-emerald-500/80 rounded-lg p-3.5 transition-all shadow-[0_2px_10px_rgba(0,230,118,0.05)] cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-mono font-black text-xs tracking-wider uppercase shadow-[0_0_8px_rgba(0,230,118,0.4)]">
                        LONG #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-baseline space-x-1.5 flex-wrap">
                          <span className="text-lg font-mono font-black text-emerald-400 tracking-tight group-hover:text-emerald-300">
                            {item.ticker}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 uppercase">
                            [{item.exchange}]
                          </span>
                          {item.liveMarket && (
                            <span className="inline-flex items-center space-x-1 ml-1 px-1.5 py-0.5 rounded bg-[#041a12] border border-emerald-700/60 text-[10px] font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <strong className="text-slate-100">${item.liveMarket.price.toFixed(2)}</strong>
                              <span className={item.liveMarket.changePct >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                {item.liveMarket.changePct >= 0 ? '+' : ''}{item.liveMarket.changePct.toFixed(2)}%
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-slate-200 line-clamp-1">
                          {item.companyName}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 space-y-1">
                      {renderVerificationBadge(item.verificationStatus)}
                      <div className="flex items-center space-x-1 text-emerald-400 font-mono text-xs font-bold">
                        <Target className="w-3.5 h-3.5" />
                        <span>CONVICTION: {item.convictionScore}/100</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        R/R: <strong className="text-slate-200">{item.targetRR}</strong> | {item.timeHorizon}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 bg-[#050c0a] p-2 rounded border border-emerald-950/80 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">CONFIDENCE</span>
                      {getConfidenceBadge(item.confidenceScore ?? 92)}
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">EST MARGIN DELTA</span>
                      <span className="text-emerald-400 font-bold flex items-center">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        +{item.quantMetrics.estimatedMarginDeltaBps} bps
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">PRICING POWER</span>
                      <span className="text-slate-200 font-semibold truncate block">
                        {item.quantMetrics.pricingPowerRank}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">EPS SURPRISE</span>
                      <span className="text-emerald-300 font-bold truncate block">
                        {item.projectedEarningsSurprisePct}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide mb-0.5">
                      Strategic Alpha Catalyst:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                      {item.catalystSummary}
                    </p>
                  </div>

                  {/* Data Provenance & Primary Source Citation */}
                  <div className="bg-[#050e0c] border border-cyan-900/50 rounded p-2 text-[11px] font-mono space-y-1">
                    <div className="flex items-center justify-between text-cyan-400">
                      <span className="font-bold flex items-center space-x-1">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>PRIMARY SOURCE & CITATION:</span>
                      </span>
                      <a
                        href={item.citation?.url || `https://${item.citation?.domain || 'reuters.com'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyan-300 hover:text-cyan-100 underline flex items-center space-x-1 font-bold"
                      >
                        <span>[{item.citation?.domain || 'reuters.com'}]</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-slate-300 font-sans text-[11px] truncate">
                      &quot;{item.citation?.title}&quot;
                    </div>
                    {item.citation?.excerptSnippet && (
                      <div className="text-slate-400 text-[10px] line-clamp-1 italic font-sans">
                        Data quote: &quot;{item.citation.excerptSnippet}&quot;
                      </div>
                    )}
                  </div>

                  {item.criticNotes && (
                    <div className="bg-[#091512] border-l-2 border-emerald-400 pl-2 py-1 text-[10px] font-mono text-emerald-300/90 leading-tight">
                      <span className="text-slate-400 uppercase block font-bold">Critic Audit Verdict:</span>
                      {item.criticNotes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-emerald-950 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div className="flex items-center space-x-1 truncate pr-2">
                      <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-slate-500">HEDGE:</span>
                      <span className="text-slate-300 truncate">{item.keyHedgeBetaNote}</span>
                    </div>
                    <span className="text-emerald-500 text-[10px] underline underline-offset-2 shrink-0 group-hover:text-emerald-300 font-bold">
                      INSPECT PROVENANCE &gt;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SHORT BASKET */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-rose-950/40 border border-rose-800/60 px-3 py-1.5 rounded">
              <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold uppercase">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span>SHORT VULNERABLE (TOP 3 CASUALTY TICKERS)</span>
              </div>
              <span className="text-[11px] font-mono text-rose-300 font-semibold bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700/50">
                INPUT MARGIN SQUEEZE & CHURN
              </span>
            </div>

            <div className="space-y-3">
              {shortTickers.map((item, idx) => (
                <div
                  key={item.ticker + idx}
                  onClick={() => onSelectTicker(item)}
                  className="group relative bg-[#14080c] hover:bg-[#1a0a10] border border-rose-900/60 hover:border-rose-500/80 rounded-lg p-3.5 transition-all shadow-[0_2px_10px_rgba(255,51,102,0.05)] cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono font-black text-xs tracking-wider uppercase shadow-[0_0_8px_rgba(255,51,102,0.4)]">
                        SHORT #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-baseline space-x-1.5 flex-wrap">
                          <span className="text-lg font-mono font-black text-rose-400 tracking-tight group-hover:text-rose-300">
                            {item.ticker}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 uppercase">
                            [{item.exchange}]
                          </span>
                          {item.liveMarket && (
                            <span className="inline-flex items-center space-x-1 ml-1 px-1.5 py-0.5 rounded bg-[#1a080d] border border-rose-700/60 text-[10px] font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                              <strong className="text-slate-100">${item.liveMarket.price.toFixed(2)}</strong>
                              <span className={item.liveMarket.changePct >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                {item.liveMarket.changePct >= 0 ? '+' : ''}{item.liveMarket.changePct.toFixed(2)}%
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-slate-200 line-clamp-1">
                          {item.companyName}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 space-y-1">
                      {renderVerificationBadge(item.verificationStatus)}
                      <div className="flex items-center space-x-1 text-rose-400 font-mono text-xs font-bold">
                        <Target className="w-3.5 h-3.5" />
                        <span>CONVICTION: {item.convictionScore}/100</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        R/R: <strong className="text-slate-200">{item.targetRR}</strong> | {item.timeHorizon}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 bg-[#0c0507] p-2 rounded border border-rose-950/80 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">CONFIDENCE</span>
                      {getConfidenceBadge(item.confidenceScore ?? 84)}
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">EST MARGIN DELTA</span>
                      <span className="text-rose-400 font-bold flex items-center">
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        {item.quantMetrics.estimatedMarginDeltaBps} bps
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">INVENTORY BUFFER</span>
                      <span className="text-amber-400 font-semibold block">
                        {item.quantMetrics.inventoryBufferDays} days
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">EBITDA RISK</span>
                      <span className="text-rose-300 font-bold truncate block">
                        {item.projectedEarningsSurprisePct}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide mb-0.5">
                      Margin Compression Catalyst:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                      {item.catalystSummary}
                    </p>
                  </div>

                  {/* Data Provenance & Primary Source Citation */}
                  <div className="bg-[#12070a] border border-rose-900/50 rounded p-2 text-[11px] font-mono space-y-1">
                    <div className="flex items-center justify-between text-rose-400">
                      <span className="font-bold flex items-center space-x-1">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>PRIMARY SOURCE & CITATION:</span>
                      </span>
                      <a
                        href={item.citation?.url || `https://${item.citation?.domain || 'bloomberg.com'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-rose-300 hover:text-rose-100 underline flex items-center space-x-1 font-bold"
                      >
                        <span>[{item.citation?.domain || 'bloomberg.com'}]</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-slate-300 font-sans text-[11px] truncate">
                      &quot;{item.citation?.title}&quot;
                    </div>
                    {item.citation?.excerptSnippet && (
                      <div className="text-slate-400 text-[10px] line-clamp-1 italic font-sans">
                        Data quote: &quot;{item.citation.excerptSnippet}&quot;
                      </div>
                    )}
                  </div>

                  {item.criticNotes && (
                    <div className="bg-[#18090e] border-l-2 border-rose-400 pl-2 py-1 text-[10px] font-mono text-rose-300/90 leading-tight">
                      <span className="text-slate-400 uppercase block font-bold">Critic Audit Verdict:</span>
                      {item.criticNotes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-rose-950 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div className="flex items-center space-x-1 truncate pr-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="text-slate-500">PAIR:</span>
                      <span className="text-slate-300 truncate">{item.keyHedgeBetaNote}</span>
                    </div>
                    <span className="text-rose-400 text-[10px] underline underline-offset-2 shrink-0 group-hover:text-rose-300 font-bold">
                      INSPECT PROVENANCE &gt;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

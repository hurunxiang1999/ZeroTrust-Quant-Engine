/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Flame,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { ActionableTicker } from '../types/alpha';

interface ConvictionMarginHeatmapProps {
  longTickers: ActionableTicker[];
  shortTickers: ActionableTicker[];
  onSelectTicker: (ticker: ActionableTicker) => void;
}

type SortOption = 'RANK' | 'CONVICTION' | 'MARGIN_DELTA' | 'DIRECTION';

export const ConvictionMarginHeatmap: React.FC<ConvictionMarginHeatmapProps> = ({
  longTickers,
  shortTickers,
  onSelectTicker,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('RANK');
  const [hoveredTicker, setHoveredTicker] = useState<string | null>(null);

  const allTickers = [
    ...longTickers.map((t) => ({ ...t, direction: 'LONG' as const })),
    ...shortTickers.map((t) => ({ ...t, direction: 'SHORT' as const })),
  ];

  // Calculate composite alpha rank score: higher conviction and higher absolute margin impact = higher rank
  const scoredTickers = allTickers.map((ticker) => {
    const margin = ticker.quantMetrics.estimatedMarginDeltaBps;
    const absMargin = Math.abs(margin);
    const conviction = ticker.convictionScore;
    // Composite ranking score: higher magnitude of margin shift * conviction weighting
    const alphaScore = (absMargin / 10) * (conviction / 100);

    return {
      ...ticker,
      absMargin,
      alphaScore,
    };
  });

  // Sort based on user selection
  const sortedTickers = [...scoredTickers].sort((a, b) => {
    if (sortBy === 'CONVICTION') {
      return b.convictionScore - a.convictionScore;
    }
    if (sortBy === 'MARGIN_DELTA') {
      return b.quantMetrics.estimatedMarginDeltaBps - a.quantMetrics.estimatedMarginDeltaBps;
    }
    if (sortBy === 'DIRECTION') {
      if (a.direction !== b.direction) {
        return a.direction === 'LONG' ? -1 : 1;
      }
      return b.convictionScore - a.convictionScore;
    }
    // Default 'RANK'
    return b.alphaScore - a.alphaScore;
  });

  // Calculate heatmap color intensity
  const getHeatmapColorClass = (direction: 'LONG' | 'SHORT', conviction: number, marginDelta: number) => {
    if (direction === 'LONG') {
      if (conviction >= 90 && marginDelta >= 450) {
        return {
          bg: 'bg-emerald-950/90 hover:bg-emerald-900/90',
          border: 'border-emerald-400 shadow-[0_0_15px_rgba(0,230,118,0.35)]',
          badgeBg: 'bg-emerald-500 text-black',
          glow: 'from-emerald-500/20 to-transparent',
          accent: 'text-emerald-300',
        };
      }
      if (conviction >= 85 || marginDelta >= 300) {
        return {
          bg: 'bg-emerald-950/70 hover:bg-emerald-900/80',
          border: 'border-emerald-600/80 shadow-[0_0_10px_rgba(0,230,118,0.2)]',
          badgeBg: 'bg-emerald-600 text-white',
          glow: 'from-emerald-600/15 to-transparent',
          accent: 'text-emerald-400',
        };
      }
      return {
        bg: 'bg-[#091b14] hover:bg-[#0c241b]',
        border: 'border-emerald-700/60',
        badgeBg: 'bg-emerald-700 text-white',
        glow: 'from-emerald-700/10 to-transparent',
        accent: 'text-emerald-400',
      };
    } else {
      // SHORT
      const absDelta = Math.abs(marginDelta);
      if (conviction >= 85 && absDelta >= 350) {
        return {
          bg: 'bg-rose-950/90 hover:bg-rose-900/90',
          border: 'border-rose-400 shadow-[0_0_15px_rgba(255,51,102,0.35)]',
          badgeBg: 'bg-rose-600 text-white',
          glow: 'from-rose-500/20 to-transparent',
          accent: 'text-rose-300',
        };
      }
      if (conviction >= 80 || absDelta >= 280) {
        return {
          bg: 'bg-rose-950/70 hover:bg-rose-900/80',
          border: 'border-rose-600/80 shadow-[0_0_10px_rgba(255,51,102,0.2)]',
          badgeBg: 'bg-rose-700 text-white',
          glow: 'from-rose-600/15 to-transparent',
          accent: 'text-rose-400',
        };
      }
      return {
        bg: 'bg-[#1b0a11] hover:bg-[#250d17]',
        border: 'border-rose-700/60',
        badgeBg: 'bg-rose-800 text-white',
        glow: 'from-rose-700/10 to-transparent',
        accent: 'text-rose-400',
      };
    }
  };

  // Find min/max for scale calibration
  const maxMargin = Math.max(...allTickers.map((t) => t.quantMetrics.estimatedMarginDeltaBps), 500);
  const minMargin = Math.min(...allTickers.map((t) => t.quantMetrics.estimatedMarginDeltaBps), -500);
  const totalMarginRange = maxMargin - minMargin || 1000;

  return (
    <div className="space-y-4 font-mono">
      {/* Heatmap Control & Legend Bar */}
      <div className="bg-[#090e1a] border border-[#1b263b] rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>HEATMAP MATRIX: CONVICTION SCORE VS. ESTIMATED MARGIN DELTA</span>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-slate-400 text-[11px]">
            Visual Cross-Ranking of All 6 Physical Event Alpha Tickers
          </span>
        </div>

        {/* Sort Switcher */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-slate-400 text-[11px] flex items-center space-x-1">
            <SlidersHorizontal className="w-3 h-3 text-slate-500" />
            <span>Sort Matrix:</span>
          </span>
          <div className="flex items-center bg-[#060a12] border border-[#1c283f] rounded p-0.5 text-[11px]">
            <button
              onClick={() => setSortBy('RANK')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                sortBy === 'RANK'
                  ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Alpha Rank
            </button>
            <button
              onClick={() => setSortBy('CONVICTION')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                sortBy === 'CONVICTION'
                  ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Conviction
            </button>
            <button
              onClick={() => setSortBy('MARGIN_DELTA')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                sortBy === 'MARGIN_DELTA'
                  ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Margin Delta
            </button>
            <button
              onClick={() => setSortBy('DIRECTION')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                sortBy === 'DIRECTION'
                  ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              L/S Grouped
            </button>
          </div>
        </div>
      </div>

      {/* Primary Color-Coded Heatmap Grid (Visual Ranking Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sortedTickers.map((item, idx) => {
          const isLong = item.direction === 'LONG';
          const marginDelta = item.quantMetrics.estimatedMarginDeltaBps;
          const styling = getHeatmapColorClass(item.direction, item.convictionScore, marginDelta);
          const isHovered = hoveredTicker === item.ticker;

          return (
            <div
              key={item.ticker}
              onClick={() => onSelectTicker(item)}
              onMouseEnter={() => setHoveredTicker(item.ticker)}
              onMouseLeave={() => setHoveredTicker(null)}
              className={`relative rounded-lg p-3.5 border transition-all duration-200 cursor-pointer overflow-hidden ${
                styling.bg
              } ${styling.border} ${isHovered ? 'scale-[1.02]' : ''}`}
            >
              {/* Radial glow background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${styling.glow} opacity-60 pointer-events-none`}
              />

              {/* Top Row: Rank Badge & Direction & Ticker */}
              <div className="relative z-10 flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-black/60 border border-white/20 text-white font-black text-xs shadow-inner">
                    #{idx + 1}
                  </span>
                  <span
                    className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${styling.badgeBg}`}
                  >
                    {isLong ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{item.direction}</span>
                  </span>
                  <span className="text-base font-black tracking-tight text-white font-mono">
                    {item.ticker}
                  </span>
                </div>

                {/* Live Price Tag from Yahoo API */}
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-end space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>${item.liveMarket ? item.liveMarket.price.toFixed(2) : '---'}</span>
                  </div>
                  {item.liveMarket?.changePct !== undefined && (
                    <span
                      className={`text-[10px] font-bold ${
                        item.liveMarket.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.liveMarket.changePct >= 0 ? '+' : ''}
                      {item.liveMarket.changePct.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Company & Sector */}
              <div className="relative z-10 mt-2">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {item.companyName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {item.sector} • {item.subIndustry}
                </div>
              </div>

              {/* Key Visual Metrics: Conviction vs Margin Delta */}
              <div className="relative z-10 mt-3 pt-2.5 border-t border-white/10 space-y-2">
                {/* 1. Conviction Score Visual Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Target className="w-3 h-3 text-amber-400" />
                      <span>Conviction Score:</span>
                    </span>
                    <strong className="text-amber-300 font-bold text-xs">
                      {item.convictionScore}/100
                    </strong>
                  </div>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLong
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                          : 'bg-gradient-to-r from-rose-600 to-rose-400'
                      }`}
                      style={{ width: `${item.convictionScore}%` }}
                    />
                  </div>
                </div>

                {/* 2. Estimated Margin Delta (bps) Meter */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Compass className="w-3 h-3 text-cyan-400" />
                      <span>Est Margin Delta:</span>
                    </span>
                    <strong
                      className={`font-black text-sm ${
                        marginDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      {marginDelta >= 0 ? '+' : ''}
                      {marginDelta} bps
                    </strong>
                  </div>

                  {/* Relative Margin Divergence Visual Bar (-500 to +600 bps) */}
                  <div className="flex items-center h-2 bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
                    {/* Center zero line marker */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-500 z-20" />

                    {marginDelta >= 0 ? (
                      <div
                        className="h-full bg-emerald-400 ml-[50%] rounded-r transition-all duration-500 shadow-[0_0_8px_rgba(0,230,118,0.5)]"
                        style={{
                          width: `${Math.min(50, (marginDelta / maxMargin) * 50)}%`,
                        }}
                      />
                    ) : (
                      <div
                        className="h-full bg-rose-500 ml-auto rounded-l transition-all duration-500 shadow-[0_0_8px_rgba(255,51,102,0.5)]"
                        style={{
                          width: `${Math.min(50, (Math.abs(marginDelta) / Math.abs(minMargin)) * 50)}%`,
                          marginRight: '50%',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Footer: Target R/R & Alpha Driver Snippet */}
              <div className="relative z-10 mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate max-w-[170px]" title={item.quantMetrics.pricingPowerRank}>
                  {item.quantMetrics.pricingPowerRank}
                </span>
                <span className="text-slate-300 font-bold bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                  R/R {item.targetRR}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2D Heatmap Quadrant Matrix (Visual Scatter Graph of Conviction vs Margin) */}
      <div className="bg-[#070b14] border border-[#1b263b] rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#162136] pb-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded bg-cyan-400 animate-pulse" />
            <h3 className="font-bold text-slate-200 uppercase tracking-wider">
              2D Conviction vs. Margin Delta Scatter Dispersion
            </h3>
          </div>
          <div className="flex items-center space-x-4 text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Margin Beneficiaries (Long Alpha)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Margin Compression Victims (Short Alpha)</span>
            </span>
          </div>
        </div>

        {/* 2D Coordinate Grid */}
        <div className="relative h-64 bg-[#050810] border border-[#151f33] rounded-lg overflow-hidden p-4">
          {/* Background Quadrant Tints */}
          {/* Top-Right: High Conviction Margin Expander */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-950/20 to-transparent pointer-events-none" />
          {/* Top-Left: High Conviction Margin Squeezer */}
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-rose-950/20 to-transparent pointer-events-none" />

          {/* Center Y-Axis (Zero Margin Delta Line) */}
          <div className="absolute left-1/2 top-4 bottom-8 w-[1px] bg-slate-700/80 z-10 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 -ml-3 bg-[#050810] px-1 -mt-2">0 bps</span>
          </div>

          {/* Center X-Axis Threshold */}
          <div className="absolute left-6 right-6 top-1/2 h-[1px] bg-slate-800/80 z-10" />

          {/* Axis Labels */}
          <div className="absolute left-3 top-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Conviction (100%)
          </div>
          <div className="absolute left-3 bottom-8 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Conviction (70%)
          </div>
          <div className="absolute left-6 bottom-2 text-[9px] font-bold text-rose-400 uppercase">
            ◄ Deep Margin Squeeze (-500 bps)
          </div>
          <div className="absolute right-6 bottom-2 text-[9px] font-bold text-emerald-400 uppercase">
            Max Margin Expansion (+600 bps) ►
          </div>

          {/* Render Plotted Ticker Bubbles */}
          {allTickers.map((item) => {
            const isLong = item.direction === 'LONG';
            const margin = item.quantMetrics.estimatedMarginDeltaBps;
            // X position: 0 bps is at 50%
            // Range from -600 to +600 bps
            const xPercent = Math.max(10, Math.min(90, 50 + (margin / 650) * 40));
            // Y position: Conviction from 70 to 98
            // 70% is at bottom (80%), 98% is at top (20%)
            const yPercent = Math.max(15, Math.min(80, 85 - ((item.convictionScore - 70) / 30) * 65));

            const isHovered = hoveredTicker === item.ticker;

            return (
              <div
                key={item.ticker}
                onClick={() => onSelectTicker(item)}
                onMouseEnter={() => setHoveredTicker(item.ticker)}
                onMouseLeave={() => setHoveredTicker(null)}
                style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200 cursor-pointer group ${
                  isHovered ? 'scale-125 z-30' : ''
                }`}
              >
                {/* Bubble Node */}
                <div
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border shadow-xl ${
                    isLong
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(0,230,118,0.4)]'
                      : 'bg-rose-950 text-rose-300 border-rose-500 shadow-[0_0_12px_rgba(255,51,102,0.4)]'
                  }`}
                >
                  <span className="font-black text-xs">{item.ticker}</span>
                  <span className="text-[10px] font-mono opacity-80">
                    {margin >= 0 ? '+' : ''}{margin}
                  </span>
                </div>

                {/* Floating Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-[#090e1a] border border-cyan-500/70 p-2 rounded text-[10px] whitespace-nowrap shadow-2xl z-40 pointer-events-none">
                  <div className="font-bold text-slate-100">{item.companyName}</div>
                  <div className="text-slate-400 mt-0.5">
                    Conviction: <strong className="text-amber-400">{item.convictionScore}/100</strong> | Delta: <strong className={margin >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{margin >= 0 ? '+' : ''}{margin} bps</strong>
                  </div>
                  <div className="text-cyan-400 mt-0.5">Click to inspect catalyst & filings</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

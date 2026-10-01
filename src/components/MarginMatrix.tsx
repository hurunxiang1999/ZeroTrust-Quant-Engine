/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Scale,
  Percent,
} from 'lucide-react';
import { MarginImpact } from '../types/alpha';

interface MarginMatrixProps {
  summary: string;
  squeezedIndustries: MarginImpact[];
  expandedIndustries: MarginImpact[];
}

export const MarginMatrix: React.FC<MarginMatrixProps> = ({
  summary,
  squeezedIndustries,
  expandedIndustries,
}) => {
  return (
    <div className="bg-[#0b0f19] border border-[#1b263b] rounded-lg p-4 space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#162136] pb-3">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs md:text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
            Margin Dynamics // Squeeze vs Expansion Matrix
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          INPUT COST ELASTICITY & PRICING POWER SPREAD
        </span>
      </div>

      {/* Synthesis Summary */}
      <div className="bg-[#070b14] border border-[#1a2538] rounded-md p-3 text-xs text-slate-300 leading-relaxed font-sans">
        <span className="font-mono font-bold text-amber-400 uppercase text-[11px] block mb-1">
          Gross Margin Bifurcation:
        </span>
        {summary}
      </div>

      {/* Two-Column Comparison: Margin Expanders vs Margin Squeezers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* =========================================================================
            MARGIN EXPANSION (WINNERS)
           ========================================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>MARGIN EXPANSION (PRICING POWER)</span>
            </span>
            <span className="text-emerald-300 font-semibold text-[11px]">NET BENEFIT</span>
          </div>

          <div className="space-y-2.5">
            {expandedIndustries.map((item, idx) => (
              <div
                key={item.industry + idx}
                className="bg-[#091510] border border-emerald-900/60 rounded-md p-3 space-y-2 text-xs transition hover:border-emerald-700/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-mono font-bold text-slate-100">{item.industry}</div>
                  <span className="shrink-0 font-mono font-bold text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +{Math.abs(item.projectedMarginDeltaBps)} bps
                  </span>
                </div>

                <div className="text-[11px] font-mono text-emerald-300/90 bg-[#050e0a] p-1.5 rounded border border-emerald-950">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Key Pricing Vector:</span>
                  {item.keyCostDriverOrPricingPower}
                </div>

                <p className="text-[11px] text-slate-300 leading-normal font-sans">
                  {item.strategicContext}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-emerald-950">
                  <span>Pass-Through Capacity:</span>
                  <span className="text-emerald-400 font-bold">{item.passThroughCapacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            MARGIN SQUEEZE (LOSERS)
           ========================================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between bg-rose-950/40 border border-rose-800/60 px-3 py-1.5 rounded text-xs font-mono">
            <span className="text-rose-400 font-bold flex items-center space-x-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>MARGIN SQUEEZE (INPUT COST SURGE)</span>
            </span>
            <span className="text-rose-300 font-semibold text-[11px]">NET CASUALTY</span>
          </div>

          <div className="space-y-2.5">
            {squeezedIndustries.map((item, idx) => (
              <div
                key={item.industry + idx}
                className="bg-[#14080c] border border-rose-900/60 rounded-md p-3 space-y-2 text-xs transition hover:border-rose-700/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-mono font-bold text-slate-100">{item.industry}</div>
                  <span className="shrink-0 font-mono font-bold text-rose-400 text-xs px-2 py-0.5 rounded bg-rose-950 border border-rose-800 flex items-center">
                    <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    -{Math.abs(item.projectedMarginDeltaBps)} bps
                  </span>
                </div>

                <div className="text-[11px] font-mono text-rose-300/90 bg-[#0d0507] p-1.5 rounded border border-rose-950">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Cost Squeeze Vector:</span>
                  {item.keyCostDriverOrPricingPower}
                </div>

                <p className="text-[11px] text-slate-300 leading-normal font-sans">
                  {item.strategicContext}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-rose-950">
                  <span>Pass-Through Capacity:</span>
                  <span className="text-rose-400 font-bold">{item.passThroughCapacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

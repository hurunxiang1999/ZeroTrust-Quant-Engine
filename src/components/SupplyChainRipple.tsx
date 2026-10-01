/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Network,
  AlertTriangle,
  Clock,
  ArrowRight,
  Anchor,
  Cpu,
  Truck,
  Building2,
  Store,
  Compass,
} from 'lucide-react';
import { SupplyChainNode } from '../types/alpha';

interface SupplyChainRippleProps {
  summary: string;
  propagationVelocity: string;
  stages: SupplyChainNode[];
}

export const SupplyChainRipple: React.FC<SupplyChainRippleProps> = ({
  summary,
  propagationVelocity,
  stages,
}) => {
  const getTierIcon = (tier: string) => {
    if (tier.includes('0') || tier.includes('Epicenter')) return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    if (tier.includes('1') || tier.includes('Upstream')) return <Anchor className="w-4 h-4 text-cyan-400" />;
    if (tier.includes('2') || tier.includes('Logistics')) return <Truck className="w-4 h-4 text-amber-400" />;
    if (tier.includes('3') || tier.includes('Midstream')) return <Cpu className="w-4 h-4 text-indigo-400" />;
    return <Store className="w-4 h-4 text-emerald-400" />;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/80';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
      case 'MODERATE':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-[#1b263b] rounded-lg p-4 space-y-4">
      {/* Title & Transmission Velocity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#162136] pb-3">
        <div className="flex items-center space-x-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs md:text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
            Supply Chain Ripple Forensics // Multi-Tier Disruption Topology
          </h2>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/60 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5" />
          <span>VELOCITY: {propagationVelocity || 'Immediate (24-48h)'}</span>
        </div>
      </div>

      {/* Ripple Summary */}
      <div className="bg-[#070b14] border border-[#1a2538] rounded-md p-3 text-xs text-slate-300 leading-relaxed font-sans">
        <span className="font-mono font-bold text-amber-400 uppercase text-[11px] block mb-1">
          Forensic Propagation Mechanism:
        </span>
        {summary}
      </div>

      {/* Multi-Tier Ripple Stage Flow */}
      <div className="space-y-3">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Sequential Stage Impact Flow (Tier 0 to Tier 4):</span>
          <span className="text-slate-500">Propagation Vector &gt;&gt;</span>
        </div>

        <div className="relative border-l-2 border-[#1f2d47] ml-3 pl-5 space-y-4">
          {stages.map((stage, idx) => (
            <div key={stage.title + idx} className="relative group">
              {/* Dot on timeline */}
              <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0d1424] border-2 border-cyan-500 group-hover:border-amber-400 transition" />

              <div className="bg-[#0e1422] hover:bg-[#121a2d] border border-[#1c2940] hover:border-[#2b3f63] rounded-lg p-3 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center space-x-2">
                    {getTierIcon(stage.tier)}
                    <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">
                      {stage.tier}
                    </span>
                    <span className="text-slate-600 font-mono hidden sm:inline">•</span>
                    <span className="text-xs font-semibold text-slate-100">
                      {stage.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-mono self-start sm:self-auto">
                    <span className={`px-2 py-0.5 rounded border font-bold ${getSeverityBadge(stage.severity)}`}>
                      {stage.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#162136] text-slate-300 border border-[#243350]">
                      {stage.propagationVelocity}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed font-sans">
                  {stage.disruptionMechanism}
                </p>

                {/* Chokepoints & Substitutability */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#172238] text-[10px] font-mono">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <span className="text-slate-500">CHOKEPOINTS:</span>
                    <div className="flex flex-wrap gap-1">
                      {stage.chokepoints.map((cp, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-1.5 py-0.5 rounded bg-[#182338] text-slate-200 border border-slate-700"
                        >
                          {cp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="ml-auto text-slate-400 flex items-center space-x-1">
                    <span className="text-slate-500">SUBSTITUTABILITY:</span>
                    <span
                      className={`font-semibold ${
                        stage.substitutabilityRating.includes('Zero') || stage.substitutabilityRating.includes('Low')
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {stage.substitutabilityRating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

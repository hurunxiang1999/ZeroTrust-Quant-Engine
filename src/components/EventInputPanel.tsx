/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  SlidersHorizontal,
  Compass,
  CornerDownLeft,
  Loader2,
  RefreshCw,
  Layers,
  History,
  ShieldCheck,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { CURATED_PRESETS, EventPreset } from '../data/curatedEvents';

interface EventInputPanelProps {
  onAnalyze: (event: string, horizon: 'tactical' | 'structural', depth: 'standard' | 'deep') => void;
  onRunAudit: () => void;
  isLoading: boolean;
  isAuditing: boolean;
  hasThesis: boolean;
  activeEvent: string;
  onOpenHistory: () => void;
  historyCount: number;
}

export const EventInputPanel: React.FC<EventInputPanelProps> = ({
  onAnalyze,
  onRunAudit,
  isLoading,
  isAuditing,
  hasThesis,
  activeEvent,
  onOpenHistory,
  historyCount,
}) => {
  const [eventInput, setEventInput] = useState<string>(activeEvent || '');
  const [horizon, setHorizon] = useState<'tactical' | 'structural'>('tactical');
  const [depth, setDepth] = useState<'standard' | 'deep'>('deep');
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [auditStepIndex, setAuditStepIndex] = useState(0);

  // Sync when activeEvent changes externally
  useEffect(() => {
    if (activeEvent && activeEvent !== eventInput) {
      setEventInput(activeEvent);
    }
  }, [activeEvent]);

  // Loading animation telemetry steps for synthesis
  useEffect(() => {
    if (!isLoading) {
      setScanStepIndex(0);
      return;
    }
    const steps = [
      'Ingesting physical macro event trigger...',
      'Mapping multi-tier global supply chain nodes...',
      'Cross-referencing real-time news wire manifests & customs records...',
      'Calculating empirical gross margin elasticity deltas...',
      'Synthesizing 3 Long / 3 Short asymmetric portfolio pairs...',
      'Calibrating beta hedges and factor attribution...',
    ];
    const timer = setInterval(() => {
      setScanStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [isLoading]);

  // Audit animation telemetry steps
  useEffect(() => {
    if (!isAuditing) {
      setAuditStepIndex(0);
      return;
    }
    const steps = [
      'Activating Zero-Trust Critic Agent...',
      'Cross-verifying primary citations against SEC 10-K & 10-Q disclosures...',
      'Evaluating inventory buffer claims and freight rate sensitivity...',
      'Checking data provenance and calculating empirical Confidence Scores...',
      'Classifying verification status: [Verified] / [Unconfirmed] / [Hallucination Risk]...',
    ];
    const timer = setInterval(() => {
      setAuditStepIndex((prev) => (prev + 1) % steps.length);
    }, 900);
    return () => clearInterval(timer);
  }, [isAuditing]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!eventInput.trim() || isLoading) return;
    onAnalyze(eventInput.trim(), horizon, depth);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectPreset = (preset: EventPreset) => {
    setEventInput(preset.fullPrompt);
  };

  const scanSteps = [
    'Ingesting physical macro event trigger...',
    'Mapping multi-tier global supply chain nodes...',
    'Cross-referencing real-time news wire manifests & customs records...',
    'Calculating empirical gross margin elasticity deltas...',
    'Synthesizing 3 Long / 3 Short asymmetric portfolio pairs...',
    'Calibrating beta hedges and factor attribution...',
  ];

  const auditSteps = [
    'Activating Zero-Trust Critic Agent...',
    'Cross-verifying primary citations against SEC 10-K & 10-Q disclosures...',
    'Evaluating inventory buffer claims and freight rate sensitivity...',
    'Checking data provenance and calculating empirical Confidence Scores...',
    'Classifying verification status: [Verified] / [Unconfirmed] / [Hallucination Risk]...',
  ];

  return (
    <div className="bg-[#0b0f19] border border-[#1d273b] rounded-lg p-4 shadow-lg space-y-3">
      {/* Strict Grounding UI Disclaimer Banner */}
      <div className="bg-[#071318] border border-cyan-500/40 rounded-md px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2 text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-cyan-200">ZERO-TRUST AUDIT PROTOCOL:</strong> All theses are generated via grounded web-search verification. Unverified claims are strictly filtered.
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold uppercase">
            STRICT GROUNDING ON
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#101b2d] text-slate-400 border border-slate-700">
            PROVENANCE L3
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <label
            htmlFor="event-trigger-input"
            className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5"
          >
            <span>Real-Time Macro/Geo-Political Event Trigger</span>
            <span className="text-slate-500 font-normal">| Bloomberg Command Prompt</span>
          </label>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          {historyCount > 0 && (
            <button
              onClick={onOpenHistory}
              className="flex items-center space-x-1 text-slate-400 hover:text-amber-400 transition cursor-pointer"
              title="View past generated theses"
            >
              <History className="w-3.5 h-3.5" />
              <span>THEORY ARCHIVE ({historyCount})</span>
            </button>
          )}

          <span className="text-slate-500">|</span>
          <span className="text-slate-400 text-[11px]">
            HOTKEY: <kbd className="px-1 py-0.5 bg-[#141b2d] rounded border border-slate-700 text-slate-300">Ctrl/Cmd + Enter</kbd>
          </span>
        </div>
      </div>

      {/* Prominent Prompt Text Area */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative rounded border border-[#23314d] focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/50 bg-[#070a12] transition">
          <div className="absolute top-2.5 left-3 text-amber-500 font-mono text-sm select-none font-bold">
            &gt;
          </div>
          <textarea
            id="event-trigger-input"
            rows={3}
            value={eventInput}
            onChange={(e) => setEventInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a physical world event (e.g. 'Port strike in Los Angeles', 'Lithium export ban in Chile', 'Unexpected cold winter in Europe')..."
            className="w-full pl-8 pr-4 pt-2.5 pb-2 bg-transparent text-slate-100 placeholder:text-slate-600 font-mono text-xs md:text-sm focus:outline-none resize-y min-h-[78px]"
          />
          <div className="px-3 py-1.5 border-t border-[#162136] bg-[#090d16] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-slate-500">
              {eventInput.length > 0 ? `${eventInput.length} chars` : 'Quant Macro Synthesizer v4.8'}
            </span>
            {eventInput && (
              <button
                type="button"
                onClick={() => setEventInput('')}
                className="text-slate-500 hover:text-slate-300 text-[10px] uppercase cursor-pointer"
              >
                Clear Input
              </button>
            )}
          </div>
        </div>

        {/* Quant Parameters & Presets */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          {/* Preset Buttons */}
          <div className="flex-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Institutional Macro Event Presets (Click to load):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CURATED_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded border transition flex items-center space-x-1.5 cursor-pointer ${
                    eventInput.includes(preset.title)
                      ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                      : 'bg-[#101726] border-[#1f2a3f] text-slate-300 hover:border-slate-500 hover:bg-[#151f33]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      preset.disruptionLevel === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-400'
                    }`}
                  />
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quant Controls & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end lg:self-center">
            {/* Horizon Filter */}
            <div className="flex items-center bg-[#070a12] border border-[#1f2a3f] rounded p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setHorizon('tactical')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  horizon === 'tactical'
                    ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tactical (1-3M)
              </button>
              <button
                type="button"
                onClick={() => setHorizon('structural')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  horizon === 'structural'
                    ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Structural (6-12M)
              </button>
            </div>

            {/* Depth Selector */}
            <div className="flex items-center bg-[#070a12] border border-[#1f2a3f] rounded p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setDepth('standard')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  depth === 'standard'
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tier-3 Standard
              </button>
              <button
                type="button"
                onClick={() => setDepth('deep')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  depth === 'deep'
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tier-4 Forensics
              </button>
            </div>

            {/* Red "Run AI Self-Audit" Button */}
            <button
              type="button"
              onClick={onRunAudit}
              disabled={isLoading || isAuditing || !hasThesis}
              className="px-3.5 py-2 rounded text-xs md:text-sm font-mono font-bold tracking-wide uppercase transition flex items-center space-x-1.5 border border-red-600 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Execute secondary Critic Agent zero-trust audit on current thesis"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>Run AI Self-Audit</span>
                </>
              )}
            </button>

            {/* Primary Generate Button */}
            <button
              type="submit"
              disabled={isLoading || isAuditing || !eventInput.trim()}
              className={`px-4 py-2 rounded text-xs md:text-sm font-mono font-bold tracking-wide uppercase transition flex items-center space-x-2 border shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isLoading
                  ? 'bg-[#152033] border-[#293b5c] text-amber-400'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Generate Alpha Thesis</span>
                  <CornerDownLeft className="w-3.5 h-3.5 opacity-70" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Synthesis Telemetry Banner */}
      {isLoading && (
        <div className="p-2.5 rounded bg-[#070b14] border border-amber-500/30 font-mono text-xs flex items-center justify-between text-amber-300 animate-pulse">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-400 font-bold">[QUANT SCANNER]:</span>
            <span className="text-slate-200">{scanSteps[scanStepIndex]}</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase">Gemini 3.8 Flash Quant Model</span>
        </div>
      )}

      {/* Critic Agent Audit Telemetry Banner */}
      {isAuditing && (
        <div className="p-2.5 rounded bg-[#18080c] border border-red-500/50 font-mono text-xs flex items-center justify-between text-red-200 animate-pulse">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-bold">[CRITIC AGENT AUDIT]:</span>
            <span className="text-slate-200">{auditSteps[auditStepIndex]}</span>
          </div>
          <span className="text-[10px] text-red-400 uppercase font-bold">Zero-Trust Fact-Checker</span>
        </div>
      )}
    </div>
  );
};

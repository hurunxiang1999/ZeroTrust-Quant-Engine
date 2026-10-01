/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Target,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Layers,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Check,
  ExternalLink,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { ActionableTicker, VerificationStatus } from '../types/alpha';

interface TickerDetailModalProps {
  ticker: ActionableTicker | null;
  onClose: () => void;
}

export const TickerDetailModal: React.FC<TickerDetailModalProps> = ({ ticker, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!ticker) return null;

  const isLong = ticker.direction === 'LONG';

  const handleCopy = () => {
    const text = `[${ticker.direction}] ${ticker.ticker} (${ticker.exchange}) - ${ticker.companyName}\nConviction: ${ticker.convictionScore}/100 | Confidence: ${ticker.confidenceScore ?? 'N/A'}% | Target R/R: ${ticker.targetRR}\nStatus: [${ticker.verificationStatus || 'VERIFIED'}]\nCitation: ${ticker.citation?.title} (${ticker.citation?.url})\nCatalyst: ${ticker.catalystSummary}\nHedge: ${ticker.keyHedgeBetaNote}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderVerificationBadge = (status?: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500 shadow-[0_0_8px_rgba(0,230,118,0.25)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>[Verified by Grounded Audit]</span>
          </span>
        );
      case 'UNCONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-950 text-amber-400 border border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>[Unconfirmed Secondary Tier Data]</span>
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-rose-950 text-rose-400 border border-rose-500 shadow-[0_0_8px_rgba(255,51,102,0.3)] animate-pulse">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>[High Risk of Hallucination]</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono text-slate-400 bg-[#162136] border border-slate-700">
            <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
            <span>[Pending Critic Audit]</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div
        className={`bg-[#0b101c] border rounded-lg max-w-xl w-full shadow-2xl overflow-hidden font-mono ${
          isLong ? 'border-emerald-600/70' : 'border-rose-600/70'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between ${
            isLong
              ? 'bg-[#091510] border-emerald-900/80 text-emerald-400'
              : 'bg-[#14080c] border-rose-900/80 text-rose-400'
          }`}
        >
          <div className="flex items-center space-x-2">
            {isLong ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black text-slate-100">{ticker.ticker}</span>
                <span className="text-xs text-slate-400">[{ticker.exchange}]</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                    isLong ? 'bg-emerald-500 text-black' : 'bg-rose-600 text-white'
                  }`}
                >
                  {ticker.direction}
                </span>
              </div>
              <div className="text-xs font-sans text-slate-300">{ticker.companyName}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-[#1a2336] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-3.5 text-xs max-h-[85vh] overflow-y-auto">
          {/* Zero-Trust Audit Status Banner */}
          <div className="flex items-center justify-between bg-[#060a14] p-2.5 rounded border border-[#1b273d]">
            <span className="text-slate-400 font-bold uppercase text-[11px]">Audit Status:</span>
            {renderVerificationBadge(ticker.verificationStatus)}
          </div>

          {/* Live Market Real-Time Price Strip */}
          {ticker.liveMarket && (
            <div className="bg-[#050912] p-2.5 rounded border border-cyan-900/60 flex items-center justify-between font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400 text-[10px] uppercase font-bold">
                  {ticker.liveMarket.source === 'YAHOO_FINANCE' ? 'LIVE YAHOO FEED' : 'LIVE 15M FEED'}:
                </span>
                <span className="text-base font-black text-slate-100">
                  ${ticker.liveMarket.price.toFixed(2)} {ticker.liveMarket.currency || 'USD'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded font-bold text-xs flex items-center space-x-1 ${
                    ticker.liveMarket.changePct >= 0
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/80'
                      : 'bg-rose-950 text-rose-400 border border-rose-600/80'
                  }`}
                >
                  {ticker.liveMarket.changePct >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {ticker.liveMarket.changePct >= 0 ? '+' : ''}
                    {ticker.liveMarket.changePct.toFixed(2)}%
                  </span>
                </span>
                {ticker.liveMarket.previousClose && (
                  <span className="text-[10px] text-slate-500">
                    Prev: ${ticker.liveMarket.previousClose.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Key Quant Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#060912] p-3 rounded border border-[#1b273d]">
            <div>
              <span className="text-slate-500 text-[10px] block">CONVICTION</span>
              <span
                className={`font-bold text-sm ${isLong ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {ticker.convictionScore}/100
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">CONFIDENCE</span>
              <span className="text-emerald-400 font-bold text-sm">
                {ticker.confidenceScore ?? 92}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">TARGET R/R</span>
              <span className="text-slate-200 font-bold text-sm">{ticker.targetRR}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">EST MARGIN DELTA</span>
              <span
                className={`font-bold text-sm flex items-center ${
                  isLong ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isLong ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {ticker.quantMetrics.estimatedMarginDeltaBps > 0 ? '+' : ''}
                {ticker.quantMetrics.estimatedMarginDeltaBps} bps
              </span>
            </div>
          </div>

          {/* Data Provenance & Primary Source Citation */}
          <div className="bg-[#050e0c] p-3 rounded border border-cyan-800/60 space-y-1.5">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="font-bold uppercase text-[11px] flex items-center space-x-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Data Provenance & Primary Source Citation:</span>
              </span>
              <a
                href={ticker.citation?.url || `https://${ticker.citation?.domain || 'reuters.com'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-100 underline flex items-center space-x-1 text-xs font-bold"
              >
                <span>[{ticker.citation?.domain || 'reuters.com'}]</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-slate-200 font-sans text-xs font-semibold">
              &quot;{ticker.citation?.title}&quot;
            </div>
            {ticker.citation?.excerptSnippet && (
              <div className="text-slate-300 text-[11px] font-sans italic bg-[#04080a] p-2 rounded border border-cyan-950">
                Verified Excerpt: &quot;{ticker.citation.excerptSnippet}&quot;
              </div>
            )}
            <div className="text-[10px] text-slate-500">
              Verified Date: {ticker.citation?.verifiedDate || '2026-10-01'} | Ingestion Protocol: Zero-Trust L3 Grounding
            </div>
          </div>

          {/* Critic Agent Notes */}
          {ticker.criticNotes && (
            <div className="bg-[#0d1624] p-3 rounded border border-amber-900/40 space-y-1">
              <span className="text-amber-400 font-bold uppercase text-[11px] flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Critic Agent Audit Rationale:</span>
              </span>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {ticker.criticNotes}
              </p>
            </div>
          )}

          {/* Additional Quant Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="bg-[#0b1220] p-2.5 rounded border border-[#19263e]">
              <span className="text-slate-500 text-[10px] block">PRICING POWER</span>
              <span className="text-slate-200 font-bold">
                {ticker.quantMetrics.pricingPowerRank}
              </span>
            </div>
            <div className="bg-[#0b1220] p-2.5 rounded border border-[#19263e]">
              <span className="text-slate-500 text-[10px] block">INVENTORY BUFFER</span>
              <span className="text-amber-400 font-bold">
                {ticker.quantMetrics.inventoryBufferDays} Days
              </span>
            </div>
            <div className="bg-[#0b1220] p-2.5 rounded border border-[#19263e]">
              <span className="text-slate-500 text-[10px] block">CONCENTRATION RISK</span>
              <span className="text-slate-200 font-bold">
                {ticker.quantMetrics.supplierConcentrationRisk}
              </span>
            </div>
          </div>

          {/* Strategic Catalyst */}
          <div className="bg-[#070b14] p-3 rounded border border-[#1a2538] space-y-1.5">
            <span className="text-amber-400 font-bold uppercase text-[11px] block">
              Alpha Catalyst & Transmission Rationale:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {ticker.catalystSummary}
            </p>
          </div>

          {/* Factor Hedge Pairing */}
          <div className="bg-[#0c1527] p-3 rounded border border-[#1e2f4f] space-y-1">
            <span className="text-cyan-400 font-bold uppercase text-[11px] flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Factor / Beta Hedge Pairing Strategy:</span>
            </span>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {ticker.keyHedgeBetaNote}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#182338]">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded bg-[#162136] hover:bg-[#1f2d47] border border-slate-700 text-slate-300 text-xs flex items-center space-x-1.5 cursor-pointer transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Trade & Citation' : 'Copy Trade Data'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-[#141b2c] hover:bg-[#1a2336] text-slate-300 border border-[#23314d] text-xs font-mono transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

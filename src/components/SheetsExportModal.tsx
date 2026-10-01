/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Layers,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
} from 'lucide-react';
import { AlphaThesisResponse } from '../types/alpha';
import { exportThesisToGoogleSheets, ExportResult } from '../services/sheetsExport';
import { googleSignIn } from '../services/firebaseAuth';

interface SheetsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  thesis: AlphaThesisResponse | null;
  user: User | null;
  accessToken: string | null;
  onAuthSuccess: (user: User, token: string) => void;
  onExportSuccess: (result: ExportResult) => void;
}

export const SheetsExportModal: React.FC<SheetsExportModalProps> = ({
  isOpen,
  onClose,
  thesis,
  user,
  accessToken,
  onAuthSuccess,
  onExportSuccess,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !thesis) return null;

  const dateFormatted = new Date(thesis.timestamp || Date.now()).toISOString().slice(0, 10);
  const prospectiveSheetTitle = `AlphaChain: ${thesis.eventTrigger.slice(0, 40)}... [${dateFormatted}]`;

  const handleConnectAndExport = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      let token = accessToken;
      if (!user || !token) {
        const signinRes = await googleSignIn();
        if (!signinRes) {
          throw new Error('Google Sign-In was cancelled or failed.');
        }
        onAuthSuccess(signinRes.user, signinRes.accessToken);
        token = signinRes.accessToken;
      }

      const result = await exportThesisToGoogleSheets(thesis, token);
      setExportResult(result);
      onExportSuccess(result);
    } catch (err: any) {
      console.error('Export to Google Sheets error:', err);
      setExportError(err.message || 'Failed to export thesis to Google Sheets.');
    } finally {
      setIsExporting(false);
    }
  };

  const copyUrl = () => {
    if (exportResult?.spreadsheetUrl) {
      navigator.clipboard.writeText(exportResult.spreadsheetUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b101d] border border-[#23314d] rounded-lg max-w-lg w-full shadow-2xl overflow-hidden font-mono">
        {/* Modal Header */}
        <div className="bg-[#0e1628] px-4 py-3 border-b border-[#1c2942] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              Export Thesis to Google Sheets
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-[#1a2336] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 text-xs">
          {exportResult ? (
            /* Export Complete State */
            <div className="space-y-4">
              <div className="p-3 rounded bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-emerald-300">
                    Export Successful!
                  </div>
                  <p className="text-[11px] text-emerald-200 mt-1">
                    Your quantitative Long/Short pairs, supply chain forensics, and execution rules have been created in Google Sheets.
                  </p>
                </div>
              </div>

              <div className="bg-[#070b14] border border-[#1a2538] rounded p-3 space-y-2 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>SPREADSHEET TITLE:</span>
                  <span className="text-slate-200 font-bold truncate max-w-[260px]">
                    {exportResult.title}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SPREADSHEET ID:</span>
                  <span className="text-slate-400 font-mono">{exportResult.spreadsheetId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>TABS CREATED:</span>
                  <span className="text-emerald-400 font-bold">2 Tabs (Alpha Pairs + Supply Chain)</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <a
                  href={exportResult.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center justify-center space-x-2 transition shadow-[0_0_12px_rgba(0,230,118,0.3)] active:scale-95"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>OPEN IN GOOGLE SHEETS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={copyUrl}
                  className="py-2.5 px-3 rounded bg-[#162136] hover:bg-[#1f2d47] border border-slate-700 text-slate-300 transition flex items-center space-x-1 cursor-pointer"
                  title="Copy link to clipboard"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            /* Explicit Confirmation Dialog (Mandatory per Workspace Skill) */
            <div className="space-y-3.5">
              <div className="bg-[#070b14] border border-[#1a263d] rounded p-3 space-y-2">
                <div className="text-slate-400 text-[11px] uppercase tracking-wide">
                  Target Operation:
                </div>
                <div className="text-slate-200 font-semibold text-xs leading-relaxed">
                  Create a new execution spreadsheet in your Google Drive titled:
                </div>
                <div className="text-amber-400 bg-[#0c1220] p-2 rounded border border-amber-900/40 text-[11px] break-words font-mono">
                  {prospectiveSheetTitle}
                </div>
              </div>

              {/* Data Items to be Exported */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-400 uppercase">
                  Data payload to be transmitted:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#07130e] border border-emerald-900/60 p-2 rounded">
                    <span className="text-emerald-400 font-bold block flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" /> 3 LONG BENEFICIARIES
                    </span>
                    <span className="text-slate-300">
                      {thesis.longTickers.map((t) => t.ticker).join(', ')}
                    </span>
                  </div>
                  <div className="bg-[#14080c] border border-rose-900/60 p-2 rounded">
                    <span className="text-rose-400 font-bold block flex items-center">
                      <TrendingDown className="w-3 h-3 mr-1" /> 3 SHORT VULNERABLE
                    </span>
                    <span className="text-slate-300">
                      {thesis.shortTickers.map((t) => t.ticker).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="bg-[#0d1424] border border-[#1b273d] p-2 rounded text-[11px] text-slate-300 space-y-1">
                  <div>
                    • <strong>Tab 1:</strong> Alpha Pairs & Execution (Tickers, Conviction, R/R, Target Margins, Catalysts, Beta Hedging)
                  </div>
                  <div>
                    • <strong>Tab 2:</strong> Supply Chain & Margin Dynamics ({thesis.rippleStages.length} Disruption Tiers, Margin Squeeze/Expansion bps, Macro Regime)
                  </div>
                </div>
              </div>

              {/* Authentication Status indicator */}
              <div className="p-2.5 rounded bg-[#0e1628] border border-[#1e2c47] text-[11px] flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user && accessToken ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {user && accessToken
                      ? `Account: ${user.email}`
                      : 'Google authorization required on confirm'}
                  </span>
                </div>
                {user && <span className="text-emerald-400 font-bold">READY</span>}
              </div>

              {exportError && (
                <div className="p-2.5 rounded bg-rose-950/70 border border-rose-800 text-rose-300 text-[11px] flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{exportError}</span>
                </div>
              )}

              {/* Explicit Confirmation Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#182338]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isExporting}
                  className="px-3.5 py-2 rounded bg-[#141b2c] hover:bg-[#1a2336] text-slate-300 border border-[#23314d] text-xs font-mono transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConnectAndExport}
                  disabled={isExporting}
                  className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs font-mono transition flex items-center space-x-1.5 shadow-[0_0_12px_rgba(0,230,118,0.25)] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Spreadsheet...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Confirm & Export to Sheets</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

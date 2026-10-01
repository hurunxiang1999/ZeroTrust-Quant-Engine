/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Terminal,
  Activity,
  Clock,
  ShieldCheck,
  LogOut,
  FileSpreadsheet,
  Globe,
  Radio,
  RefreshCw,
  Zap,
  Code2,
} from 'lucide-react';
import { googleSignIn, logout } from '../services/firebaseAuth';
import { ApiConnectionStatus } from '../types/alpha';

interface HeaderProps {
  user: User | null;
  hasToken: boolean;
  onAuthChange: (user: User | null, token: string | null) => void;
  onOpenExportModal: () => void;
  hasActiveThesis: boolean;
  apiConnectionStatus?: ApiConnectionStatus;
  lastSyncTime?: string;
  onLiveSync?: () => void;
  isLiveSyncing?: boolean;
  isAuditMode?: boolean;
  onToggleAuditMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  hasToken,
  onAuthChange,
  onOpenExportModal,
  hasActiveThesis,
  apiConnectionStatus = 'CONNECTED',
  lastSyncTime,
  onLiveSync,
  isLiveSyncing = false,
  isAuditMode = false,
  onToggleAuditMode,
}) => {
  const [timeUtc, setTimeUtc] = useState<string>('');
  const [timeEst, setTimeEst] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeUtc(
        now.toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
      setTimeEst(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' NYC'
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      const res = await googleSignIn();
      if (res) {
        onAuthChange(res.user, res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onAuthChange(null, null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="border-b border-[#1f293d] bg-[#090d16] select-none sticky top-0 z-40">
      {/* Top Bloomberg Market Ticker Tape */}
      <div className="bg-[#05080f] px-3 py-1 border-b border-[#151c2c] overflow-hidden flex items-center justify-between text-[11px] font-mono tracking-tight text-slate-400">
        <div className="flex items-center space-x-6 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ALPHACHAIN FEED</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>
              <strong className="text-slate-200">BCOM:</strong> 98.42 <span className="text-emerald-400">+1.24%</span>
            </span>
            <span>
              <strong className="text-slate-200">BDI (Baltic Dry):</strong> 1,842 <span className="text-emerald-400">+4.82%</span>
            </span>
            <span>
              <strong className="text-slate-200">SCFI Container:</strong> 2,140 <span className="text-emerald-400">+12.4%</span>
            </span>
            <span>
              <strong className="text-slate-200">WTI Crude:</strong> $78.45 <span className="text-emerald-400">+1.85%</span>
            </span>
            <span>
              <strong className="text-slate-200">US10Y:</strong> 4.28% <span className="text-amber-400">+3.1bps</span>
            </span>
            <span>
              <strong className="text-slate-200">VIX:</strong> 16.82 <span className="text-rose-400">-0.65</span>
            </span>
            <span>
              <strong className="text-slate-200">IYT Transport:</strong> 264.10 <span className="text-rose-400">-1.42%</span>
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-slate-400 shrink-0 pl-4 border-l border-[#1a2336]">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-500" />
            <span className="text-amber-400 font-semibold">{timeEst}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">{timeUtc}</span>
          </div>

          {/* Telemetry Status Indicator */}
          {apiConnectionStatus === 'CONNECTED' ? (
            <span className="inline-flex items-center space-x-1.5 text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-600/80 font-semibold shadow-[0_0_8px_rgba(0,230,118,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE API CONNECTED</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-600/80 font-semibold shadow-[0_0_8px_rgba(245,158,11,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>DEGRADED: FALLBACK TO HEURISTICS</span>
            </span>
          )}

          {/* Developer Audit Mode Indicator in tape */}
          {isAuditMode && (
            <span className="inline-flex items-center space-x-1.5 text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500 font-bold shadow-[0_0_10px_rgba(245,158,11,0.35)] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>DEV AUDIT ACTIVE</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Terminal Header Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(255,153,0,0.15)]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm md:text-base font-mono font-bold tracking-wider text-slate-100 uppercase">
                AlphaChain <span className="text-amber-400 font-black">//</span> Screener
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 bg-[#121927] text-slate-300 border border-[#23314d] rounded">
                ALT-DATA & SUPPLY CHAIN QUANT
              </span>
              <span className="hidden md:inline-flex items-center space-x-1 text-[10px] font-mono px-1.5 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 rounded">
                <ShieldCheck className="w-2.5 h-2.5 text-cyan-400" />
                <span>ZERO-TRUST AUDITED</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
              Institutional Physical Event Sourcing, Zero-Trust Fact-Checking & Asymmetric L/S Synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Developer Audit Mode Toggle Switch */}
          {onToggleAuditMode && (
            <button
              onClick={onToggleAuditMode}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition cursor-pointer select-none border ${
                isAuditMode
                  ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-[#0f172a] text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
              }`}
              title="Toggle Developer Audit & Raw Data Verification Mode"
            >
              <Code2 className={`w-3.5 h-3.5 ${isAuditMode ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">DEV AUDIT:</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono font-black ${
                  isAuditMode ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isAuditMode ? 'ON' : 'OFF'}
              </span>
            </button>
          )}

          {/* Live Sync Refresh Trigger Button */}
          {onLiveSync && (
            <button
              onClick={onLiveSync}
              disabled={isLiveSyncing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#0b1b24] hover:bg-[#0f2533] border border-cyan-500/60 text-cyan-300 hover:text-cyan-100 text-xs font-mono font-bold transition shadow-[0_0_10px_rgba(0,229,255,0.15)] active:scale-95 cursor-pointer disabled:opacity-60"
              title="Manually re-trigger live price and news feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLiveSyncing ? 'animate-spin' : ''}`} />
              <span>{isLiveSyncing ? 'SYNCING...' : 'LIVE SYNC'}</span>
              {lastSyncTime && (
                <span className="hidden lg:inline text-[10px] text-cyan-500 font-normal">
                  ({new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
                </span>
              )}
            </button>
          )}

          {/* Quick Export to Google Sheets button in header */}
          {hasActiveThesis && (
            <button
              onClick={onOpenExportModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-600/60 text-emerald-300 hover:text-emerald-100 text-xs font-mono font-medium transition shadow-sm active:scale-95 cursor-pointer"
              title="Export current thesis to Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXPORT TO SHEETS</span>
            </button>
          )}

          {/* Google Sign In / Account Status */}
          {user && hasToken ? (
            <div className="flex items-center space-x-2 bg-[#101726] border border-[#223048] rounded px-2.5 py-1 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-400" title="Connected to Google Workspace" />
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="w-5 h-5 rounded-full border border-slate-600"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                  {user.email ? user.email[0].toUpperCase() : 'G'}
                </div>
              )}
              <span className="text-slate-200 text-xs truncate max-w-[120px] sm:max-w-[180px]">
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-[#1a2336] transition"
                title="Disconnect Google account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Official Google Sign-In button per guidelines */
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="group flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded text-xs font-medium border border-slate-300 transition shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isSigningIn ? 'Connecting...' : 'Connect Google Sheets'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

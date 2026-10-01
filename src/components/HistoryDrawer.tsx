/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  History,
  FileSpreadsheet,
  ExternalLink,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import { AlphaThesisResponse } from '../types/alpha';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AlphaThesisResponse[];
  onSelectThesis: (thesis: AlphaThesisResponse) => void;
  onDeleteThesis: (id: string) => void;
  onClearAll: () => void;
  activeId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectThesis,
  onDeleteThesis,
  onClearAll,
  activeId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0a0e19] border-l border-[#1f2a3f] w-full max-w-md h-full flex flex-col shadow-2xl font-mono text-xs">
        {/* Header */}
        <div className="bg-[#0d1424] px-4 py-3 border-b border-[#1b273d] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400">
            <History className="w-4 h-4" />
            <h3 className="font-bold uppercase tracking-wider text-slate-100 text-xs">
              Quantitative Thesis Archive ({history.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-[#1a2336] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <History className="w-8 h-8 mx-auto opacity-40" />
              <p>No archived theses yet.</p>
              <p className="text-[11px] text-slate-600">
                Trigger any event to populate the quant archive.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const isActive = item.id === activeId;
              const dateStr = new Date(item.timestamp || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className={`border rounded-lg p-3 transition space-y-2 ${
                    isActive
                      ? 'bg-[#10182b] border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                      : 'bg-[#080c14] border-[#182338] hover:border-slate-600 hover:bg-[#0c121f]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                      <span className="text-amber-400 font-bold">{dateStr}</span>
                      <span>•</span>
                      <span className="truncate max-w-[140px] text-slate-500">{item.eventClassification}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteThesis(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition"
                      title="Delete from archive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div
                    onClick={() => {
                      onSelectThesis(item);
                      onClose();
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="text-xs font-semibold text-slate-200 line-clamp-2 group-hover:text-amber-400 transition font-sans">
                      {item.eventTrigger}
                    </div>

                    {/* Long / Short Tickers Preview */}
                    <div className="flex items-center space-x-2 mt-2 text-[10px]">
                      <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                        <TrendingUp className="w-3 h-3" />
                        <span>L:</span>
                        <span>{item.longTickers?.map((t) => t.ticker).join(', ') || 'N/A'}</span>
                      </div>
                      <span className="text-slate-600">|</span>
                      <div className="flex items-center space-x-1 text-rose-400 font-bold">
                        <TrendingDown className="w-3 h-3" />
                        <span>S:</span>
                        <span>{item.shortTickers?.map((t) => t.ticker).join(', ') || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Google Sheets Export Link if available */}
                  {item.googleSheetExportUrl && (
                    <div className="pt-2 border-t border-[#162136] flex items-center justify-between text-[10px]">
                      <a
                        href={item.googleSheetExportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition font-bold"
                      >
                        <FileSpreadsheet className="w-3 h-3" />
                        <span>View Google Sheet</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-slate-500">Exported</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-[#1b273d] bg-[#0d1424] flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-slate-400 hover:text-rose-400 text-xs flex items-center space-x-1 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Archive</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#162136] hover:bg-[#1f2d47] text-slate-200 text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

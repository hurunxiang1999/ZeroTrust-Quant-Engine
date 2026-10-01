/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  ChevronDown,
  BrainCircuit,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock,
  History,
  Trash2,
  X,
  Layers,
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../types/i18n';
import { agentMemory, AgentMemoryState, MacroEventMemoryItem } from '../services/agentMemory';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onSelectMemoryPrompt?: (event: string, horizon: 'tactical' | 'structural', depth: 'standard' | 'deep') => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  onSelectMemoryPrompt,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memoryState, setMemoryState] = useState<AgentMemoryState>(agentMemory.getState());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = agentMemory.subscribe((newState) => {
      setMemoryState(newState);
    });
    return unsub;
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentConfig = SUPPORTED_LANGUAGES[currentLanguage];
  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="flex items-center space-x-2 font-mono" ref={dropdownRef}>
      {/* 1. Bloomberg-Style Language Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-[#0a101d] hover:bg-[#121c32] border border-[#233554] text-slate-200 text-xs font-bold transition shadow-sm cursor-pointer select-none active:scale-95"
          title={`Select Language (Current: ${currentConfig.name})`}
        >
          <span className="text-sm leading-none">{currentConfig.flag}</span>
          <span className="text-amber-400 font-black">{currentConfig.code.toUpperCase()}</span>
          <span className="hidden xl:inline text-slate-400 text-[10px]">
            {currentConfig.nativeName}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180 text-amber-400' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#060a14] border border-amber-500/50 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.85)] z-50 overflow-hidden divide-y divide-[#152033] py-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 bg-[#090f1e] text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1 text-amber-300">
                <Globe className="w-3 h-3 text-amber-400" />
                <span>SEMANTIC QUANT i18n (UN 6 + 2)</span>
              </span>
              <span className="text-[9px] text-slate-500">8 DIALECTS</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-[#101827]">
              {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((langKey) => {
                const config = SUPPORTED_LANGUAGES[langKey];
                const isSelected = currentLanguage === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => {
                      onLanguageChange(langKey);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-start justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#0f1c30] text-amber-300 font-bold border-l-2 border-l-amber-500'
                        : 'text-slate-300 hover:bg-[#0c1424] hover:text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-base leading-none pt-0.5">{config.flag}</span>
                      <div>
                        <div className="flex items-center space-x-1.5 text-xs font-bold">
                          <span>{config.nativeName}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            ({config.code.toUpperCase()})
                          </span>
                          {config.dir === 'rtl' && (
                            <span className="px-1 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-600 text-[8px] font-black">
                              RTL
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                          {config.institutionalJargonStyle}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-2 bg-[#070b16] text-[10px] text-slate-400 font-sans flex items-center justify-between">
              <span className="text-slate-500">Gemini Semantic Quant Phrasing</span>
              <span className="text-amber-400 font-mono text-[9px]">Zero-Slop Institutional</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Persistent Agent Memory: Synced Status Badge */}
      <button
        onClick={() => setIsMemoryModalOpen(true)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-[#09151f] hover:bg-[#0e2130] border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold transition shadow-[0_0_8px_rgba(0,229,255,0.15)] cursor-pointer select-none group"
        title={t.agentMemoryTooltip}
      >
        <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span className="hidden md:inline">{t.agentMemorySynced}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
      </button>

      {/* 3. Agentic Memory State Inspector Modal */}
      {isMemoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-[#070b14] border border-cyan-500/60 rounded-xl max-w-xl w-full shadow-[0_0_30px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col font-mono text-xs">
            {/* Header */}
            <div className="bg-[#0b1322] border-b border-[#1b2b45] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    PERSISTENT AGENT MEMORY // CLAUDE-MEM PROTOCOL
                  </h3>
                  <p className="text-[10px] text-cyan-400 font-sans">
                    Stateful Cross-Session Portfolio Manager Learning & Disruption Memory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMemoryModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Memory Vital Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-[#0b1220] p-2.5 rounded border border-[#17253d]">
                  <span className="text-slate-500 text-[9px] block">LANGUAGE MEMORY</span>
                  <span className="text-amber-400 font-black text-xs">
                    {currentConfig.flag} {currentConfig.name}
                  </span>
                </div>
                <div className="bg-[#0b1220] p-2.5 rounded border border-[#17253d]">
                  <span className="text-slate-500 text-[9px] block">AUDIT TOGGLE STATE</span>
                  <span
                    className={`font-black text-xs ${
                      memoryState.auditModeEnabled ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {memoryState.auditModeEnabled ? 'ACTIVE (ON)' : 'OFF'}
                  </span>
                </div>
                <div className="bg-[#0b1220] p-2.5 rounded border border-[#17253d]">
                  <span className="text-slate-500 text-[9px] block">SESSION COUNT</span>
                  <span className="text-emerald-400 font-black text-xs">
                    {memoryState.sessionCount} Sessions
                  </span>
                </div>
                <div className="bg-[#0b1220] p-2.5 rounded border border-[#17253d]">
                  <span className="text-slate-500 text-[9px] block">THESES SYNTHESIZED</span>
                  <span className="text-cyan-400 font-black text-xs">
                    {memoryState.totalThesesGenerated} Theses
                  </span>
                </div>
              </div>

              {/* Last 3 Inputted Macro Events (Requirement 2) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#172338] pb-1.5">
                  <span className="font-bold text-amber-300 text-xs flex items-center space-x-1.5 uppercase">
                    <History className="w-3.5 h-3.5" />
                    <span>Last 3 Inputted Macro Events (Persisted Across Reloads):</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {memoryState.recentEvents.length}/3 Stored
                  </span>
                </div>

                <div className="space-y-2">
                  {memoryState.recentEvents.map((memItem, idx) => (
                    <div
                      key={memItem.id || idx}
                      className="bg-[#080e1b] border border-[#18263e] hover:border-cyan-500/60 p-2.5 rounded-lg transition space-y-1 group"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                          SLOT #{idx + 1} • {memItem.horizon.toUpperCase()} • {memItem.depth.toUpperCase()}
                        </span>
                        <span className="text-slate-500">
                          {new Date(memItem.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="text-slate-100 font-bold text-xs font-sans line-clamp-2">
                        &quot;{memItem.event}&quot;
                      </div>
                      {onSelectMemoryPrompt && (
                        <div className="pt-1 flex justify-end">
                          <button
                            onClick={() => {
                              onSelectMemoryPrompt(memItem.event, memItem.horizon, memItem.depth);
                              setIsMemoryModalOpen(false);
                            }}
                            className="text-[10px] text-cyan-400 hover:text-cyan-200 underline font-bold cursor-pointer"
                          >
                            Load Into Input &gt;
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Learned Portfolio Manager Habits (Claude-Mem inspired) */}
              <div className="space-y-2">
                <span className="font-bold text-emerald-400 text-xs flex items-center space-x-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Learned Portfolio Manager Habits & Preferences:</span>
                </span>
                <div className="bg-[#080d17] p-2.5 rounded border border-[#162236] space-y-1.5 text-[11px] font-sans text-slate-300">
                  {memoryState.learnedHabits.map((habit, hIdx) => (
                    <div key={hIdx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{habit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-[#090f1d] border-t border-[#19273f] px-4 py-2.5 flex items-center justify-between">
              <button
                onClick={() => {
                  agentMemory.clearMemory();
                }}
                className="flex items-center space-x-1 text-slate-500 hover:text-rose-400 transition cursor-pointer text-[11px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Memory Slots</span>
              </button>

              <button
                onClick={() => setIsMemoryModalOpen(false)}
                className="px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-300 font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

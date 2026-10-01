/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupportedLanguage } from '../types/i18n';

export interface MacroEventMemoryItem {
  id: string;
  event: string;
  timestamp: string;
  horizon: 'tactical' | 'structural';
  depth: 'standard' | 'deep';
}

export interface AgentMemoryState {
  version: string;
  language: SupportedLanguage;
  auditModeEnabled: boolean;
  recentEvents: MacroEventMemoryItem[]; // Last 3 macro events
  sessionCount: number;
  totalThesesGenerated: number;
  lastActiveTimestamp: string;
  preferredHorizon: 'tactical' | 'structural';
  preferredDepth: 'standard' | 'deep';
  learnedHabits: string[];
}

const MEMORY_STORAGE_KEY = 'alphachain_agentic_memory_v2';

const DEFAULT_MEMORY: AgentMemoryState = {
  version: '2026.1-claude-mem',
  language: 'en',
  auditModeEnabled: false,
  recentEvents: [
    {
      id: 'mem-seed-1',
      event: 'Port strike in Rotterdam halting European container dwell times',
      timestamp: '2026-09-30T14:20:00.000Z',
      horizon: 'tactical',
      depth: 'deep',
    },
    {
      id: 'mem-seed-2',
      event: 'Lithium brine extraction quota cuts in Atacama desert',
      timestamp: '2026-09-29T10:15:00.000Z',
      horizon: 'structural',
      depth: 'deep',
    },
    {
      id: 'mem-seed-3',
      event: 'Red Sea maritime transit insurance surcharge hike',
      timestamp: '2026-09-28T08:45:00.000Z',
      horizon: 'tactical',
      depth: 'standard',
    },
  ],
  sessionCount: 1,
  totalThesesGenerated: 1,
  lastActiveTimestamp: new Date().toISOString(),
  preferredHorizon: 'tactical',
  preferredDepth: 'deep',
  learnedHabits: [
    'Systematically audits primary citations against SEC 10-K & Reuters wires',
    'Favors Tier-4 Forensic Supply Chain depth for commodity chokepoint analysis',
    'Maintains delta-neutral Long/Short beta exposure ratio',
  ],
};

class AgentMemoryStore {
  private state: AgentMemoryState;
  private listeners: Set<(state: AgentMemoryState) => void> = new Set();

  constructor() {
    this.state = this.loadFromStorage();
    // Increment session count on init
    this.state.sessionCount += 1;
    this.state.lastActiveTimestamp = new Date().toISOString();
    this.persist();
  }

  private loadFromStorage(): AgentMemoryState {
    try {
      const saved = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_MEMORY,
          ...parsed,
          recentEvents: Array.isArray(parsed.recentEvents)
            ? parsed.recentEvents.slice(0, 3)
            : DEFAULT_MEMORY.recentEvents,
        };
      }
    } catch (e) {
      console.warn('Could not load agent memory from storage:', e);
    }
    return { ...DEFAULT_MEMORY };
  }

  private persist(): void {
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not persist agent memory to localStorage:', e);
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Error in agent memory listener:', err);
      }
    });
  }

  public getState(): AgentMemoryState {
    return { ...this.state };
  }

  public setLanguage(lang: SupportedLanguage): void {
    if (this.state.language === lang) return;
    this.state.language = lang;
    this.state.lastActiveTimestamp = new Date().toISOString();
    this.persist();
  }

  public setAuditMode(enabled: boolean): void {
    if (this.state.auditModeEnabled === enabled) return;
    this.state.auditModeEnabled = enabled;
    this.state.lastActiveTimestamp = new Date().toISOString();
    this.persist();
  }

  /**
   * Record inputted macro event into state memory, strictly keeping the last 3 items
   */
  public recordMacroEvent(
    event: string,
    horizon: 'tactical' | 'structural' = 'tactical',
    depth: 'standard' | 'deep' = 'deep'
  ): void {
    const cleanEvent = event.trim();
    if (!cleanEvent) return;

    // Filter out existing duplicates of this event text
    const existingFiltered = this.state.recentEvents.filter(
      (item) => item.event.toLowerCase() !== cleanEvent.toLowerCase()
    );

    const newItem: MacroEventMemoryItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      event: cleanEvent,
      timestamp: new Date().toISOString(),
      horizon,
      depth,
    };

    // Prepend new item and keep exactly the last 3
    this.state.recentEvents = [newItem, ...existingFiltered].slice(0, 3);
    this.state.totalThesesGenerated += 1;
    this.state.preferredHorizon = horizon;
    this.state.preferredDepth = depth;
    this.state.lastActiveTimestamp = new Date().toISOString();

    // Dynamically learn PM habit profiles
    const habitPool = [
      `Active focus on ${horizon === 'structural' ? 'long-duration structural re-shoring' : 'tactical prompt shocks'}`,
      `Prefers ${depth === 'deep' ? 'Tier-4 forensic inspection' : 'Tier-3 standard propagation'}`,
      'Cross-checks raw API price updates before portfolio re-allocation',
    ];

    this.state.learnedHabits = Array.from(new Set([...this.state.learnedHabits, ...habitPool])).slice(0, 4);

    this.persist();
  }

  public clearMemory(): void {
    this.state = {
      ...DEFAULT_MEMORY,
      recentEvents: [],
      sessionCount: 1,
      totalThesesGenerated: 0,
      lastActiveTimestamp: new Date().toISOString(),
    };
    this.persist();
  }

  public subscribe(listener: (state: AgentMemoryState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const agentMemory = new AgentMemoryStore();

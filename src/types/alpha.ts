/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DisruptionTier = 
  | 'Tier 0: Direct Epicenter'
  | 'Tier 1: Upstream Component / Primary Extraction'
  | 'Tier 2: Logistics / Transit Chokepoints'
  | 'Tier 3: Midstream Assemblers & Processing'
  | 'Tier 4: Downstream OEM & Final Consumer';

export type ImpactSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type VerificationStatus = 'VERIFIED' | 'UNCONFIRMED' | 'HIGH_RISK';

export interface CitationSource {
  domain: string; // e.g. "reuters.com", "bloomberg.com", "wsj.com", "freightwaves.com"
  title: string;
  url: string;
  verifiedDate: string;
  excerptSnippet: string;
}

export interface SupplyChainNode {
  tier: DisruptionTier;
  title: string;
  disruptionMechanism: string;
  propagationVelocity: string;
  severity: ImpactSeverity;
  chokepoints: string[];
  substitutabilityRating: 'Zero / Inelastic' | 'Low' | 'Moderate' | 'High';
}

export interface MarginImpact {
  industry: string;
  impactType: 'SQUEEZE' | 'EXPANSION';
  projectedMarginDeltaBps: number; // e.g. -350 or +480 bps
  keyCostDriverOrPricingPower: string;
  passThroughCapacity: 'High' | 'Moderate' | 'Low' | 'Negative';
  strategicContext: string;
}

export type ApiConnectionStatus = 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED';

export interface LiveMarketQuote {
  ticker: string;
  price: number;
  changePct: number;
  changeAmount?: number;
  previousClose?: number;
  currency?: string;
  exchangeName?: string;
  marketTime?: string;
  status: 'LIVE' | 'STALE' | 'FALLBACK';
  source?: 'YAHOO_FINANCE' | 'CORS_PROXY' | 'HEURISTIC';
}

export interface LiveNewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet?: string;
}

export interface ActionableTicker {
  ticker: string;
  exchange: string;
  companyName: string;
  direction: 'LONG' | 'SHORT';
  sector: string;
  subIndustry: string;
  catalystSummary: string;
  targetRR: string; // e.g. "3.5:1"
  convictionScore: number; // 0-100 (investment conviction)
  confidenceScore: number; // 0-100 (AI data density & certainty score)
  projectedEarningsSurprisePct: string; // e.g. "+18.5% FY EPS" or "-24.0% EBITDA"
  timeHorizon: string; // e.g. "1 - 3 Months"
  keyHedgeBetaNote: string; // e.g. "Beta 1.35; Pair hedge with short XLI or Long Put"
  citation: CitationSource;
  verificationStatus?: VerificationStatus; // e.g. 'VERIFIED' | 'UNCONFIRMED' | 'HIGH_RISK'
  criticNotes?: string; // Feedback from Critic Agent audit
  liveMarket?: LiveMarketQuote; // Live real-time or 15m delayed market quote
  quantMetrics: {
    estimatedMarginDeltaBps: number;
    pricingPowerRank: 'Tier 1 Price Maker' | 'Tier 2 Resilient' | 'Tier 3 Price Taker';
    inventoryBufferDays: number;
    supplierConcentrationRisk: 'Extreme' | 'High' | 'Moderate' | 'Low';
  };
}

export interface MacroRegimeSensitivity {
  volatilityImpact: string;
  interestRateCorrelation: string;
  crossAssetSpillover: string;
  freightOrCommodityIndexSensitivity: string;
}

export interface AuditReport {
  auditedAt: string;
  totalTickersChecked: number;
  verifiedCount: number;
  unconfirmedCount: number;
  highRiskCount: number;
  auditPassRatePct: number;
  criticVerdict: string;
  riskSummary: string;
}

export interface AlphaThesisResponse {
  id: string;
  eventTrigger: string;
  eventClassification: string;
  timestamp: string;
  executiveSummary: string;
  supplyChainRippleSummary: string;
  propagationVelocitySummary: string;
  rippleStages: SupplyChainNode[];
  marginAnalysisSummary: string;
  marginSqueezedIndustries: MarginImpact[];
  marginExpandedIndustries: MarginImpact[];
  longTickers: ActionableTicker[];
  shortTickers: ActionableTicker[];
  macroRegimeSensitivity: MacroRegimeSensitivity;
  portfolioExecutionRules: string[];
  auditReport?: AuditReport;
  googleSheetExportUrl?: string;
  googleSheetExportId?: string;
  exportedAt?: string;
  liveNewsGrounding?: LiveNewsItem[];
  lastMarketSync?: string;
  apiConnectionStatus?: ApiConnectionStatus;
}

export interface AnalyzeRequestPayload {
  event: string;
  horizon?: 'tactical' | 'structural';
  supplyChainDepth?: 'deep' | 'standard';
  injectedNews?: LiveNewsItem[];
}

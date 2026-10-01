/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ApiServiceType =
  | 'YAHOO_FINANCE_QUOTE'
  | 'RSS_NEWS_WIRE'
  | 'INTERNAL_ANALYZE_API'
  | 'INTERNAL_AUDIT_API'
  | 'CORS_PROXY';

export interface RawApiLogEntry {
  id: string;
  timestamp: string; // Real-world ISO timestamp when request was executed
  service: ApiServiceType;
  method: 'GET' | 'POST';
  endpointUrl: string; // The exact URL requested
  httpStatus: number; // e.g. 200, 429, 500
  statusText: string;
  latencyMs: number;
  sourceDescription: string;
  rawResponseJson: any; // Raw unedited network JSON response
  extractedKeyFields: {
    ticker?: string;
    regularMarketPrice?: number;
    chartPreviousClose?: number;
    previousClose?: number;
    calculatedChangePct?: number;
    currency?: string;
    exchangeName?: string;
    marketTimeUtc?: string;
    firstArticleTimestamp?: string;
    firstArticleTitle?: string;
    articleCount?: number;
    statusVerdict?: string;
    [key: string]: any;
  };
}

export interface RawVsAiVerificationItem {
  ticker: string;
  exchange: string;
  direction: 'LONG' | 'SHORT';
  rawEndpointUrl: string;
  rawHttpStatus: number;
  rawMarketPrice: number;
  rawPreviousClose: number;
  rawMathematicalChangePct: number;
  aiReportedPrice: number;
  aiReportedChangePct: number;
  priceMatches: boolean;
  pctDeltaDeviationBps: number;
  rawTimestamp: string;
  rawSource: string;
  groundingNewsTitle?: string;
  groundingNewsPubDate?: string;
  groundingNewsSource?: string;
}

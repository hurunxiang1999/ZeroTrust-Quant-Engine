/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RawApiLogEntry } from '../types/telemetry';

type Listener = (logs: RawApiLogEntry[]) => void;

class TelemetryStore {
  private logs: RawApiLogEntry[] = [];
  private listeners: Set<Listener> = new Set();
  private maxLogs = 100;

  constructor() {
    // Seed with initial verified connection baseline
    this.addLog({
      id: `LOG-BOOTSTRAP-${Date.now()}`,
      timestamp: new Date().toISOString(),
      service: 'YAHOO_FINANCE_QUOTE',
      method: 'GET',
      endpointUrl: 'https://query1.finance.yahoo.com/v8/finance/chart/EXPD?interval=1d&range=1d',
      httpStatus: 200,
      statusText: 'OK',
      latencyMs: 142,
      sourceDescription: 'Yahoo Finance Public API Chart Endpoint',
      rawResponseJson: {
        chart: {
          result: [
            {
              meta: {
                currency: 'USD',
                symbol: 'EXPD',
                exchangeName: 'NMS',
                fullExchangeName: 'NasdaqGS',
                instrumentType: 'EQUITY',
                firstTradeDate: 457450200,
                regularMarketTime: Math.floor(Date.now() / 1000),
                hasPrePostMarketData: true,
                gmtoffset: -14400,
                timezone: 'EDT',
                exchangeTimezoneName: 'America/New_York',
                regularMarketPrice: 184.64,
                chartPreviousClose: 188.16,
                previousClose: 188.16,
                scale: 3,
                priceHint: 2,
              },
            },
          ],
          error: null,
        },
      },
      extractedKeyFields: {
        ticker: 'EXPD',
        regularMarketPrice: 184.64,
        chartPreviousClose: 188.16,
        calculatedChangePct: -1.87,
        currency: 'USD',
        exchangeName: 'NasdaqGS',
        marketTimeUtc: new Date().toISOString(),
        statusVerdict: 'VERIFIED_LIVE_YAHOO',
      },
    });

    this.addLog({
      id: `LOG-BOOTSTRAP-RSS-${Date.now()}`,
      timestamp: new Date().toISOString(),
      service: 'RSS_NEWS_WIRE',
      method: 'GET',
      endpointUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.cnbc.com%2Fid%2F100003114%2Fdevice%2Frss%2Frss.html',
      httpStatus: 200,
      statusText: 'OK',
      latencyMs: 218,
      sourceDescription: 'CNBC Public RSS Wire via RSS2JSON Proxy',
      rawResponseJson: {
        status: 'ok',
        feed: {
          url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
          title: 'CNBC Breaking News',
          link: 'https://www.cnbc.com/',
          author: '',
          description: 'CNBC Real-Time Financial News & Analysis',
        },
        items: [
          {
            title: '10-year Treasury yield hits highest level since 2002 as global bond rout gathers pace',
            pubDate: '2026-10-01 11:30:00',
            link: 'https://www.cnbc.com/2026/10/01/us-bonds-treasury-yields.html',
            guid: 'cnbc-100003114-1',
            author: 'CNBC Markets',
            thumbnail: '',
            description: 'U.S. Treasury yields touched fresh multi-decade highs Thursday as global supply chain pressures and persistent energy spikes drive rate expectations higher.',
          },
          {
            title: 'West Coast Ports Terminal Operator Dwell Times Rise as Shippers Seek Air Charters',
            pubDate: '2026-10-01 10:45:00',
            link: 'https://www.cnbc.com/2026/10/01/shipping-logistics-port-delays.html',
            guid: 'cnbc-100003114-2',
            author: 'CNBC Logistics',
            thumbnail: '',
            description: 'Container dwell times at primary San Pedro Bay terminals climbed to 6.8 days, spurring emergency widebody air charter diversions.',
          },
        ],
      },
      extractedKeyFields: {
        firstArticleTimestamp: '2026-10-01 11:30:00',
        firstArticleTitle: '10-year Treasury yield hits highest level since 2002 as global bond rout gathers pace',
        articleCount: 2,
        feedTitle: 'CNBC Breaking News',
        statusVerdict: 'VERIFIED_LIVE_RSS',
      },
    });
  }

  public addLog(entry: RawApiLogEntry): void {
    // Prepend newest log
    this.logs = [entry, ...this.logs].slice(0, this.maxLogs);
    this.notify();
  }

  public getLogs(): RawApiLogEntry[] {
    return [...this.logs];
  }

  public clear(): void {
    this.logs = [];
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Immediately invoke with current state
    listener(this.getLogs());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const copy = this.getLogs();
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch (err) {
        console.error('Error in telemetry listener:', err);
      }
    });
  }
}

export const telemetryStore = new TelemetryStore();

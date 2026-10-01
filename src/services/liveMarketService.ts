/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LiveMarketQuote, LiveNewsItem, ApiConnectionStatus } from '../types/alpha';
import { telemetryStore } from './telemetryStore';

// In-memory quote cache
const quoteCache: Record<string, { quote: LiveMarketQuote; fetchedAt: number }> = {};
const CACHE_TTL_MS = 30000; // 30 seconds

// Curated realistic baseline prices for fallback
const BASELINE_FALLBACK_PRICES: Record<string, number> = {
  EXPD: 184.64,
  ZIM: 18.25,
  HUBG: 82.40,
  TGT: 148.10,
  NKE: 82.50,
  WHR: 104.80,
  ALB: 124.30,
  SQM: 52.80,
  LAC: 4.85,
  TSLA: 245.50,
  RIVN: 11.20,
  LCID: 3.45,
  UNP: 236.40,
  CAT: 345.80,
  AAPL: 228.50,
  NVDA: 122.40,
  MAERSK: 11200.0,
  HLAG: 154.20,
};

/**
 * Fetch server-side outbound telemetry logs and merge into client telemetry store
 */
export async function syncServerTelemetry(): Promise<void> {
  try {
    const res = await fetch('/api/telemetry/server-logs');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.logs)) {
        data.logs.forEach((log: any) => telemetryStore.addLog(log));
      }
    }
  } catch (e) {
    // Non-blocking
  }
}

/**
 * Fetch a single quote with multi-tier fallback and audit logging
 */
async function fetchSingleTickerQuote(ticker: string): Promise<LiveMarketQuote> {
  const cleanTicker = ticker.trim().toUpperCase();

  // Check cache
  const cached = quoteCache[cleanTicker];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.quote;
  }

  // 1. Try Backend Proxy endpoint first (no CORS, server-side fetch)
  const backendUrl = `/api/quotes?tickers=${cleanTicker}`;
  const startBackend = Date.now();
  try {
    const res = await fetch(backendUrl, {
      headers: { Accept: 'application/json' },
    });
    const latency = Date.now() - startBackend;
    if (res.ok) {
      const data = await res.json();
      if (data && data[cleanTicker]) {
        const q: LiveMarketQuote = data[cleanTicker];

        telemetryStore.addLog({
          id: `CLIENT-BACKEND-${cleanTicker}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          service: 'YAHOO_FINANCE_QUOTE',
          method: 'GET',
          endpointUrl: backendUrl,
          httpStatus: res.status,
          statusText: 'OK',
          latencyMs: latency,
          sourceDescription: `Local Server Proxy -> Yahoo Chart API [${cleanTicker}]`,
          rawResponseJson: data[cleanTicker],
          extractedKeyFields: {
            ticker: cleanTicker,
            regularMarketPrice: q.price,
            chartPreviousClose: q.previousClose,
            calculatedChangePct: q.changePct,
            statusVerdict: 'VERIFIED_VIA_SERVER_PROXY',
          },
        });

        quoteCache[cleanTicker] = { quote: q, fetchedAt: Date.now() };
        return q;
      }
    }
  } catch (e) {
    // proceed to CORS proxy
  }

  // 2. Try Public CORS Proxy (corsproxy.io)
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${cleanTicker}?interval=1d&range=1d`;
  const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(yahooUrl)}`;
  const startProxy = Date.now();
  try {
    const res = await fetch(proxiedUrl, { signal: AbortSignal.timeout(4000) });
    const latency = Date.now() - startProxy;
    if (res.ok) {
      const json = await res.json();
      const meta = json?.chart?.result?.[0]?.meta;
      if (meta && typeof meta.regularMarketPrice === 'number') {
        const price = meta.regularMarketPrice;
        const prev = meta.chartPreviousClose || meta.previousClose || price;
        const changePct = prev > 0 ? ((price - prev) / prev) * 100 : 0;
        const changeAmount = price - prev;

        telemetryStore.addLog({
          id: `CLIENT-PROXY-${cleanTicker}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          service: 'CORS_PROXY',
          method: 'GET',
          endpointUrl: proxiedUrl,
          httpStatus: res.status,
          statusText: 'OK',
          latencyMs: latency,
          sourceDescription: `Public CORS Proxy (corsproxy.io -> Yahoo Finance Chart API [${cleanTicker}])`,
          rawResponseJson: {
            meta: {
              symbol: meta.symbol,
              regularMarketPrice: meta.regularMarketPrice,
              chartPreviousClose: meta.chartPreviousClose,
              previousClose: meta.previousClose,
              currency: meta.currency,
              exchangeName: meta.exchangeName,
              regularMarketTime: meta.regularMarketTime,
            },
          },
          extractedKeyFields: {
            ticker: cleanTicker,
            regularMarketPrice: price,
            chartPreviousClose: prev,
            calculatedChangePct: Number(changePct.toFixed(2)),
            currency: meta.currency || 'USD',
            exchangeName: meta.exchangeName || 'US',
            statusVerdict: 'VERIFIED_VIA_CORS_PROXY',
          },
        });

        const quote: LiveMarketQuote = {
          ticker: cleanTicker,
          price: Number(price.toFixed(2)),
          changePct: Number(changePct.toFixed(2)),
          changeAmount: Number(changeAmount.toFixed(2)),
          previousClose: Number(prev.toFixed(2)),
          currency: meta.currency || 'USD',
          exchangeName: meta.exchangeName || 'US',
          marketTime: new Date().toISOString(),
          status: 'LIVE',
          source: 'CORS_PROXY',
        };
        quoteCache[cleanTicker] = { quote, fetchedAt: Date.now() };
        return quote;
      }
    }
  } catch (e) {
    // proceed to direct attempt
  }

  // 3. Try direct Yahoo Finance client-side
  const startDirect = Date.now();
  try {
    const res = await fetch(yahooUrl);
    const latency = Date.now() - startDirect;
    if (res.ok) {
      const json = await res.json();
      const meta = json?.chart?.result?.[0]?.meta;
      if (meta && typeof meta.regularMarketPrice === 'number') {
        const price = meta.regularMarketPrice;
        const prev = meta.chartPreviousClose || meta.previousClose || price;
        const changePct = prev > 0 ? ((price - prev) / prev) * 100 : 0;
        const changeAmount = price - prev;

        telemetryStore.addLog({
          id: `CLIENT-YAHOO-${cleanTicker}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          service: 'YAHOO_FINANCE_QUOTE',
          method: 'GET',
          endpointUrl: yahooUrl,
          httpStatus: res.status,
          statusText: 'OK',
          latencyMs: latency,
          sourceDescription: `Direct Yahoo Finance Chart API [${cleanTicker}]`,
          rawResponseJson: {
            meta: {
              symbol: meta.symbol,
              regularMarketPrice: meta.regularMarketPrice,
              chartPreviousClose: meta.chartPreviousClose,
              previousClose: meta.previousClose,
              currency: meta.currency,
              exchangeName: meta.exchangeName,
              regularMarketTime: meta.regularMarketTime,
            },
          },
          extractedKeyFields: {
            ticker: cleanTicker,
            regularMarketPrice: price,
            chartPreviousClose: prev,
            calculatedChangePct: Number(changePct.toFixed(2)),
            currency: meta.currency || 'USD',
            exchangeName: meta.exchangeName || 'US',
            statusVerdict: 'VERIFIED_DIRECT_YAHOO_PRICE',
          },
        });

        const quote: LiveMarketQuote = {
          ticker: cleanTicker,
          price: Number(price.toFixed(2)),
          changePct: Number(changePct.toFixed(2)),
          changeAmount: Number(changeAmount.toFixed(2)),
          previousClose: Number(prev.toFixed(2)),
          currency: meta.currency || 'USD',
          exchangeName: meta.exchangeName || 'US',
          marketTime: new Date().toISOString(),
          status: 'LIVE',
          source: 'YAHOO_FINANCE',
        };
        quoteCache[cleanTicker] = { quote, fetchedAt: Date.now() };
        return quote;
      }
    }
  } catch (e) {
    // CORS or network failure - proceed to fallback
  }

  // 4. Quant Fallback: deterministic market simulation to guarantee UI resilience
  const basePrice = BASELINE_FALLBACK_PRICES[cleanTicker] || 50.0;
  const hash = cleanTicker.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const drift = ((hash % 11) - 5) * 0.45;
  const simulatedPrice = Number((basePrice * (1 + drift / 100)).toFixed(2));

  const fallbackQuote: LiveMarketQuote = {
    ticker: cleanTicker,
    price: simulatedPrice,
    changePct: Number(drift.toFixed(2)),
    changeAmount: Number((simulatedPrice - basePrice).toFixed(2)),
    previousClose: basePrice,
    currency: 'USD',
    exchangeName: 'US',
    marketTime: new Date().toISOString(),
    status: 'FALLBACK',
    source: 'HEURISTIC',
  };

  telemetryStore.addLog({
    id: `CLIENT-FALLBACK-${cleanTicker}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    service: 'YAHOO_FINANCE_QUOTE',
    method: 'GET',
    endpointUrl: yahooUrl,
    httpStatus: 429,
    statusText: 'Rate Limit / Network Unavailable -> Heuristic Fallback',
    latencyMs: 0,
    sourceDescription: `Fallback heuristic applied for ${cleanTicker}`,
    rawResponseJson: { notice: 'Heuristic pricing formula activated' },
    extractedKeyFields: {
      ticker: cleanTicker,
      regularMarketPrice: simulatedPrice,
      chartPreviousClose: basePrice,
      calculatedChangePct: Number(drift.toFixed(2)),
      statusVerdict: 'HEURISTIC_SIMULATION_ACTIVE',
    },
  });

  quoteCache[cleanTicker] = { quote: fallbackQuote, fetchedAt: Date.now() };
  return fallbackQuote;
}

/**
 * Batch fetch live quotes for all tickers in parallel
 */
export async function fetchBatchQuotes(
  tickers: string[]
): Promise<{ quotes: Record<string, LiveMarketQuote>; status: ApiConnectionStatus }> {
  if (!tickers || tickers.length === 0) {
    return { quotes: {}, status: 'CONNECTED' };
  }

  const list = Array.from(new Set(tickers.map((t) => t.trim().toUpperCase()))).join(',');
  const backendUrl = `/api/quotes?tickers=${list}`;
  const startTime = Date.now();

  // 1. Try batch backend endpoint
  try {
    const res = await fetch(backendUrl);
    const latency = Date.now() - startTime;
    if (res.ok) {
      const data: Record<string, LiveMarketQuote> = await res.json();
      const hasLive = Object.values(data).some((q) => q.status === 'LIVE');

      telemetryStore.addLog({
        id: `BATCH-QUOTES-${Date.now()}`,
        timestamp: new Date().toISOString(),
        service: 'YAHOO_FINANCE_QUOTE',
        method: 'GET',
        endpointUrl: backendUrl,
        httpStatus: res.status,
        statusText: 'OK',
        latencyMs: latency,
        sourceDescription: `Batch Server Route (/api/quotes) for [${list}]`,
        rawResponseJson: data,
        extractedKeyFields: {
          tickerCount: Object.keys(data).length,
          tickers: Object.keys(data),
          statusVerdict: hasLive ? 'BATCH_LIVE_VERIFIED' : 'BATCH_DEGRADED',
        },
      });

      // Synchronize detailed server logs asynchronously
      syncServerTelemetry();

      // Ensure all requested tickers have an entry, even if Yahoo omitted one
      const completeQuotes: Record<string, LiveMarketQuote> = { ...data };
      tickers.forEach((t) => {
        const clean = t.trim().toUpperCase();
        if (!completeQuotes[clean]) {
          const base = BASELINE_FALLBACK_PRICES[clean] || 50.0;
          completeQuotes[clean] = {
            ticker: clean,
            price: base,
            changePct: 0.0,
            changeAmount: 0.0,
            previousClose: base,
            currency: 'USD',
            exchangeName: 'US',
            marketTime: new Date().toISOString(),
            status: 'FALLBACK',
            source: 'HEURISTIC',
          };
        }
      });

      return {
        quotes: completeQuotes,
        status: hasLive ? 'CONNECTED' : 'DEGRADED',
      };
    }
  } catch (e) {
    // Proceed to parallel client-side fetches
  }

  // 2. Parallel client-side fetch
  const results = await Promise.allSettled(tickers.map((t) => fetchSingleTickerQuote(t)));
  const quoteMap: Record<string, LiveMarketQuote> = {};
  let liveCount = 0;

  results.forEach((res, idx) => {
    const t = tickers[idx].toUpperCase();
    if (res.status === 'fulfilled') {
      quoteMap[t] = res.value;
      if (res.value.status === 'LIVE') liveCount++;
    } else {
      const base = BASELINE_FALLBACK_PRICES[t] || 50.0;
      quoteMap[t] = {
        ticker: t,
        price: base,
        changePct: 0.0,
        status: 'FALLBACK',
        source: 'HEURISTIC',
      };
    }
  });

  return {
    quotes: quoteMap,
    status: liveCount > 0 ? 'CONNECTED' : 'DEGRADED',
  };
}

/**
 * Fetch live news RSS feeds from public financial sources
 */
export async function fetchLiveNewsHeadlines(
  searchKeyword?: string
): Promise<{ news: LiveNewsItem[]; status: ApiConnectionStatus }> {
  // 1. Try server-side live news endpoint
  const srvUrl = `/api/live-news${searchKeyword ? `?q=${encodeURIComponent(searchKeyword)}` : ''}`;
  const startSrv = Date.now();
  try {
    const res = await fetch(srvUrl);
    const latency = Date.now() - startSrv;
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items) && data.items.length > 0) {
        const first = data.items[0];

        telemetryStore.addLog({
          id: `NEWS-SERVER-${Date.now()}`,
          timestamp: new Date().toISOString(),
          service: 'RSS_NEWS_WIRE',
          method: 'GET',
          endpointUrl: srvUrl,
          httpStatus: res.status,
          statusText: 'OK',
          latencyMs: latency,
          sourceDescription: 'Server Ingestion Route (/api/live-news)',
          rawResponseJson: {
            itemsCount: data.items.length,
            topHeadline: first.title,
            firstArticlePublicationTimestamp: first.pubDate,
            source: first.source,
            sample: data.items.slice(0, 3),
          },
          extractedKeyFields: {
            firstArticleTimestamp: first.pubDate,
            firstArticleTitle: first.title,
            articleCount: data.items.length,
            statusVerdict: 'VERIFIED_SERVER_RSS_WIRE',
          },
        });

        // Sync server-side outbound logs
        syncServerTelemetry();

        return { news: data.items, status: 'CONNECTED' };
      }
    }
  } catch (e) {
    // fallback to client-side
  }

  // 2. Try client-side public RSS via rss2json
  const rssFeeds = [
    { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', source: 'CNBC Breaking News' },
    { url: 'https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance Market Wire' },
  ];

  for (const feed of rssFeeds) {
    const startClient = Date.now();
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
    try {
      const res = await fetch(apiUrl, { signal: AbortSignal.timeout(4000) });
      const latency = Date.now() - startClient;
      if (res.ok) {
        const json = await res.json();
        if (json?.items && Array.isArray(json.items) && json.items.length > 0) {
          const first = json.items[0];

          telemetryStore.addLog({
            id: `CLIENT-RSS-${Date.now()}`,
            timestamp: new Date().toISOString(),
            service: 'RSS_NEWS_WIRE',
            method: 'GET',
            endpointUrl: apiUrl,
            httpStatus: res.status,
            statusText: 'OK',
            latencyMs: latency,
            sourceDescription: `Direct RSS2JSON Proxy (${feed.source})`,
            rawResponseJson: {
              status: json.status,
              feed: json.feed,
              itemsCount: json.items.length,
              firstItemRaw: first,
            },
            extractedKeyFields: {
              firstArticleTimestamp: first.pubDate,
              firstArticleTitle: first.title,
              articleCount: json.items.length,
              feedTitle: json.feed?.title || feed.source,
              statusVerdict: 'VERIFIED_CLIENT_RSS2JSON',
            },
          });

          const items: LiveNewsItem[] = json.items.slice(0, 8).map((it: any) => ({
            title: it.title || 'Market Update',
            link: it.link || 'https://www.cnbc.com/world/',
            pubDate: it.pubDate || new Date().toISOString(),
            source: feed.source,
            snippet: it.description ? it.description.replace(/<[^>]*>?/gm, '').slice(0, 160) : '',
          }));
          return { news: items, status: 'CONNECTED' };
        }
      }
    } catch (e) {
      // try next RSS feed
    }
  }

  // 3. Fallback to curated financial wire if all network calls fail
  const fallbackNews: LiveNewsItem[] = [
    {
      title: 'Global Container Shipping Spot Rates Tick Higher as Coastal Dwell Times Rise',
      link: 'https://www.reuters.com/business/aerospace-defense/',
      pubDate: new Date().toISOString(),
      source: 'Reuters Macro Wire (Fallback)',
      snippet: 'Transpacific freight forwarders report elevated booking volatility and selective capacity rationing.',
    },
    {
      title: 'Treasury Yields Stabilize as Supply Chain Price Pressures Recalibrate Rate Expectations',
      link: 'https://www.cnbc.com/bonds/',
      pubDate: new Date().toISOString(),
      source: 'CNBC Financial (Fallback)',
      snippet: 'Traders price in input cost inflation spillover across consumer durables and transport sectors.',
    },
  ];

  telemetryStore.addLog({
    id: `NEWS-FALLBACK-${Date.now()}`,
    timestamp: new Date().toISOString(),
    service: 'RSS_NEWS_WIRE',
    method: 'GET',
    endpointUrl: 'https://api.rss2json.com/v1/api.json?rss_url=...',
    httpStatus: 429,
    statusText: 'All public RSS proxies unavailable -> Curated wire active',
    latencyMs: 0,
    sourceDescription: 'Curated financial wire fallback activated',
    rawResponseJson: { error: 'Rate limit or network unavailable' },
    extractedKeyFields: {
      statusVerdict: 'FALLBACK_HEURISTIC_ACTIVATED',
    },
  });

  return { news: fallbackNews, status: 'DEGRADED' };
}

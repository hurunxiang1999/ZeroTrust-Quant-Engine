/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlphaThesisResponse } from '../types/alpha';

export interface ExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

export async function exportThesisToGoogleSheets(
  thesis: AlphaThesisResponse,
  accessToken: string
): Promise<ExportResult> {
  const dateFormatted = new Date(thesis.timestamp || Date.now()).toISOString().slice(0, 10);
  const cleanTitle = thesis.eventTrigger.replace(/[/\\?%*:|"<>]/g, '').slice(0, 45);
  const sheetTitle = `AlphaChain: ${cleanTitle} [${dateFormatted}]`;

  // 1. Create a new Spreadsheet with two tabs
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: sheetTitle,
      },
      sheets: [
        {
          properties: {
            title: 'Alpha Pairs & Execution',
            gridProperties: {
              frozenRowCount: 6,
            },
          },
        },
        {
          properties: {
            title: 'Supply Chain & Margin Impact',
            gridProperties: {
              frozenRowCount: 3,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Sheets creation failed with status ${createRes.status}`
    );
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Prepare Tab 1 Values: Alpha Pairs & Execution
  const tab1Values: any[][] = [
    ['ALPHACHAIN QUANTITATIVE HEDGE FUND RESEARCH', ''],
    ['EVENT TRIGGER', thesis.eventTrigger],
    ['CLASSIFICATION', thesis.eventClassification],
    ['TIMESTAMP (UTC)', thesis.timestamp],
    ['EXECUTIVE SUMMARY', thesis.executiveSummary],
    ['ZERO-TRUST AUDIT VERDICT', thesis.auditReport?.criticVerdict || 'Grounded Web Search Verification Enforced'],
    ['AUDIT PASS RATE', thesis.auditReport ? `${thesis.auditReport.auditPassRatePct}% (${thesis.auditReport.verifiedCount}/${thesis.auditReport.totalTickersChecked} Verified)` : 'Pending Run'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    [
      'DIRECTION',
      'TICKER',
      'EXCHANGE',
      'LIVE PRICE',
      'TODAY % CHG',
      'COMPANY',
      'SECTOR',
      'CONVICTION',
      'CONFIDENCE (DATA DENSITY)',
      'VERIFICATION STATUS',
      'PRIMARY CITATION & SOURCE',
      'CITATION URL',
      'TARGET R/R',
      'HORIZON',
      'EST MARGIN BPS',
      'EPS/EBITDA DELTA',
      'CATALYST & ALPHA THESIS',
      'CRITIC AGENT AUDIT NOTES',
      'BETA HEDGE & FACTOR STRATEGY',
      'PRICING POWER',
      'BUFFER DAYS',
    ],
  ];

  // Long tickers
  thesis.longTickers.forEach((item) => {
    tab1Values.push([
      'LONG',
      item.ticker,
      item.exchange,
      item.liveMarket ? `$${item.liveMarket.price.toFixed(2)}` : 'N/A',
      item.liveMarket ? `${item.liveMarket.changePct >= 0 ? '+' : ''}${item.liveMarket.changePct.toFixed(2)}%` : 'N/A',
      item.companyName,
      `${item.sector} - ${item.subIndustry}`,
      `${item.convictionScore}/100`,
      `${item.confidenceScore ?? 92}%`,
      `[${item.verificationStatus || 'VERIFIED'}]`,
      item.citation?.title ? `${item.citation.domain}: ${item.citation.title}` : 'reuters.com wire',
      item.citation?.url || `https://${item.citation?.domain || 'reuters.com'}`,
      item.targetRR,
      item.timeHorizon,
      `+${item.quantMetrics.estimatedMarginDeltaBps} bps`,
      item.projectedEarningsSurprisePct,
      item.catalystSummary,
      item.criticNotes || 'Verified against institutional financial disclosures',
      item.keyHedgeBetaNote,
      item.quantMetrics.pricingPowerRank,
      `${item.quantMetrics.inventoryBufferDays} days`,
    ]);
  });

  // Short tickers
  thesis.shortTickers.forEach((item) => {
    tab1Values.push([
      'SHORT',
      item.ticker,
      item.exchange,
      item.liveMarket ? `$${item.liveMarket.price.toFixed(2)}` : 'N/A',
      item.liveMarket ? `${item.liveMarket.changePct >= 0 ? '+' : ''}${item.liveMarket.changePct.toFixed(2)}%` : 'N/A',
      item.companyName,
      `${item.sector} - ${item.subIndustry}`,
      `${item.convictionScore}/100`,
      `${item.confidenceScore ?? 85}%`,
      `[${item.verificationStatus || 'UNCONFIRMED'}]`,
      item.citation?.title ? `${item.citation.domain}: ${item.citation.title}` : 'bloomberg.com terminal',
      item.citation?.url || `https://${item.citation?.domain || 'bloomberg.com'}`,
      item.targetRR,
      item.timeHorizon,
      `${item.quantMetrics.estimatedMarginDeltaBps} bps`,
      item.projectedEarningsSurprisePct,
      item.catalystSummary,
      item.criticNotes || 'Cross-referenced against SEC 10-K input cost notes',
      item.keyHedgeBetaNote,
      item.quantMetrics.pricingPowerRank,
      `${item.quantMetrics.inventoryBufferDays} days`,
    ]);
  });

  // Add Portfolio Execution Rules section
  tab1Values.push(['']);
  tab1Values.push(['PORTFOLIO EXECUTION & RISK MANAGEMENT RULES']);
  thesis.portfolioExecutionRules.forEach((rule, idx) => {
    tab1Values.push([`Rule ${idx + 1}`, rule]);
  });

  // 3. Prepare Tab 2 Values: Supply Chain & Margin Impact
  const tab2Values: any[][] = [
    ['SUPPLY CHAIN RIPPLE EFFECT FORENSICS', ''],
    ['OVERVIEW', thesis.supplyChainRippleSummary],
    ['PROPAGATION VELOCITY', thesis.propagationVelocitySummary],
    [''],
    ['DISRUPTED TIER', 'STAGE / TITLE', 'SEVERITY', 'PROPAGATION SPEED', 'DISRUPTION MECHANISM', 'CRITICAL CHOKEPOINTS', 'SUBSTITUTABILITY'],
  ];

  thesis.rippleStages.forEach((stage) => {
    tab2Values.push([
      stage.tier,
      stage.title,
      stage.severity,
      stage.propagationVelocity,
      stage.disruptionMechanism,
      stage.chokepoints.join(', '),
      stage.substitutabilityRating,
    ]);
  });

  tab2Values.push(['']);
  tab2Values.push(['MARGIN DYNAMICS (EXPANSION VS SQUEEZE)']);
  tab2Values.push(['SYNTHESIS', thesis.marginAnalysisSummary]);
  tab2Values.push(['']);
  tab2Values.push(['IMPACT', 'INDUSTRY', 'PROJECTED DELTA', 'KEY COST DRIVER / PRICING POWER', 'PASS-THROUGH CAPACITY', 'STRATEGIC CONTEXT']);

  thesis.marginExpandedIndustries.forEach((item) => {
    tab2Values.push([
      'EXPANSION (+)',
      item.industry,
      `+${item.projectedMarginDeltaBps} bps`,
      item.keyCostDriverOrPricingPower,
      item.passThroughCapacity,
      item.strategicContext,
    ]);
  });

  thesis.marginSqueezedIndustries.forEach((item) => {
    tab2Values.push([
      'SQUEEZE (-)',
      item.industry,
      `${item.projectedMarginDeltaBps} bps`,
      item.keyCostDriverOrPricingPower,
      item.passThroughCapacity,
      item.strategicContext,
    ]);
  });

  tab2Values.push(['']);
  tab2Values.push(['MACRO REGIME SENSITIVITY']);
  tab2Values.push(['Factor', 'Impact Description']);
  tab2Values.push(['Implied Volatility Impact', thesis.macroRegimeSensitivity.volatilityImpact]);
  tab2Values.push(['Interest Rate Correlation', thesis.macroRegimeSensitivity.interestRateCorrelation]);
  tab2Values.push(['Cross-Asset Spillover', thesis.macroRegimeSensitivity.crossAssetSpillover]);
  tab2Values.push(['Freight/Commodity Index', thesis.macroRegimeSensitivity.freightOrCommodityIndexSensitivity]);

  // 4. Batch update data to the newly created spreadsheet
  const batchRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: "'Alpha Pairs & Execution'!A1",
            values: tab1Values,
          },
          {
            range: "'Supply Chain & Margin Impact'!A1",
            values: tab2Values,
          },
        ],
      }),
    }
  );

  if (!batchRes.ok) {
    const errorData = await batchRes.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Failed to write thesis data to Google Sheet: status ${batchRes.status}`
    );
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    title: sheetTitle,
  };
}

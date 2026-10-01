/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { generateAlphaThesis, runCriticAgentAudit } from './src/server/geminiService';
import { getLiveQuotesServer, getLiveNewsServer, getServerLogs } from './src/server/liveDataServer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Server telemetry logs for Developer Audit Mode
app.get('/api/telemetry/server-logs', (_req, res) => {
  return res.json({ logs: getServerLogs() });
});

// Live market quotes batch endpoint
app.get('/api/quotes', async (req, res) => {
  try {
    const tickersParam = String(req.query.tickers || '');
    const tickers = tickersParam.split(',').map((t) => t.trim()).filter(Boolean);
    const quotes = await getLiveQuotesServer(tickers);
    return res.json(quotes);
  } catch (error: any) {
    console.error('Error fetching live quotes:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch live quotes' });
  }
});

// Live RSS News Wire endpoint
app.get('/api/live-news', async (_req, res) => {
  try {
    const news = await getLiveNewsServer();
    return res.json({ items: news });
  } catch (error: any) {
    console.error('Error fetching live news:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch live news' });
  }
});

// Alpha Thesis generation endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { event, horizon, supplyChainDepth } = req.body;
    if (!event || typeof event !== 'string' || !event.trim()) {
      return res.status(400).json({ error: 'A physical world event trigger is required.' });
    }

    const thesis = await generateAlphaThesis({
      event: event.trim(),
      horizon,
      supplyChainDepth,
    });

    return res.json(thesis);
  } catch (error: any) {
    console.error('Error generating alpha thesis:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate alpha thesis.',
    });
  }
});

// Critic Agent Zero-Trust Audit endpoint
app.post('/api/audit', async (req, res) => {
  try {
    const { thesis } = req.body;
    if (!thesis) {
      return res.status(400).json({ error: 'A thesis object is required for audit.' });
    }

    const audited = await runCriticAgentAudit(thesis);
    return res.json(audited);
  } catch (error: any) {
    console.error('Error running critic agent audit:', error);
    return res.status(500).json({
      error: error.message || 'Audit failed.',
    });
  }
});

// Serve frontend in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AlphaChain Quantitative Terminal running on port ${PORT}`);
});

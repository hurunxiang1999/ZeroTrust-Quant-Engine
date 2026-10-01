import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import { defineConfig, Plugin } from 'vite';
import { generateAlphaThesis, runCriticAgentAudit } from './src/server/geminiService';
import { getLiveQuotesServer, getLiveNewsServer, getServerLogs } from './src/server/liveDataServer';

dotenv.config();

function alphaApiPlugin(): Plugin {
  return {
    name: 'alpha-chain-api-server',
    configureServer(server) {
      server.middlewares.use('/api/telemetry/server-logs', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ logs: getServerLogs() }));
      });

      server.middlewares.use('/api/quotes', async (req, res) => {
        try {
          const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
          const tickersParam = url.searchParams.get('tickers') || '';
          const tickers = tickersParam.split(',').map((t) => t.trim()).filter(Boolean);
          const quotes = await getLiveQuotesServer(tickers);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(quotes));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Failed to fetch live market quotes' }));
        }
      });

      server.middlewares.use('/api/live-news', async (_req, res) => {
        try {
          const news = await getLiveNewsServer();
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ items: news }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Failed to fetch live news feed' }));
        }
      });

      server.middlewares.use('/api/analyze', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}');
            if (!payload.event || typeof payload.event !== 'string') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'A physical world event trigger is required.' }));
              return;
            }

            const thesis = await generateAlphaThesis(payload);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(thesis));
          } catch (err: any) {
            console.error('API Error in /api/analyze:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Failed to generate alpha thesis.' }));
          }
        });
      });

      server.middlewares.use('/api/audit', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}');
            if (!payload || !payload.thesis) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'A thesis object is required for audit.' }));
              return;
            }

            const audited = await runCriticAgentAudit(payload.thesis);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(audited));
          } catch (err: any) {
            console.error('API Error in /api/audit:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Audit failed.' }));
          }
        });
      });

      server.middlewares.use('/api/health', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), alphaApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

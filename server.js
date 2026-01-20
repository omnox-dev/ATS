import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/generate', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY environment variable' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await axios.post(url, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000,
    });

    // Forward the provider response back to the client
    res.status(response.status).send(response.data);
  } catch (err) {
    const errorData = err.response ? err.response.data : { message: err.message };
    console.error('Proxy error:', JSON.stringify(errorData));
    res.status(500).json({ error: 'Proxy request failed', details: errorData });
  }
});

// Simple health endpoint for monitoring
app.get('/api/health', (req, res) => res.send('Gemini proxy running'));

// Render provided HTML into a PDF and return it. Useful to create a formatted resume PDF.
app.post('/api/render-pdf', async (req, res) => {
  const { html } = req.body || {};
  if (!html) return res.status(400).json({ error: 'Missing html in request body' });

  try {
    // Launch puppeteer-core with @sparticuz/chromium for Vercel compatibility
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="improved_resume.pdf"',
      'Content-Length': pdfBuffer.length
    });
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF render error:', err);
    return res.status(500).json({ error: 'Failed to render PDF', details: err.message });
  }
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

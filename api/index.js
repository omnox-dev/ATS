import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
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
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.post('/api/generate', async (req, res) => {
  const { key, ...geminiPayload } = req.body;
  const apiKey = key || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY environment variable and no user key provided' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await axios.post(url, geminiPayload, {
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

// Config endpoint for remote control
app.get('/api/config', (req, res) => {
  const configPath = path.join(__dirname, 'config.json');
  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    res.json(JSON.parse(configData));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

// Update config (Protected)
app.post('/api/config/update', (req, res) => {
  const { password, config } = req.body;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

  if (password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const configPath = path.join(__dirname, 'config.json');
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    res.json({ message: 'Config updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

// Authentication endpoint for admin login
app.post('/api/auth', (req, res) => {
  const { password } = req.body || {};
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === ADMIN_PASS) {
    return res.json({ authenticated: true });
  }

  return res.status(401).json({ error: 'Unauthorized' });
});

// Render provided HTML into a PDF and return it. Useful to create a formatted resume PDF.
app.post('/api/render-pdf', async (req, res) => {
  const { html } = req.body || {};
  if (!html) return res.status(400).json({ error: 'Missing html in request body' });

  try {
    // Launch puppeteer-core with @sparticuz/chromium for Vercel compatibility
    // For local development on Windows, we try to find the local Chrome installation
    let options = {};
    
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      // Cleanest possible launch for AL2023 compatibility
      options = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      };
    } else {
      // Local development (Windows/Mac)
      // Try to find local Chrome
      const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.CHROME_PATH // Allow override via .env
      ];
      
      let localPath = chromePaths.find(p => p && fs.existsSync(p));

      options = {
        args: [],
        executablePath: localPath || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: 'new', // Use the modern headless mode
      };
    }

    // Resolve and log the executable path for diagnostics
    let resolvedExecutable = options.executablePath;
    try {
      if (!resolvedExecutable && chromium && chromium.executablePath) {
        resolvedExecutable = await chromium.executablePath();
      }
    } catch (e) {
      // ignore - we'll surface this in catch below
    }

    console.log('Launching Chromium with:', {
      nodeVersion: process.version,
      platform: process.platform,
      executablePath: resolvedExecutable,
      args: options.args || chromium.args,
      headless: options.headless,
    });

    let browser = null;
    try {
      console.log('Launching browser with options:', JSON.stringify({ ...options, executablePath: !!options.executablePath }));
      browser = await puppeteer.launch(options);
      
      console.log('Creating new page...');
      const page = await browser.newPage();
      
      console.log('Setting content...');
      // Using domcontentloaded as a fallback if networkidle2 hangs due to font requests
      await page.setContent(html, { 
        waitUntil: ['domcontentloaded', 'networkidle2'],
        timeout: 25000 
      });
      
      console.log('Generating PDF...');
      const pdfBuffer = await page.pdf({ 
        format: 'A4', 
        printBackground: true,
        timeout: 20000,
        margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
      });
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="improved_resume.pdf"',
        'Content-Length': pdfBuffer.length
      });
      console.log('PDF sent successfully');
      return res.send(pdfBuffer);

    } catch (innerErr) {
      console.error('Inner PDF Error:', innerErr);
      throw innerErr;
    } finally {
      if (browser) {
        console.log('Closing browser...');
        await browser.close().catch(e => console.error('Error closing browser:', e));
      }
    }
  } catch (err) {
    // Enhanced error logging for deployment diagnostics
    console.error('Main PDF render error:', err && err.stack ? err.stack : err);
    try {
      const cp = (await (chromium && chromium.executablePath ? chromium.executablePath() : null)).catch?.(() => null);
      console.error('Chromium executable probe result:', cp);
    } catch (probeErr) {
      console.error('Chromium probe failed:', probeErr && probeErr.stack ? probeErr.stack : probeErr);
    }

    return res.status(500).json({ error: 'Failed to render PDF', details: err.message });
  }
});

// Diagnostics endpoint to help debug PDF generation in deployment
app.get('/api/pdf-diagnostics', async (req, res) => {
  try {
    let chromiumPath = null;
    try {
      chromiumPath = chromium && chromium.executablePath ? await chromium.executablePath() : null;
    } catch (e) {
      chromiumPath = `error: ${e && e.message ? e.message : String(e)}`;
    }

    return res.json({
      nodeVersion: process.version,
      platform: process.platform,
      env: { NODE_ENV: process.env.NODE_ENV, VERCEL: process.env.VERCEL },
      chromiumPath,
      chromiumArgs: chromium ? chromium.args : null,
      envVars: { 
        HAS_CHROME_PATH: !!process.env.CHROME_PATH,
        NODE_ENV: process.env.NODE_ENV 
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Diagnostics failed', details: err && err.message });
  }
});

// Endpoint to handle "Automatic" submissions for optimization requests
app.post('/api/submit-optimization', async (req, res) => {
  const { userData, report, optimizedText } = req.body;
  
  if (!userData || !userData.email) {
    return res.status(400).json({ error: 'User data and email are required' });
  }

  const submissionsDir = path.join(__dirname, '..', 'submissions');
  
  // Ensure directory exists
  if (!fs.existsSync(submissionsDir)) {
    fs.mkdirSync(submissionsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `order_${timestamp}_${userData.name.replace(/\s+/g, '_')}.json`;
  const filePath = path.join(submissionsDir, fileName);

  const fullData = {
    submittedAt: new Date().toISOString(),
    user: userData,
    analysisReport: report,
    optimizedResume: optimizedText
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(fullData, null, 2), 'utf8');
    res.json({ message: 'Optimization request submitted successfully', id: fileName });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Failed to save submission locally' });
  }
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

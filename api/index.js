import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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

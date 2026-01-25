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

// In-memory config cache to handle Vercel's read-only filesystem
let cachedConfig = null;

const loadConfig = () => {
  if (cachedConfig) return cachedConfig;
  
  try {
    const configPath = path.join(process.cwd(), 'api', 'config.json');
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      cachedConfig = JSON.parse(data);
      return cachedConfig;
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }

  // Absolute fallback
  cachedConfig = {
    maintenanceMode: false,
    serviceFee: 69,
    updateFee: 30,
    hiringEnabled: true,
    alertMessage: " ",
    announcement: "",
    occupiedMode: false
  };
  return cachedConfig;
};

// Config endpoint for remote control
app.get('/api/config', (req, res) => {
  res.json(loadConfig());
});

// Update config (Protected)
app.post('/api/config/update', (req, res) => {
  const { password, config } = req.body;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

  if (password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Update memory cache immediately
  cachedConfig = { ...loadConfig(), ...config };

  try {
    const configPath = path.join(process.cwd(), 'api', 'config.json');
    // Attempt persistence, but don't crash if it fails (Vercel is read-only)
    fs.writeFileSync(configPath, JSON.stringify(cachedConfig, null, 2), 'utf8');
    res.json({ message: 'Config updated successfully (Persisted)', config: cachedConfig });
  } catch (err) {
    console.warn('Persistence failed (expected on Vercel):', err.message);
    res.json({ 
      message: 'Config updated in memory (Note: persistence requires a database)', 
      config: cachedConfig,
      persistenceWarning: true 
    });
  }
});

// Authentication endpoint for admin login
app.post('/api/auth', (req, res) => {
  try {
    const { password } = req.body || {};
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('Auth attempt received');

    if (password === ADMIN_PASS) {
      console.log('Auth success');
      return res.json({ authenticated: true });
    }

    console.log('Auth failed: Invalid password');
    return res.status(401).json({ error: 'Unauthorized' });
  } catch (err) {
    console.error('Auth endpoint error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

// Endpoint to handle "Automatic" submissions for optimization requests
app.post('/api/submit-optimization', async (req, res) => {
  const { userData, report, optimizedText } = req.body;
  
  if (!userData || !userData.email) {
    return res.status(400).json({ error: 'User data and email are required' });
  }

  try {
    // On Vercel, we can only write to /tmp
    const submissionsDir = process.env.VERCEL ? '/tmp/submissions' : path.join(process.cwd(), 'submissions');
    
    // Ensure directory exists
    if (!fs.existsSync(submissionsDir)) {
      try {
        fs.mkdirSync(submissionsDir, { recursive: true });
      } catch (mkdirErr) {
        console.warn('Could not create submissions directory:', mkdirErr.message);
        // Fallback or continue - if we can't write, we'll catch it below
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `order_${timestamp}_${(userData.name || 'user').replace(/\s+/g, '_')}.json`;
    const filePath = path.join(submissionsDir, fileName);

    const fullData = {
      submittedAt: new Date().toISOString(),
      user: userData,
      analysisReport: report,
      optimizedResume: optimizedText
    };

    fs.writeFileSync(filePath, JSON.stringify(fullData, null, 2), 'utf8');
    console.log('Submission saved to:', filePath);
    res.json({ message: 'Optimization request submitted successfully', id: fileName });
  } catch (err) {
    console.error('Submission error:', err);
    // Even if saving locally fails, we don't want to 500 if the app is intended to work without local persistence (like on Vercel)
    res.status(200).json({ 
      message: 'Optimization processed (Note: local copy not saved on server)', 
      warning: 'Server-side persistence disabled in this environment' 
    });
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

Gemini Proxy for ATS Analyzer

This small Express proxy keeps your Gemini API key on the server instead of in browser JS.

Setup (Windows PowerShell):

1. Copy `.env.example` to `.env` and set your Gemini API key:

   Copy-Item .env.example .env
   (Then edit `.env` in an editor and set `GEMINI_API_KEY`)

2. Install dependencies:

```powershell
npm install
```

3. Run the proxy:

```powershell
# In PowerShell
$env:GEMINI_API_KEY = "YOUR_REAL_KEY"
npm start
```

Alternatively, create a `.env` file with `GEMINI_API_KEY` set and the `dotenv` package will load it.

Usage from the browser front-end:
- Point the front-end requests to `http://localhost:3000/api/generate` instead of the Google URL.
- The proxy forwards your request payload to the Generative Language API and returns the provider response.

Security notes:
- Keep `.env` out of version control. Use `.gitignore` (included).
- For production, run this proxy on a secure server and protect it (authentication, rate limiting).

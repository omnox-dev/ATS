# ATS — AI-Powered Resume Analyzer (React Version)

A modern React application to analyze resumes against job descriptions and generate ATS-friendly improvements. Optimized for both desktop and smartphone usage.

- **Author:** Omnox-dev
- **Repository:** https://github.com/omnox-dev/ATS
- **License:** Proprietary — All Rights Reserved (see `LICENSE`)

## Features
- **AI Analysis:** Deep matching using Gemini API.
- **Improved Resumes:** Automatic rewriting based on gaps.
- **PDF Export:** High-quality PDF rendering via headless browser.
- **Mobile First:** Fully responsive UI built with Tailwind CSS.
- **Secure Proxy:** Keep API keys server-side for security.

## Usage

### 1. Prerequisites
- Node.js installed.
- Gemini API Key.

### 2. Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and set your `GEMINI_API_KEY`.

### 3. Local Development
Start the development server (Vite):
```bash
npm run dev
```
Start the backend proxy (required for PDF rendering and secure API calls):
```bash
node server.js
```

### 4. Build and Production
Build the React frontend:
```bash
npm run build
```
Run the unified server (serves the React app and handles API calls):
```bash
npm start
```
Open `http://localhost:3000` in your browser.

## Security
- API keys are handled via a local Node.js proxy to prevent exposure in the browser. 
- Environment variables are stored in `.env` (ignored by git).

## Project Structure
- `src/`: React frontend source code.
- `server.js`: Node/Express backend proxy and PDF engine.
- `dist/`: Compiled production build.
- `legacy/`: Old standalone HTML files (optional).


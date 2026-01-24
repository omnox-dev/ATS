# ATSMASTER — AI-Powered Resume Analyzer (React Version)

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
node api/index.js
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
 
## Environment & Admin

- Copy `.env.example` to `.env` and set the required values:

	- `GEMINI_API_KEY` — your Gemini API key
	- `ADMIN_PASSWORD` — admin password for the settings panel (keep secret)
	- `PORT` — optional, default `3000`

	Example `.env`:
	```env
	GEMINI_API_KEY=your_gemini_api_key_here
	ADMIN_PASSWORD=your_strong_admin_password
	PORT=3000
	```

- The admin panel authenticates by POSTing the password to `/api/auth`. The server checks `process.env.ADMIN_PASSWORD`.

## Admin Panel (changing the password)

- To change the admin password, edit the `ADMIN_PASSWORD` value in your `.env` and restart the server.
- For production, use a secrets manager instead of `.env` for better security.

## Project Structure
- `api/` — Express server and `config.json`
- `src/` — React frontend source and components
- `public/` — static assets
- `dist/` — production build output

## Run

- Install dependencies:
```bash
npm install
```
- Start frontend (dev):
```bash
npm run dev
```
- Start server:
```bash
npm start
```

Open `http://localhost:3000`.

---
Updated to document environment-based admin password and server auth.

## Project Structure
- `src/`: React frontend source code.
- `server.js`: Node/Express backend proxy and PDF engine.
- `dist/`: Compiled production build.
- `legacy/`: Old standalone HTML files (optional).


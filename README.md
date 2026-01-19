# ATS — AI-Powered Resume Analyzer

Small local project to analyze resumes against job descriptions and generate ATS-friendly improvements.

- **Author:** Omanox-dev
- **Repository:** https://github.com/omnox-dev/ATS
- **License:** Proprietary — All Rights Reserved (see `LICENSE`)

This repository contains a lightweight frontend (`ats_analyzer.html`) and a small Node.js proxy (`server.js`) to securely use the Gemini API for content generation and to render downloadable PDFs of improved resumes.

Usage
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`.
3. Start the server: `node server.js`.
4. Open `http://localhost:3000/ats_analyzer.html` in your browser.

Security note
- Keep the `GEMINI_API_KEY` in the server `.env` file and do not commit it. `.env` is included in `.gitignore`.

Development
-----------
This project was developed using Visual Studio Code and GitHub Copilot Agentic AI Mode. The codebase and iterative changes were authored and reviewed in VS Code with Copilot assisting code generation and refactors. For questions about development environment or workflows, see the repository and contact the author.

# RV Mobile Solutions

...existing code...

RV Mobile Solutions is a small full‑stack project (Node.js backend + Vite + React frontend) for a mobile accessories storefront and admin utilities.

## Table of contents
- Project structure
- Requirements
- Quick start (development)
- Environment variables
- Build & deploy
- License

## Project structure
- backend/ — Express API, server.js, routes, models
- frontend/ — Vite + React app
- .gitattributes, .gitignore, README.md

## Requirements
- Node.js 16+ (or LTS)
- npm (or yarn/pnpm)
- MongoDB (if backend uses a DB)

## Quick start (development)

1. Clone / open project:
   cd "D:\RV Mobile Solutions"

2. Backend:
   cd backend
   npm install
   copy .env.example .env   (or create .env with values)
   npm run start            (or npm run dev if configured)

3. Frontend:
   cd ../frontend
   npm install
   npm run dev

Open frontend dev server URL shown by Vite (usually http://localhost:5173) and backend on configured port (default 5000/3000).

## Environment variables (example .env for backend)
MONGO_URI=mongodb://localhost:27017/rv_mobile_solutions
PORT=5000
JWT_SECRET=your_jwt_secret
STRIPE_KEY=your_stripe_key

## Build & deploy
- Frontend: cd frontend && npm run build → serve generated dist with a static host.
- Backend: ensure .env values available on server, start with PM2/systemd or Docker.

## Notes
- Search and update any remaining old names (e.g., "Daksh") if needed.
- Use a Personal Access Token (PAT) for HTTPS pushes or set up SSH keys.

## License
Choose a license (e.g., MIT) and add LICENSE file if required.

...existing code...

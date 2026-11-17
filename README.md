# US&ABOUT
Free invitation + date-planner platform. Next.js 15 (App Router), TypeScript, Tailwind, Framer Motion, Firebase (Firestore), Vercel.

## Pages
- `/` homepage (all sections) · `/create` invitation wizard
- `/invite/{id}` recipient experience (rewritten to `/i?id=`) · `/manage/{id}` creator dashboard (rewritten to `/m?id=`)

## Firebase
1. Create a Firestore database (production mode) and publish `firestore.rules` (browsers get no direct access).
2. Project settings > Service accounts > Generate new private key.
3. In Vercel add `FIREBASE_SERVICE_ACCOUNT` (the whole JSON) or `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`, plus `NEXT_PUBLIC_SITE_URL`. Redeploy after changing variables.

## Background music (optional)
Add your own licensed audio file at `public/music/soft.mp3`. Without it, the music button hides itself.

## Security
Management token: random, shown once, stored only as a SHA-256 hash, sent in a header (never in a URL path/query) and removed from the address bar after first load.
Creation is rate-limited per instance (best effort). All input is validated on the server.

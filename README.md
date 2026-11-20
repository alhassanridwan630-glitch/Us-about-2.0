# US&ABOUT
See `docs/GUIDE.md` (setup, deployment, launch checklist) and `docs/TESTING.md` (what was and was not tested). Run `npm test` for the automated logic tests (Node 22).
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

## Security and reliability (milestone 2)
- API responses are `no-store`; security headers set in `next.config.mjs` (no CSP yet).
- Rate limits (per server instance): create 10/h, respond 60/h, report 5/h, public read 240/10min, dashboard 120/h.
- Invitations expire (90 days, or 30 days after an event date). Existing invitations without `expiresAt` never expire. Optional: add a Firestore TTL policy on a field if you want automatic deletion.
- Reports are stored in the `reports` collection (Firestore rules still deny all browser access). `disabled: true` on an invitation makes it unavailable; the admin dashboard (later milestone) will manage this.
- Errors shown to visitors never include configuration or database details; the details go to the Vercel function logs.

## Sharing and SEO (milestone 4)
- Set `NEXT_PUBLIC_SITE_URL` in Vercel to your final address (for example `https://yourname.com`). Without it, Vercel's production URL is used.
- Social images are generated at build time (`app/opengraph-image.tsx`, `app/i/opengraph-image.tsx`). The invitation preview is generic on purpose: no names or message.
- `/invite/*` is crawlable for link previews but marked noindex; `/manage/*`, `/my`, `/demo` and `/api/*` are blocked in robots.txt.
- `sitemap.xml` and `robots.txt` are generated. Homepage has WebApplication and FAQ structured data.

## Analytics (milestone 5)
1. Vercel project > Analytics tab > Enable. Vercel project > Speed Insights > Enable. Then redeploy. (Both scripts are served from your own domain; no cookies.)
2. Product events (privacy-safe, coarse properties only): create_started, create_completed, invitation_published, link_shared, invitation_opened, invitation_accepted, invitation_declined, planner_started, planner_completed, ticket_generated, ticket_downloaded, ticket_shared, calendar_event_created. Custom events may require a paid Vercel plan; check your plan in the dashboard. Page views and Speed Insights work without them.
3. Privacy: invitation and dashboard addresses are recorded only as `/invite/[id]` and `/manage/[id]`; no names, messages, tokens or free text are ever sent. Visitors can opt out on the Privacy page.
4. Source of truth, so numbers are never double counted: Vercel = traffic, visitors, events; Firestore = invitation outcomes (created, accepted, declined, plans). The admin dashboard will read outcomes from Firestore only.

## Live sessions and admin sign-in (milestone 6a)
Setup, in order:
1. Firebase console > Build > Authentication > Get started > Sign-in method > enable Email/Password.
2. Authentication > Settings > User actions: turn off "Enable create (sign-up)" so only people you add can have accounts.
3. Authentication > Users > Add user: your email and a strong password.
4. Project settings > General > Your apps > add a Web app. Copy apiKey, authDomain, projectId and appId.
5. Vercel > Settings > Environment Variables: add NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_APP_ID and ADMIN_SETUP_CODE (random, 20+ characters). Redeploy.
6. Open /admin/login, sign in, then enter the setup code on /admin/setup. You are now the Super Admin. Then delete ADMIN_SETUP_CODE in Vercel and redeploy.
7. Firestore > TTL: add a policy for collection `sessions`, field `expireAt` (keeps session records from piling up).

How it works: visitors send an anonymous heartbeat every 60 s while a tab is visible (`sessions` collection, one small document per tab, deleted after 2 hours). The admin page polls aggregate counts every 20 s; no listeners, no session lists. Admin rights live in the `admins` collection and are checked on every request; sessions are 8-hour httpOnly cookies. Sign-ins and denied attempts are written to `auditlog`.
Limits: no multi-factor sign-in yet (needs Firebase Identity Platform); free-tier writes: roughly 1 write per active tab per minute.

## Admin dashboard (milestone 6b-1)
Views by role: Overview + CSV exports (Super Admin, Analytics Viewer), Live activity (all), Invitations + Reports (Super Admin, Moderator), Audit log (Super Admin).
- Totals and rates come from counting the `invitations` collection; trends and occasion popularity come from daily counters (`stats`) that started with milestone 6a. Page views and visitors stay in Vercel Analytics.
- Moderation: Disable/Restore (Moderator and Super Admin). Delete is Super Admin only, needs the invitation to be disabled first and an explicit confirmation. Opening a reported message ("Show message") is allowed only for reported invitations and is logged.
- Invitation lists show a masked id, never names or messages. The audit log records user, action, a short record reference and outcome, never content.
- The invitations list loads the latest 300 and filters in the browser, so no extra Firestore indexes are needed. If Firestore asks for an index for the `planSubmittedAt` or `reportCount` count queries, open the link it prints in the Vercel function logs and create it.

## Settings and admin management (milestone 6b-2)
- **Settings** (Super Admin): announcement banner, maintenance mode (pauses creating invitations, answers and reports; shows a maintenance screen on /create and invitation pages; the dashboard stays available), feature switches (new invitations, reports, music option, reduced animations), the per-hour creation limit, and which occasions are offered. Stored in `settings/site`, validated on the server, cached for 60 seconds, logged in the audit log. If the document is missing or Firebase is unreachable, safe defaults apply.
- **Admins** (Super Admin): add an admin by email (their Firebase account must already exist), change role, remove or restore access. You cannot change your own access, and the last active Super Admin cannot be demoted or removed. Removing access also ends that person's sessions.
- Not included: per-user default invitation settings and a settings history view.

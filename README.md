# Full Gospel Churches of Kenya — Kabarnet Website

Production-ready church website with a live-editable admin dashboard.
Overseer: **Bishop Cheptarus**.

---

## 1. Architecture Overview

```
Next.js 14 (App Router, Vercel)
   ├─ Public site: Home, About, Sermons, Ministries, Giving, Contact
   ├─ /admin/*  → password-protected dashboard (Supabase Auth)
   └─ /api/*    → Route Handlers (events CRUD API)
        │
        ▼
Supabase (Postgres + Auth + Storage)
   ├─ auth.users          → admin login (email/password)
   ├─ events               → CRUD from admin, read-only public
   ├─ announcements        → toggleable top banner
   ├─ sermons               → video/audio/notes links
   ├─ site_settings         → single-row config (service times, Bishop's word, contact info)
   ├─ contact_messages      → inbox from the Contact form
   └─ Storage buckets: flyers, sermon-notes, thumbnails
```

**Why this stack:** Next.js + Vercel gives you the fastest possible page
loads (server-rendered, cached, edge-deployed) with zero server
maintenance. Supabase gives you a real Postgres database, built-in secure
auth for the admin panel, and file storage for flyers/PDFs — all on one
free-tier-friendly platform, with no separate backend server to run or
pay for.

**Security model:**
- Public visitors can only **read** published content (enforced by
  Postgres Row Level Security policies, not just app code).
- Only an authenticated Supabase user (the church admin) can create,
  edit, or delete anything — enforced both by middleware (`middleware.ts`
  redirects unauthenticated users away from `/admin/*`) and by database
  RLS policies (so even a direct API call without a valid session is
  rejected at the database layer).

---

## 2. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) → **New Project**. Choose a
   region close to Kenya (Europe/Frankfurt is typically fastest).
2. Once created, open **SQL Editor** → **New Query**, paste the entire
   contents of `supabase/schema.sql`, and click **Run**. This creates all
   tables, security policies, and seeds the default settings row.
3. Go to **Storage** → create three **public** buckets:
   - `flyers`
   - `sermon-notes`
   - `thumbnails`
   (Toggle "Public bucket" on for each — this lets images/PDFs load
   directly on the website.)
4. Go to **Authentication → Users → Add User**. Create the admin login
   for Bishop Cheptarus / church office, e.g.:
   - Email: `admin@fgckkabarnet.org`
   - Password: (choose something strong — this is the only password
     needed to manage the whole site)
5. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key

---

## 3. Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your Supabase values
cp .env.local.example .env.local
# then edit .env.local:
#   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# 3. Run locally
npm run dev
# open http://localhost:3000
# admin panel: http://localhost:3000/admin/login
```

---

## 4. Deploying to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import
   the repo.
3. In **Environment Variables**, add the same two values from
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel builds and gives you a live URL
   (e.g. `fgck-kabarnet.vercel.app`) in about 1–2 minutes.
5. **Custom domain:** In the Vercel project → **Settings → Domains**, add
   your domain (e.g. `fgckkabarnet.org`) and follow the DNS instructions
   Vercel provides (usually one CNAME or A record at your domain
   registrar).

Every time you push to the `main` branch, Vercel automatically rebuilds
and redeploys — no manual steps needed.

---

## 5. Using the Admin Dashboard

- Go to `yourdomain.org/admin/login` and sign in with the credentials
  created in Supabase Authentication.
- **Events:** Add/edit/delete events, upload a flyer image, mark as
  featured, and toggle published/hidden.
- **Announcements:** Post a banner message; only one can be active at a
  time; visitors can dismiss it per session.
- **Sermons:** Add title, speaker, series, scripture reference, and
  paste in YouTube/audio/PDF links.
- **Site Settings:** Update service times, the Bishop's weekly word
  (shown on the homepage), contact details, map coordinates, and the
  M-Pesa Paybill number/account label — all reflected on the live site
  within seconds (page cache revalidates every 60 seconds, or instantly
  on next visitor load for admin-facing pages).

No code changes or redeployment are ever needed for day-to-day content
updates — that's the entire point of the dashboard.

---

## 6. Getting the Map Coordinates Right

In **Site Settings**, update `latitude`/`longitude` to the church's exact
GPS coordinates:
1. Open Google Maps, right-click the exact church location pin.
2. Click the coordinates that appear at the top of the context menu to
   copy them (format: `latitude, longitude`).
3. Paste the two numbers into the corresponding fields in Site Settings
   and save. The embedded map on the Contact page updates immediately.

---

## 7. M-Pesa Notes

Per your current requirement, the Giving page displays the **Paybill
number and account label only** (no STK Push integration yet). When
you're ready to add real-time STK Push:
- You'll need Safaricom Daraja API credentials (Consumer Key/Secret,
  Passkey, and a registered Paybill/Till).
- STK Push requires a small serverless function (Vercel API route) to
  call Safaricom's API — the `/api/events` route in this project is a
  working example of the same Route Handler pattern you'd extend for
  that.

---

## 8. What's Included vs. What to Expand Next

**Built and working:**
Home, Contact (with live map + form), Giving (Paybill display), full
Admin Dashboard (Events CRUD, Announcements, Sermons, Settings), auth,
database schema, deployment config.

**Scaffolded folders ready for content** (About, Sermons listing,
Ministries): these follow the exact same pattern as the Home/Contact
pages — fetch from Supabase in a Server Component, render with the same
design system. Ask if you'd like these fully built out next, along with
the About page's Bishop Cheptarus biography section.

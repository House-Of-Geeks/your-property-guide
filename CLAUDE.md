@AGENTS.md

# Publishing blog / news posts

Blog content lives in `src/lib/data/blogs.ts` and is mirrored into the
production DB at sync time. To get changes live:

1. Edit `src/lib/data/blogs.ts` (add/update entries — slug is the unique key).
2. `git commit && git push` to main — Vercel auto-deploys the code changes.
3. `npm run publish:blogs` — POSTs the source-of-truth to
   `/api/admin/sync-blogs` on production. The endpoint upserts every post
   into whatever DB Vercel is connected to, revalidates ISR for affected
   paths (`/`, `/guides`, `/guides/category/<cat>`, `/guides/<slug>`), and
   pings IndexNow for any newly-created post URLs.

Flags:
- `npm run publish:blogs -- --prune` — also delete posts that exist in DB
  but not in `blogs.ts` (off by default; opt-in for safety).
- `npm run publish:blogs -- --no-indexnow` — skip the IndexNow ping.
- `PUBLISH_TARGET_URL=https://preview.../  npm run publish:blogs` — target
  a Vercel preview deployment instead of prod.

Auth: the endpoint uses `INDEXNOW_KEY` from `.env` (same key as
`/api/revalidate` and `/api/indexnow`).

Why this exists: the local `.env` `DATABASE_URL` may target a different DB
than Vercel's production env. Running a local seed script will hit the
wrong DB. Sync via the deployed endpoint always hits the right one.

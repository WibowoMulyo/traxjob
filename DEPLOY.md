# Deploying TraxJob

Everything runs on **Vercel** (free Hobby plan, no card needed) plus a managed
**Neon** Postgres database:

- **Frontend** — the Vite SPA (static).
- **API** — the Express app served as a Vercel **Serverless Function**
  (`api/[...path].ts` → every `/api/*` request). Vercel matches functions before
  the SPA rewrite, so `/api/*` hits the function and everything else falls back
  to `index.html`.
- **Database** — PostgreSQL on **Neon** (use the **pooled** connection string —
  serverless-friendly).

Because the SPA and API share one Vercel domain, the session cookie is
same-origin (`SameSite=Lax; Secure`) — no cross-site config needed.

---

## 1. Database — Neon (Singapore, Postgres 16)

You already created it. Grab the **pooled** connection string
(`...-pooler...neon.tech/...?sslmode=require`) — it's the `DATABASE_URL`.

Create the schema once (from your machine, against Neon):

```bash
DATABASE_URL="<neon-pooled-url>" npm run db:migrate
```

(Optional demo account in prod:
`DATABASE_URL="<neon-pooled-url>" npm run db:seed`)

## 2. Vercel — env vars

In the Vercel project → **Settings → Environment Variables** (Production), add:

| Key                  | Value                                                     |
| -------------------- | --------------------------------------------------------- |
| `DATABASE_URL`       | the Neon **pooled** string                                |
| `CLIENT_ORIGIN`      | your production URL, e.g. `https://traxjob.vercel.app`    |
| `GMAIL_USER`         | your Gmail address                                        |
| `GMAIL_APP_PASSWORD` | the Gmail App Password                                    |
| `EMAIL_FROM`         | your Gmail address                                        |

`NODE_ENV=production` is set by Vercel automatically (enables `Secure` cookies).
`CLIENT_ORIGIN` is also what the password-reset emails link to, so it must be
the real production URL.

## 3. Deploy

Push to GitHub — Vercel builds the SPA and the `api/` function together. Then:

- `https://<app>.vercel.app/api/health` → `{"ok":true}`
- Register / log in / add a job to confirm the full stack works.

---

## Local development (unchanged)

```bash
npm run server:dev   # Express on :3001 (uses the same createApp())
npm run dev          # Vite on :5173, proxies /api -> :3001
```

## Notes

- **Cold starts**: Vercel functions cold-start (~1–3s) after idle; warm
  invocations reuse the DB pool (module-level in `db/index.ts`).
- **Migrations**: re-run `npm run db:migrate` against `DATABASE_URL` whenever the
  schema changes (`db/schema.ts` → `npm run db:generate` → commit → migrate).
- **TLS**: `db/index.ts` enables SSL automatically for non-local connections;
  the Neon URL also carries `?sslmode=require`.
- **Secrets**: keep `DATABASE_URL` / Gmail creds only in Vercel env vars and your
  local `.env` (gitignored) — never commit them. Rotate the Neon password if it
  was ever shared in plaintext.

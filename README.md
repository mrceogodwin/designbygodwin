# Godwin Oriabure — Portfolio

A premium, responsive developer portfolio built with Next.js App Router, React, TypeScript, and custom CSS.

## Features
- Editorial light-and-dark visual system with restrained orange accents
- Responsive desktop, tablet, and mobile layout
- CSS motion with reduced-motion support
- Project cards linking to source repositories
- Contact form saved to a separate Neon PostgreSQL database
- Private owner login at `/admin/login` and protected message dashboard at `/admin`
- Signed, HTTP-only owner session cookie and logout

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Owner dashboard configuration

Set these server-side environment variables in Vercel Project Settings → Environment Variables (Production, and Preview only if you want to test there):

- `DATABASE_URL`: the connection string for the dedicated Godmode Neon database
- `ADMIN_EMAIL`: the email address used to sign in as the owner
- `ADMIN_PASSWORD`: a long, unique owner password
- `AUTH_SECRET`: a unique random secret of at least 32 characters used to sign the session cookie

Keep these values private. Do not commit real values to GitHub or expose them as `NEXT_PUBLIC_*` variables. After setting or changing them, redeploy the relevant Vercel environment.

Sign in at `/admin/login`. Only the configured owner credentials can sign in; there is no public registration route. The dashboard lists the 100 latest contact messages. Email notifications are not yet connected.

## Production build

```bash
npm run build
npm start
```

## Deploy
Import `mrceogodwin/designbygodwin` into Vercel and use the default Next.js build settings. Pushes to `main` can deploy automatically after the repository is connected.

## Accuracy note
Project descriptions and development statuses should be reviewed before job applications. Do not add unverified employment history, metrics, or claims.

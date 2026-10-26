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
- Searchable owner inbox for message name, email, topic, and content
- Optional best-effort owner email alerts through Brevo

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Owner dashboard configuration

Set these server-side environment variables in Vercel Project Settings → Environment Variables (Production, and Preview only if you want to test there):

- `DATABASE_URL`: the connection string for the dedicated Godmode Neon database
- `ADMIN_EMAIL`: the email address used to sign in as the owner and receive notifications
- `ADMIN_PASSWORD`: a long, unique owner password
- `AUTH_SECRET`: a unique random secret of at least 32 characters used to sign the session cookie

Keep these values private. Do not commit real values to GitHub or expose them as `NEXT_PUBLIC_*` variables. After setting or changing them, redeploy the relevant Vercel environment.

Sign in at `/admin/login`. Only the configured owner credentials can sign in; there is no public registration route. The dashboard lists and lets you search the 100 latest contact messages.

## Optional email alerts (Brevo)

To send an owner notification after a contact message has been saved, configure both of these server-side environment variables:

- `BREVO_API_KEY`: a private Brevo transactional email API key
- `BREVO_SENDER_EMAIL`: an email address verified as a sender in Brevo

The notification is best-effort: a provider error does not discard a message already stored in Neon. The owner inbox remains the source of truth. Email alerts must be tested after the variables are configured; merely adding the variables does not prove delivery.

## SEO routes

The app defines `/robots.txt` and `/sitemap.xml` through Next.js metadata routes. Verify both return HTTP 200 after the latest source changes are deployed.

## Production build

```bash
npm run build
npm start
```

## Deploy
Import `mrceogodwin/designbygodwin` into Vercel and use the default Next.js build settings. Pushes to `main` can deploy automatically after the repository is connected.

## Accuracy note
Project descriptions and development statuses should be reviewed before job applications. Do not add unverified employment history, metrics, or claims.

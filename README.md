# Adipo Academy — Full project (Dark Premium Theme)

This scaffold includes:
- Node.js + Express backend
- Prisma + PostgreSQL schema
- Cloudinary uploads via multer-storage-cloudinary
- Stripe (test mode placeholder) PaymentIntent + webhook
- React admin app (Vite) preconfigured in /admin-app (dark theme)
- Dockerfile (multi-stage) and render.yaml for Render.com

Quick start:
1. Copy `.env.example` -> `.env` and fill values (DATABASE_URL from Render, JWT secret, Cloudinary, Stripe keys).
2. Locally:
   - npm install
   - npx prisma generate
   - npx prisma migrate dev --name init   (requires a running Postgres)
   - npm run dev
3. For Render:
   - Push repo to GitHub
   - Create Web Service (Docker) or use render.yaml
   - Create managed Postgres in Render
   - Add environment variables in Render dashboard
   - Deploy

Admin app:
- Admin React source is in `admin-app/`. Build with `npm run build` and the Dockerfile copies the build into `public/admin`.

Stripe:
- Use test keys for `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`.
- Create webhook in Stripe dashboard pointing to `/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET` in Render.

Enjoy — unzip and deploy!

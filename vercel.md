# Deploying Tech Academic to Vercel

Follow these steps to deploy your **Tech Academic** admission portal to production using Vercel.

## 1. Prerequisites
- A [Vercel](https://vercel.com) account.
- A [GitHub](https://github.com) account.
- Your project pushed to a GitHub repository.
- A production database (e.g., [Supabase](https://supabase.com)).

## 2. Push to GitHub
If you haven't already, initialize git and push your code:
```bash
git init
git add .
git commit -m "Initial commit: Tech Academic Portal"
# Create a repo on GitHub and follow their instructions to push:
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

## 3. Connect to Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.

## 4. Configure Environment Variables
In the Vercel deployment settings, under **Environment Variables**, add the following from your `.env` file:
- `DATABASE_URL`: Your production PostgreSQL connection string.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (if used for admin features).

> [!IMPORTANT]
> Ensure your `DATABASE_URL` is configured for **Session Mode** or use a connection pooling string (like Supavisor) if you are using Supabase.

## 5. Deployment Settings
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build`
- **Install Command**: `npm install`

## 6. Database Migrations
Vercel won't automatically run your database migrations unless you add them to the build step.
Ensure your `package.json` build script includes prisma:
```json
"scripts": {
  "build": "prisma generate && next build"
}
```
If you want to run migrations automatically on every deploy, use:
`prisma generate && prisma migrate deploy && next build`

## 7. Success!
Once Vercel finishes the build, your portal will be live at a `.vercel.app` URL.

---
**Tech Academic | 2026**

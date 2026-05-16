# 🗄️ Connecting to Supabase (Step-by-Step)

This guide explains how to connect your Student Admission Portal to Supabase using Prisma.

## 1. Create your Supabase Project
1.  Go to [Supabase.com](https://supabase.com) and sign in.
2.  Click **New Project** and select your organization.
3.  Enter a project name and a **Strong Password**.
    *   **CRITICAL:** If your password contains special characters like `@`, `#`, or `/`, you must URL-encode them in the connection string.
    *   **Example:** `@` becomes `%40`. (So `029@Mertu21` becomes `029%40Mertu21`).
4.  Choose a region close to you (e.g., `ap-south-1` for India).
5.  Click **Create New Project**.

## 2. Get your Connection String
1.  Once the project is ready, go to **Project Settings** (gear icon) > **Database**.
2.  Scroll down to the **Connection string** section.
3.  Select the **URI** tab.

### Which Host should I use?
In Prisma 7, we recommend using the **IPv4 Pooler Host** to avoid connection errors on home/office networks that don't support IPv6.

*   **Session Pooler (Port 5432):**
    *   Best for local development and running initial setup commands like `db push`.
*   **Transaction Pooler (Port 6543):**
    *   Best for production traffic to save database resources.

## 3. Update your `.env` File
In the root of your project, update your `.env` file with your connection string. 

**Note:** Always wrap the URL in double quotes `" "` to handle special characters correctly.

```env
# Example using Port 5432 (Session Mode)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD-ENCODED]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# Set the storage provider to supabase
STORAGE_PROVIDER=supabase
```

## 4. Initialize the Database
Run these commands in your terminal to create the tables and the admin account:

```bash
# 1. Sync the schema (Create tables)
npx prisma db push

# 2. Seed the data (Create admin user & sample data)
npx prisma db seed
```

## 5. Troubleshooting Common Errors

### Error: `getaddrinfo ENOENT` or `Can't reach database server`
*   **Cause:** You are likely trying to use the "Direct Connection" which requires IPv6.
*   **Solution:** Switch your host to the **Pooler Host** (e.g., `aws-1-ap-south-1.pooler.supabase.com`) which supports IPv4.

### Error: `SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`
*   **Cause:** Your password contains an `@` symbol that hasn't been encoded, or the URL is not wrapped in quotes.
*   **Solution:** Replace `@` with `%40` and wrap the `DATABASE_URL` in `" "`.

### Error: `Table 'public.Submission' does not exist`
*   **Cause:** You haven't synced the schema yet.
*   **Solution:** Run `npx prisma db push`.

---

## 🚀 Running the App
Once everything is set up:
```bash
npm run dev
```
The app will now read and write directly to your Supabase PostgreSQL database!

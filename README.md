# Premium Student Admission Portal

A stunning, production-ready student admission web application with a modern UI and a fully modular, database-agnostic backend architecture.

## 🌟 Key Features

- **Premium UI/UX:** Glassmorphism aesthetic, responsive design, dark/light mode support, and smooth micro-animations.
- **Database-Agnostic Architecture:** Fully decoupled storage layer using the Adapter Pattern. Works out-of-the-box with JSON files or Memory, and can easily plug into PostgreSQL, Supabase, or MongoDB.
- **Student Portal:** Comprehensive application form with real-time validation.
- **Admin Dashboard:** Overview of total, pending, and accepted applications, with the ability to change application statuses.
- **Email Service Abstraction:** Mock email provider out of the box, ready to connect to SendGrid or AWS SES.

---

## 🏗️ Architecture Overview

The system is designed with a strict separation of concerns, ensuring maximum flexibility:

1. **Frontend Layer (Next.js App Router):**
   - Renders the UI and manages client-side state.
   - Built with pure Vanilla CSS Modules (`page.module.css` and `globals.css`) to enforce design system rules strictly without utility-class clutter.

2. **API Layer (`src/app/api`):**
   - Next.js Route Handlers securely process form submissions and handle admin requests.
   - Delegates all business logic to the Service Layer.

3. **Service Layer (`src/services`):**
   - Acts as the orchestrator. Contains `StorageService.ts` and `EmailService.ts`.
   - Uses environment variables to determine which adapter to instantiate.

4. **Adapter Layer (`src/adapters`):**
   - The core of the database-agnostic design. Implements the `StorageAdapter` interface.
   - Current implementations include:
     - `JsonFileStorageAdapter`: Persists data locally in `/data/submissions.json`.
     - `MemoryStorageAdapter`: Keeps data in RAM (for serverless environments without filesystem access).
   - Easily extendable to `SupabaseAdapter`, `MongoAdapter`, etc.

---

## 💻 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla CSS (CSS Modules) + Custom CSS Variables for Theming
- **Storage:** JSON File System / In-Memory (Easily extensible via Adapters)

---

## 🚀 Getting Started

### 1. Clone & Install
Ensure you have Node.js installed.
```bash
npm install
```

### 2. Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the Student Portal and [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Dashboard.

---

## 🔌 Database Abstraction & Adding New Integrations

Because of the **Adapter Pattern**, integrating a new database like PostgreSQL or Supabase requires zero changes to the core application logic.

### Example: Adding Supabase
1. Create `src/adapters/storage/SupabaseStorageAdapter.ts`:
```typescript
import { StorageAdapter } from './StorageAdapter';
import { createClient } from '@supabase/supabase-js';

export class SupabaseStorageAdapter implements StorageAdapter {
  private supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

  async saveSubmission(data) {
    const { data: result } = await this.supabase.from('submissions').insert(data).select().single();
    return result;
  }
  // ... implement other methods
}
```

2. Update `src/services/StorageService.ts`:
```typescript
if (provider === 'supabase') {
  this.adapter = new SupabaseStorageAdapter();
}
```

---

## 🚀 Getting Started

Follow these steps to get the project running locally:

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (or a Supabase account)

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
# Storage Provider (json, prisma, or supabase)
STORAGE_PROVIDER=prisma

# PostgreSQL Database URL (Required for prisma/supabase)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

### 4. Database Setup (Prisma)
Sync the schema and seed the initial data:
```bash
# Sync schema
npx prisma db push

# Seed admin and sample data
npx prisma db seed
```

### 5. Run the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`.
Admin dashboard is at `http://localhost:3000/admin`.

---

## 📊 Admin Features
- **Status Management:** Change student application status (Pending, Reviewed, Accepted, Rejected).
- **Settings:** Change admin credentials dynamically.
- **Export to Excel:** Export new submissions to XLSX with automated history tracking. The system remembers how many records you've already exported!
- **Data Security:** Delete unwanted submissions directly from the dashboard.

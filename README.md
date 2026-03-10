# Rental Finance Manager (MVP Foundation)

A production-oriented Next.js + Supabase scaffold for a New Zealand rental property owner finance manager.

## Stack
- Next.js (App Router) + TypeScript
- Supabase Auth/Postgres/RLS
- shadcn-style UI components
- TanStack Table
- React Hook Form + Zod

## Implemented in this pass
- Auth routes (`/sign-in`, `/sign-up`) using Supabase Auth
- Protected app shell with left sidebar
- Organisation + membership model foundations
- Initial SQL migration with schema + RLS policies for:
  - organisations
  - organisation_members
  - properties
  - obligations
  - transactions
  - documents
- First CRUD flow for properties:
  - list
  - create
  - edit
  - Zod validation on client and server
- Placeholder routes for obligations, transactions, documents, reports, settings

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Run migrations in Supabase SQL editor or with Supabase CLI:
   - `supabase/migrations/20260310220000_initial_schema.sql`
4. Start app:
   ```bash
   npm run dev
   ```

## Notes
- App is organisation-scoped from the start.
- RLS policies enforce membership-based tenancy boundaries.
- AI features are intentionally not implemented in this MVP pass.
- NZ tax-year logic is prepared for future reporting modules.

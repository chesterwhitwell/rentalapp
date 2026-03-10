# Rental Finance App – Product Overview

## Product summary

This product is a web application for rental property owners to manage the core financial obligations and records associated with one or more properties.

The initial goal is to produce a strong MVP that is practical, trustworthy, and quick to deliver, while keeping a clear path to later expansion into a more fully fledged product.

The app should allow users to:
- manage multiple rental properties
- track recurring financial obligations such as rates, insurance, mortgage payments, body corporate fees, and planned servicing
- record income and expense transactions in a property-linked ledger
- upload and store supporting documents such as receipts, invoices, and statements
- view dashboard summaries and simple reports aligned to the New Zealand tax year
- export key financial data for review, tax preparation, or accountant handover

## Product goals

### Primary goals
- provide a clean, trustworthy way to manage rental-property financial records
- reduce missed obligations by surfacing due and overdue items clearly
- create a single place to store property-linked financial evidence and records
- support straightforward annual review and tax preparation
- establish a scalable architecture for future expansion

### Non-goals for MVP
The MVP should not attempt to include:
- bank-feed integrations
- full double-entry accounting
- automated reconciliation
- OCR-based receipt extraction as a required core workflow
- complex jurisdiction-specific tax automation beyond NZ tax-year support
- native mobile apps
- advanced workflow automation

## Target users

### Primary users
- individual rental property owners
- couples or households managing shared properties
- small property portfolios managed directly by owners

### Secondary users
- a spouse or co-owner with shared access
- a bookkeeper, accountant, or advisor with read-only or limited access

## Product principles
- Keep financial records understandable and auditable.
- Use conventional software for core calculations and business rules.
- Treat AI as an assistive layer, not the source of truth.
- Optimise for clarity, speed, and low admin overhead.
- Build in a way that supports later multi-organisation growth.

## MVP scope

### In scope
- email-based authentication
- organisation-based account structure
- multiple properties per organisation
- recurring obligations with due dates and recurrence frequency
- manual income and expense transaction entry
- links between obligations and transactions
- document upload and storage
- dashboard summaries
- reporting by date, property, and category
- CSV export of ledger and summaries
- CSV import of transactions
- NZD currency support
- NZ tax year support from 1 April to 31 March
- role-based access for owner, manager, and viewer

### Out of scope
- direct tenant payment collection
- maintenance workflow management
- contractor portal
- automatic reminders outside the application unless simple email reminders are added later
- invoice generation
- depreciation engine
- mortgage amortisation modelling
- trust accounting features

## Recommended MVP stack

### Frontend
- Next.js
- TypeScript
- React
- shadcn/ui
- TanStack Table
- React Hook Form
- Zod

### Backend and platform
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Supabase Row Level Security
- Supabase Edge Functions only where needed

### Deployment
- Vercel for the initial app deployment
- Supabase hosted environment for the MVP
- Docker support later for self-hosting the Next.js app if required

## Why this stack

This combination gives the fastest path to a strong MVP because it provides:
- a mature React application framework
- hosted authentication and database
- simple file storage for receipts and invoices
- a clean path to multi-user access
- a clear route from MVP to later SaaS-style architecture

## Product positioning

The product should be framed as:
- a practical rental-property finance manager
- a record-keeping and oversight tool
- a way to reduce admin and improve visibility

It should not be framed as:
- a substitute for legal or tax advice
- a full accounting system
- an automated decision-maker for financial compliance

## Release framing

### Release 1
A trustworthy no-AI MVP focused on:
- properties
- obligations
- transactions
- documents
- reports
- permissions

### Release 2
An AI-assisted layer focused on:
- document extraction
- categorisation suggestions
- property and obligation suggestions
- plain-English summaries

## Success criteria

The MVP should be considered successful when a signed-in owner can:
1. create an organisation
2. create at least one property
3. create recurring obligations for that property
4. record income and expense transactions
5. upload and link supporting documents
6. view due soon and overdue obligations
7. run property and tax-year summaries
8. export ledger data to CSV
9. invite or add another user with a limited role
10. use the app without seeing other organisations’ data

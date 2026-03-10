# Rental Finance App – MVP Feature Specification

## MVP application areas
- dashboard
- properties
- obligations
- transactions
- documents
- reports
- settings

## User experience requirements

### App shell
- left sidebar navigation on desktop
- responsive mobile-friendly layout
- top bar with organisation name and active property filter
- clear empty states and onboarding hints

### Form behaviour
- use side panels, drawers, or dialogs for create and edit actions
- validate all forms clearly
- preserve draft input where practical
- keep forms concise and readable

### Tables
Use TanStack Table for:
- transactions ledger
- obligations list
- documents list
- reporting tables

Tables should support:
- sorting
- filtering
- pagination if needed
- export of filtered data where relevant

## Routes and pages

### Public routes
- `/` – landing page
- `/login` – authentication entry
- `/signup` – optional sign-up page if self-service sign-up is enabled

### Authenticated routes
- `/dashboard`
- `/properties`
- `/properties/[propertyId]`
- `/obligations`
- `/transactions`
- `/documents`
- `/reports`
- `/settings`

## Feature specifications

### Dashboard
Should include:
- income this tax year
- expenses this tax year
- net position
- obligations due soon
- overdue obligations
- recent transactions
- quick links to add transaction or obligation

### Properties
Must support:
- add property
- edit property
- archive property
- view property details
- filter other app views by property

Property details should include:
- name
- address
- notes
- active status

### Obligations
Must support:
- create recurring obligations
- edit obligations
- archive obligations
- track due soon and overdue status
- mark obligation as paid
- optionally create linked expense transaction
- automatically advance next due date when payment is recorded

Supported frequencies:
- weekly
- fortnightly
- monthly
- quarterly
- annually

### Transactions
Must support:
- manual income and expense entry
- categorisation
- property linking
- optional obligation linking
- notes
- date entry
- ledger table view
- filtering by property, type, category, date range, and tax year
- CSV export

Rules:
- store amount as positive numeric value
- treat income and expense as separate types
- derive tax-year from transaction date

### Documents
Must support:
- upload document
- store metadata
- link document to property
- link document to transaction if relevant
- link document to obligation if relevant
- view and download document later

Supported file types:
- PDF
- JPG
- JPEG
- PNG

### Reports
MVP reports should include:
- tax-year summary
- monthly income vs expense summary
- category summary
- property-level summary
- exportable filtered ledger

Filtering options:
- property
- date range
- tax year
- category
- type

## Settings
Should include:
- organisation settings
- membership and roles
- basic preferences later if needed

## Validation rules

Use Zod schemas for all forms and key server operations.

Minimum validation expectations:
- required property name
- required obligation name, amount, frequency, and next due date
- required transaction type, property, date, category, and amount
- positive numeric amounts only
- accepted file types limited to approved MIME types
- role values restricted to approved enum values

## Import and export requirements

### CSV import – MVP
Support importing transactions from CSV.

Required columns:
- date
- property
- type
- category
- description
- amount
- notes

Import behaviour:
- attempt to match property by name within the current organisation
- show validation errors clearly
- create an import summary before commit if possible
- store imported rows with `source = 'csv_import'`

### CSV export – MVP
Support export of:
- filtered transactions ledger
- category summary report
- date-filtered report data

### JSON export – optional
JSON export may be useful for backup or migration, but it is secondary to CSV.

## Suggested component structure

### Shared app shell components
- AppSidebar
- AppHeader
- PropertySwitcher
- EmptyState
- ConfirmDialog

### Property components
- PropertyList
- PropertyCard
- PropertyForm
- PropertyDetailHeader

### Obligation components
- ObligationTable
- ObligationForm
- ObligationStatusBadge
- RecordObligationPaymentAction

### Transaction components
- TransactionTable
- TransactionForm
- TransactionFilters
- TransactionSummaryCards

### Document components
- DocumentUploadForm
- DocumentTable
- DocumentPreviewLink
- LinkedDocumentBadge

### Reporting components
- ReportFilters
- MonthlySummaryTable
- CategorySummaryTable
- ExportButtons

## Suggested folder structure

```text
src/
  app/
    (marketing)/
      page.tsx
    (auth)/
      login/
        page.tsx
    (app)/
      dashboard/
        page.tsx
      properties/
        page.tsx
        [propertyId]/
          page.tsx
      obligations/
        page.tsx
      transactions/
        page.tsx
      documents/
        page.tsx
      reports/
        page.tsx
      settings/
        page.tsx
      layout.tsx
  components/
    ui/
    app-shell/
    properties/
    obligations/
    transactions/
    documents/
    reports/
    dashboard/
  lib/
    supabase/
    auth/
    validation/
    utils/
    formatting/
    tax/
  server/
    actions/
    queries/
  types/
```

## Suggested implementation phases

### Phase 1 – foundations
- set up Next.js project
- configure Supabase
- implement auth
- implement organisation and membership model
- implement app shell and route protection

### Phase 2 – properties and obligations
- properties CRUD
- obligations CRUD
- due soon and overdue logic
- dashboard summary placeholders

### Phase 3 – transactions and reporting
- transactions CRUD
- tax-year calculation
- dashboard summary cards
- monthly and category reports
- CSV export

### Phase 4 – documents and permissions
- document upload and metadata
- role-based permissions
- viewer restrictions
- manager restrictions

### Phase 5 – import and polish
- CSV import flow
- improved validation and error handling
- onboarding and empty states
- responsive polish
- QA and bug fixing

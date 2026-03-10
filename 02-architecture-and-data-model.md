# Rental Finance App – Architecture and Data Model

## Architecture overview

The application should be built as a modern full-stack web application using Next.js for the app layer and Supabase for authentication, database, storage, and security.

## Architectural principles
- keep the MVP simple and maintainable
- prefer relational modelling over ad hoc document structures
- make organisation membership the root of access control
- keep business rules explicit and testable
- support future expansion without overbuilding now

## Application areas
- public marketing or landing area
- authenticated application area
  - dashboard
  - properties
  - obligations
  - transactions
  - documents
  - reports
  - settings

## Multi-organisation model

The product should be organisation-based from the start.

This means:
- every core record belongs to an organisation
- users are linked to organisations through membership records
- permissions are determined by organisation role
- all data access is scoped through organisation membership

This supports:
- co-owners
- small portfolio management
- limited-access viewers
- future SaaS expansion

## Roles and permissions

### Owner
Can:
- manage organisation settings
- manage users and roles
- create, update, archive, and delete properties
- manage obligations
- manage transactions
- manage documents
- run exports and reports

### Manager
Can:
- manage properties
- manage obligations
- manage transactions
- manage documents
- run reports and exports

Cannot:
- manage organisation billing
- delete organisation
- manage all user permissions unless explicitly allowed later

### Viewer
Can:
- view dashboard, properties, obligations, transactions, documents, and reports
- export reports if enabled

Cannot:
- create, edit, or delete records

## Core entities

### organisations
Fields:
- id
- name
- slug
- created_at
- updated_at

### organisation_members
Fields:
- id
- organisation_id
- user_id
- role
- created_at
- updated_at

### properties
Fields:
- id
- organisation_id
- name
- address_line_1
- address_line_2
- suburb
- city
- postcode
- country
- notes
- active
- created_at
- updated_at
- created_by
- updated_by

### obligations
Fields:
- id
- organisation_id
- property_id
- name
- category
- frequency
- amount
- next_due_date
- autopost_to_ledger
- notes
- active
- created_at
- updated_at
- created_by
- updated_by

### transactions
Fields:
- id
- organisation_id
- property_id
- obligation_id nullable
- type
- category
- transaction_date
- description
- amount
- tax_year
- source
- notes
- created_at
- updated_at
- created_by
- updated_by

### documents
Fields:
- id
- organisation_id
- property_id nullable
- transaction_id nullable
- obligation_id nullable
- file_name
- file_path
- mime_type
- size_bytes
- document_type
- issue_date nullable
- notes
- created_at
- updated_at
- created_by

### rent_schedules (MVP+)
Fields:
- id
- organisation_id
- property_id
- frequency
- expected_amount
- start_date
- end_date nullable
- active
- created_at
- updated_at

## Suggested database schema outline

### organisations
- `id uuid primary key`
- `name text not null`
- `slug text unique not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### organisation_members
- `id uuid primary key`
- `organisation_id uuid not null references organisations(id) on delete cascade`
- `user_id uuid not null`
- `role text not null check (role in ('owner','manager','viewer'))`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- unique `(organisation_id, user_id)`

### properties
- `id uuid primary key`
- `organisation_id uuid not null references organisations(id) on delete cascade`
- `name text not null`
- `address_line_1 text`
- `address_line_2 text`
- `suburb text`
- `city text`
- `postcode text`
- `country text default 'New Zealand'`
- `notes text`
- `active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `created_by uuid`
- `updated_by uuid`

### obligations
- `id uuid primary key`
- `organisation_id uuid not null references organisations(id) on delete cascade`
- `property_id uuid not null references properties(id) on delete cascade`
- `name text not null`
- `category text not null`
- `frequency text not null check (frequency in ('weekly','fortnightly','monthly','quarterly','annually'))`
- `amount numeric(12,2) not null`
- `next_due_date date not null`
- `autopost_to_ledger boolean not null default false`
- `notes text`
- `active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `created_by uuid`
- `updated_by uuid`

### transactions
- `id uuid primary key`
- `organisation_id uuid not null references organisations(id) on delete cascade`
- `property_id uuid not null references properties(id) on delete cascade`
- `obligation_id uuid references obligations(id) on delete set null`
- `type text not null check (type in ('income','expense'))`
- `category text not null`
- `transaction_date date not null`
- `description text`
- `amount numeric(12,2) not null`
- `tax_year text not null`
- `source text not null check (source in ('manual','obligation','csv_import'))`
- `notes text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `created_by uuid`
- `updated_by uuid`

### documents
- `id uuid primary key`
- `organisation_id uuid not null references organisations(id) on delete cascade`
- `property_id uuid references properties(id) on delete set null`
- `transaction_id uuid references transactions(id) on delete set null`
- `obligation_id uuid references obligations(id) on delete set null`
- `file_name text not null`
- `file_path text not null`
- `mime_type text not null`
- `size_bytes bigint not null`
- `document_type text not null`
- `issue_date date`
- `notes text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `created_by uuid`

## Row Level Security requirements

All core tables must use Row Level Security.

### Core rule
A user may only access rows where they belong to the row’s organisation through `organisation_members`.

### Tables that require organisation-scoped RLS
- organisations
- organisation_members
- properties
- obligations
- transactions
- documents

### Permission behaviour
- owners can read and write all rows in their organisations
- managers can read and write most operational rows in their organisations
- viewers can read but not write

## Core business rules

### Property rules
- each property must belong to one organisation
- archived properties should not be available for new obligations or transactions unless explicitly reactivated

### Obligation rules
- each obligation must belong to one property and one organisation
- obligations must support one of the approved frequencies
- obligations can be marked inactive rather than deleted when historic record is useful
- recording payment for an obligation may optionally create a linked expense transaction
- once a payment is recorded, the next due date should advance according to the obligation frequency

### Transaction rules
- every transaction must belong to one organisation and one property
- transaction type must be either income or expense
- amount should always be stored as a positive numeric value
- sign should be derived from transaction type in reports, not stored as a negative number
- `tax_year` should be derived from the transaction date using the NZ tax-year boundary

### Document rules
- documents must be stored in Supabase Storage with metadata in the database
- documents may be linked to a property, transaction, obligation, or any combination that makes sense
- only permitted members of the same organisation may access document metadata and file URLs

## NZ-specific logic

### Currency
- display and store amounts in NZD context

### Tax year
The application must support the New Zealand tax year:
- starts on 1 April
- ends on 31 March

The system should calculate and store a tax-year label such as:
- `2025-2026`

### Suggested default categories

Income:
- Rent
- Bond received
- Reimbursement
- Other income

Expenses:
- Rates
- Insurance
- Mortgage
- Repairs
- Maintenance
- Property management
- Body corporate
- Utilities
- Compliance
- Tax
- Other expense

# Rental Finance App – Implementation Pack

## Build intent

This document translates the agreed design into implementation guidance for a coding agent or engineering team.

## Shared implementation principles
- prioritise reliable CRUD and permissions before advanced features
- keep the data model clean and explicit
- do not over-engineer accounting features in the MVP
- treat organisation-scoped access control as a core requirement
- favour maintainable, conventional patterns over clever abstractions

## AI Starter Pack implementation brief

### Included features
1. AI-assisted document extraction
2. Smart transaction categorisation
3. Property suggestion
4. Obligation match suggestion
5. Plain-English monthly summary

The AI layer should be assistive, not autonomous.

## Feature brief 1 – AI-assisted document extraction

### Goal
Turn uploaded receipts, invoices, notices, and statements into structured draft data.

### Supported document types
- receipt
- invoice
- rates notice
- insurance notice
- mortgage statement
- other financial document

### UX flow
1. User uploads a document.
2. File is stored in Supabase Storage.
3. Metadata row is created in `documents`.
4. Extraction pipeline runs.
5. User sees a review panel containing:
   - detected document type
   - supplier or issuer
   - issue date
   - due date if found
   - total amount
   - suggested category
   - suggested property
   - suggested obligation
   - confidence indicators
6. User can:
   - confirm and save
   - edit fields first
   - create linked transaction
   - save document only
   - dismiss AI suggestions

### Outputs
- document_type
- supplier_name
- issue_date
- due_date
- total_amount
- suggested_category
- suggested_property_id
- suggested_obligation_id
- suggested_description
- extracted_text
- confidence
- warnings

### Suggested schema additions
#### `ai_document_extractions`
- id
- document_id
- organisation_id
- extracted_text
- extracted_supplier
- extracted_issue_date
- extracted_due_date
- extracted_total_amount
- suggested_document_type
- suggested_category
- suggested_property_id
- suggested_obligation_id
- suggested_description
- confidence_score
- warning_flags jsonb
- status
- model_version
- created_at
- reviewed_at
- reviewed_by

#### `documents`
Add if not present:
- ai_extraction_status
- ai_review_required boolean

### API shape
#### `POST /api/ai/documents/extract`
Input:
- document_id

Output:
- extraction record payload

#### `POST /api/ai/documents/confirm`
Input:
- document_id
- confirmed fields
- create_transaction boolean

Output:
- updated document
- optional created transaction

### Guardrails
- do not auto-create transaction unless the user confirms
- show low-confidence fields prominently
- preserve extracted text for audit and review
- reject unsupported formats early

## Feature brief 2 – Smart transaction categorisation

### Goal
Suggest the best category and type for manual or imported transactions.

### UX flow – manual entry
1. User starts entering transaction details.
2. When description, amount, or supplier-like text is entered, suggestion runs.
3. Suggested values appear inline:
   - type
   - category
   - property
   - obligation match
4. User accepts or overrides.

### UX flow – CSV import
1. User uploads CSV.
2. Each row is pre-processed.
3. AI suggestions are generated for uncertain rows only.
4. Import review screen shows:
   - raw row
   - suggested category/type/property
   - confidence
   - rows needing user attention

### Outputs
- suggested_type
- suggested_category
- suggested_property_id
- suggested_obligation_id
- suggested_description
- confidence_score
- explanation

### Suggested schema additions
#### `ai_transaction_suggestions`
- id
- organisation_id
- source_type
- source_reference_id
- suggested_type
- suggested_category
- suggested_property_id
- suggested_obligation_id
- suggested_description
- confidence_score
- explanation
- status
- model_version
- created_at
- reviewed_at
- reviewed_by

### API shape
#### `POST /api/ai/transactions/suggest`
Input:
- description
- amount
- date
- property_id optional
- document_id optional

Output:
- suggestion payload

#### `POST /api/ai/imports/transactions/review`
Input:
- parsed CSV rows

Output:
- row-by-row suggestions and flags

### Guardrails
- use deterministic rules first where possible
- only call AI for ambiguous rows
- user must confirm imported rows before final import
- do not overwrite user-selected category after manual change unless explicitly re-run

## Feature brief 3 – Property suggestion

### Goal
Suggest the most likely property for a transaction or uploaded document.

### Inputs
- property list and addresses
- document text
- supplier
- obligation schedules
- previous similar transactions
- current property context if selected

### Outputs
- suggested_property_id
- alternate_property_ids
- confidence_score
- explanation

### Suggested logic layering
1. Exact or near-exact rule match first
2. AI suggestion only if still ambiguous

### API shape
#### `POST /api/ai/properties/suggest`
Input:
- source_type
- source_reference_id or payload

Output:
- property suggestion payload

### Guardrails
- never auto-assign if confidence is low
- show top alternatives where ambiguity exists
- prioritise deterministic matching over AI

## Feature brief 4 – Obligation match suggestion

### Goal
Suggest whether a document or transaction corresponds to an existing recurring obligation.

### Matching criteria
- amount similarity
- category similarity
- due date proximity
- supplier or issuer match
- property match

### Outputs
- suggested_obligation_id
- confidence_score
- explanation
- alternate matches

### API shape
#### `POST /api/ai/obligations/match`
Input:
- transaction payload or document extraction payload

Output:
- likely obligation matches

### Guardrails
- do not silently alter obligation schedules from AI alone
- if a user confirms payment recording, then use deterministic logic to link the transaction and advance due date if appropriate

## Feature brief 5 – Plain-English monthly summary

### Goal
Generate a concise, helpful narrative from monthly financial data.

### Inputs
- monthly totals
- income/expense by category
- prior month comparison
- due/overdue obligations
- anomalies or flags if available

### Outputs
- summary paragraph
- key points to review
- optional notable changes section

### API shape
#### `POST /api/ai/reports/monthly-summary`
Input:
- organisation_id
- property_id optional
- period_start
- period_end
- summary metrics payload

Output:
- summary text
- notable points array

### Guardrails
- only summarise visible data
- avoid recommendations framed as legal or tax advice
- avoid speculative statements where data is thin
- if dataset is small, say so plainly

## Suggested service layout

```text
src/
  server/
    ai/
      documents.ts
      transactions.ts
      properties.ts
      obligations.ts
      reports.ts
      prompts/
        documentExtraction.ts
        transactionSuggestion.ts
        propertySuggestion.ts
        obligationMatch.ts
        monthlySummary.ts
      schemas/
        documentExtraction.ts
        transactionSuggestion.ts
        propertySuggestion.ts
        obligationMatch.ts
        monthlySummary.ts
```

## Deterministic logic before AI

### For document extraction
Use non-AI parsing first for:
- obvious amounts
- obvious dates
- file metadata
- known supplier patterns

### For categorisation
Use rules first for:
- exact supplier to category mappings
- exact obligation reference matches
- known keywords such as:
  - rates
  - insurance
  - body corp
  - mortgage

### For property suggestion
Use rules first for:
- exact address mentions
- obligation-linked property
- unique supplier-to-property mappings where valid

AI should handle ambiguity, not routine cases.

## Review UX requirements

The AI review panel should show:
- suggested values
- confidence level
- why suggested
- editable fields
- original source snippet where available
- confirm, reject, or save-without-applying actions

### Confidence display
Suggested thresholds:
- High: 0.85+
- Medium: 0.60–0.84
- Low: below 0.60

Low-confidence suggestions should not be preselected if avoidable.

## Suggested statuses

### For extraction and suggestions
- `pending_review`
- `accepted`
- `edited_then_accepted`
- `rejected`
- `failed`

### For AI review flags later
- `open`
- `dismissed`
- `resolved`

## Audit and traceability

For each AI action, store:
- model version
- timestamp
- source record
- structured output
- confidence
- user outcome
- final confirmed values

## Acceptance criteria by release

### Release A – document intelligence
Includes:
- AI-assisted document extraction
- property suggestion
- obligation suggestion from documents
- confirm-and-create transaction flow

Success means:
- user can upload a receipt or invoice
- app extracts draft fields
- user confirms or edits
- linked transaction can be created
- document remains attached and auditable

### Release B – ledger intelligence
Includes:
- smart categorisation for manual entry
- smart categorisation for CSV import
- property suggestion for transactions
- obligation suggestion for transactions

Success means:
- manual entry is faster
- ambiguous imports are easier to review
- users can override suggestions easily

### Release C – insight layer
Includes:
- plain-English monthly summaries

Success means:
- users can read concise summaries tied to report data
- summaries remain accurate and restrained

## Suggested implementation order
1. build storage tables for AI suggestions and review states
2. implement document extraction workflow
3. implement confirm-and-create transaction flow
4. implement transaction categorisation suggestions
5. implement property and obligation suggestion logic
6. implement monthly summary generation

## Biggest risks and mitigations

### Risk: user distrust
Mitigation:
- show confidence
- preserve source data
- require confirmation

### Risk: wrong financial categorisation
Mitigation:
- suggestions only
- clear override
- deterministic rules first

### Risk: messy OCR or document text
Mitigation:
- support clean formats first
- show extraction warnings
- allow save-as-document-only path

### Risk: too much AI cost
Mitigation:
- run AI only when ambiguity exists
- cache results
- use deterministic pre-checks
- avoid repeated calls on unchanged records

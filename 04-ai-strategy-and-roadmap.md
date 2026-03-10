# Rental Finance App – AI Strategy and Roadmap

## Guiding principle

AI should sit on top of the app as an assistive layer.

Use conventional software for:
- calculations
- dates
- recurrence
- tax-year assignment
- permissions
- reports
- database writes

Use AI for:
- extraction
- suggestion
- summarisation
- anomaly detection
- natural-language access

## AI design principles
- human-in-the-loop confirmation for financial actions
- structured outputs rather than free-form responses
- deterministic logic before AI
- confidence-aware UX
- preserve source data and auditability
- keep AI suggestions separate from confirmed records

## Priority matrix

### Tier 1 – best early wins
| Feature | User value | Complexity | Risk | Why it matters |
|---|---:|---:|---:|---|
| Receipt/invoice extraction | Very high | Medium | Medium | Saves time and reduces data entry |
| Smart categorisation | High | Low–Medium | Low | Improves consistency and speed |
| Property suggestion | High | Low–Medium | Low | Useful for multi-property owners |
| Obligation matching suggestion | High | Medium | Low–Medium | Connects documents, bills, and ledger entries |
| Plain-English monthly summaries | High | Low | Low | Makes reports much more readable |

### Tier 2 – strong next stage
| Feature | User value | Complexity | Risk | Why it matters |
|---|---:|---:|---:|---|
| Natural-language search | High | Medium | Low–Medium | Makes records easier to access |
| Anomaly detection | High | Medium | Medium | Helps spot errors and missed items |
| Unlinked document detection | Medium–High | Medium | Low | Keeps admin tidy |
| Missing rent-period detection | High | Medium | Medium | Useful for owner oversight |
| Duplicate transaction detection | High | Medium | Medium | Prevents messy ledgers |

### Tier 3 – later strategic features
| Feature | User value | Complexity | Risk | Why it matters |
|---|---:|---:|---:|---|
| Conversational finance assistant | High | High | Medium | Strong user-facing differentiator |
| Tax prep assistant | High | High | High | Valuable, but needs careful framing |
| Forecasting and trend insights | Medium–High | High | Medium | Good once enough historical data exists |
| Maintenance cost pattern insights | Medium | High | Medium | Helpful for mature portfolios |
| Portfolio benchmarking | Medium | High | High | Only useful later and may need external data |

## Recommended rollout

### Phase A – first AI release
- document extraction
- transaction categorisation
- property suggestion
- plain-English monthly summary

### Phase B – review and search intelligence
- natural-language search
- duplicate and anomaly detection
- unlinked document and record detection
- missing rent-period detection

### Phase C – advanced assistant layer
- conversational assistant
- tax prep assistant
- forecasting and trend insights

## Best first AI package

### AI Starter Pack
- receipt/invoice extraction
- smart category suggestion
- property suggestion
- obligation match suggestion
- plain-English monthly summary

This is the best first package because it directly reduces admin and improves data quality.

## Where not to use AI heavily

These areas should remain deterministic:
- totals
- balances
- date calculations
- tax-year assignment
- recurrence logic
- report generation
- permission checks

AI can suggest categories or linkages, but it should not silently:
- delete records
- merge records
- reclassify sensitive entries without review
- decide tax treatment definitively

## AI data requirements by feature

| Feature | Needs transactions | Needs obligations | Needs documents | Needs OCR/text extraction | Benefits from history |
|---|---:|---:|---:|---:|---:|
| Receipt extraction | No | No | Yes | Yes | No |
| Categorisation | Yes | Optional | Optional | Helpful | Yes |
| Property suggestion | Yes | Helpful | Helpful | Helpful | Yes |
| Obligation matching | Helpful | Yes | Helpful | Helpful | Yes |
| Plain-English summaries | Yes | Helpful | No | No | Helpful |
| Natural-language search | Yes | Yes | Yes | Helpful | Helpful |
| Anomaly detection | Yes | Yes | Optional | No | Yes |
| Tax prep assistant | Yes | Helpful | Yes | Helpful | Yes |

## Product roadmap recommendation

### Release 1 – no AI
Get the core product trustworthy first.

### Release 2 – first AI layer
Add:
- document extraction
- categorisation
- property suggestion
- monthly summary narration

### Release 3 – intelligence layer
Add:
- obligation matching
- anomaly detection
- duplicate detection
- unlinked document prompts

### Release 4 – assistant layer
Add:
- natural-language search
- conversational assistant
- annual review and tax prep assistant

## Strongest recommendation

If only one AI workflow is built first, it should be:

### AI-assisted document-to-transaction workflow
1. upload receipt/invoice
2. extract key fields
3. suggest property, category, and obligation
4. let the user confirm
5. optionally create a linked transaction

This is the highest-value, most coherent first AI workflow in the product.

## Positioning guidance

AI in this app should be positioned as:
- reducing admin
- improving record quality
- surfacing insights
- helping users find and understand information faster

It should not be positioned as:
- doing accounting for the user
- making compliance decisions
- guaranteeing tax correctness

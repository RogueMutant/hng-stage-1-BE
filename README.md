# Intelligence Query Engine (Stage 2)

This project has been upgraded to a high-performance query engine for profile analytics. It supports advanced filtering, sorting, pagination, and rule-based natural language search.

## Stage 2 Features

- **Advanced Filtering:** Combine multiple filters including gender, age group, country, and probability thresholds.
- **Sorting & Pagination:** Efficient server-side sorting and pagination (indexed).
- **Natural Language Search:** Rule-based parsing of English queries into structured database filters.
- **High Performance:** Indexed database fields for optimized query execution.
- **Idempotent Seeding:** Seed script to populate 2026 records without duplicates.

## Parsing Strategy

The natural language search engine (`/api/profiles/search`) uses a strict rule-based approach (No AI):

1. **Normalization:** Input is trimmed and converted to lowercase.
2. **Tokenization:** Query is split into individual words (tokens).
3. **Keyword Mapping:**
   - **Gender:** Maps "male", "males" to `male` and "female", "females" to `female`.
   - **Age Groups:** Recognizes "child", "teenager", "adult", "senior".
   - **Special Keywords:** "young" is mapped to `min_age=16` and `max_age=24`.
   - **Country Lookup:** Maps common country names (e.g., "nigeria", "kenya") to their ISO codes.
4. **Regex Patterns:**
   - Detects numeric age constraints like "above 30", "below 20", "over 18", "under 60".
5. **Filter Building:** Combines all detected attributes into a structured filter object passed to the core query engine.

## Limitations

- **Complex Grammar:** Does not support complex sentence structures or negative filters (e.g., "not from Nigeria").
- **Multi-Country Queries:** Only the first detected country is applied in a single query.
- **Synonyms:** Only the predefined list of keywords and their plural forms are supported.
- **Ambiguity:** Queries that don't match any known patterns will return an error.

## API Endpoints (Upgraded)

### 1. GET /api/profiles
Supports filtering, sorting, and pagination.

**Query Params:**
- `gender`: string
- `age_group`: string
- `country_id`: string
- `min_age`: number
- `max_age`: number
- `min_gender_probability`: number
- `min_country_probability`: number
- `sort_by`: `age`, `created_at`, `gender_probability`
- `order`: `asc`, `desc`
- `page`: number (default 1)
- `limit`: number (default 10, max 50)

### 2. GET /api/profiles/search?q=...
Rule-based search.

**Examples:**
- `/api/profiles/search?q=young males from nigeria`
- `/api/profiles/search?q=females above 30`
- `/api/profiles/search?q=adults from kenya`

## Data Seeding

To seed the database with 2026 idempotent records:

```bash
npm run seed
```

## Local Setup

1. Install dependencies: `npm install`
2. Sync database: `npx prisma db push`
3. Seed data: `npm run seed`
4. Start dev server: `npm run dev`

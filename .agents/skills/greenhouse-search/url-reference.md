# Greenhouse Job Board API Reference

Public, unauthenticated JSON API used by this skill. One board per company — there is
no cross-company search endpoint.

> Verified live during `/add-portal` setup against `databricks`, `asana`, and `figma`
> (all valid boards) and a nonexistent slug (confirmed 404). `robots.txt` at
> `boards-api.greenhouse.io/robots.txt` only disallows `/embed/` — the `/v1/boards/`
> paths used here are unrestricted.

## Finding a company's board slug

The slug is the path segment in the company's public careers page URL:
`https://boards.greenhouse.io/<slug>` (or a custom-domain careers page that embeds the
same board — check the page's network requests for `boards-api.greenhouse.io` calls if
the public URL isn't the standard `boards.greenhouse.io` one).

## List jobs on a board

```
GET https://boards-api.greenhouse.io/v1/boards/<company>/jobs
```

- Returns `{ "jobs": [...] }` — **every** job on the board, in one response. No
  server-side `query`, date filter, or pagination parameters exist for this endpoint.
- Optional `?content=true` includes each job's full HTML `content` field inline; the CLI
  omits this for `search` (keeps the response small) and relies on the per-job detail
  endpoint instead, which includes `content` by default.
- **404** if the company slug has no Greenhouse board (confirmed live against a bogus
  slug — returns `{"status":404,"error":"Job not found"}` with HTTP 404, no `jobs` key).

### Per-job fields (list endpoint)

| Field | Notes |
|-------|-------|
| `id` | Numeric, globally unique across all Greenhouse boards |
| `title` | Job title |
| `company_name` | Display name (may differ slightly from the slug) |
| `location.name` | Free-text location string, e.g. `"Remote - US"`, `"Tokyo, Japan"` |
| `absolute_url` | Public posting URL (view + apply) |
| `updated_at` | ISO timestamp, last modified |
| `first_published` | ISO timestamp, first posted — used for the `--jobage` filter |
| `requisition_id` | Internal req ID, useful as a human-readable reference |
| `departments[].name`, `offices[].name` | Present on the detail endpoint; sparse on the list endpoint |

## Single job detail

```
GET https://boards-api.greenhouse.io/v1/boards/<company>/jobs/<job_id>
```

- Includes the full `content` field (job description) **by default** — `?content=true`
  is not required here (only matters for the list endpoint).
- **404** if the job ID doesn't exist on that company's board (verified: a job ID valid
  on one board 404s if queried against a different company slug — IDs are not
  board-scoped for lookup purposes, you must supply the correct `--company`).

### The `content` field is double HTML-escaped

Verified via raw `curl` (not through a summarizing fetch, which can silently
re-escape output and hide this). A real response looks like:

```json
{"content":"&lt;p&gt;We're hiring...&lt;/p&gt;"}
```

After `JSON.parse`, the `content` string is literally `&lt;p&gt;We're hiring...&lt;/p&gt;`
— i.e. the HTML tags themselves are HTML-entity-escaped inside the JSON string, not
real markup. Decoding entities once reveals real tags (`<p>...</p>`); any entity that
was part of the *original* text (e.g. a literal ampersand written as `&amp;` in the
source HTML) will itself have been escaped again in this process, so stripping tags and
decoding a second time is required to get clean plain text. See `cleanContent` in
`cli/src/helpers.ts`.

## Notes

- No authentication, no API key.
- No documented rate limit was hit during testing, but the CLI backs off on 429/5xx
  with exponential backoff + jitter (max 6 retries) as a precaution, matching the other
  portal skills in this repo.
- Not every company uses Greenhouse — a 404 on the list endpoint just means "wrong slug
  or this company uses a different ATS" (e.g. `notion` and `grammarly` both 404'd
  during verification; `databricks`, `asana`, and `figma` all resolved correctly).

---
name: greenhouse-search
version: 1.0.0
description: >
  Use this skill when the user wants to search job openings on a specific company's
  Greenhouse-hosted careers page/job board, or asks to check open roles at a named
  company that uses Greenhouse (boards.greenhouse.io). Unlike a general job-portal
  search, this targets one company's board at a time — the user (or the calling skill)
  must supply a company name/slug. Trigger phrases: check openings at <company>, jobs at
  <company>, does <company> have any openings, <company> careers page, Greenhouse job
  board, ATS job search.
context: fork
allowed-tools: Bash(bun run .agents/skills/greenhouse-search/cli/src/cli.ts *)
---

# Greenhouse Job Board Search Skill

Search live job listings on a specific company's **Greenhouse** job board
(`boards.greenhouse.io/<company>`). No authentication, no API key, and **zero runtime
dependencies** — it runs with just `bun`.

> Greenhouse is a per-company Applicant Tracking System (ATS), not a general job
> portal — there is no "search every company" endpoint. This skill answers "what's open
> at Company X" rather than "what AI jobs exist in my city." Pair it with
> `linkedin-search` for broad geographic/keyword search, and use this skill once you
> have specific target companies in mind.

## When to use this skill

- Check open roles at a specific company that hosts its careers page on Greenhouse
- Filter that company's openings by keyword or location
- Get the full description of a specific job listing at that company

## Finding a company's board slug

The slug is the path segment in `https://boards.greenhouse.io/<slug>` — usually the
company's name in lowercase, no spaces (e.g. `databricks`, `asana`, `figma`). If unsure,
search `"<company name> careers greenhouse"` or check the company's own careers page for
a `boards.greenhouse.io` or `job-boards.greenhouse.io` link. A wrong or nonexistent slug
returns a clean `BOARD_NOT_FOUND` error rather than a crash — try a close variant if the
first guess fails.

## Commands

### Search a company's job board

```bash
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search --company <slug> [flags]
```

Key flags:
- `--company <slug>` / `-c <slug>` — **required.** The board slug, e.g. `databricks`, `asana`, `figma`.
- `--query <text>` / `-q <text>` — keyword match against the job title.
- `--location <text>` / `-l <text>` — substring match against the posting's location.
- `--jobage <days>` — posted within N days (uses the posting's first-published date). Omit for all postings.
- `--page <n>` — page number (1-indexed, 25 results per page — applied client-side, Greenhouse's API has no native pagination).
- `--limit <n>` / `-n <n>` — cap total results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/greenhouse-search/cli/src/cli.ts detail <id> --company <slug> [--format json|plain]
```

`id` is the job ID from `search` results (e.g. `7962954`). Returns the full description,
department, office, and requisition ID.

## Usage examples

```bash
# AI/GenAI roles at Databricks
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search -c databricks -q "AI" --format table

# Product management roles at Asana, remote only
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search -c asana -q "product manager" -l "Remote" --format table

# Everything posted at Figma in the last 14 days
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search -c figma --jobage 14 --format table

# Full detail for a specific job
bun run .agents/skills/greenhouse-search/cli/src/cli.ts detail 7962954 -c asana --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Data is from Greenhouse's public Job Board API (`boards-api.greenhouse.io`) — no credentials required.
- **No cross-company search.** Every command needs `--company`. To check several target
  companies, run the search once per company slug.
- **No native search, date filter, or pagination** on Greenhouse's side — the API
  returns every job on a board in one response, and this CLI applies `--query`,
  `--location`, `--jobage`, `--page`, and `--limit` client-side.
- Not every company uses Greenhouse; a `BOARD_NOT_FOUND` error means either the slug is
  wrong or that company uses a different ATS (e.g. Ashby, Lever, Workday).
- Job IDs are numeric and globally unique, but lookups are still board-scoped — you must
  pass the correct `--company` for `detail` to find it.

# greenhouse-cli

CLI for searching a company's job listings on **Greenhouse's public Job Board API**.

**Data source**: `boards-api.greenhouse.io/v1/boards/<company>/jobs` and `.../jobs/<id>`.
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch`). `bun install` is optional and only pulls dev type defs.

> **No cross-company search.** Greenhouse hosts one board per company — there is no
> "search every company at once" endpoint. Every command requires `--company <slug>`,
> the slug from the company's `boards.greenhouse.io/<slug>` URL.

## Installation

```bash
cd .agents/skills/greenhouse-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search a company's job board (`--company` required) |
| `detail` | Fetch full detail for a single job listing (`--company` required) |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts `--format json|plain`.
All errors are written to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
# AI-related roles at Databricks
bun run src/cli.ts search -c databricks -q "AI" --format table

# Product roles at Asana, remote only
bun run src/cli.ts search -c asana -q "product manager" -l "Remote" --format table

# Everything posted at Figma in the last 14 days
bun run src/cli.ts search -c figma --jobage 14 --format table

# Full detail for one job
bun run src/cli.ts detail 7962954 -c asana --format plain
```

See `../SKILL.md` for the full flag reference and finding a company's board slug.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--company` | `-c` | **Required.** Board slug, e.g. `databricks`, `asana`, `figma`. |
| `--query` | `-q` | Keywords, matched against the job title (substring, case-insensitive). |
| `--location` | `-l` | Substring match against the posting's location. |
| `--jobage` | | Posted within N days, using `first_published`. |
| `--page` | | 1-indexed page (25 results/page, applied client-side). |
| `--limit` | `-n` | Cap results emitted. |
| `--format` | | `json` \| `table` \| `plain`. |

## Implementation notes

- The Job Board API has **no server-side search, date filter, or pagination** — the
  `jobs` list endpoint returns every posting on the board in one response. This CLI
  applies `--query`, `--location`, `--jobage`, `--page`, and `--limit` client-side.
- The `content` field on a job (its full description) is **HTML-escaped HTML**: the raw
  JSON string contains literal `&lt;p&gt;` text rather than real `<p>` tags. `helpers.ts`
  decodes it twice — once to reveal the real markup, once more after stripping tags to
  resolve entities that were part of the original text (see `cleanContent`).
- A 404 from the board-list endpoint means the company slug doesn't have a Greenhouse
  board (or is misspelled) — surfaced as `BOARD_NOT_FOUND`, not a crash.

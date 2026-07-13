#!/usr/bin/env bun
// Self-contained CLI for searching a company's job listings on Greenhouse's
// public per-company Job Board JSON API (boards-api.greenhouse.io). No
// external CLI framework, so it runs anywhere `bun` is available with zero
// install beyond the repo clone.
//
// Greenhouse hosts one board per company with no cross-company search, so
// every command requires --company <slug> - the slug from the company's
// boards.greenhouse.io/<slug> URL.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit", c: "company" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `greenhouse-cli — search jobs on a company's Greenhouse job board

USAGE
  bun run src/cli.ts search --company <slug> [flags]
  bun run src/cli.ts detail <id> --company <slug> [--format json|plain]

Greenhouse has no cross-company search - every command needs --company, the
slug from the company's boards.greenhouse.io/<slug> URL (e.g. "databricks",
"asana", "figma").

SEARCH FLAGS
  --company, -c <slug>    Company board slug. REQUIRED.
  --query, -q <text>      Keywords, matched against the job title.
  --location, -l <text>   Substring match against the posting's location.
  --jobage <days>         Posted within N days (uses first_published). Default: all.
  --page <n>              1-indexed page (25 results/page). Default 1.
  --limit, -n <n>         Cap results emitted (client-side).
  --format <fmt>          json (default) | table | plain.

EXAMPLES
  bun run src/cli.ts search --company databricks -q "AI" --format table
  bun run src/cli.ts search --company asana -q "product manager" -l "Remote" --format table
  bun run src/cli.ts search --company figma --jobage 14 --format table
  bun run src/cli.ts detail 7962954 --company asana --format plain

No authentication required - this is Greenhouse's public Job Board API.
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  if (cmd !== "search" && cmd !== "detail") {
    process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
    return 1
  }

  const company = typeof flags.company === "string" ? flags.company : undefined
  if (!company) {
    process.stderr.write(
      JSON.stringify({
        error: 'the --company/-c flag is required (the slug from boards.greenhouse.io/<slug>, e.g. "databricks")',
        code: "NO_COMPANY",
      }) + "\n",
    )
    return 1
  }

  if (cmd === "search") {
    const fmt = (flags.format as string) || "json"

    const parseIntFlag = (name: string, raw: string | boolean | string[]): number | null => {
      const val = parseInt(raw as string, 10)
      if (isNaN(val)) {
        process.stderr.write(JSON.stringify({ error: `--${name} must be a number, got "${raw}"`, code: "BAD_ARG" }) + "\n")
        return null
      }
      return val
    }

    if (flags.jobage !== undefined) {
      const v = parseIntFlag("jobage", flags.jobage)
      if (v === null) return 1
      flags.jobage = String(v)
    }
    if (flags.page !== undefined) {
      const v = parseIntFlag("page", flags.page)
      if (v === null) return 1
      flags.page = String(v)
    }
    if (flags.limit !== undefined) {
      const v = parseIntFlag("limit", flags.limit)
      if (v === null) return 1
      flags.limit = String(v)
    }

    const opts: SearchOpts = {
      company,
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : 9999,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? parseInt(flags.limit as string, 10) : undefined,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  // cmd === "detail"
  const id = (flags._ as string[])[1]
  if (!id) {
    process.stderr.write(JSON.stringify({ error: "detail requires an <id>", code: "NO_ID" }) + "\n")
    return 1
  }
  const fmt = (flags.format as string) || "json"
  const opts: DetailOpts = {
    id,
    company,
    format: (fmt === "plain" ? "plain" : "json") as DetailOpts["format"],
  }
  return runDetail(opts)
}

main().then((code) => process.exit(code))

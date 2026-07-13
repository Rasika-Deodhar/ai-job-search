import {
  fetchBoard,
  toJobSummary,
  matchesQuery,
  matchesLocation,
  withinJobAge,
  writeError,
  type JobSummary,
} from "../helpers.js"

export interface SearchOpts {
  company: string
  query?: string
  location?: string
  jobage: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

const PAGE_SIZE = 25

function renderTable(jobs: JobSummary[]): string {
  if (jobs.length === 0) return "No results."
  const rows = jobs.map((j) => {
    const title = (j.title || "").slice(0, 42).padEnd(42)
    const company = (j.company || "—").slice(0, 20).padEnd(20)
    const loc = (j.location || "—").slice(0, 24).padEnd(24)
    const date = (j.date || "—").slice(0, 10)
    return `${j.id.padEnd(11)} ${title} ${company} ${loc} ${date}`
  })
  const header =
    "ID".padEnd(11) + " " + "TITLE".padEnd(42) + " " + "COMPANY".padEnd(20) + " " + "LOCATION".padEnd(24) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const jobs = await fetchBoard(opts.company)
    if (jobs === null) {
      writeError(`No Greenhouse board found for company "${opts.company}"`, "BOARD_NOT_FOUND")
      return 1
    }

    const filtered = jobs.filter(
      (j) => matchesQuery(j, opts.query) && matchesLocation(j, opts.location) && withinJobAge(j, opts.jobage),
    )

    const start = (opts.page - 1) * PAGE_SIZE
    const paged = filtered.slice(start, start + PAGE_SIZE)

    let summaries = paged.map((j) => toJobSummary(j, opts.company))
    if (opts.limit !== undefined && opts.limit >= 0) summaries = summaries.slice(0, opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(summaries) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        summaries
          .map(
            (s) =>
              `${s.title}\n  ${s.company || "—"} · ${s.location || "—"} · ${s.date || "—"}\n  id: ${s.id}\n  ${s.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify({ meta: { count: summaries.length, page: opts.page }, results: summaries }, null, 2) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}

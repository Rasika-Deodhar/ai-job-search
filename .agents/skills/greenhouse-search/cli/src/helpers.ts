// Data source: Greenhouse's public Job Board JSON API (boards-api.greenhouse.io).
// No authentication required. Each company has its own board, identified by a
// slug from its boards.greenhouse.io/<slug> URL (e.g. "databricks", "asana"),
// so every command in this CLI requires --company. There is no cross-company
// search and no server-side keyword search, date filter, or pagination — the
// list endpoint returns every job on a board in one response, so query,
// location, jobage, and page/limit are all applied client-side here.

export const BASE_URL = "https://boards-api.greenhouse.io/v1/boards"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

/** Fetch JSON with exponential backoff on 429/5xx. Returns null on 404 (unknown board or job). */
export async function jsonFetch<T = unknown>(url: string): Promise<T | null> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      redirect: "follow",
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return (await response.json()) as T
  }
  throw new Error("Request failed after max retries")
}

export interface JobSummary {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface JobDetail extends JobSummary {
  description: string | null
  departments: string[]
  offices: string[]
  requisitionId: string | null
  applyUrl: string | null
}

export interface RawJob {
  id: number
  title: string
  company_name?: string
  location?: { name?: string | null } | null
  absolute_url?: string
  updated_at?: string
  first_published?: string
  content?: string
  departments?: { name: string }[]
  offices?: { name: string }[]
  requisition_id?: string | null
}

interface RawBoard {
  jobs: RawJob[]
}

function numericEntity(cp: number): string {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
}

/**
 * Strip tags while preserving the "\n" breaks cleanContent already inserted
 * for block-level elements. Only horizontal whitespace is collapsed here —
 * collapsing `\s+` (as the linkedin-search reference implementation does)
 * would erase those breaks too, since `\s` matches newlines in JS regex, and
 * flatten every paragraph/list item into one run-on line.
 */
function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim()
}

/**
 * Greenhouse's `content` field is HTML-escaped HTML: the raw JSON string
 * contains literal "&lt;p&gt;" text rather than real "<p>" tags. Decoding
 * once turns the escaped tags into real markup — any entity that was part of
 * the original text (e.g. a literal "&" written as "&amp;") surfaces as a
 * real entity at that point, so stripping tags and decoding a second time
 * resolves those too.
 */
function cleanContent(raw: string): string {
  const htmlLayer = decodeHtmlEntities(raw)
  const withBreaks = htmlLayer
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
  const stripped = stripTags(withBreaks)
  return decodeHtmlEntities(stripped).replace(/\n{3,}/g, "\n\n").trim()
}

function toSummary(job: RawJob, companySlug: string): JobSummary {
  return {
    id: String(job.id),
    title: job.title,
    company: job.company_name || companySlug,
    location: job.location?.name || null,
    date: job.first_published || job.updated_at || null,
    url: job.absolute_url || `https://boards.greenhouse.io/${companySlug}/jobs/${job.id}`,
  }
}

/** Fetch every job on a company's board. Null means the board slug doesn't exist (404). */
export async function fetchBoard(companySlug: string): Promise<RawJob[] | null> {
  const data = await jsonFetch<RawBoard>(`${BASE_URL}/${encodeURIComponent(companySlug)}/jobs`)
  return data ? data.jobs : null
}

/** Fetch a single job's full detail (includes `content`). Null means not found. */
export async function fetchJobDetail(companySlug: string, jobId: string): Promise<RawJob | null> {
  return jsonFetch<RawJob>(`${BASE_URL}/${encodeURIComponent(companySlug)}/jobs/${encodeURIComponent(jobId)}`)
}

export function toJobSummary(job: RawJob, companySlug: string): JobSummary {
  return toSummary(job, companySlug)
}

export function toJobDetail(job: RawJob, companySlug: string): JobDetail {
  return {
    ...toSummary(job, companySlug),
    description: job.content ? cleanContent(job.content) : null,
    departments: (job.departments || []).map((d) => d.name).filter(Boolean),
    offices: (job.offices || []).map((o) => o.name).filter(Boolean),
    requisitionId: job.requisition_id || null,
    applyUrl: job.absolute_url || null,
  }
}

/** Client-side keyword filter: match query against the job title (case-insensitive). */
export function matchesQuery(job: RawJob, query: string | undefined): boolean {
  if (!query) return true
  return job.title.toLowerCase().includes(query.toLowerCase())
}

/** Client-side location filter: substring match against location.name. */
export function matchesLocation(job: RawJob, location: string | undefined): boolean {
  if (!location) return true
  const loc = (job.location?.name || "").toLowerCase()
  return loc.includes(location.toLowerCase())
}

/** Client-side posted-within-N-days filter, using first_published (falls back to updated_at). */
export function withinJobAge(job: RawJob, days: number): boolean {
  if (!days || days >= 9999) return true
  const dateStr = job.first_published || job.updated_at
  if (!dateStr) return true // unknown date - don't exclude
  const posted = new Date(dateStr).getTime()
  if (isNaN(posted)) return true
  const cutoff = Date.now() - days * 86400000
  return posted >= cutoff
}

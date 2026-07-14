# Referral Contact Lookup

Finds people worth reaching out to for a scraped job - recruiters/TA who can put you
forward, and people already doing the role or on the team who can give a warm intro or
informational-interview lead.

## When to Run

Only for jobs marked **high** or **medium** fit in Step 3. Skip low-fit jobs - it is not
worth spending lookups on roles unlikely to be pursued.

Skip any job whose `seen_jobs.json` entry already has a `contacts` object - it was already
looked up in a previous `/scrape` run. Do not repeat the lookup.

## Method

Two sources, used together.

### 1. Apollo.io API (primary)

Use `apollo_mixed_people_api_search`. This is a search endpoint (not enrichment) - no
credit cost, no mandatory-confirmation prompt - but it does not return emails/phone
numbers and may mask last names on some plans.

**Availability check:** this endpoint is gated on some Apollo plans (`API_INACCESSIBLE`
/ "not accessible with this access token on a free plan"). If the first call in a
`/scrape` run returns this error, **stop calling Apollo for the rest of the run** - do
not retry per job. Print one line noting Apollo lookup is unavailable (plan upgrade
required) and fall back to the LinkedIn manual-search link (below) for every job in
this run. Same graceful-skip pattern as the `pdftotext`/`bun` availability checks used
elsewhere in this repo.

**Do not call `apollo_people_match`,
`apollo_organizations_enrich`, or any other credit-costing Apollo endpoint** unless the
user explicitly asks to unmask or enrich a specific contact - those tools carry their own
mandatory per-call confirmation and a credit cost, and this workflow must not trigger that
automatically for every contact found.

Run two searches per qualifying job:

**A. Recruiters / Talent Acquisition (the referral path)**
```
q_keywords: "<Company Name>"
person_titles: ["recruiter", "technical recruiter", "talent acquisition", "talent acquisition partner", "people operations", "hr business partner"]
per_page: 5
```

**B. Role/team peers (informational-outreach / warm-intro path)**
```
q_keywords: "<Company Name>"
person_titles: [<2-3 titles derived from the posting: the exact title, its likely manager title, and one adjacent team title>]
per_page: 5
```
Example: a posting titled "AI Program Manager" -> `["AI Program Manager", "Technical Program Manager", "Program Manager"]`.

If the posting names a specific office/city, pass it via `organization_locations` to cut
down false positives at large multi-office companies.

### 2. LinkedIn manual search link (always included)

Generate a link for the user to browse themselves - no scraping, no automated people
lookup, fully within LinkedIn's ToS:

```
https://www.linkedin.com/search/results/people/?keywords=<url-encoded "Company Name" + role keyword>&origin=GLOBAL_SEARCH_HEADER
```

Always include this alongside any Apollo results as a "browse more" option. When Apollo
returns zero results for a job, this link is the only thing presented for that job.

## Storing Results

Add a `contacts` object to the job's entry in `seen_jobs.json`:

```json
"contacts": {
  "recruiters": [{"name": "...", "title": "...", "linkedin_url": "...", "email_status": "..."}],
  "team": [{"name": "...", "title": "...", "linkedin_url": "..."}],
  "linkedin_search_url": "...",
  "looked_up_date": "YYYY-MM-DD"
}
```

Presence of `contacts` marks the job as already looked up. Do not drop this field when the
entry is later rewritten by `/rank` or subsequent `/scrape` runs.

## Presenting Results

Under each high/medium-fit job in the Step 5 output, add a short block:

```
**Contacts:**
- Recruiter: Jane D. - Technical Recruiter - [LinkedIn](...)
- Team: John S. - AI Program Manager - [LinkedIn](...)
- [Browse more on LinkedIn](...)
```

- If a name is partially masked (e.g. "Jane D***"), note it: "(name masked by Apollo - ask
  me to enrich this specific contact if you want the full name; costs 1 Apollo credit)."
- If Apollo found nothing, show only the LinkedIn link: "No Apollo match - try this
  LinkedIn search to look manually."

## Rules

- Never fabricate contacts. Only present what Apollo's search actually returned or a valid
  LinkedIn search URL.
- Never call a credit-costing Apollo endpoint without the user's explicit, per-contact
  confirmation.
- The LinkedIn link is for the user to click themselves - do not fetch or scrape LinkedIn
  people-search result pages programmatically.

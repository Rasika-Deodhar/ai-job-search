# Referral Contact Lookup

Generates LinkedIn people-search links for a scraped job - one to find recruiters/TA
who can put you forward, one to find people already doing the role or on the team who
can give a warm intro or informational-interview lead.

This is deliberately a **link-generation step, not an automated lookup**: no scraping,
no third-party API, zero runtime dependencies or credentials required. It works
identically for every forker regardless of what else they have configured.

## When to Run

Only for jobs marked **high** or **medium** fit in Step 3. Skip low-fit jobs - it is not
worth generating outreach links for roles unlikely to be pursued.

Skip any job whose `seen_jobs.json` entry already has a `contacts` object - it was
already generated in a previous `/scrape` run. Do not regenerate it.

## Method

Build two LinkedIn people-search URLs per qualifying job:

**A. Recruiters / Talent Acquisition (the referral path)**
```
https://www.linkedin.com/search/results/people/?keywords=<url-encoded "<Company Name> recruiter">&origin=GLOBAL_SEARCH_HEADER
```

**B. Role/team peers (informational-outreach / warm-intro path)**
```
https://www.linkedin.com/search/results/people/?keywords=<url-encoded "<Company Name> <role keyword>">&origin=GLOBAL_SEARCH_HEADER
```
Use a short keyword drawn from the posting's title for `<role keyword>` - e.g. a
posting titled "AI Program Manager" becomes `"<Company Name> AI Program Manager"`.

Both links are for the user to open and browse themselves - no automated fetching of
LinkedIn's people-search results.

## Storing Results

Add a `contacts` object to the job's entry in `seen_jobs.json`:

```json
"contacts": {
  "recruiter_search_url": "...",
  "team_search_url": "...",
  "generated_date": "YYYY-MM-DD"
}
```

Presence of `contacts` marks the job as already processed. Do not drop this field when
the entry is later rewritten by `/rank` or subsequent `/scrape` runs.

## Presenting Results

Under each high/medium-fit job in the Step 5 output, add a short block:

```
**Contacts:**
- [Find recruiters at <Company>](...)
- [Find <role> peers at <Company>](...)
```

## Rules

- Never fabricate contacts or claim a specific person was found - these are search
  links, not results. Do not present them as if a lookup already happened.
- Never fetch or scrape the LinkedIn people-search result pages programmatically -
  the link is for the user to open themselves.

# Search Queries for Job Scraper

## Search Sites

Primary:
- **linkedin.com/jobs** - LinkedIn job listings (filter: Minnesota, USA / remote)
- No Denmark-style local job board applies here (US-based search). Additional US portals (Indeed, Handshake, Dice, Ashby, Greenhouse) to be scaffolded via `/add-portal` - not yet set up as of this /setup run.

Secondary (company career pages via Google):
- Direct Google searches with `site:` filters for known target companies (Qlik, and similar enterprise SaaS/AI product companies, once identified)

## Query Categories

Queries are grouped by priority. Each query should be combined with location terms (Minnesota / Twin Cities / remote US) where the site supports it.

### Priority 1: Hybrid AI Program Manager / AI Automation

These match the strongest and most desired career direction - the Qlik-style blend of AI engineering depth and program ownership.

```
site:linkedin.com/jobs "AI Program Manager" Minnesota
site:linkedin.com/jobs "AI Program Manager" remote
site:linkedin.com/jobs "Technical Program Manager" "Generative AI" Minnesota OR remote
```

### Priority 2: AI/ML Engineering (GenAI, RAG, LLM)

These match direct hands-on technical experience from MMC Innovation Lab.

```
site:linkedin.com/jobs "GenAI" OR "LLM" engineer Minnesota OR remote
site:linkedin.com/jobs "RAG" OR "Retrieval-Augmented Generation" engineer remote
site:linkedin.com/jobs "AI Engineer" LangChain Minnesota OR remote
```

### Priority 3: Technical Product/Program Management (adjacent pivot)

Adjacent roles that lean more product/roadmap than AI-specific.

```
site:linkedin.com/jobs "Technical Product Manager" Minnesota OR remote
site:linkedin.com/jobs "Product Manager" "AI" OR "Machine Learning" Minnesota OR remote
```

### Priority 4: Broader Full-Stack / AI-Adjacent Software Engineering

Wider net for general technical roles that still touch AI or automation.

```
site:linkedin.com/jobs "Full-Stack" developer "AI" OR "GenAI" Minnesota OR remote
site:linkedin.com/jobs "Software Engineer" LangChain OR "vector database" remote
site:linkedin.com/jobs "Solutions Engineer" AI automation Minnesota OR remote
```

## Location Filter

When evaluating results, verify the job location fits Rasika's constraints (Minnesota + remote US, open to relocation for the right role but not required). Define acceptable areas:
- Twin Cities metro (St. Paul / Minneapolis) - ideal, current base
- Remote US (any state) - acceptable, no relocation needed
- Other Minnesota cities - acceptable
- Other major US tech hubs (with relocation) - borderline, confirm interest before applying
- Non-US locations, or on-site-only roles outside the US - too far (work authorization is US-only: CPT/OPT/STEM OPT)

Also weight employer sponsorship history (STEM OPT extension / H-1B track record) as a strong positive signal, not a hard filter - flag postings from employers with no known sponsorship history rather than excluding them outright.

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape AI engineering" -> Priority 2 queries + custom GenAI-specific queries
- "/scrape program management" -> Priority 1 and 3 queries combined

## Priority 5: Target Companies (Greenhouse ATS)

`greenhouse-search` was added via `/add-portal` - it checks a specific company's job
board rather than searching broadly, so use it once Priority 1-4 results surface a
company worth tracking directly. Starter list (verified live, all fit the Enterprise
SaaS/AI target sectors): `databricks`, `asana`, `figma`.

```
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search -c databricks -q "AI" --format table
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search -c asana -q "program manager" --format table
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search -c figma --jobage 14 --format table
```

Add more company slugs here as target companies are identified - check
`boards.greenhouse.io/<slug>` or search "`<company> careers greenhouse`" to confirm a
company uses Greenhouse before adding it (a wrong slug fails cleanly with
`BOARD_NOT_FOUND` rather than crashing).

## Next Step: Additional Portal Setup

Run `/add-portal` to scaffold a search skill for a specific US job board - Indeed,
Handshake (St. Cloud State University's portal), and Dice were flagged as candidates
during `/setup` but not yet built. Until then, `/scrape` relies on LinkedIn, Google
site-searches, and `greenhouse-search` for the tracked companies above.

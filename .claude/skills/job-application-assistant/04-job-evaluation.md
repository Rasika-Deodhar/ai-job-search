# Job Evaluation Framework

<!-- SETUP: Skill match areas and career goals are personalized by running /setup -->

## Scoring Dimensions

Evaluate each job posting against these five dimensions:

### 1. Technical Skills Match (0-100)
How well do the required/preferred skills align with the candidate's capabilities?

| Score | Meaning |
|-------|---------|
| 80-100 | Core requirements are primary skills |
| 60-79 | Most requirements match, 1-2 gaps that are learnable |
| 40-59 | Partial match, significant upskilling needed |
| 0-39 | Fundamental mismatch |

**Strong match areas:** Python, Gen AI/LLM engineering (RAG, prompt engineering, LangChain, OpenAI GPT, Llama), full-stack development (React/Next.js, Node.js, REST/GraphQL APIs), AI automation/workflow tooling (n8n, Salesforce), Agile/Kanban delivery
**Moderate match areas:** Java 8/Spring Boot, Angular, cloud/DevOps (Docker, Kubernetes basics, AWS, GCP, CI/CD), classical data analytics/ML (Pandas, Scikit-learn, NLP), Enterprise Architecture and stakeholder collaboration
**Weak match areas:** Deep MLOps/production ML infrastructure, large-scale distributed systems architecture, formal product management certification (though SAFe Agilist covers Agile leadership)

### 2. Experience Match (0-100)
Does work history align with what they're looking for?

| Score | Meaning |
|-------|---------|
| 80-100 | Direct experience in the same domain and role type |
| 60-79 | Related experience, transferable skills clear |
| 40-59 | Adjacent experience, would need to make the case |
| 0-39 | Unrelated experience |

**Strong:** GenAI/LLM application development (MMC Innovation Lab), AI-driven automation and program management (Qlik), full-stack enterprise development (Citi)
**Moderate:** Technical/product program management more broadly (only ~1 year direct experience, at Qlik), data governance/API platform work (Informatica)
**Entry-level:** Formal product management outside the AI-automation niche (Forage simulation only, no employer-based PM role yet)

### 3. Behavioral/Culture Fit (0-100)
Does the role and company culture match the behavioral profile?

| Score | Meaning |
|-------|---------|
| 80-100 | Culture strongly matches behavioral preferences |
| 60-79 | Mixed signals but mostly compatible |
| 40-59 | Some friction areas |
| 0-39 | Significant culture mismatch |

**Red flags to research:** Department disorganization, work dominated by maintenance over development, poor chemistry with leadership, culture mismatches. Check reviews, media coverage, LinkedIn connections, and network contacts for insider perspective.

### 4. Location & Logistics (Pass/Fail + Notes)
- Within commute range: PASS
- Remote with occasional office: PASS
- Requires relocation: FAIL (deal-breaker)
- Frequent international travel: FLAG (discuss with user)

### 5. Career Alignment & Motivation (0-100)
Does this role advance career goals and contain tasks that energize?

| Score | Meaning |
|-------|---------|
| 80-100 | Strongly aligned with career direction, clear growth path |
| 60-79 | Good role but only partially aligned with long-term goals |
| 40-59 | Decent job but doesn't build toward career goals |
| 0-39 | Dead end or backwards step |

**Career goals:**
- AI/ML Engineering - hands-on GenAI, RAG, and LLM application development
- Technical Program/Product Management - bridging engineering and business, owning roadmaps
- Hybrid AI Program Manager (Qlik-style) - driving AI adoption and automation initiatives with real technical depth, not just coordination

All three directions are live targets, not a narrowed single path - Rasika's ideal next role sits at the intersection of AI engineering depth and program/product ownership. Score roles that combine these two dimensions higher than roles that are purely one or the other.

**Motivation filter:** Evaluate not just whether you *can* do the tasks, but whether the tasks will *energize* you. Consider:
- Tasks that energize: learning new tools/domains, hands-on GenAI/LLM work, cross-functional work that bridges engineering and business
- Tasks that drain: not yet specifically captured beyond culture signals below - ask if a posting looks like a poor fit on tasks alone
- Non-task factors: a genuinely healthy, collaborative team culture; hiring/interview processes that evaluate real experience rather than pure algorithmic screening

**Life situation alignment:** Consider personal constraints:
- **Security**: Currently employed (Qlik internship) while finishing the Master's degree (expected Dec 2026); actively searching for a full-time role to start after graduation. Work authorization is CPT/OPT/STEM OPT - visa sponsorship pathway (STEM OPT extension, future H-1B) is a strong preference in evaluation, weighted heavily but not an automatic disqualifier per role.
- **Flexibility**: Open to Minnesota (Twin Cities metro and beyond) plus remote roles anywhere in the US; open to relocation for the right role but not required.
- **Professional development**: Continuous learning is a top priority - weight roles with a genuine learning/growth culture (mentorship, internal tech investment, varied problem exposure) above otherwise-similar roles without it.

### 6. Salary Benchmark (Optional)

If the salary lookup tool is configured (`salary_data.json` exists), look up the company:
```
python salary_lookup.py "<Company Name>" --json
```

If a city is known from the posting, add `--city "<City>"` to narrow results.

Present findings as:
```
### Salary Benchmark
| Metric | Value |
|--------|-------|
| [Category] index | XX.X (+/-X.X% vs baseline) |
| Overall index | XX.X (+/-X.X% vs baseline) |
```

Interpret results relative to the baseline defined in the data file's metadata. For index-based data, higher typically means above-market compensation.

If the salary tool is not configured, skip this section.

## Output Format

Present the evaluation as:

```
## Job Fit Evaluation: [Role] at [Company]

| Dimension | Score | Notes |
|-----------|-------|-------|
| Technical Skills | XX/100 | [brief note] |
| Experience Match | XX/100 | [brief note] |
| Behavioral Fit | XX/100 | [brief note] |
| Location | PASS/FAIL | [brief note] |
| Career Alignment | XX/100 | [brief note] |

**Overall Score: XX/100** (weighted average of scored dimensions)

### Verdict: [Strong Fit / Good Fit / Moderate Fit / Weak Fit / Poor Fit]

### Key Strengths for This Role
- [bullet points]

### Gaps to Address
- [bullet points]

### Recommendation
[1-2 sentences: apply/skip/apply with caveats]

### Company Research Checklist
- [ ] Checked company website (mission, values, recent news)
- [ ] Checked review sites (Glassdoor, Jobindex, etc.)
- [ ] Checked LinkedIn for team size, recent hires, connections
- [ ] Checked media for restructuring, growth, or workplace issues
- [ ] Identified network contacts who may know the team/manager
```

## Weighting
- Technical Skills: 30%
- Experience Match: 25%
- Behavioral Fit: 15%
- Career Alignment: 30%

(Location is pass/fail, not weighted)

## Thresholds
- **Strong Fit** (75+): Definitely apply, tailor everything
- **Good Fit** (60-74): Apply, address gaps in cover letter
- **Moderate Fit** (45-59): Consider carefully, discuss with user
- **Weak Fit** (30-44): Probably skip unless strategic reasons
- **Poor Fit** (<30): Skip

## Pre-Application: Call the Employer (Best Practice)

Before writing the application, consider whether the candidate should call the contact person listed in the posting. **Only call if there are substantive questions** - never call just to "be remembered."

### When to Suggest Calling
- The posting has unclear or ambiguous requirements
- It's unclear which competencies are essential vs. nice-to-have
- The role description is vague about day-to-day tasks
- There's a named contact person who invites questions

### Good Questions to Ask
- "What are the primary challenges in this role?"
- "How is time typically divided across the listed responsibilities?"
- "Which competencies are most critical for success in this position?"
- "What does success look like in the first 6-12 months?"

### Rules for the Call
- Prepare a 30-second "elevator pitch" about your background in case they ask
- The call's purpose is **gathering information**, not delivering a pitch
- Take notes - use what you learn to tailor the application
- Reference the conversation naturally in the cover letter ("After speaking with [name], I was especially drawn to...")

# Job Application Assistant for Rasika Deodhar

## Role
This repo is a job application workspace. Claude acts as a career advisor and application assistant for Rasika Deodhar, helping with:
1. **Job fit evaluation** - Assess job postings against your profile (skills, experience, behavioral traits)
2. **CV tailoring** - Adapt existing CV templates (LaTeX/moderncv) to target specific roles
3. **Cover letter writing** - Draft targeted cover letters using existing templates (LaTeX)
4. **Interview preparation** - Prepare answers, questions, and talking points for interviews
5. **Career strategy** - Advise on positioning and personal branding

## Candidate Profile

### Identity
- **Name:** Rasika Deodhar
- **Location:** St. Paul, Minnesota, USA (open to Minnesota + remote US; not tied to relocation)
- **Languages:** English (Professional), Hindi (Native), Marathi (Native)
- **Status:** Master's student (Engineering Management, St. Cloud State University, expected December 2026), currently employed as AI Program Management Intern at Qlik; actively searching for a full-time role for after graduation
- **LinkedIn headline:** "AI Program Management Intern @ Qlik | GenAI, RAG & Full-Stack Engineering | MEM Candidate, St. Cloud State University" *(suggested positioning derived from resume - verify against your actual LinkedIn headline and adjust)*

### Education
- **Master's in Engineering Management** (2025-Expected Dec 2026) - St. Cloud State University
  - GPA: 4.0
  - Topics: AI for Engineering Managers, Quality Engineering, Engineering Project Management, Supply Chain & Logistics, Lean Six Sigma, Engineering Economy, Facilities Systems Design
  - Work Authorization: CPT, OPT, and STEM OPT
- **Bachelor of Engineering in Information Technology** (2012-2017) - The University of Pune (Savitribai Phule Pune University)
  - GPA: 3.60, First Class with Distinction (confirmed across all four years)
  - Topics: Data Structures, DBMS, Software Engineering, Machine Learning, Cloud Computing, Distributed Systems

### Professional Experience
- **AI Program Management Intern** (June 2026 - Present) - **Qlik** (St. Paul, Minnesota)
  - Building AI agent workflows and automation pipelines using n8n and Salesforce to shift post-sales customer support toward a self-service model, reducing dependency on live agents for help desk resolution.
- **Applications Developer** (October 2022 - July 2024) - **MMC Innovation Lab** (Dublin, Ireland)
  - Contributed to company-wide LLM-powered chatbot (LenAI) and document extraction workflows using prompt engineering and RAG, reducing manual data entry time by 40%.
  - Built PoC applications with OpenAI GPT models, Llama, LangChain, and vector databases (Pinecone/Chroma).
  - Designed and published internal APIs for Text-to-Speech/Speech-to-Text via Google Apigee, supporting 10k+ monthly API calls.
- **Technology Analyst** (September 2020 - October 2022) - **Citi** (Dublin, Ireland)
  - Developed full-stack features for a global scaled application using Java 8, Spring Boot, Angular 9/10, and Oracle DB, improving system throughput by 20%.
  - Led UI migration from legacy systems to Angular, cutting page load times by 40%.
- **Software Developer Intern** (June 2020 - September 2020) - **Informatica** (Dublin, Ireland)
  - Developed backend REST APIs (Java 8/Spring Boot) and React frontend components for a cloud-native data governance platform.

*(Full experience detail, including academic projects, in `.claude/skills/job-application-assistant/01-candidate-profile.md`.)*

### Technical Skills
- **Primary:** Python, JavaScript/TypeScript, React/Next.js, Node.js, LangChain, Gen AI/LLM applications (RAG, prompt engineering, OpenAI GPT, Llama), REST/GraphQL APIs
- **Secondary:** Java 8, Angular 9+ (RxJS, NgRx), Docker, Kubernetes (basics), AWS (EC2/S3/Lambda), GCP, CI/CD (GitHub Actions, Jenkins)
- **Domain:** AI Program Management, Enterprise Architecture, Agile/Kanban delivery, Change Management, Stakeholder Collaboration
- **Software:** n8n, Make, Salesforce, MongoDB/SQL/PostgreSQL, JIRA, Azure DevOps, Postman, Swagger/OpenAPI

### Certifications
- **Certified AI-Empowered SAFe Agilist** - Scaled Agile, Inc. - valid until April 2027 (Certificate ID 25631208-4407)
- **Product Management Job Simulation** - Forage / Electronic Arts - completed May 2026 (KPI analysis, data-driven presentation planning)

### Publications
None currently.

### Awards
None currently (beyond First Class with Distinction noted under Education).

### Behavioral Profile
<!-- Self-assessed; no formal instrument (PI/DISC/MBTI) on file yet -->
- **Continuous learner** - energized by learning new things and taking on new problems regularly; this is a primary driver, not just a nice-to-have
- **Collaborative + independently driven** - equally comfortable as a hands-on individual contributor and as a collaborative team member; adapts quickly to new tools and frameworks in fast-paced settings
- **Strengths:** Bridging technical and business perspectives (GenAI engineering + program/product management background); fast onboarding to unfamiliar tools and domains
- **Growth areas:** Not yet formally assessed - revisit with `/setup --section behavioral` if a formal assessment becomes available
- **Thrives in:** Environments with a genuine learning culture and healthy, collaborative team dynamics - not just technically strong, but well-run

### What Excites You
- Learning new things and continuously growing technically and professionally
- A good, healthy work culture over a purely high-pressure/competitive one
- Hands-on GenAI/LLM engineering work and cross-functional work that bridges engineering and business

### Target Sectors
- **Enterprise SaaS & AI Product companies:** e.g. Qlik and similar AI-forward platform companies
- **Tech consulting / innovation labs:** e.g. MMC Innovation Lab-style GenAI delivery teams
- **Financial services technology:** e.g. Citi-style large-scale platform engineering

### Deal-breakers
- Interview processes that are purely leetcode/DSA-style with no broader evaluation of experience or fit - strong negative signal, not an automatic disqualifier
- Lack of a visa sponsorship pathway (STEM OPT extension / future H-1B) - strong preference for employers with a sponsorship track record, weighted heavily in evaluation but not a hard filter

## Repo Structure
- `cv/` - LaTeX CV variants (moderncv template, banking style)
- `cover_letters/` - LaTeX cover letters (custom cover.cls template)
- `.claude/skills/` - AI skill definitions for the application workflow
- `.agents/skills/` - Job search CLI tools

## Workflow for New Job Applications
1. User provides a job posting (URL or text)
2. **Always evaluate fit first**: skills match, experience match, behavioral/culture match. Present this assessment to the user before proceeding.
3. If good fit: create targeted CV (`cv/main_<company>.tex`) and cover letter (`cover_letters/cover_<company>_<role>.tex`)
4. **Verify both documents** (see Verification Checklist below)
5. Prepare interview talking points based on the role requirements and your strengths

**Important:** When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference **Claude Code** by name.

## Verification Checklist
After creating or updating a CV or cover letter, re-read the generated file and verify **all** of the following before presenting to the user. Report the results as a pass/fail checklist.

### Factual accuracy
- [ ] All claims match actual profile (CLAUDE.md / candidate profile) - no fabricated skills, experience, or achievements
- [ ] Job titles, dates, company names, and locations are correct
- [ ] Contact details are correct
- [ ] All company-specific claims (partnerships, products, technology, expansions) have been independently verified via WebFetch/WebSearch - do not trust reviewer agent research without verification

### Targeting
- [ ] Profile statement / opening paragraph is tailored to the specific role (not generic)
- [ ] Skills and experience bullets are reframed to match the job requirements
- [ ] Key job requirements are addressed (with gaps acknowledged where relevant)
- [ ] Nice-to-have requirements are highlighted where there is a match

### Consistency
- [ ] CV follows the standard 2-page moderncv/banking format
- [ ] Cover letter uses cover.cls template and established structure
- [ ] Tone is consistent across CV and cover letter
- [ ] No contradictions between CV and cover letter content

### Quality
- [ ] No LaTeX syntax errors (balanced braces, correct commands)
- [ ] No spelling or grammar errors
- [ ] Agentic coding / AI tooling references mention **Claude Code** by name
- [ ] Cover letter is addressed to the correct person (or "Dear Hiring Manager" if unknown)
- [ ] Cover letter fits approximately one page

### Compiled PDF verification (MANDATORY - never skip)
Both documents MUST be compiled and visually inspected via the Read tool on the PDF output. "Looks fine in the .tex" is not acceptable - LaTeX page-break decisions are unpredictable. Iterate until these all pass:
- [ ] CV compiled with **lualatex** (pdflatex often fails on modern MiKTeX with fontawesome5 font-expansion errors). Cover letter compiled with **xelatex** (cover.cls requires fontspec).
- [ ] **CV is exactly 2 pages** - not 1, not 3
- [ ] **No orphaned `\cventry` titles** - a job/education title must never sit at the bottom of a page with its bullets spilling to the next page. Use `\needspace{5\baselineskip}` before each `\cventry` to prevent this, and `\enlargethispage{2-3\baselineskip}` to rescue a trailing section that just barely spills
- [ ] **Cover letter is exactly 1 page** - signature block must fit with the body, never overflow
- [ ] **Cover letter bullet font matches body font** - `\lettercontent{}` must not wrap `\begin{itemize}...\end{itemize}` (the command's trailing `\\` errors on `\end{itemize}`, and moving itemize outside loses the Raleway font). Standard pattern: close `\lettercontent{}`, then wrap the list in `{\raggedright\fontspec[Path = OpenFonts/fonts/raleway/]{Raleway-Medium}\fontsize{11pt}{13pt}\selectfont \begin{itemize}...\end{itemize}\par}`

### ATS & keyword verification (CV)
ATS parsers read the PDF's embedded text layer, not the rendered page. Extract it with `pdftotext -layout` and verify what a parser sees. `pdftotext` (poppler) is optional - if missing, skip the parseability items with a warning and check keyword coverage from the visual PDF read instead.
- [ ] CV text layer extracts cleanly - no `(cid:*)` markers, `�` replacement characters, or text visible in the PDF but absent from the extraction
- [ ] Email and phone appear as **literal text** in the extraction (icon-glyph noise like `MOBILE-ALT`/`Envelope` is harmless, but a contact detail carried only by an icon or hyperlink is invisible to ATS)
- [ ] Reading order of the extracted text matches the visual order (single-column stock template is safe; multi-column custom templates are where this breaks)
- [ ] Posting keywords covered or honestly absent - synonym-only matches tightened to the posting's exact term where truthfully applicable, keywords the profile genuinely supports added to experience bullets, genuine gaps left visible and **never stuffed**

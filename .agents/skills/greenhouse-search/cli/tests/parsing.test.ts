import { describe, test, expect } from "bun:test";
import { toJobSummary, toJobDetail, matchesQuery, matchesLocation, withinJobAge, type RawJob } from "../src/helpers";

function job(overrides: Partial<RawJob> = {}): RawJob {
  return {
    id: 123456,
    title: "Senior AI Engineer",
    company_name: "Acme",
    location: { name: "Remote - US" },
    absolute_url: "https://acme.com/careers/123456",
    first_published: "2026-06-01T00:00:00-04:00",
    updated_at: "2026-06-05T00:00:00-04:00",
    ...overrides,
  };
}

describe("toJobSummary", () => {
  test("maps core fields, falling back to the company slug when company_name is absent", () => {
    const s = toJobSummary(job({ company_name: undefined }), "acme");
    expect(s.id).toBe("123456");
    expect(s.title).toBe("Senior AI Engineer");
    expect(s.company).toBe("acme");
    expect(s.location).toBe("Remote - US");
    expect(s.date).toBe("2026-06-01T00:00:00-04:00");
    expect(s.url).toBe("https://acme.com/careers/123456");
  });

  test("falls back to a constructed URL when absolute_url is missing", () => {
    const s = toJobSummary(job({ absolute_url: undefined }), "acme");
    expect(s.url).toBe("https://boards.greenhouse.io/acme/jobs/123456");
  });

  test("null location when the board omits it", () => {
    const s = toJobSummary(job({ location: null }), "acme");
    expect(s.location).toBeNull();
  });
});

describe("toJobDetail — double-encoded HTML content", () => {
  // Greenhouse's `content` field is HTML-escaped HTML: the raw JSON string
  // itself contains literal "&lt;p&gt;" rather than real "<p>" tags.
  test("decodes escaped tags and strips them, preserving paragraph breaks", () => {
    const raw = "&lt;p&gt;We are hiring a &lt;strong&gt;Senior Engineer&lt;/strong&gt;.&lt;/p&gt;\n&lt;p&gt;Apply now.&lt;/p&gt;";
    const d = toJobDetail(job({ content: raw }), "acme");
    expect(d.description).toBe("We are hiring a Senior Engineer .\n\nApply now.");
  });

  test("resolves entities that were part of the original text (double-escaped)", () => {
    // Original text "R&D" HTML-escaped once -> "R&amp;D" -> escaped again for
    // the JSON payload -> "R&amp;amp;D".
    const raw = "&lt;p&gt;R&amp;amp;D team&lt;/p&gt;";
    const d = toJobDetail(job({ content: raw }), "acme");
    expect(d.description).toBe("R&D team");
  });

  test("null description when content is absent", () => {
    const d = toJobDetail(job({ content: undefined }), "acme");
    expect(d.description).toBeNull();
  });

  test("maps departments and offices to plain name arrays", () => {
    const d = toJobDetail(
      job({ departments: [{ name: "Engineering" }], offices: [{ name: "Remote" }, { name: "SF" }] }),
      "acme",
    );
    expect(d.departments).toEqual(["Engineering"]);
    expect(d.offices).toEqual(["Remote", "SF"]);
  });
});

describe("matchesQuery", () => {
  test("case-insensitive substring match against title", () => {
    expect(matchesQuery(job({ title: "Senior AI Engineer" }), "ai engineer")).toBe(true);
    expect(matchesQuery(job({ title: "Senior AI Engineer" }), "sales")).toBe(false);
  });
  test("undefined query matches everything", () => {
    expect(matchesQuery(job(), undefined)).toBe(true);
  });
});

describe("matchesLocation", () => {
  test("case-insensitive substring match", () => {
    expect(matchesLocation(job({ location: { name: "Remote - US" } }), "remote")).toBe(true);
    expect(matchesLocation(job({ location: { name: "Tokyo, Japan" } }), "remote")).toBe(false);
  });
  test("missing location never matches a location filter", () => {
    expect(matchesLocation(job({ location: null }), "remote")).toBe(false);
  });
});

describe("withinJobAge", () => {
  test("9999 (default/unset) always matches", () => {
    expect(withinJobAge(job({ first_published: "2000-01-01T00:00:00-04:00" }), 9999)).toBe(true);
  });
  test("recent posting matches a short window", () => {
    const recent = new Date(Date.now() - 2 * 86400000).toISOString();
    expect(withinJobAge(job({ first_published: recent }), 7)).toBe(true);
  });
  test("old posting fails a short window", () => {
    expect(withinJobAge(job({ first_published: "2000-01-01T00:00:00-04:00" }), 7)).toBe(false);
  });
  test("unknown date is not excluded", () => {
    expect(withinJobAge(job({ first_published: undefined, updated_at: undefined }), 7)).toBe(true);
  });
});

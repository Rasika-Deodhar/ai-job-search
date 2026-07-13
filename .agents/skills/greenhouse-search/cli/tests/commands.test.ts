import { afterEach, describe, expect, test } from "bun:test";
import { runSearch } from "../src/commands/search";
import { runDetail } from "../src/commands/detail";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;
const originalStderrWrite = process.stderr.write;

function boardResponse(jobs: Array<Record<string, unknown>>): Response {
  return new Response(JSON.stringify({ jobs }));
}

function captureStdout(): { get: () => string } {
  let out = "";
  process.stdout.write = ((chunk: string | Uint8Array) => {
    out += chunk.toString();
    return true;
  }) as typeof process.stdout.write;
  return { get: () => out };
}

function captureStderr(): { get: () => string } {
  let out = "";
  process.stderr.write = ((chunk: string | Uint8Array) => {
    out += chunk.toString();
    return true;
  }) as typeof process.stderr.write;
  return { get: () => out };
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.stdout.write = originalStdoutWrite;
  process.stderr.write = originalStderrWrite;
});

describe("runSearch", () => {
  test("--limit 0 emits zero results", async () => {
    globalThis.fetch = (async () =>
      boardResponse([{ id: 1, title: "Engineer", location: { name: "Remote" } }])) as typeof fetch;
    const stdout = captureStdout();

    const code = await runSearch({ company: "acme", jobage: 9999, page: 1, limit: 0, format: "json" });

    expect(code).toBe(0);
    expect(JSON.parse(stdout.get()).results).toHaveLength(0);
  });

  test("filters by query against title", async () => {
    globalThis.fetch = (async () =>
      boardResponse([
        { id: 1, title: "AI Engineer", location: { name: "Remote" } },
        { id: 2, title: "Account Executive", location: { name: "Remote" } },
      ])) as typeof fetch;
    const stdout = captureStdout();

    const code = await runSearch({ company: "acme", query: "AI", jobage: 9999, page: 1, format: "json" });

    expect(code).toBe(0);
    const parsed = JSON.parse(stdout.get());
    expect(parsed.results).toHaveLength(1);
    expect(parsed.results[0].title).toBe("AI Engineer");
  });

  test("unknown board (404) exits 1 with BOARD_NOT_FOUND", async () => {
    globalThis.fetch = (async () => new Response(null, { status: 404 })) as typeof fetch;
    const stderr = captureStderr();

    const code = await runSearch({ company: "doesnotexist", jobage: 9999, page: 1, format: "json" });

    expect(code).toBe(1);
    const err = JSON.parse(stderr.get());
    expect(err.code).toBe("BOARD_NOT_FOUND");
  });

  test("table format renders a header and no crash on empty results", async () => {
    globalThis.fetch = (async () => boardResponse([])) as typeof fetch;
    const stdout = captureStdout();

    const code = await runSearch({ company: "acme", jobage: 9999, page: 1, format: "table" });

    expect(code).toBe(0);
    expect(stdout.get()).toBe("No results.\n");
  });
});

describe("runDetail", () => {
  test("decodes the double-escaped content field into plain text", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          id: 42,
          title: "Engineer",
          location: { name: "Remote" },
          content: "&lt;p&gt;Build things.&lt;/p&gt;",
        }),
      )) as typeof fetch;
    const stdout = captureStdout();

    const code = await runDetail({ id: "42", company: "acme", format: "json" });

    expect(code).toBe(0);
    const parsed = JSON.parse(stdout.get());
    expect(parsed.description).toBe("Build things.");
  });

  test("missing job (404) exits 1 with NOT_FOUND", async () => {
    globalThis.fetch = (async () => new Response(null, { status: 404 })) as typeof fetch;
    const stderr = captureStderr();

    const code = await runDetail({ id: "999", company: "acme", format: "json" });

    expect(code).toBe(1);
    const err = JSON.parse(stderr.get());
    expect(err.code).toBe("NOT_FOUND");
  });
});

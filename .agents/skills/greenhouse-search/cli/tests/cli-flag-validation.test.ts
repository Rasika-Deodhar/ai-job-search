import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";

// Known-good board (verified live during /add-portal setup) — used for the
// handful of tests that need a request to actually reach the network.
const COMPANY = "asana";

function parsedStderr(stderr: string): { error?: string; code?: string } {
  try {
    return JSON.parse(stderr);
  } catch {
    return {};
  }
}

describe("Greenhouse CLI flag validation", () => {
  describe("--company requirement", () => {
    test("missing --company exits 1 with NO_COMPANY", async () => {
      const result = await runCLI(["search"]);
      expect(result.exitCode).not.toBe(0);
      const err = parsedStderr(result.stderr);
      expect(err.code).toBe("NO_COMPANY");
    });

    test("detail without --company exits 1 with NO_COMPANY", async () => {
      const result = await runCLI(["detail", "12345"]);
      expect(result.exitCode).not.toBe(0);
      const err = parsedStderr(result.stderr);
      expect(err.code).toBe("NO_COMPANY");
    });
  });

  describe("--jobage NaN validation", () => {
    test("non-numeric string exits 1 with BAD_ARG", async () => {
      const result = await runCLI(["search", "-c", COMPANY, "--jobage", "foo"]);
      expect(result.exitCode).not.toBe(0);
      const err = parsedStderr(result.stderr);
      expect(err.code).toBe("BAD_ARG");
      expect(err.error).toMatch(/jobage/);
    });
  });

  describe("--page NaN validation", () => {
    test("non-numeric string exits 1 with BAD_ARG", async () => {
      const result = await runCLI(["search", "-c", COMPANY, "--page", "abc"]);
      expect(result.exitCode).not.toBe(0);
      const err = parsedStderr(result.stderr);
      expect(err.code).toBe("BAD_ARG");
      expect(err.error).toMatch(/page/);
    });
  });

  describe("--limit NaN validation", () => {
    test("non-numeric string exits 1 with BAD_ARG", async () => {
      const result = await runCLI(["search", "-c", COMPANY, "--limit", "xyz"]);
      expect(result.exitCode).not.toBe(0);
      const err = parsedStderr(result.stderr);
      expect(err.code).toBe("BAD_ARG");
      expect(err.error).toMatch(/limit/);
    });
  });

  describe("unknown command", () => {
    test("exits 1 with BAD_CMD", async () => {
      const result = await runCLI(["bogus"]);
      expect(result.exitCode).not.toBe(0);
      const err = parsedStderr(result.stderr);
      expect(err.code).toBe("BAD_CMD");
    });
  });

  describe("detail missing id", () => {
    test("exits 1 with NO_ID", async () => {
      const result = await runCLI(["detail", "-c", COMPANY]);
      expect(result.exitCode).not.toBe(0);
      const err = parsedStderr(result.stderr);
      expect(err.code).toBe("NO_ID");
    });
  });

  describe("live smoke test", () => {
    test("search against a known-good board returns real, complete results", async () => {
      const result = await runCLI(["search", "-c", COMPANY, "-q", "product", "--limit", "5"]);
      expect(result.exitCode).toBe(0);
      const parsed = JSON.parse(result.stdout);
      expect(parsed.results.length).toBeGreaterThan(0);
      const first = parsed.results[0];
      expect(first.id).toBeTruthy();
      expect(first.title).toBeTruthy();
      expect(first.url).toMatch(/^https?:\/\//);
    });
  });
});

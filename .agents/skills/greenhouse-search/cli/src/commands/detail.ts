import { fetchJobDetail, toJobDetail, writeError } from "../helpers.js"

export interface DetailOpts {
  id: string
  company: string
  format: "json" | "plain"
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  try {
    const job = await fetchJobDetail(opts.company, opts.id)
    if (!job) {
      writeError(`Job "${opts.id}" not found on ${opts.company}'s board`, "NOT_FOUND")
      return 1
    }
    const detail = toJobDetail(job, opts.company)

    if (opts.format === "plain") {
      const lines = [
        detail.title,
        `${detail.company || "—"} · ${detail.location || "—"}`,
        detail.departments.length ? `Department: ${detail.departments.join(", ")}` : "",
        detail.offices.length ? `Office: ${detail.offices.join(", ")}` : "",
        detail.requisitionId ? `Requisition: ${detail.requisitionId}` : "",
        "",
        detail.description || "(no description)",
        "",
        `URL: ${detail.url}`,
      ].filter((l) => l !== "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(detail, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}

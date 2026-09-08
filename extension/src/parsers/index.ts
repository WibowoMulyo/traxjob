export interface ExtractedJob {
  company: string;
  role: string;
  url: string;
  source: string;
  notes: string;
}

export function hasJobMetadata(job: Pick<ExtractedJob, "company" | "role">): boolean {
  return Boolean(job.company.trim() || job.role.trim());
}

import { applySiteSelectors } from "./sites.js";

const SOURCES = [
  ["linkedin.com", "LinkedIn"],
  ["jobstreet.com", "JobStreet"],
  ["glints.com", "Glints"],
  ["maganghub.kemnaker.go.id", "MagangHub"],
  ["kalibrr.com", "Kalibrr"],
  ["kalibrr.id", "Kalibrr"],
  ["indeed.com", "Indeed"],
  ["pintarnya.com", "Pintarnya"],
  ["dealls.com", "Dealls"],
] as const;

export function normalizeJobUrl(raw: string): string {
  const value = raw.trim();
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return value;
  }
}

export function sourceFromUrl(raw: string): string {
  try {
    const hostname = new URL(raw).hostname.toLowerCase();
    return (
      SOURCES.find(
        ([domain]) => hostname === domain || hostname.endsWith(`.${domain}`),
      )?.[1] ?? ""
    );
  } catch {
    return "";
  }
}

function text(value: string | null | undefined): string {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function meta(document: Document, selector: string): string {
  return text(document.querySelector<HTMLMetaElement>(selector)?.content);
}

function jsonLdJob(document: Document): Pick<ExtractedJob, "company" | "role" | "notes"> {
  for (const script of document.querySelectorAll("script[type='application/ld+json']")) {
    try {
      const value = JSON.parse(script.textContent ?? "");
      const jobs = Array.isArray(value) ? value : [value];
      const job = jobs.find((item) => item?.["@type"] === "JobPosting");
      if (job) {
        const company =
          typeof job.hiringOrganization?.name === "string"
            ? text(job.hiringOrganization.name)
            : "";
        const role = typeof job.title === "string" ? text(job.title) : "";
        const location =
          typeof job.jobLocation?.address?.addressLocality === "string"
            ? text(job.jobLocation.address.addressLocality)
            : "";
        const description = typeof job.description === "string" ? text(job.description) : "";
        const notes = [location && `Location: ${location}`, description && `Description: ${description}`]
          .filter(Boolean)
          .join("\n\n")
          .slice(0, 4000);
        return { company, role, notes };
      }
    } catch {
      /* Malformed structured data must not block generic metadata fallbacks. */
    }
  }
  return { company: "", role: "", notes: "" };
}

export function extractGenericJob(document: Document, pageUrl: string): ExtractedJob {
  const structured = jsonLdJob(document);
  const title = text(document.title).replace(/\s*[|—-].*$/, "");
  const role = structured.role || meta(document, "meta[property='og:title']") || title;
  const company =
    structured.company ||
    meta(document, "meta[property='og:site_name']") ||
    meta(document, "meta[name='author']");
  return {
    company,
    role,
    url: normalizeJobUrl(pageUrl),
    source: sourceFromUrl(pageUrl),
    notes: structured.notes,
  };
}

export function extractJob(document: Document, pageUrl: string): ExtractedJob {
  return applySiteSelectors(document, pageUrl, extractGenericJob(document, pageUrl));
}

import type { ExtractedJob } from "./index.js";

type SiteSelectors = {
  domains: string[];
  role: string[];
  company: string[];
  notes?: string[];
};

const SITE_SELECTORS: SiteSelectors[] = [
  {
    domains: ["linkedin.com"],
    role: [".top-card-layout__title", "[data-testid='job-details-jobs-unified-top-card__job-title']"],
    company: [
      ".topcard__org-name-link",
      "[data-tracking-control-name='public_jobs_topcard-org-name']",
      "[class*='job-details-jobs-unified-top-card__company-name']",
      "[class*='top-card-layout__company-name']",
      ".top-card-layout__card a[href*='/company/']",
      "a[href*='/company/']",
    ],
  },
  {
    domains: ["jobstreet.com"],
    role: ["[data-automation='job-detail-title']", "h1"],
    company: ["[data-automation='advertiser-name']", "[data-automation='job-detail-company-name']"],
  },
  {
    domains: ["glints.com"],
    role: ["[data-cy='job-detail-title']", "h1"],
    company: ["[data-cy='job-detail-company-name']", "a[href*='/companies/']"],
  },
  {
    domains: ["maganghub.kemnaker.go.id"],
    role: ["h1[class*='text-xl']", "h1"],
    company: ["h1 + p.text-muted-foreground", "h1 + p"],
    notes: ["h2 + .prose"],
  },
  {
    domains: ["kalibrr.com", "kalibrr.id"],
    role: ["[data-testid='job-title']", "[class*='job-title']", "h1"],
    company: ["[data-testid='company-name']", "[class*='company-name']", "a[href*='/company']"],
    notes: ["[data-testid='job-description']", "[class*='job-description']"],
  },
  {
    domains: ["indeed.com"],
    role: ["[data-testid='jobsearch-JobInfoHeader-title']", "h1"],
    company: ["[data-testid='inlineHeader-companyName']", "[data-testid='companyName']", "[class*='companyName']", "a[href*='/cmp/']"],
    notes: ["#jobDescriptionText"],
  },
  {
    domains: ["pintarnya.com"],
    role: ["[data-testid='job-title']", "[class*='job-title']", "h1"],
    company: ["[data-testid='company-name']", "[class*='company-name']", "[class*='company']"],
    notes: ["[data-testid='job-description']", "[class*='description']"],
  },
  {
    domains: ["dealls.com"],
    role: ["[data-testid='job-title']", "[class*='job-title']", "h1"],
    company: ["[data-testid='company-name']", "[class*='company-name']", "[class*='company']"],
    notes: ["[data-testid='job-description']", "[class*='description']"],
  },
];

function text(value: string | null | undefined): string {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function selectText(document: Document, selectors: string[]): string {
  for (const selector of selectors) {
    const value = text(document.querySelector(selector)?.textContent);
    if (value) return value;
  }
  return "";
}

function kalibrrRoleFromUrl(pageUrl: string): string {
  try {
    const url = new URL(pageUrl);
    const segments = url.pathname.split("/").filter(Boolean);
    const jobsIndex = segments.lastIndexOf("jobs");
    const slug = jobsIndex >= 0 ? segments[jobsIndex + 2] : segments.at(-1);
    if (!slug || /^\d+$/.test(slug)) return "";
    return decodeURIComponent(slug)
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  } catch {
    return "";
  }
}

function kalibrrCompanyFromUrl(pageUrl: string): string {
  try {
    const segments = new URL(pageUrl).pathname.split("/").filter(Boolean);
    const companyIndex = segments.indexOf("c");
    const slug = companyIndex >= 0 ? segments[companyIndex + 1] : "";
    if (!slug) return "";
    return decodeURIComponent(slug)
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  } catch {
    return "";
  }
}

function kalibrrCompanyFromDocument(document: Document): string {
  const anchors =
    typeof document.querySelectorAll === "function"
      ? document.querySelectorAll<HTMLAnchorElement>("a[href]")
      : [];
  for (const anchor of anchors) {
    const href = anchor.getAttribute("href") ?? "";
    if (!/\/c\/[^/]+(?:\/jobs)?(?:\/|$)/i.test(href)) continue;
    const value = text(anchor.textContent);
    if (value && !/^report|view all|jobs?$/i.test(value)) return value;
  }
  return "";
}

export function siteSelectors(pageUrl: string): SiteSelectors | null {
  try {
    const hostname = new URL(pageUrl).hostname.toLowerCase();
    return (
      SITE_SELECTORS.find((site) =>
        site.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`)),
      ) ?? null
    );
  } catch {
    return null;
  }
}

export function applySiteSelectors(
  document: Document,
  pageUrl: string,
  fallback: ExtractedJob,
): ExtractedJob {
  const selectors = siteSelectors(pageUrl);
  if (!selectors) return fallback;
  const isKalibrr = selectors.domains.includes("kalibrr.com");
  const selectedRole = selectText(document, selectors.role);
  const kalibrrRole = isKalibrr
    ? kalibrrRoleFromUrl(pageUrl)
    : "";
  const selectedCompany = selectText(document, selectors.company);
  const fallbackCompany =
    isKalibrr && /^kalibrr$/i.test(fallback.company) ? "" : fallback.company;
  const kalibrrCompany = isKalibrr
    ? kalibrrCompanyFromDocument(document) || kalibrrCompanyFromUrl(pageUrl)
    : "";
  return {
    ...fallback,
    role: selectedRole || fallback.role || kalibrrRole,
    company: selectedCompany || fallbackCompany || kalibrrCompany,
    notes: selectText(document, selectors.notes ?? []) || fallback.notes,
  };
}

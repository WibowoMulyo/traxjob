import assert from "node:assert/strict";
import test from "node:test";
import { hasJobMetadata, normalizeJobUrl, sourceFromUrl } from "./index.js";
import { applySiteSelectors } from "./sites.js";

test("normalizes a job URL without changing its identity", () => {
  assert.equal(
    normalizeJobUrl(" https://jobs.example.com/role?id=42#details "),
    "https://jobs.example.com/role?id=42",
  );
});

test("detects the supported source from a job URL", () => {
  assert.equal(sourceFromUrl("https://www.linkedin.com/jobs/view/42"), "LinkedIn");
  assert.equal(sourceFromUrl("https://id.jobstreet.com/id/job/42"), "JobStreet");
  assert.equal(sourceFromUrl("https://glints.com/id/en/opportunities/jobs/42"), "Glints");
  assert.equal(
    sourceFromUrl("https://maganghub.kemnaker.go.id/magang-nasional/lowongan/42"),
    "MagangHub",
  );
  assert.equal(sourceFromUrl("https://www.kalibrr.com/c/role/42"), "Kalibrr");
  assert.equal(sourceFromUrl("https://kalibrr.id/c/role/42"), "Kalibrr");
  assert.equal(sourceFromUrl("https://id.indeed.com/viewjob?jk=42"), "Indeed");
  assert.equal(sourceFromUrl("https://www.pintarnya.com/lowongan/42"), "Pintarnya");
  assert.equal(sourceFromUrl("https://dealls.com/loker/42"), "Dealls");
  assert.equal(sourceFromUrl("https://example.com/jobs/42"), "");
});

test("detects when a page has no readable job metadata", () => {
  assert.equal(hasJobMetadata({ company: "", role: "" }), false);
  assert.equal(hasJobMetadata({ company: "Acme", role: "" }), true);
});

test("reads LinkedIn company from the public jobs tracking link", () => {
  const documentStub = {
    querySelector: (selector: string) =>
      selector === "[data-tracking-control-name='public_jobs_topcard-org-name']"
        ? { textContent: "Acme Corp" }
        : null,
  } as unknown as Document;
  const fallback = {
    company: "",
    role: "Frontend Engineer",
    url: "https://www.linkedin.com/jobs/view/42",
    source: "LinkedIn",
    notes: "",
  };

  assert.equal(
    applySiteSelectors(documentStub, fallback.url, fallback).company,
    "Acme Corp",
  );
});

test("reads LinkedIn company from the two-pane company class", () => {
  const documentStub = {
    querySelector: (selector: string) =>
      selector === "[class*='job-details-jobs-unified-top-card__company-name']"
        ? { textContent: "Acme Corp" }
        : null,
  } as unknown as Document;
  const fallback = {
    company: "",
    role: "Frontend Engineer",
    url: "https://www.linkedin.com/jobs/view/42",
    source: "LinkedIn",
    notes: "",
  };

  assert.equal(
    applySiteSelectors(documentStub, fallback.url, fallback).company,
    "Acme Corp",
  );
});

test("reads MagangHub role and company from the detail header", () => {
  const documentStub = {
    querySelector: (selector: string) => {
      if (selector === "h1[class*='text-xl']") return { textContent: "Web Developer" };
      if (selector === "h1 + p.text-muted-foreground") return { textContent: "Digital Kreasi Muslim" };
      if (selector === "h2 + .prose") return { textContent: "Membangun aplikasi web." };
      return null;
    },
  } as unknown as Document;
  const fallback = {
    company: "",
    role: "",
    url: "https://maganghub.kemnaker.go.id/magang-nasional/lowongan/42",
    source: "MagangHub",
    notes: "",
  };

  const extracted = applySiteSelectors(documentStub, fallback.url, fallback);
  assert.equal(extracted.role, "Web Developer");
  assert.equal(extracted.company, "Digital Kreasi Muslim");
  assert.equal(extracted.notes, "Membangun aplikasi web.");
});

test("reads role and company from the additional supported sites", () => {
  const cases = [
    {
      url: "https://www.kalibrr.com/c/role/42",
      roleSelector: "[data-testid='job-title']",
      companySelector: "[data-testid='company-name']",
      role: "Frontend Engineer",
      company: "Acme Kalibrr",
    },
    {
      url: "https://id.indeed.com/viewjob?jk=42",
      roleSelector: "[data-testid='jobsearch-JobInfoHeader-title']",
      companySelector: "[data-testid='inlineHeader-companyName']",
      role: "Backend Engineer",
      company: "Acme Indeed",
    },
    {
      url: "https://www.pintarnya.com/lowongan/42",
      roleSelector: "[data-testid='job-title']",
      companySelector: "[data-testid='company-name']",
      role: "Product Designer",
      company: "Acme Pintarnya",
    },
    {
      url: "https://dealls.com/loker/42",
      roleSelector: "[data-testid='job-title']",
      companySelector: "[data-testid='company-name']",
      role: "Data Analyst",
      company: "Acme Dealls",
    },
  ];

  for (const item of cases) {
    const documentStub = {
      querySelector: (selector: string) => {
        if (selector === item.roleSelector) return { textContent: item.role };
        if (selector === item.companySelector) return { textContent: item.company };
        return null;
      },
    } as unknown as Document;
    const extracted = applySiteSelectors(documentStub, item.url, {
      company: "",
      role: "",
      url: item.url,
      source: "",
      notes: "",
    });

    assert.equal(extracted.role, item.role);
    assert.equal(extracted.company, item.company);
  }
});

test("falls back to the Kalibrr job slug for the role", () => {
  const documentStub = {
    querySelector: () => null,
  } as unknown as Document;
  const fallback = {
    company: "Acme Kalibrr",
    role: "",
    source: "Kalibrr",
    notes: "",
  };

  assert.equal(
    applySiteSelectors(
      documentStub,
      "https://kalibrr.id/c/company/jobs/42/frontend-engineer",
      { ...fallback, url: "https://kalibrr.id/c/company/jobs/42/frontend-engineer" },
    ).role,
    "Frontend Engineer",
  );
  assert.equal(
    applySiteSelectors(
      documentStub,
      "https://www.kalibrr.com/c/company/jobs/42/senior-product-designer",
      { ...fallback, url: "https://www.kalibrr.com/c/company/jobs/42/senior-product-designer" },
    ).role,
    "Senior Product Designer",
  );
});

test("falls back to the Kalibrr company slug for the company", () => {
  const documentStub = {
    querySelector: () => null,
    querySelectorAll: () => [],
  } as unknown as Document;
  const base = {
    company: "Kalibrr",
    role: "Frontend Engineer",
    source: "Kalibrr",
    notes: "",
  };

  assert.equal(
    applySiteSelectors(
      documentStub,
      "https://kalibrr.id/id-ID/c/acme-digital/jobs/42/frontend-engineer",
      { ...base, url: "https://kalibrr.id/id-ID/c/acme-digital/jobs/42/frontend-engineer" },
    ).company,
    "Acme Digital",
  );
  assert.equal(
    applySiteSelectors(
      documentStub,
      "https://www.kalibrr.com/c/acme-labs/jobs/42/frontend-engineer",
      { ...base, url: "https://www.kalibrr.com/c/acme-labs/jobs/42/frontend-engineer" },
    ).company,
    "Acme Labs",
  );
});

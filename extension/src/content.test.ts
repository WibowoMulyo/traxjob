import assert from "node:assert/strict";
import test from "node:test";

test("responds to extraction requests from the service worker", async () => {
  let listener: ((message: { type?: string }, sender: unknown, sendResponse: (value: unknown) => void) => void) | undefined;
  let response: any;
  const documentStub = {
    title: "Jr Fullstack Developer | Glints",
    querySelector: () => null,
    querySelectorAll: () => [],
  } as unknown as Document;

  (globalThis as any).document = documentStub;
  (globalThis as any).location = { href: "https://glints.com/id/en/opportunities/jobs/42" };
  (globalThis as any).chrome = {
    runtime: {
      onMessage: { addListener: (handler: typeof listener) => { listener = handler; } },
    },
  };
  await import(`./content.js?test=${Date.now()}`);

  listener?.({ type: "extract-job" }, {}, (value) => { response = value; });
  assert.equal(response.source, "Glints");
  assert.equal(response.role, "Jr Fullstack Developer");
});

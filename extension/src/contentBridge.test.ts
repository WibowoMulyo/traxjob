import assert from "node:assert/strict";
import test from "node:test";
import { shouldInjectContentScript } from "./contentBridge.js";

test("detects a missing content script connection", () => {
  assert.equal(
    shouldInjectContentScript(
      new Error("Could not establish connection. Receiving end does not exist."),
    ),
    true,
  );
  assert.equal(shouldInjectContentScript(new Error("API failed")), false);
});

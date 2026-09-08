import assert from "node:assert/strict";
import test from "node:test";
import { bearerToken } from "./authTokens.js";

test("extracts only a well-formed bearer token", () => {
  assert.equal(bearerToken("Bearer extension-token"), "extension-token");
  assert.equal(bearerToken("bearer extension-token"), "extension-token");
  assert.equal(bearerToken("Basic credentials"), null);
  assert.equal(bearerToken("Bearer"), null);
});

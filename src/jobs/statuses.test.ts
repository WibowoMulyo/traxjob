import assert from "node:assert/strict";
import test from "node:test";
import { STATUS_LABEL, STATUS_OPTIONS } from "./constants.js";

test("includes the detailed application pipeline statuses", () => {
  assert.deepEqual(STATUS_OPTIONS, [
    "wishlist",
    "applied",
    "screening",
    "psychological_test",
    "technical_test",
    "interview",
    "interview_hr",
    "interview_user",
    "final_interview",
    "offer",
    "accepted",
    "rejected",
    "withdrawn",
  ]);
  assert.equal(STATUS_LABEL.interview_hr, "Interview HR");
  assert.equal(STATUS_LABEL.interview_user, "Interview User");
});

import test from "node:test";
import assert from "node:assert";
import { nightsBetween, isRangeFree, totalPrice } from "./booking.js";

test("nightsBetween", () => {
  assert.strictEqual(nightsBetween("2026-12-01", "2026-12-04"), 3);
  assert.strictEqual(nightsBetween("2026-12-04", "2026-12-04"), 0);
  assert.ok(nightsBetween("2026-12-05", "2026-12-04") < 0);
});

test("isRangeFree", () => {
  assert.strictEqual(isRangeFree("2026-12-01", "2026-12-03", ["2026-12-02"]), false);
  assert.strictEqual(isRangeFree("2026-12-01", "2026-12-03", ["2026-12-03"]), true);
  assert.strictEqual(isRangeFree("2026-12-03", "2026-12-05", ["2026-12-01", "2026-12-02"]), true);
});

test("totalPrice", () => {
  assert.strictEqual(totalPrice(3), 45000);
});

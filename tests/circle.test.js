const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};

test("arguments", () => {
  // const c2 = math.circle(1, [0.5, 0]);
  expect(true).toBe(true);
});

test("circle", () => {
  testEqual(5, math.circle(5, 1, 2).radius);
  testEqual([1, 2], math.circle(5, 1, 2).origin);
  const clipLine = math.circle(1).intersect(math.line([0, 1], [0.5, 0]));
  const shouldBeLine = [[0.5, -Math.sqrt(3) / 2], [0.5, Math.sqrt(3) / 2]];
  testEqual(clipLine[0], shouldBeLine[0]);
  testEqual(clipLine[1], shouldBeLine[1]);

  const shouldBeRay = [Math.sqrt(2) / 2, Math.sqrt(2) / 2];
  const clipRay = math.circle(1).intersect(math.ray(0.1, 0.1));
  testEqual(shouldBeRay, clipRay[0]);

  const shouldBeSeg = [Math.sqrt(2) / 2, Math.sqrt(2) / 2];
  const clipSeg = math.circle(1).intersect(math.segment(0, 0, 10, 10));
  testEqual(shouldBeSeg, clipSeg[0]);
});

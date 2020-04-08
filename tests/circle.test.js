const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};

test("circle", () => {
  testEqual(5, math.circle(1, 2, 5).radius);
  testEqual([1, 2], math.circle(1, 2, 5).origin);
  // testEqual(
  //   [[0.5, Math.sqrt(3) / 2], [0.5, -Math.sqrt(3) / 2]],
  //   math.circle(0, 0, 1).intersectionLine(math.line(0.5, 0, 0, 1))
  // );


  // todo, this needs to be written
  // testEqual(
  //   [Math.sqrt(2) / 2, -Math.sqrt(2) / 2],
  //   math.circle(0, 0, 1).intersectionRay(math.ray(0, 0, 0.1, 0.1))
  // );
  // testEqual(
  //   [Math.sqrt(2) / 2, -Math.sqrt(2) / 2],
  //   math.circle(0, 0, 1).intersectionEdge(math.segment(0, 0, 10, 10))
  // );
});

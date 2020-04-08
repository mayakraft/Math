const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};


/**
 * lines, rays, segments
 */

// test("line ray segment intersections", () => {
//   testEqual([5, 5], math.line(0, 0, 1, 1).intersect(math.line(10, 0, -1, 1)));
//   testEqual([5, 5], math.line(0, 0, 1, 1).intersect(math.ray(10, 0, -1, 1)));
//   testEqual([5, 5], math.line(0, 0, 1, 1).intersect(math.segment(10, 0, 0, 10)));
// });

// test("line ray segment parallel", () => {
//   testEqual(true, math.line(0, 0, 1, 1).isParallel(math.ray(10, 0, 1, 1)));
//   testEqual(true, math.line(0, 0, -1, 1).isParallel(math.segment(0, 0, -2, 2)));
//   testEqual(false, math.line(0, 0, -1, 1).isParallel(math.segment(10, 0, 1, 1)));
// });

// test("line ray segment reflection matrices", () => {
//   testEqual(
//     math.line(10, 0, -1, 1).reflection(),
//     math.ray(10, 0, -1, 1).reflection()
//   );
//   testEqual(
//     math.segment(10, 0, 0, 10).reflection(),
//     math.ray(10, 0, -1, 1).reflection()
//   );
// });

test("line ray segment nearest points", () => {
  // testEqual([20, -10], math.line(10, 0, -1, 1).nearestPoint([20, -10]));
  // testEqual([-50, 60], math.line(10, 0, -1, 1).nearestPoint([-10, 100]));
  // testEqual([10, 0], math.ray(10, 0, -1, 1).nearestPoint([20, -10]));
  // testEqual([-50, 60], math.ray(10, 0, -1, 1).nearestPoint([-10, 100]));
  // testEqual([10, 0], math.segment(10, 0, 0, 10).nearestPoint([20, -10]));
  // testEqual([0, 10], math.segment(10, 0, 0, 10).nearestPoint([-10, 100]));
  // testEqual(
  //   math.ray(10, 0, -1, 1).nearestPoint([0, 0]),
  //   math.line(10, 0, -1, 1).nearestPoint([0, 0])
  // );
  // testEqual(
  //   math.segment(10, 0, 0, 10).nearestPoint([0, 0]),
  //   math.ray(10, 0, -1, 1).nearestPoint([0, 0])
  // );
});

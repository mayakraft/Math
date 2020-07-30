const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};

test("arguments", () => {
  const l1 = math.line(1);
  expect(l1.origin[0]).toBe(0);
  expect(l1.origin[1]).toBe(undefined);
  expect(l1.origin[2]).toBe(undefined);
  const l2 = math.line(1,2);
  expect(l2.origin[0]).toBe(0);
  expect(l2.origin[1]).toBe(0);
  expect(l2.origin[2]).toBe(undefined);
  const l3 = math.line(1,2,3);
  expect(l3.origin[0]).toBe(0);
  expect(l3.origin[1]).toBe(0);
  expect(l3.origin[2]).toBe(0);
});


// from the prototype
// test("isParallel", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.isParallel()).toBe(true);
// });
// test("isDegenerate", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.isDegenerate()).toBe(true);
// });
// test("reflection", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.reflection()).toBe(true);
// });
// test("nearestPoint", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.nearestPoint()).toBe(true);
// });
// test("intersect", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.intersect()).toBe(true);
// });
// test("bisectLine", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.bisectLine()).toBe(true);
// });
// test("bisectRay", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.bisectRay()).toBe(true);
// });
// test("bisectSegment", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.bisectSegment()).toBe(true);
// });

// // line
// test("transform", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.transform()).toBe(true);
// });
// test("fromPoints", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.fromPoints()).toBe(true);
// });
// test("perpendicularBisector", () => {
//   const l = math.line(0,1,2,3);
//   expect(l.perpendicularBisector()).toBe(true);
// });

// // ray
// test("transform", () => {
//   const r = math.ray(0,1,2,3);
//   expect(r.transform()).toBe(true);
// });
// test("rotate180", () => {
//   const r = math.ray(0,1,2,3);
//   expect(r.rotate180()).toBe(true);
// });
// test("fromPoints", () => {
//   const r = math.ray(0,1,2,3);
//   expect(r.fromPoints()).toBe(true);
// });

// // segment
// test("0", () => {
//   const s = math.segment(0,1,2,3);
//   expect(s[0]()).toBe(true);
// });
// test("1", () => {
//   const s = math.segment(0,1,2,3);
//   expect(s[1]()).toBe(true);
// });
// test("length", () => {
//   const s = math.segment(0,1,2,3);
//   expect(s.length()).toBe(true);
// });
// test("clip_function", () => {
//   const s = math.segment(0,1,2,3);
//   expect(s.clip_function()).toBe(true);
// });
// test("transform", () => {
//   const s = math.segment(0,1,2,3);
//   expect(s.transform()).toBe(true);
// });
// test("scale", () => {
//   const s = math.segment(0,1,2,3);
//   expect(s.scale()).toBe(true);
// });
// test("midpoint", () => {
//   const s = math.segment(0,1,2,3);
//   expect(s.midpoint()).toBe(true);
// });

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

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
test("isParallel", () => {
  const l = math.line([0,1],[2,3]);
  expect(l.isParallel([0,-1], [7, 8])).toBe(true);
});
test("isDegenerate", () => {
  const l = math.line([0,0],[2,3]);
  expect(l.isDegenerate()).toBe(true);
});
test("reflection", () => {
  const result = math.line([0,1],[2,3]).reflectionMatrix();
  expect(result[0]).toBeCloseTo(-1);
  expect(result[1]).toBeCloseTo(0);
  expect(result[2]).toBeCloseTo(0);
  expect(result[3]).toBeCloseTo(0);
  expect(result[4]).toBeCloseTo(1);
  expect(result[9]).toBeCloseTo(4);
  expect(result[10]).toBeCloseTo(0);
  // expect(l.reflection().origin).toBe();
});
test("nearestPoint", () => {
  const res = math.line([1,1],[2,3]).nearestPoint(0,0);
  expect(res[0]).toBe(-0.5);
  expect(res[1]).toBe(0.5);
  // expect(l.nearestPoint(0,0)).toBe(true);
});
test("transform", () => {
  const res = math.line([0,1],[2,3]).transform([2,0,0,0,2,0,0,0,2,0,0,0]);
  expect(res.vector[0]).toBeCloseTo(0);
  expect(res.vector[1]).toBeCloseTo(2);
  expect(res.origin[0]).toBeCloseTo(4);
  expect(res.origin[1]).toBeCloseTo(6);
});
test("intersect", () => {
  const polygon = math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
  const circle = math.circle(1);
  const line = math.line([1, 2], [-0.5, 0]);
  const line2 = math.line([-1, 2], [0.5, 0]);
  const ray = math.ray([-1, 2], [0.5, 0]);
  const segment = math.segment([-2, 0.5], [2, 0.5]);
  [
    line.intersect(polygon),
    line.intersect(circle),
    line.intersect(line2),
    line.intersect(ray),
    line.intersect(segment)
  ].forEach(intersect => expect(intersect).not.toBe(undefined));

});

// todo problems
test("bisect", () => {
  expect(true).toBe(true);
  const l0 = math.line([0,1], [0,0]);
  const l1 = math.line([0,1], [1,0]);
  const res = l0.bisect(l1);
  // console.log("Bisec", res);
  // expect(l.bisectLine()).toBe(true);
});

// line
test("fromPoints", () => {
  const result = math.line.fromPoints([1,2],[3,4]);
  expect(result.origin.x).toBe(1);
  expect(result.origin.y).toBe(2);
  expect(result.vector.x).toBe(2);
  expect(result.vector.y).toBe(2);
});
test("perpendicularBisector", () => {
  const result = math.line.perpendicularBisector([0,1],[2,3]);
  expect(result.origin.x).toBe(1);
  expect(result.origin.y).toBe(2);
  expect(result.vector.x).toBe(-2);
  expect(result.vector.y).toBe(2);
});
test("length infinity", () => {
  expect(math.line().length).toBe(Infinity);
  expect(math.line([1,2],[3,4]).length).toBe(Infinity);
  expect(math.line.fromPoints([1,2],[3,4]).length).toBe(Infinity);

  expect(math.ray().length).toBe(Infinity);
  expect(math.ray([1,2],[3,4]).length).toBe(Infinity);
  expect(math.ray.fromPoints([1,2],[3,4]).length).toBe(Infinity);
});
// // ray
// test("transform", () => {
//   const r = math.ray(0,1,2,3);
//   expect(r.transform()).toBe(true);
// });
test("ray", () => {
  const result = math.ray([1,2], [3,3]);
  expect(result.origin.x).toBe(3);
  expect(result.origin.y).toBe(3);
  expect(result.vector.x).toBe(1);
  expect(result.vector.y).toBe(2);
});
test("rotate180", () => {
  const result = math.ray([1,2], [3,3]).rotate180();
  expect(result.origin.x).toBe(3);
  expect(result.origin.y).toBe(3);
  expect(result.vector.x).toBe(-1);
  expect(result.vector.y).toBe(-2);
});
test("fromPoints", () => {
  const result = math.ray.fromPoints([1,2],[3,4]);
  expect(result.origin.x).toBe(1);
  expect(result.origin.y).toBe(2);
  expect(result.vector.x).toBe(2);
  expect(result.vector.y).toBe(2);
});
test("nearestPoint", () => {
  const result = math.ray([1,1],[2,3]).nearestPoint(0,0);
  expect(result[0]).toBe(2);
  expect(result[1]).toBe(3);
  const result2 = math.ray([0,1],[5,-5]).nearestPoint(0,0);
  expect(result2[0]).toBe(5);
  expect(result2[1]).toBe(0);
});

// segment
test("[0], [1]", () => {
  const result = math.segment([1,2], [3,4]);
  expect(result[0][0]).toBe(1);
  expect(result[0][1]).toBe(2);
  expect(result[1][0]).toBe(3);
  expect(result[1][1]).toBe(4);
});
test("length", () => {
  const result = math.segment([1,2], [3,4]);
  expect(result.length).toBeCloseTo(Math.sqrt(2) * 2);
});
test("transform", () => {
  const result1 = math.segment([1,2], [3,4]).transform(math.matrix().scale(0.5));
  expect(result1[0].x).toBe(0.5);
  expect(result1[0].y).toBe(1);
  expect(result1[1].x).toBe(1.5);
  expect(result1[1].y).toBe(2);
});
test("midpoint", () => {
  const result = math.segment([1,2], [3,4]).midpoint();
  expect(result.x).toBe(2);
  expect(result.y).toBe(3);
});
test("fromPoints", () => {
  const result = math.segment.fromPoints([1,2],[3,4]);
  expect(result[0].x).toBe(1);
  expect(result[0].y).toBe(2);
  expect(result[1].x).toBe(3);
  expect(result[1].y).toBe(4);
});
test("nearestPoint", () => {
  const res = math.segment([1,1],[2,3]).nearestPoint(0,0);
  expect(res[0]).toBe(1);
  expect(res[1]).toBe(1);
});

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

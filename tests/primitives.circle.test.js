const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("excluding primitives", () => expect(true).toBe(true));

// test("arguments", () => {
// 	expect(math.circle(1, [4, 5]).radius).toBe(1);
// 	expect(math.circle(1, [4, 5]).origin.x).toBe(4);
// 	expect(math.circle(1, [4, 5]).origin.y).toBe(5);
// 	expect(math.circle([4, 5], 1).radius).toBe(1);
// 	expect(math.circle([4, 5], 1).origin.x).toBe(4);
// 	expect(math.circle([4, 5], 1).origin.y).toBe(5);
// 	expect(math.circle(1, 2).radius).toBe(2);
// 	expect(math.circle(1, 2).origin.x).toBe(1);
// 	expect(math.circle(1, 2, 3).radius).toBe(3);
// 	expect(math.circle(1, 2, 3).origin.x).toBe(1);
// 	expect(math.circle(1, 2, 3).origin.y).toBe(2);
// 	expect(math.circle(1, 2, 3, 4).radius).toBe(4);
// 	expect(math.circle(1, 2, 3, 4).origin.x).toBe(1);
// 	expect(math.circle(1, 2, 3, 4).origin.y).toBe(2);
// 	expect(math.circle(1, 2, 3, 4).origin.z).toBe(3);
// 	expect(math.circle([1, 2], [3, 4]).radius).toBe(math.distance2([1, 2], [3, 4]));
// 	expect(math.circle([1, 2], [3, 4]).origin.x).toBe(1);
// 	expect(math.circle([1, 2], [3, 4]).origin.y).toBe(2);
// 	// expect(math.circle([1,2], [3,4], [5,6]) circumcenter between 3 points
// 	// expect(math.circle([1,2], [3,4], [5,6]) circumcenter between 3 points
// });

// test("x, y", () => {
// 	const result = math.circle(1, [2, 3]);
// 	expect(result.x).toBe(2);
// 	expect(result.y).toBe(3);
// 	expect(result.z).toBe(undefined);

// 	const result1 = math.circle(1);
// 	expect(result1.x).toBe(0);
// 	expect(result1.y).toBe(0);
// 	expect(result1.z).toBe(0);
// });

// test("circle nearest point", () => {
// 	const result1 = math.circle(1).nearestPoint([5, 0]);
// 	expect(result1.x).toBeCloseTo(1);
// 	expect(result1.y).toBeCloseTo(0);
// 	const result2 = math.circle(2, [4, 4]).nearestPoint([0, 0]);
// 	expect(result2.x).toBeCloseTo(4 - Math.sqrt(2));
// 	expect(result2.y).toBeCloseTo(4 - Math.sqrt(2));
// });

// test("points", () => {
// 	const result = math.circle(1, [1, 2]).points();
// 	expect(result.length).toBe(128);
// 	expect(result[0][0]).toBeCloseTo(2);
// 	expect(result[0][1]).toBeCloseTo(2);
// });

// test("points param", () => {
// 	const result1 = math.circle(1).points(64);
// 	expect(result1.length).toBe(64);
// 	const result2 = math.circle(1).points(1);
// 	expect(result2.length).toBe(1);
// 	const result3 = math.circle(1).points(3);
// 	expect(result3.length).toBe(3);
// });

// test("polygon", () => {
// 	const result = math.circle(1, [1, 2]).polygon();
// 	expect(result.points.length).toBe(128);
// 	expect(result.points[0][0]).toBeCloseTo(2);
// 	expect(result.points[0][1]).toBeCloseTo(2);
// });

// test("segments", () => {
// 	const result = math.circle(1, [1, 2]).segments();
// 	expect(result.length).toBe(128);
// 	expect(result[0][0][0]).toBeCloseTo(2);
// 	expect(result[0][0][1]).toBeCloseTo(2);
// });

// test("circle fromPoints", () => {
// 	const result1 = math.circle.fromPoints([1, 2], [0, 3], [-1, 2]);
// 	expect(result1.radius).toBeCloseTo(1);
// 	expect(result1.origin.x).toBeCloseTo(0);
// 	expect(result1.origin.y).toBeCloseTo(2);

// 	const result2 = math.circle.fromPoints([1, 2], [0, 3]);
// 	expect(result2.radius).toBeCloseTo(Math.sqrt(2));
// 	expect(result2.origin.x).toBeCloseTo(1);
// 	expect(result2.origin.y).toBeCloseTo(2);
// });

// test("circle fromThreePoints", () => {
// 	const result = math.circle.fromThreePoints([1, 2], [0, 3], [-1, 2]);
// 	expect(result.origin.x).toBeCloseTo(0);
// 	expect(result.origin.y).toBeCloseTo(2);
// });

// test("intersect lines", () => {
// 	const clipLine = math.circle(1).intersect(math.line([0, 1], [0.5, 0]));
// 	const shouldBeLine = [[0.5, -Math.sqrt(3) / 2], [0.5, Math.sqrt(3) / 2]];
// 	math.fnEpsilonEqualVectors(clipLine[0], shouldBeLine[0]);
// 	math.fnEpsilonEqualVectors(clipLine[1], shouldBeLine[1]);
// 	// no intersect
// 	expect(math.circle(1, [2, 2]).intersect(math.line([0, 1], [10, 0]))).toBe(undefined);
// 	// tangent
// 	const tangent = math.circle(1, [2, 0]).intersect(math.line([0, 1], [3, 0]));
// 	expect(tangent[0][0]).toBe(3);
// 	expect(tangent[0][1]).toBe(0);

// 	const shouldBeRay = [Math.sqrt(2) / 2, Math.sqrt(2) / 2];
// 	const clipRay = math.circle(1).intersect(math.ray(0.1, 0.1));
// 	math.fnEpsilonEqualVectors(shouldBeRay, clipRay[0]);

// 	const shouldBeSeg = [Math.sqrt(2) / 2, Math.sqrt(2) / 2];
// 	const clipSeg = math.circle(1).intersect(math.segment(0, 0, 10, 10));
// 	math.fnEpsilonEqualVectors(shouldBeSeg, clipSeg[0]);
// });

// test("circle circle intersect", () => {
// 	// same origin
// 	expect(math.circle(1).intersect(math.circle(2))).toBe(undefined);
// 	// kissing circles
// 	const result1 = math.circle(1).intersect(math.circle(1, [2, 0]));
// 	expect(result1[0][0]).toBe(1);
// 	expect(result1[0][1]).toBe(0);
// 	const result2 = math.circle(1).intersect(math.circle(1, [Math.sqrt(2), Math.sqrt(2)]));
// 	expect(result2[0][0]).toBeCloseTo(Math.sqrt(2) / 2);
// 	expect(result2[0][1]).toBeCloseTo(Math.sqrt(2) / 2);
// 	// circles are contained
// 	expect(math.circle(10).intersect(math.circle(1, [2, 0]))).toBe(undefined);
// });

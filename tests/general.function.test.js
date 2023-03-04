const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("clamp functions", () => {
	expect(math.clampLine(0)).toBe(0);
	expect(math.clampLine(-Infinity)).toBe(-Infinity);
	expect(math.clampLine(Infinity)).toBe(Infinity);
	expect(math.clampLine(NaN)).toBe(NaN);

	expect(math.clampRay(0)).toBe(0);
	expect(math.clampRay(-1e-10)).toBe(-1e-10);
	expect(math.clampRay(-1e-1)).toBe(0);
	expect(math.clampRay(Infinity)).toBe(Infinity);
	expect(math.clampRay(-Infinity)).toBe(0);

	expect(math.clampSegment(0)).toBe(0);
	expect(math.clampSegment(-1e-10)).toBe(-1e-10);
	expect(math.clampSegment(-1e-1)).toBe(0);
	expect(math.clampSegment(Infinity)).toBe(1);
	expect(math.clampSegment(-Infinity)).toBe(0);
});

test("equivalent vectors", () => {
	const smEp = math.EPSILON / 10; // smaller than epsilon
	const bgEp = math.EPSILON * 10; // larger than epsilon
	expect(math.epsilonCompare(0, 0)).toBe(0);
	expect(math.epsilonCompare(0, smEp)).toBe(0);
	expect(math.epsilonCompare(10, 10)).toBe(0);
	expect(math.epsilonCompare(0, 1)).toBe(1);
	expect(math.epsilonCompare(1, 0)).toBe(-1);
	expect(math.epsilonCompare(0, 0, smEp)).toBe(0);
	expect(math.epsilonCompare(0, 0, 1)).toBe(0);
	expect(math.epsilonCompare(0, 1, smEp)).toBe(1);
	expect(math.epsilonCompare(1, 0, smEp)).toBe(-1);
	expect(math.epsilonCompare(0, 1, 10)).toBe(0);
	expect(math.epsilonCompare(0, smEp, bgEp)).toBe(0);
	expect(math.epsilonCompare(0, bgEp, smEp)).toBe(1);
	expect(math.epsilonCompare(bgEp, 0, smEp)).toBe(-1);
});

test("equivalent vectors", () => {
	const smEp = math.EPSILON / 10; // smaller than epsilon
	const bgEp = math.EPSILON * 10; // larger than epsilon
	expect(math.epsilonEqualVectors([1, 2, 3], [1, 2, 3])).toBe(true);
	expect(math.epsilonEqualVectors([1, 2 + smEp], [1, 2 - smEp])).toBe(true);
	expect(math.epsilonEqualVectors([1, 2 + bgEp], [1, 2 - bgEp])).toBe(false);
	expect(math.epsilonEqualVectors([1, 2], [1, 2.0000000001])).toBe(true);
	expect(math.epsilonEqualVectors([1, 2, 3, 4], [1, 2])).toBe(false);
	expect(math.epsilonEqualVectors([], [])).toBe(true);
	expect(math.epsilonEqualVectors([1.000000001, -1], [1, -1])).toBe(true);
	expect(math.epsilonEqualVectors([1.000000001, 0], [1])).toBe(true);
	expect(math.epsilonEqualVectors([1.000000001, 0], [1, 0])).toBe(true);
});

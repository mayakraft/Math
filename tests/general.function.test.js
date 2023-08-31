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

test("epsilonEqual", () => {
	const smEp = math.EPSILON / 10; // smaller than epsilon
	const bgEp = math.EPSILON * 10; // larger than epsilon
	expect(math.epsilonEqual(0, 0)).toBe(true);
	expect(math.epsilonEqual(0, smEp)).toBe(true);
	expect(math.epsilonEqual(10, 10)).toBe(true);
	expect(math.epsilonEqual(0, 1)).toBe(false);
	expect(math.epsilonEqual(1, 0)).toBe(false);
	expect(math.epsilonEqual(0, 0, smEp)).toBe(true);
	expect(math.epsilonEqual(0, 0, 1)).toBe(true);
	expect(math.epsilonEqual(0, 1, smEp)).toBe(false);
	expect(math.epsilonEqual(1, 0, smEp)).toBe(false);
	expect(math.epsilonEqual(0, 1, 10)).toBe(true);
	expect(math.epsilonEqual(0, smEp, bgEp)).toBe(true);
	expect(math.epsilonEqual(0, bgEp, smEp)).toBe(false);
	expect(math.epsilonEqual(bgEp, 0, smEp)).toBe(false);
});

test("epsilonCompare", () => {
	const smEp = math.EPSILON / 10; // smaller than epsilon
	const bgEp = math.EPSILON * 10; // larger than epsilon
	expect(math.epsilonCompare(0, 0)).toBe(0);
	expect(math.epsilonCompare(0, smEp)).toBe(0);
	expect(math.epsilonCompare(10, 10)).toBe(0);
	expect(math.epsilonCompare(0, 1)).toBe(-1);
	expect(math.epsilonCompare(1, 0)).toBe(1);
	expect(math.epsilonCompare(0, 0, smEp)).toBe(0);
	expect(math.epsilonCompare(0, 0, 1)).toBe(0);
	expect(math.epsilonCompare(0, 1, smEp)).toBe(-1);
	expect(math.epsilonCompare(1, 0, smEp)).toBe(1);
	expect(math.epsilonCompare(0, 1, 10)).toBe(0);
	expect(math.epsilonCompare(0, smEp, bgEp)).toBe(0);
	expect(math.epsilonCompare(0, bgEp, smEp)).toBe(-1);
	expect(math.epsilonCompare(bgEp, 0, smEp)).toBe(1);
});

test("epsilonCompare to sort", () => {
	const smEp = math.EPSILON / 10; // smaller than epsilon
	const array = [0, 0 + smEp, 1, 3 + smEp * 2, 3, 2, 1.1];
	// sort increasing (or leave pairs untouched)
	array.sort(math.epsilonCompare);
	// the result is an increasing array, except that values within an epsilon
	// are allowed to be unsorted with respect to each other.
	// hence, we test for equality. will be either "less than" or "equal".
	for (let i = 0; i < array.length - 1; i += 1) {
		const equal = math.epsilonEqual(array[i], array[i + 1]);
		const lessThan = array[i] < array[i + 1];
		expect(equal || lessThan).toBe(true);
	}
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

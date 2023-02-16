const { test, expect } = require("@jest/globals");
const math = require("../math.js");

const testEqual = function (...args) {
	expect(math.epsilonEqualVectors(...args)).toBe(true);
};
/**
 * algebra core
 */
test("magnitude", () => {
	expect(math.magnitude([0, 0, 0, 0, 0, 1])).toBe(1);
	expect(math.magnitude([1, 1])).toBeCloseTo(Math.sqrt(2));
	expect(math.magnitude([0, 0, 0, 0, 0, 0])).toBe(0);
	expect(math.magnitude([])).toBe(0);

	expect(math.magnitude2([1, 0, 10])).toBe(1);
	expect(math.magnitude2([1, 0])).toBe(1);
	expect(math.magnitude2([0, 0, 1])).toBe(0);

	expect(math.magnitude3([0, 0, 10])).toBe(10);
	expect(math.magnitude3([1, 0, 0])).toBe(1);
	expect(math.magnitude3([0, 0, 1])).toBe(1);
	expect(math.magnitude3([0, 0, 0, 1])).toBe(0);
});

test("mag sq", () => {
	expect(math.magSquared([1, 1, 1, 1])).toBe(4);
	expect(math.magSquared([])).toBe(0);
	expect(math.magSquared([1, -2, 3]))
		.toBe((1 ** 2) + (2 ** 2) + (3 ** 2));
	expect(math.magSquared([-100])).toBe(100 * 100);
});

test("normalize", () => {
	expect(math.normalize([]).length).toBe(0);
	expect(math.normalize([1, 1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.normalize([1, 1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.normalize([1, -1, 1])[0]).toBeCloseTo(Math.sqrt(3) / 3);

	expect(math.normalize2([]).length).toBe(2);
	expect(math.normalize2([1, 1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.normalize2([1, 1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.normalize2([1, 1])[2]).toBe(undefined);
	expect(math.normalize2([1, 1, 10])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.normalize2([1, 1, 10])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.normalize2([1, 1, 10])[2]).toBe(undefined);

	expect(math.normalize3([]).length).toBe(3);
	expect(math.normalize3([1, 1, 1])[0]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(math.normalize3([1, 1, 1])[1]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(math.normalize3([1, 1, 1])[2]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(math.normalize3([1, 1, 1])[3]).toBe(undefined);
	expect(math.normalize3([1, 1, 1, 10])[0]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(math.normalize3([1, 1, 1, 10])[1]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(math.normalize3([1, 1, 1, 10])[2]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(math.normalize3([1, 1, 1, 10])[3]).toBe(undefined);
});

test("scale", () => {
	expect(math.scale([]).length).toBe(0);
	expect(math.scale([1])[0]).toBe(NaN);
	expect(math.scale([1], 2)[0]).toBe(2);
	expect(math.scale([1], -2)[0]).toBe(-2);

	expect(math.scale2([]).length).toBe(2);
	expect(math.scale2([1])[0]).toBe(NaN);
	expect(math.scale2([1], 2)[1]).toBe(NaN);
	expect(math.scale2([1], 2)[2]).toBe(undefined);
	expect(math.scale2([1, 1], 2)[1]).toBe(2);
	expect(math.scale2([1, 1], 2)[2]).toBe(undefined);
	expect(math.scale2([1, 1, 1], 2)[2]).toBe(undefined);

	expect(math.scale3([]).length).toBe(3);
	expect(math.scale3([1])[0]).toBe(NaN);
	expect(math.scale3([1], 2)[1]).toBe(NaN);
	expect(math.scale3([1], 2)[2]).toBe(NaN);
	expect(math.scale3([1, 1, 1], 2)[1]).toBe(2);
	expect(math.scale3([1, 1, 1], 2)[2]).toBe(2);
	expect(math.scale3([1, 1, 1], 2)[3]).toBe(undefined);
});

test("add", () => {
	expect(math.add([1], [1, 2, 3]).length).toBe(1);
	expect(math.add([1], [1, 2, 3])[0]).toBe(2);
	expect(math.add([1, 2, 3], [1, 2])[0]).toBe(2);
	expect(math.add([1, 2, 3], [1, 2])[1]).toBe(4);
	expect(math.add([1, 2, 3], [1, 2])[2]).toBe(3);
	expect(math.add([1, 2, 3], [])[0]).toBe(1);

	expect(math.add2([1], [1, 2, 3]).length).toBe(2);
	expect(math.add2([1], [1, 2, 3])[0]).toBe(2);
	expect(math.add2([1], [1, 2, 3])[1]).toBe(NaN);
	expect(math.add2([1, 2, 3], [1, 2])[0]).toBe(2);
	expect(math.add2([1, 2, 3], [1, 2])[1]).toBe(4);
	expect(math.add2([1, 2, 3], [1, 2])[2]).toBe(undefined);
	expect(math.add2([1, 2, 3], [])[0]).toBe(NaN);

	expect(math.add3([1], [1, 2, 3]).length).toBe(3);
	expect(math.add3([1], [1, 2, 3])[0]).toBe(2);
	expect(math.add3([1], [1, 2, 3])[1]).toBe(NaN);
	expect(math.add3([1, 2, 3], [1, 2])[0]).toBe(2);
	expect(math.add3([1, 2, 3], [1, 2])[1]).toBe(4);
	expect(math.add3([1, 2, 3], [1, 2])[2]).toBe(NaN);
	expect(math.add3([1, 2, 3], [])[0]).toBe(NaN);
});

test("subtract", () => {
	expect(math.subtract([1], [2, 3, 4]).length).toBe(1);
	expect(math.subtract([1], [2, 3, 4])[0]).toBe(-1);
	expect(math.subtract([1, 2, 3], [1, 2])[0]).toBe(0);
	expect(math.subtract([1, 2, 3], [1, 2])[1]).toBe(0);
	expect(math.subtract([1, 2, 3], [1, 2])[2]).toBe(3);
	expect(math.subtract([1, 2, 3], [])[0]).toBe(1);

	expect(math.subtract2([1], [2, 3, 4]).length).toBe(2);
	expect(math.subtract2([1], [2, 3, 4])[0]).toBe(-1);
	expect(math.subtract2([1, 2, 3], [1, 2])[0]).toBe(0);
	expect(math.subtract2([1, 2, 3], [1, 2])[1]).toBe(0);
	expect(math.subtract2([1, 2, 3], [1, 2])[2]).toBe(undefined);
	expect(math.subtract2([1, 2, 3], [])[0]).toBe(NaN);

	expect(math.subtract3([1], [2, 3, 4]).length).toBe(3);
	expect(math.subtract3([1], [2, 3, 4])[0]).toBe(-1);
	expect(math.subtract3([1, 2, 3], [1, 2])[0]).toBe(0);
	expect(math.subtract3([1, 2, 3], [1, 2])[1]).toBe(0);
	expect(math.subtract3([1, 2, 3], [1, 2])[2]).toBe(NaN);
	expect(math.subtract3([1, 2, 3], [])[0]).toBe(NaN);
});

test("dot", () => {
	expect(math.dot([3, 1000], [1, 0])).toBe(3);
	expect(math.dot([3, 1000], [1, 0])).toBe(3);
	expect(math.dot([3, 1000], [0, 1])).toBe(1000);
	expect(math.dot([1, 1000], [400])).toBe(400);
	expect(math.dot([1, 1000], [400, 0])).toBe(400);
	expect(math.dot([1, 1000], [400, 1])).toBe(1400);
	expect(math.dot([1, 1000], [])).toBe(0);

	expect(math.dot2([3, 1000], [1, 0])).toBe(3);
	expect(math.dot2([3, 1000], [1, 0])).toBe(3);
	expect(math.dot2([3, 1000], [0, 1])).toBe(1000);
	expect(math.dot2([1, 1000], [400])).toBe(NaN);
	expect(math.dot2([1, 1000], [400, 0])).toBe(400);
	expect(math.dot2([1, 1000], [400, 1])).toBe(1400);
	expect(math.dot2([1, 1000], [])).toBe(NaN);

	expect(math.dot3([3, 1000], [1, 0])).toBe(NaN);
	expect(math.dot3([3, 1000], [1, 0])).toBe(NaN);
	expect(math.dot3([3, 1000], [0, 1])).toBe(NaN);
	expect(math.dot3([1, 1000], [400])).toBe(NaN);
	expect(math.dot3([1, 1000], [400, 0])).toBe(NaN);
	expect(math.dot3([1, 1000], [400, 1])).toBe(NaN);
	expect(math.dot3([1, 1000], [])).toBe(NaN);
	expect(math.dot3([3, 1000, 0], [1, 0, 0])).toBe(3);
	expect(math.dot3([3, 1000, 0], [0, 1, 0])).toBe(1000);
	expect(math.dot3([3, 1000, 200], [1, 1, 1])).toBe(1203);
	expect(math.dot3([1, 1000, 0], [400])).toBe(NaN);
	expect(math.dot3([1, 1000, 0], [400, 0, 0])).toBe(400);
	expect(math.dot3([1, 1000, 0], [400, 1, 0])).toBe(1400);
	expect(math.dot3([1, 1000, 0], [])).toBe(NaN);
});

test("midpoint", () => {
	expect(math.midpoint([1, 2], [5, 6, 7]).length).toBe(2);
	expect(math.midpoint([1, 2], [5, 6, 7])[0]).toBe(3);
	expect(math.midpoint([1, 2], [5, 6, 7])[1]).toBe(4);
	expect(math.midpoint([], [5, 6, 7]).length).toBe(0);

	expect(math.midpoint2([1, 2], [5, 6, 7]).length).toBe(2);
	expect(math.midpoint2([1, 2], [5, 6, 7])[0]).toBe(3);
	expect(math.midpoint2([1, 2], [5, 6, 7])[1]).toBe(4);
	expect(math.midpoint2([1, 2], [5, 6, 7])[2]).toBe(undefined);
	expect(math.midpoint2([], [5, 6, 7]).length).toBe(2);
	expect(math.midpoint2([], [5, 6, 7])[0]).toBe(NaN);
	expect(math.midpoint2([], [5, 6, 7])[1]).toBe(NaN);

	expect(math.midpoint3([1, 2], [5, 6, 7]).length).toBe(3);
	expect(math.midpoint3([1, 2], [5, 6, 7])[0]).toBe(3);
	expect(math.midpoint3([1, 2], [5, 6, 7])[1]).toBe(4);
	expect(math.midpoint3([1, 2], [5, 6, 7])[2]).toBe(NaN);
	expect(math.midpoint3([], [5, 6, 7]).length).toBe(3);
	expect(math.midpoint3([], [5, 6, 7])[0]).toBe(NaN);
	expect(math.midpoint3([], [5, 6, 7])[1]).toBe(NaN);
});

test("average function", () => {
	// improper use
	expect(math.average().length).toBe(0);
	expect(math.average(0, 1, 2).length).toBe(0);
	expect(math.average([], [], []).length).toBe(0);
	// correct
	testEqual(
		[3.75, 4.75],
		math.average([4, 1], [5, 6], [4, 6], [2, 6]),
	);
	testEqual(
		[4, 5, 3],
		math.average([1, 2, 3], [4, 5, 6], [7, 8]),
	);
	testEqual(
		[4, 5, 6],
		math.average([1, 2, 3], [4, 5, 6], [7, 8, 9]),
	);
});

test("lerp", () => {
	expect(math.lerp([0, 1], [2, 0], 0)[0]).toBe(0);
	expect(math.lerp([0, 1], [2, 0], 0)[1]).toBe(1);
	expect(math.lerp([0, 1], [2, 0], 1)[0]).toBe(2);
	expect(math.lerp([0, 1], [2, 0], 1)[1]).toBe(0);
	expect(math.lerp([0, 1], [2, 0], 0.5)[0]).toBe(1);
	expect(math.lerp([0, 1], [2, 0], 0.5)[1]).toBe(0.5);
});

test("cross2", () => {
	expect(math.cross2([1, 0], [-4, 3])).toBe(3);
	expect(math.cross2([2, -1], [1, 3])).toBe(7);
});

test("cross3", () => {
	expect(math.cross3([-3, 0, -2], [5, -1, 2])[0]).toBe(-2);
	expect(math.cross3([-3, 0, -2], [5, -1, 2])[1]).toBe(-4);
	expect(math.cross3([-3, 0, -2], [5, -1, 2])[2]).toBe(3);
	expect(Number.isNaN(math.cross3([-3, 0], [5, -1, 2])[0])).toBe(true);
	expect(Number.isNaN(math.cross3([-3, 0], [5, -1, 2])[1])).toBe(true);
	expect(Number.isNaN(math.cross3([-3, 0], [5, -1, 2])[2])).toBe(false);
});

test("distance3", () => {
	const r1 = math.distance3([1, 2, 3], [4, 5, 6]);
	const r2 = math.distance3([1, 2, 3], [4, 5]);
	expect(r1).toBeCloseTo(5.196152422706632);
	expect(Number.isNaN(r2)).toBe(true);
});

test("rotate90, rotate270", () => {
	expect(math.rotate90([-3, 2])[0]).toBe(-2);
	expect(math.rotate90([-3, 2])[1]).toBe(-3);
	expect(math.rotate270([-3, 2])[0]).toBe(2);
	expect(math.rotate270([-3, 2])[1]).toBe(3);
});

test("flip", () => {
	expect(math.flip([-2, -1])[0]).toBe(2);
	expect(math.flip([-2, -1])[1]).toBe(1);
});

test("degenerate", () => {
	expect(math.degenerate([1], 1)).toBe(false);
	expect(math.degenerate([1], 1 + math.EPSILON)).toBe(true);
	expect(math.degenerate([1, 1], 2)).toBe(false);
	expect(math.degenerate([1, 1], 2 + math.EPSILON)).toBe(true);
});

test("parallel", () => {
	expect(math.parallel([1, 0], [0, 1])).toBe(false);
	expect(math.parallel([1, 0], [-1, 0])).toBe(true);
	// this is where the parallel test breaks down when it uses dot product
	expect(math.parallel([1, 0], [1, 0.0014142])).toBe(true);
	expect(math.parallel([1, 0], [1, 0.0014143])).toBe(false);
	// this is the parallel test using cross product
	expect(math.parallel2([1, 0], [1, 0.0000009])).toBe(true);
	expect(math.parallel2([1, 0], [1, 0.0000010])).toBe(false);
});

/*
test("alternating sum", () => {
	const r1 = math.alternating_sum([1, 2, 3, 4, 5, 6]);
	expect(r1[0]).toBe(9);
	expect(r1[1]).toBe(12);
	const r2 = math.alternating_sum([1, undefined, 3, 4, 5, 6]);
	expect(r2[0]).toBe(9);
	expect(r2[1]).toBe(10);
	const r3 = math.alternating_sum([]);
	expect(r3[0]).toBe(0);
	expect(r3[1]).toBe(0);
});
*/

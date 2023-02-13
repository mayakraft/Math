const { test, expect } = require("@jest/globals");
const math = require("../math.js");

const equalTest = (a, b) => expect(JSON.stringify(a))
	.toBe(JSON.stringify(b));

test("resize", () => {
	const a = [1, 2, 3];
	const _a = math.resize(5, a);
	equalTest(_a, [1, 2, 3, 0, 0]);
});

test("resize empty", () => {
	const res = math.resize(3, []);
	expect(math.fnEpsilonEqualVectors([0, 0, 0], res)).toBe(true);
});

test("resize undefined", () => {
	try {
		math.resize(3);
	} catch (err) {
		expect(err).not.toBe(undefined);
	}
});

test("resizeUp", () => {
	const a = [1, 2, 3];
	const b = [4, 5];
	expect(a.length).toBe(3);
	expect(b.length).toBe(2);
	const [_a, _b] = math.resizeUp(a, b);
	expect(_a.length).toBe(3);
	expect(_b.length).toBe(3);
});

// function is not included.
// since implementation it has never been used
// test("resizeDown", () => {
// 	const a = [1, 2, 3];
// 	const b = [4, 5];
// 	expect(a.length).toBe(3);
// 	expect(b.length).toBe(2);
// 	const [_a, _b] = math.resizeDown(a, b);
// 	expect(_a.length).toBe(2);
// 	expect(_b.length).toBe(2);
// });

test("cleanNumber", () => {
	// this is the most decimal places javascript uses
	equalTest(math.cleanNumber(0.12345678912345678), 0.12345678912345678);
	equalTest(math.cleanNumber(0.12345678912345678, 5), 0.12345678912345678);
	equalTest(math.cleanNumber(0.00000678912345678, 5), 0.00000678912345678);
	equalTest(math.cleanNumber(0.00000078912345678, 5), 0);
	equalTest(math.cleanNumber(0.00000000000000001), 0);
	equalTest(math.cleanNumber(0.0000000000000001), 0);
	equalTest(math.cleanNumber(0.000000000000001), 0.000000000000001);
	equalTest(math.cleanNumber(0.00000000001, 9), 0);
	equalTest(math.cleanNumber(0.0000000001, 9), 0);
	equalTest(math.cleanNumber(0.000000001, 9), 0.000000001);
});

test("cleanNumber invalid input", () => {
	// this is the most decimal places javascript uses
	expect(math.cleanNumber("50.00000000001")).toBe("50.00000000001");
	expect(math.cleanNumber(undefined)).toBe(undefined);
	expect(math.cleanNumber(true)).toBe(true);
	expect(math.cleanNumber(false)).toBe(false);
	const arr = [];
	expect(math.cleanNumber(arr)).toBe(arr);
});

/**
 * inputs and argument inference
 */
test("semi flatten arrays", () => {
	equalTest(
		[[0, 1, 2], [2, 3, 4]],
		math.semiFlattenArrays([0, 1, 2], [2, 3, 4]),
	);
	equalTest(
		[[0, 1, 2], [2, 3, 4]],
		math.semiFlattenArrays([[0, 1, 2]], [[2, 3, 4]]),
	);
	equalTest(
		[[0, 1, 2], [2, 3, 4]],
		math.semiFlattenArrays([[[0, 1, 2]], [[2, 3, 4]]]),
	);
	equalTest(
		[[0, 1, 2], [2, 3, 4]],
		math.semiFlattenArrays([[[[0, 1, 2]], [[2, 3, 4]]]]),
	);
	equalTest(
		[[[0], [1], [2]], [2, 3, 4]],
		math.semiFlattenArrays([[[[0], [1], [2]]], [[2, 3, 4]]]),
	);
	equalTest(
		[[[0], [1], [2]], [2, 3, 4]],
		math.semiFlattenArrays([[[[[[0]]], [[[1]]], [2]]], [[2, 3, 4]]]),
	);
});

test("flatten arrays", () => {
	equalTest(
		[1],
		math.flattenArrays([[[1]], []]),
	);
	equalTest(
		[1, 2, 3, 4],
		math.flattenArrays([[[1, 2, 3, 4]]]),
	);
	equalTest(
		[1, 2, 3, 4],
		math.flattenArrays(1, 2, 3, 4),
	);
	equalTest(
		[1, 2, 3, 4, 2, 4],
		math.flattenArrays([1, 2, 3, 4], [2, 4]),
	);
	equalTest(
		[1, 2, 3, 4, 6, 7, 6],
		math.flattenArrays([1, 2, 3, 4], [6, 7], 6),
	);
	equalTest(
		[1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
		math.flattenArrays([1, 2, 3, 4], [6, 7], 6, 2, 4, 5),
	);
	equalTest(
		[{ x: 5, y: 3 }],
		math.flattenArrays({ x: 5, y: 3 }),
	);
	equalTest(
		[{ x: 5, y: 3 }],
		math.flattenArrays([[{ x: 5, y: 3 }]]),
	);
	equalTest(
		[1, 2, 3, 4, 5, 6],
		math.flattenArrays([[[1], [2, 3]]], 4, [5, 6]),
	);
	equalTest(
		[undefined, undefined],
		math.flattenArrays([[[undefined, [[undefined]]]]]),
	);
});

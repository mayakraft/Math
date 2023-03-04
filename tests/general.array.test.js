const { test, expect } = require("@jest/globals");
const math = require("../math.js");

const equalTest = (a, b) => expect(JSON.stringify(a))
	.toBe(JSON.stringify(b));

/**
 * inputs and argument inference
 */
test("semiFlattenArrays", () => {
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
	equalTest(
		[{ x: 5, y: 3 }],
		math.semiFlattenArrays({ x: 5, y: 3 }),
	);
	equalTest(
		[{ x: 5, y: 3 }],
		math.semiFlattenArrays([[[{ x: 5, y: 3 }]]]),
	);
	equalTest(
		[5, 3],
		math.semiFlattenArrays([[[5, 3]]]),
	);
	equalTest(
		[[5], [3]],
		math.semiFlattenArrays([[[5], [3]]]),
	);
	equalTest(
		[[5], [3]],
		math.semiFlattenArrays([[[5]], [[3]]]),
	);
	equalTest(
		[[5], [3]],
		math.semiFlattenArrays([[[5]]], [[[3]]]),
	);
});

test("flattenArrays", () => {
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

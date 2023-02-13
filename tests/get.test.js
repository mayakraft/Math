const { test, expect } = require("@jest/globals");
const math = require("../math.js");

const equalTest = (a, b) => expect(JSON.stringify(a))
	.toBe(JSON.stringify(b));

test("getVector", () => {
	equalTest(
		[1, 2, 3, 4],
		math.getVector([[[1, 2, 3, 4]]]),
	);
	equalTest(
		[1, 2, 3, 4],
		math.getVector(1, 2, 3, 4),
	);
	equalTest(
		[1, 2, 3, 4, 2, 4],
		math.getVector([1, 2, 3, 4], [2, 4]),
	);
	equalTest(
		[1, 2, 3, 4, 6, 7, 6],
		math.getVector([1, 2, 3, 4], [6, 7], 6),
	);
	equalTest(
		[1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
		math.getVector([1, 2, 3, 4], [6, 7], 6, 2, 4, 5),
	);
	equalTest(
		[5, 3],
		math.getVector({ x: 5, y: 3 }),
	);
	equalTest(
		[5, 3],
		math.getVector([[[{ x: 5, y: 3 }]]]),
	);
	equalTest(
		[5, 3],
		math.getVector([[[5, 3]]]),
	);
	equalTest(
		[5, 3],
		math.getVector([[[5], [3]]]),
	);
	equalTest(
		[5, 3],
		math.getVector([[[5]], [[3]]]),
	);
	equalTest(
		[5, 3],
		math.getVector([[[5]]], [[[3]]]),
	);
	equalTest(
		[5, 3],
		math.getVector([[[5]]], 3),
	);
});

test("getLine", () => {
	equalTest(math.getLine(1), { vector: [1], origin: [] });
	equalTest(math.getLine(1, 2), { vector: [1, 2], origin: [] });
	equalTest(math.getLine(1, 2, 3), { vector: [1, 2, 3], origin: [] });
	equalTest(math.getLine([1], [2]), { vector: [1], origin: [2] });
	equalTest(math.getLine([1, 2], [2, 3]), { vector: [1, 2], origin: [2, 3] });
	equalTest(math.getLine(), { vector: [], origin: [] });
	equalTest(math.getLine({}), { vector: [], origin: [] });
});

test("getVectorOfVectors", () => {
	equalTest(
		[[1, 2], [3, 4]],
		math.getVectorOfVectors({ x: 1, y: 2 }, { x: 3, y: 4 }),
	);
	equalTest(
		[[1, 2], [3, 4]],
		math.getVectorOfVectors([[[{ x: 1, y: 2 }, { x: 3, y: 4 }]]]),
	);
	equalTest(
		[[1, 2], [3, 4]],
		math.getVectorOfVectors([[[1, 2], [3, 4]]]),
	);
	equalTest(
		[[1, 2], [3, 4]],
		math.getVectorOfVectors([[[1, 2]], [[3, 4]]]),
	);
	equalTest(
		[[1, 2], [3, 4]],
		math.getVectorOfVectors([[[1, 2]]], [[[3, 4]]]),
	);
	equalTest(
		[[1], [2], [3], [4]],
		math.getVectorOfVectors([[[1], [2], [3], [4]]]),
	);
	equalTest(
		[[1], [2], [3], [4]],
		math.getVectorOfVectors([[[1]], [[2]], [[3]], [[4]]]),
	);
	equalTest(
		[[1], [2], [3], [4]],
		math.getVectorOfVectors([[[1]]], 2, 3, 4),
	);
	equalTest(
		[[1], [2], [3], [4]],
		math.getVectorOfVectors([[[1, 2, 3, 4]]]),
	);
});

test("getSegment", () => {
	equalTest([[1, 2], [3, 4]], math.getSegment(1, 2, 3, 4));
	equalTest([[1, 2], [3, 4]], math.getSegment([1, 2], [3, 4]));
	equalTest([[1, 2], [3, 4]], math.getSegment([1, 2, 3, 4]));
	equalTest([[1, 2], [3, 4]], math.getSegment([[1, 2], [3, 4]]));
});

// test("get_matrix2", () => {
//   equalTest(
//     [1, 2, 3, 4, 5, 6],
//     math.get_matrix2([[[1, 2, 3, 4, 5, 6]]])
//   );
//   equalTest(
//     [1, 2, 3, 4, 0, 0],
//     math.get_matrix2([[1, 2, 3, 4]])
//   );
//   equalTest(
//     [1, 2, 3, 1, 0, 0],
//     math.get_matrix2(1, 2, 3)
//   );
//   equalTest(
//     [1, 2, 3, 1, 0, 0],
//     math.get_matrix2(1, 2, 3, 1)
//   );
// });

test("getMatrix3x4", () => {
	equalTest(
		[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
		math.getMatrix3x4([[[]]]),
	);
	equalTest(
		[1, 2, 0, 3, 4, 0, 0, 0, 1, 0, 0, 0],
		math.getMatrix3x4([[[1, 2, 3, 4]]]),
	);
	equalTest(
		[1, 2, 0, 3, 4, 0, 0, 0, 1, 5, 6, 0],
		math.getMatrix3x4([[[1, 2, 3, 4, 5, 6]]]),
	);
	equalTest(
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0],
		math.getMatrix3x4([[[1, 2, 3, 4, 5, 6, 7, 8, 9]]]),
	);
});

const { test, expect } = require("@jest/globals");
const math = require("../math.js");

const testEqualVectors = function (...args) {
	expect(math.epsilonEqualVectors(...args)).toBe(true);
};

test("matrix 2 core", () => {
	expect(math.invertMatrix2([1, 0, 0, 1, 0, 0])).not.toBe(undefined);
	const r1 = math.makeMatrix2Translate();
	expect(r1[0]).toBe(1);
	expect(r1[4]).toBe(0);
	expect(r1[5]).toBe(0);
	const r2 = math.makeMatrix2Scale([2, -1]);
	expect(r2[0]).toBe(2);
	expect(r2[3]).toBe(-1);
});

test("matrix 2", () => {
	// top level types
	testEqualVectors([1, 0, 0, 1, 6, 7], math.makeMatrix2Translate(6, 7));
	testEqualVectors([3, 0, 0, 3, -2, 0], math.makeMatrix2Scale([3, 3], [1, 0]));
	testEqualVectors([0, 1, 1, -0, -8, 8], math.makeMatrix2Reflect([1, 1], [-5, 3]));
	testEqualVectors(
		[Math.SQRT1_2, Math.SQRT1_2, -Math.SQRT1_2, Math.SQRT1_2, 1, 1],
		math.makeMatrix2Rotate(Math.PI / 4, [1, 1]),
	);
	testEqualVectors(
		[Math.SQRT1_2, -Math.SQRT1_2, Math.SQRT1_2,
			Math.SQRT1_2, -Math.SQRT1_2, Math.SQRT1_2],
		math.invertMatrix2([Math.SQRT1_2, Math.SQRT1_2, -Math.SQRT1_2, Math.SQRT1_2, 1, 0]),
	);
	testEqualVectors(
		[Math.sqrt(4.5), Math.SQRT1_2, -Math.SQRT1_2, Math.sqrt(4.5), Math.sqrt(4.5), Math.SQRT1_2],
		math.multiplyMatrices2(
			[Math.SQRT1_2, -Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2, 0, 0],
			[1, 2, -2, 1, 1, 2],
		),
	);
	testEqualVectors(
		[0, 3],
		math.multiplyMatrix2Vector2([2, 1, -1, 2, -1, 0], [1, 1]),
	);
	testEqualVectors(
		[-2, 3],
		math.multiplyMatrix2Vector2(
			math.makeMatrix2Scale([3, 3], [1, 0]),
			[0, 1],
		),
	);
	testEqualVectors(
		[-1, 2],
		math.multiplyMatrix2Vector2(
			math.makeMatrix2Scale([3, 3], [0.5, 0.5]),
			[0, 1],
		),
	);
	testEqualVectors(
		[1, 1],
		math.multiplyMatrix2Vector2(
			math.makeMatrix2Scale([0.5, 0.5], [1, 1]),
			[1, 1],
		),
	);
	testEqualVectors(
		[0.75, 0.75],
		math.multiplyMatrix2Vector2(
			math.makeMatrix2Scale([0.5, 0.5], [0.5, 0.5]),
			[1, 1],
		),
	);
});

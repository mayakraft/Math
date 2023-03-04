const { test, expect } = require("@jest/globals");
const math = require("../math.js");

const testEqualVectors = function (...args) {
	expect(math.epsilonEqualVectors(...args)).toBe(true);
};

test("isIdentity", () => {
	expect(math.isIdentity3x4([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(false);
	expect(math.isIdentity3x4([1, 0, 0, 0, 1, 0, 0, 0, 1, 4, 5, 6])).toBe(false);
	expect(math.isIdentity3x4([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0])).toBe(true);
});

test("multiply", () => {
	const m = math.multiplyMatrices3(
		math.makeMatrix3RotateX(Math.PI / 4),
		math.makeMatrix3RotateZ(Math.PI / 4),
	);
	const sq = Math.SQRT1_2;
	[sq, 0.5, 0.5, -sq, 0.5, 0.5, 0, -sq, sq, 0, 0, 0]
		.forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});

test("determinant", () => {
	// randomly made matrices, made using these affine transforms,
	// even their inverted forms, should all have a determinant of 1
	expect(math.determinant3([...math.identity3x4])).toBeCloseTo(1);
	expect(math.determinant3(math.makeMatrix3RotateX(Math.random() * Math.PI * 2)))
		.toBeCloseTo(1);
	expect(math.determinant3(math.makeMatrix3RotateZ(Math.random() * Math.PI * 2)))
		.toBeCloseTo(1);
	expect(math.determinant3(math.makeMatrix3Translate(1, 2, 3)))
		.toBeCloseTo(1);
	expect(math.determinant3(math.invertMatrix3(
		math.makeMatrix3Rotate(Math.random() * Math.PI * 2, [1, 5, 8]),
	))).toBeCloseTo(1);
});

test("inverse", () => {
	const m = math.invertMatrix3([0, -1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0]);
	[0, 1, -0, -1, 0, 0, 0, -0, 1, 0, 0, 0]
		.forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});

test("translate", () => {
	const m = math.makeMatrix3Translate(4, 5, 6);
	expect(m[9]).toBe(4);
	expect(m[10]).toBe(5);
	expect(m[11]).toBe(6);
});

test("rotateX", () => {
	const sq = Math.SQRT1_2;
	const m = math.makeMatrix3RotateX(Math.PI / 4);
	[1, 0, 0, 0, sq, sq, 0, -sq, sq, 0, 0, 0].forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});

test("rotateY", () => {
	const sq = Math.SQRT1_2;
	const m = math.makeMatrix3RotateY(Math.PI / 4);
	[sq, 0, -sq, 0, 1, 0, sq, 0, sq, 0, 0, 0].forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});

test("rotateZ", () => {
	const sq = Math.SQRT1_2;
	const m = math.makeMatrix3RotateZ(Math.PI / 4);
	[sq, sq, 0, -sq, sq, 0, 0, 0, 1, 0, 0, 0].forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});

test("rotate", () => {
	const m = math.makeMatrix3Rotate(Math.PI / 2, [1, 1, 1], [0, 0, 0]);
	expect(m[2]).toBeCloseTo(m[3]);
	expect(m[0]).toBeCloseTo(m[4]);
	expect(m[1]).toBeCloseTo(m[5]);
});

test("scale", () => {
	const m = math.makeMatrix3Scale([0.5, 0.5, 0.5]);
	[0.5, 0, 0, 0, 0.5, 0, 0, 0, 0.5, 0, 0, 0]
		.forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});

test("makeMatrix3Scale", () => {
	testEqualVectors(
		math.makeMatrix3Scale(),
		[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
	);
	testEqualVectors(
		math.makeMatrix3Scale([0.5, 0.5, 0.5]),
		[0.5, 0, 0, 0, 0.5, 0, 0, 0, 0.5, 0, 0, 0],
	);
	testEqualVectors(
		math.makeMatrix3UniformScale(),
		[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
	);
	testEqualVectors(
		math.makeMatrix3UniformScale(0.5),
		[0.5, 0, 0, 0, 0.5, 0, 0, 0, 0.5, 0, 0, 0],
	);
});

test("combine operations", () => {
	const result = math.multiplyMatrices3(
		math.makeMatrix3RotateX(Math.PI / 2),
		math.makeMatrix3Translate(40, 20, 10),
	);
	[1, 0, 0, 0, 0, 1, 0, -1, 0, 40, -10, 20]
		.forEach((n, i) => expect(n).toBeCloseTo(result[i]));
});

test("reflectZ", () => {
	const m = math.makeMatrix3ReflectZ([1, 1, 1], [0, 0, 0]);
	expect(m[1]).toBeCloseTo(m[3]);
	expect(m[0]).toBeCloseTo(m[4]);
	expect(m[2]).toBeCloseTo(m[5]);
	expect(m[5]).toBeCloseTo(m[6]);
});

test("transform", () => {
	const matrix = math.multiplyMatrices3(
		math.makeMatrix3RotateZ(Math.PI / 2),
		math.makeMatrix3Translate(4, 5, 6),
	);
	const segment = [[-1, 0, 0], [1, 0, 0]];
	const result = segment
		.map(p => math.multiplyMatrix3Vector3(matrix, p));
	[[-5, 3, 6], [-5, 5, 6]]
		.forEach((p, i) => p
			.forEach((n, j) => expect(n).toBe(result[i][j])));
});

test("transformVector", () => {
	const vector = [1, 2, 3];
	const result = math.multiplyMatrix3Vector3(
		math.makeMatrix3Scale([0.5, 0.5, 0.5]),
		vector,
	);
	expect(result[0]).toBeCloseTo(0.5);
	expect(result[1]).toBeCloseTo(1);
	expect(result[2]).toBeCloseTo(1.5);
});

test("transformLine", () => {
	const result = math.multiplyMatrix3Line3(
		math.makeMatrix3Scale([0.5, 0.5, 0.5]),
		[0.707, 0.707, 0],
		[1, 0, 0],
	);
	expect(result.vector[0]).toBeCloseTo(0.3535);
	expect(result.vector[1]).toBeCloseTo(0.3535);
	expect(result.vector[2]).toBeCloseTo(0);
	expect(result.origin[0]).toBeCloseTo(0.5);
	expect(result.origin[1]).toBeCloseTo(0);
	expect(result.origin[2]).toBeCloseTo(0);
});

test("matrix core invert", () => {
	expect(math.invertMatrix2([1, 0, 0, 1, 0, 0])).not.toBe(undefined);
	expect(math.invertMatrix3([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0])).not.toBe(undefined);
	expect(math.invertMatrix2([5, 5, 4, 4, 3, 3])).toBe(undefined);
	expect(math.invertMatrix3([0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1])).toBe(undefined);
});

// todo: test matrix3 methods (invert) with the translation component to make sure it carries over
test("matrix 3 core, transforms", () => {
	const result1 = math.makeMatrix3Translate();
	[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0].forEach((n, i) => expect(n).toBe(result1[i]));
	// rotate 360 degrees about an arbitrary axis and origin
	testEqualVectors(
		[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
		math.makeMatrix3Rotate(
			Math.PI * 2,
			[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
			[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
		),
	);

	testEqualVectors(
		math.makeMatrix3RotateX(Math.PI / 6),
		math.makeMatrix3Rotate(Math.PI / 6, [1, 0, 0]),
	);
	testEqualVectors(
		math.makeMatrix3RotateY(Math.PI / 6),
		math.makeMatrix3Rotate(Math.PI / 6, [0, 1, 0]),
	);
	testEqualVectors(
		math.makeMatrix3RotateZ(Math.PI / 6),
		math.makeMatrix3Rotate(Math.PI / 6, [0, 0, 1]),
	);
	// source wikipedia https://en.wikipedia.org/wiki/Rotation_matrix#Examples
	const exampleMat = [
		0.35612209405955486, -0.8018106071106572, 0.47987165414043453,
		0.47987165414043464, 0.5975763087872217, 0.6423595182829954,
		-0.8018106071106572, 0.0015183876574496047, 0.5975763087872216,
		0, 0, 0,
	];
	testEqualVectors(
		exampleMat,
		math.makeMatrix3Rotate((-74 / 180) * Math.PI, [-1 / 3, 2 / 3, 2 / 3]),
	);
	testEqualVectors(
		exampleMat,
		math.makeMatrix3Rotate((-74 / 180) * Math.PI, [-0.5, 1, 1]),
	);

	testEqualVectors(
		[1, 0, 0, 0, 0.8660254, 0.5, 0, -0.5, 0.8660254, 0, 0, 0],
		math.makeMatrix3Rotate(Math.PI / 6, [1, 0, 0]),
	);
});

test("matrix 3 core", () => {
	expect(math.determinant3([1, 2, 3, 2, 4, 8, 7, 8, 9])).toBe(12);
	expect(math.determinant3([3, 2, 0, 0, 0, 1, 2, -2, 1, 0, 0, 0])).toBe(10);
	testEqualVectors(
		[4, 5, -8, -5, -6, 9, -2, -2, 3, 0, 0, 0],
		math.invertMatrix3([0, 1, -3, -3, -4, 4, -2, -2, 1, 0, 0, 0]),
	);
	testEqualVectors(
		[0.2, -0.2, 0.2, 0.2, 0.3, -0.3, 0, 1, 0, 0, 0, 0],
		math.invertMatrix3([3, 2, 0, 0, 0, 1, 2, -2, 1, 0, 0, 0]),
	);
	const mat_3d_ref = math.makeMatrix3ReflectZ([1, -2], [12, 13]);
	testEqualVectors(
		math.makeMatrix2Reflect([1, -2], [12, 13]),
		[mat_3d_ref[0], mat_3d_ref[1], mat_3d_ref[3], mat_3d_ref[4], mat_3d_ref[9], mat_3d_ref[10]],
	);
	// source wolfram alpha
	testEqualVectors(
		[-682, 3737, -5545, 2154, -549, -1951, 953, -3256, 4401, 0, 0, 0],
		math.multiplyMatrices3(
			[5, -52, 85, 15, -9, -2, 32, 2, -50, 0, 0, 0],
			[-77, 25, -21, 3, 53, 42, 63, 2, 19, 0, 0, 0],
		),
	);
});

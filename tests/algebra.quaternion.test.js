const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("quaternionFromTwoVectors", () => {
	const res1 = math.quaternionFromTwoVectors([1, 0, 0], [0, 1, 0]);
	[0, 0, Math.SQRT1_2, Math.SQRT1_2]
		.forEach((n, i) => expect(res1[i]).toBeCloseTo(n));

	const res2 = math.quaternionFromTwoVectors([1, 0, 0], [0, 0, 1]);
	[0, -Math.SQRT1_2, 0, Math.SQRT1_2]
		.forEach((n, i) => expect(res2[i]).toBeCloseTo(n));

	const res3 = math.quaternionFromTwoVectors([0, 1, 0], [0, 0, 1]);
	[Math.SQRT1_2, 0, 0, Math.SQRT1_2]
		.forEach((n, i) => expect(res3[i]).toBeCloseTo(n));
});

test("matrix4FromQuaternion", () => {
	const res1 = math.matrix4FromQuaternion([0, 0, 0, 1]);
	math.identity4x4
		.forEach((n, i) => expect(res1[i]).toBeCloseTo(n));

	const res2 = math.matrix4FromQuaternion([1, 0, 0, 0]);
	[1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]
		.forEach((n, i) => expect(res2[i]).toBeCloseTo(n));

	const res3 = math.matrix4FromQuaternion([0, 1, 0, 0]);
	[-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]
		.forEach((n, i) => expect(res3[i]).toBeCloseTo(n));

	const res4 = math.matrix4FromQuaternion([0, 0, 1, 0]);
	[-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
		.forEach((n, i) => expect(res4[i]).toBeCloseTo(n));
});

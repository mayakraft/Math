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
	expect(math.epsilonEqualVectors([0, 0, 0], res)).toBe(true);
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

const { test, expect } = require("@jest/globals");
const math = require("../math.js");

const equalTest = (a, b) => expect(JSON.stringify(a))
	.toBe(JSON.stringify(b));

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
	equalTest(math.cleanNumber(NaN), NaN);
	equalTest(math.cleanNumber(NaN, 10), NaN);
	equalTest(math.cleanNumber(3), 3);
	equalTest(math.cleanNumber(33), 33);
	equalTest(math.cleanNumber(33, 10), 33);
	equalTest(math.cleanNumber(33, 100), 33);
});

test("cleanNumber invalid input", () => {
	// this is the most decimal places javascript uses
	expect(math.cleanNumber("50.00000000001")).toBe(50.00000000001);
	expect(math.cleanNumber(undefined)).toBe(undefined);
	expect(math.cleanNumber(true)).toBe(true);
	expect(math.cleanNumber(false)).toBe(false);
	const arr = [];
	expect(math.cleanNumber(arr)).toBe(arr);
});

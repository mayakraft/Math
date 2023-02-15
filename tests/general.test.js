const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("constants", () => {
	expect(typeof math.EPSILON).toBe("number");
	expect(typeof math.TWO_PI).toBe("number");
	expect(typeof math.D2R).toBe("number");
	expect(typeof math.R2D).toBe("number");
});

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

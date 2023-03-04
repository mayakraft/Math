const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("constants", () => {
	expect(typeof math.EPSILON).toBe("number");
	expect(typeof math.TWO_PI).toBe("number");
	expect(typeof math.D2R).toBe("number");
	expect(typeof math.R2D).toBe("number");
});

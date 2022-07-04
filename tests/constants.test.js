const math = require("../math");

test("constants", () => {
	expect(typeof math.core.EPSILON).toBe("number");
	expect(typeof math.core.TWO_PI).toBe("number");
	expect(typeof math.core.D2R).toBe("number");
	expect(typeof math.core.R2D).toBe("number");
});

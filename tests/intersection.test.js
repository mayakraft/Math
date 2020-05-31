const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};


test("intersections", () => {
  expect(true).toBe(true);
});

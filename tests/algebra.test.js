const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};


/**
 * algebra core
 */

test("average function", () => {
  testEqual([3.75, 4.75],
    math.core.average([4, 1], [5, 6], [4, 6], [2, 6]));
  testEqual([4, 5, 3],
    math.core.average([1, 2, 3], [4, 5, 6], [7, 8]));
  testEqual([4, 5, 6],
    math.core.average([1, 2, 3], [4, 5, 6], [7, 8, 9]));
});

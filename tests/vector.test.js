const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};

/**
 * vectors
 */

test("vector normalize, scale", () => {
  testEqual([Math.sqrt(2), Math.sqrt(2)],
    math.vector(10, 10).normalize().scale(2));
});

test("vector dot", () => {
  testEqual(0, math.vector(2, 1).normalize().dot(math.vector(1, -2).normalize()));
  testEqual(1, math.vector(2, 1).normalize().dot(math.vector(4, 2).normalize()));
});

test("vector cross", () => {
  testEqual([0, 0, -5], math.vector(2, 1).cross(math.vector(1, -2)));
});

test("vector parallel", () => {
  testEqual(true, math.vector(3, 4).isParallel(math.vector(-6, -8)));
});

test("lines parallel", () => {
  testEqual(true, math.line(100, 101, 3, 4).isParallel(math.line(5, 5, -6, -8)));
});

test("vector lerp", () => {
  testEqual([15.5, 3.5, 3], math.vector(30, 5, 3).lerp([1, 2, 3], 0.5));
});

test("vector copy", () => {
  testEqual([1, 2, 3], math.vector(1, 2, 3).copy().copy());
});

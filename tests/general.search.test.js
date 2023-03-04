const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("minimum2DPointIndex easy", () => {
	expect(math.minimum2DPointIndex()).toBe(undefined);
	expect(math.minimum2DPointIndex([])).toBe(undefined);
	expect(math.minimum2DPointIndex([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]])).toBe(0);
	expect(math.minimum2DPointIndex([[4, 0], [3, 0], [2, 0], [1, 0], [0, 0]])).toBe(4);
	expect(math.minimum2DPointIndex([[2, 0], [1, 0], [0, 0], [4, 0], [3, 0]])).toBe(2);
});

test("minimum2DPointIndex vertically aligned", () => {
	expect(math.minimum2DPointIndex([[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]])).toBe(0);
	expect(math.minimum2DPointIndex([[3, 1], [3, 2], [3, 3], [3, 4], [3, 0]])).toBe(4);
	expect(math.minimum2DPointIndex([[3, 2], [3, 3], [3, 4], [3, 0], [3, 1]])).toBe(3);
	expect(math.minimum2DPointIndex([[3, 3], [3, 4], [3, 0], [3, 1], [3, 2]])).toBe(2);
});

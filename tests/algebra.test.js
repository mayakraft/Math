const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};

/**
 * algebra core
 */
test("dot", () => {
  expect(math.core.dot([3, 1000], [1, 0])).toBe(3);
  expect(math.core.dot([3, 1000], [1, 0])).toBe(3);
  expect(math.core.dot([1, 1000], [400])).toBe(400);
  expect(math.core.dot([1, 1000], [])).toBe(0);
});

test("magnitude", () => {
	expect(math.core.magnitude([0, 0, 0, 0, 0, 1])).toBe(1);
	expect(math.core.magnitude([1, 1])).toBeCloseTo(Math.sqrt(2));
	expect(math.core.magnitude([0, 0, 0, 0, 0, 0])).toBe(0);
	expect(math.core.magnitude([])).toBe(0);
});

test("mag sq", () => {
	expect(math.core.mag_squared([1, 1, 1, 1])).toBe(4);
	expect(math.core.mag_squared([])).toBe(0);
	expect(math.core.mag_squared([1, -2, 3]))
		.toBe((1 ** 2) + (2 ** 2) + (3 ** 2));
	expect(math.core.mag_squared([-100])).toBe(100 * 100);
});

test("normalize", () => {
	expect(math.core.normalize([]).length).toBe(0);
	expect(math.core.normalize([1, 1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.core.normalize([1, 1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.core.normalize([1, -1, 1])[0]).toBeCloseTo(Math.sqrt(3) / 3);
});

test("scale", () => {
	expect(math.core.scale([]).length).toBe(0);
	expect(math.core.scale([1])[0]).toBe(NaN);
	expect(math.core.scale([1], 2)[0]).toBe(2);
	expect(math.core.scale([1], -2)[0]).toBe(-2);
});

test("average function", () => {
  // improper use
  expect(math.core.average().length).toBe(0);
  expect(math.core.average(0, 1, 2).length).toBe(0);
  expect(math.core.average([], [], []).length).toBe(0);
  // correct
  testEqual([3.75, 4.75],
    math.core.average([4, 1], [5, 6], [4, 6], [2, 6]));
  testEqual([4, 5, 3],
    math.core.average([1, 2, 3], [4, 5, 6], [7, 8]));
  testEqual([4, 5, 6],
    math.core.average([1, 2, 3], [4, 5, 6], [7, 8, 9]));
});

test("distance3", () => {
  const r1 = math.core.distance3([1,2,3], [4,5,6]);
  const r2 = math.core.distance3([1,2,3], [4,5]);
  expect(r1).toBeCloseTo(5.196152422706632);
  expect(isNaN(r2)).toBe(true);
});
/*
test("alternating sum", () => {
  const r1 = math.core.alternating_sum([1,2,3,4,5,6]);
  expect(r1[0]).toBe(9);
  expect(r1[1]).toBe(12);
  const r2 = math.core.alternating_sum([1, undefined, 3, 4, 5, 6]);
  expect(r2[0]).toBe(9);
  expect(r2[1]).toBe(10);
  const r3 = math.core.alternating_sum([]);
  expect(r3[0]).toBe(0);
  expect(r3[1]).toBe(0);
});
*/


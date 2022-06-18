const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};

/**
 * algebra core
 */
test("magnitude", () => {
	expect(math.core.magnitude([0, 0, 0, 0, 0, 1])).toBe(1);
	expect(math.core.magnitude([1, 1])).toBeCloseTo(Math.sqrt(2));
	expect(math.core.magnitude([0, 0, 0, 0, 0, 0])).toBe(0);
	expect(math.core.magnitude([])).toBe(0);
});

test("mag sq", () => {
	expect(math.core.magSquared([1, 1, 1, 1])).toBe(4);
	expect(math.core.magSquared([])).toBe(0);
	expect(math.core.magSquared([1, -2, 3]))
		.toBe((1 ** 2) + (2 ** 2) + (3 ** 2));
	expect(math.core.magSquared([-100])).toBe(100 * 100);
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

test("add", () => {
  expect(math.core.add([1], [1,2,3]).length).toBe(1);
  expect(math.core.add([1], [1,2,3])[0]).toBe(2);
  expect(math.core.add([1,2,3], [1,2])[0]).toBe(2);
  expect(math.core.add([1,2,3], [1,2])[1]).toBe(4);
  expect(math.core.add([1,2,3], [1,2])[2]).toBe(3);
  expect(math.core.add([1,2,3], [])[0]).toBe(1);
});

test("subtract", () => {
  expect(math.core.subtract([1], [2,3,4]).length).toBe(1);
  expect(math.core.subtract([1], [2,3,4])[0]).toBe(-1);
  expect(math.core.subtract([1,2,3], [1,2])[0]).toBe(0);
  expect(math.core.subtract([1,2,3], [1,2])[1]).toBe(0);
  expect(math.core.subtract([1,2,3], [1,2])[2]).toBe(3);
  expect(math.core.subtract([1,2,3], [])[0]).toBe(1);
});

test("dot", () => {
  expect(math.core.dot([3, 1000], [1, 0])).toBe(3);
  expect(math.core.dot([3, 1000], [1, 0])).toBe(3);
  expect(math.core.dot([1, 1000], [400])).toBe(400);
  expect(math.core.dot([1, 1000], [])).toBe(0);
});

test("midpoint", () => {
  expect(math.core.midpoint([1,2], [5,6,7]).length).toBe(2);
  expect(math.core.midpoint([1,2], [5,6,7])[0]).toBe(3);
  expect(math.core.midpoint([1,2], [5,6,7])[1]).toBe(4);
  expect(math.core.midpoint([], [5,6,7]).length).toBe(0);
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

test("lerp", () => {
  expect(math.core.lerp([0,1], [2,0], 0)[0]).toBe(0);
  expect(math.core.lerp([0,1], [2,0], 0)[1]).toBe(1);
  expect(math.core.lerp([0,1], [2,0], 1)[0]).toBe(2);
  expect(math.core.lerp([0,1], [2,0], 1)[1]).toBe(0);
  expect(math.core.lerp([0,1], [2,0], 0.5)[0]).toBe(1);
  expect(math.core.lerp([0,1], [2,0], 0.5)[1]).toBe(0.5);
});

test("cross2", () => {
  expect(math.core.cross2([1, 0], [-4, 3])).toBe(3);
  expect(math.core.cross2([2, -1], [1, 3])).toBe(7);
});

test("cross3", () => {
  expect(math.core.cross3([-3,0,-2], [5,-1,2])[0]).toBe(-2);
  expect(math.core.cross3([-3,0,-2], [5,-1,2])[1]).toBe(-4);
  expect(math.core.cross3([-3,0,-2], [5,-1,2])[2]).toBe(3);
  expect(isNaN(math.core.cross3([-3,0], [5,-1,2])[0])).toBe(true);
  expect(isNaN(math.core.cross3([-3,0], [5,-1,2])[1])).toBe(true);
  expect(isNaN(math.core.cross3([-3,0], [5,-1,2])[2])).toBe(false);
});

test("distance3", () => {
  const r1 = math.core.distance3([1,2,3], [4,5,6]);
  const r2 = math.core.distance3([1,2,3], [4,5]);
  expect(r1).toBeCloseTo(5.196152422706632);
  expect(isNaN(r2)).toBe(true);
});

test("rotate90, rotate270", () => {
  expect(math.core.rotate90([-3, 2])[0]).toBe(-2);
  expect(math.core.rotate90([-3, 2])[1]).toBe(-3);
  expect(math.core.rotate270([-3, 2])[0]).toBe(2);
  expect(math.core.rotate270([-3, 2])[1]).toBe(3);
});

test("flip", () => {
  expect(math.core.flip([-2, -1])[0]).toBe(2);
  expect(math.core.flip([-2, -1])[1]).toBe(1);
});

test("degenerate", () => {
  expect(math.core.degenerate([1], 1)).toBe(false);
  expect(math.core.degenerate([1], 1 + math.core.EPSILON)).toBe(true);
  expect(math.core.degenerate([1, 1], 2)).toBe(false);
  expect(math.core.degenerate([1, 1], 2 + math.core.EPSILON)).toBe(true);
});

test("parallel", () => {
  expect(math.core.parallel([1, 0], [0, 1])).toBe(false);
  expect(math.core.parallel([1, 0], [-1, 0])).toBe(true);
  // this is where the parallel test breaks down when it uses dot product
  expect(math.core.parallel([1, 0], [1, 0.0014142])).toBe(true);
  expect(math.core.parallel([1, 0], [1, 0.0014143])).toBe(false);
  // this is the parallel test using cross product
  expect(math.core.parallel2([1, 0], [1, 0.0000009])).toBe(true);
  expect(math.core.parallel2([1, 0], [1, 0.0000010])).toBe(false);
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


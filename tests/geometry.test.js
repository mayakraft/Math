const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};

test("nearest point", () => {
  testEqual([5, 5], math.core.nearest_point2([10, 0],
    [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9]]));
  testEqual([6, 6, 0], math.core.nearest_point([10, 0, 0],
    [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 1],
      [5, 5, 10], [6, 6, 0], [7, 7, 0], [8, 8, 0], [9, 9, 0]]));
});


test("interior angles", () => {
  testEqual(
    [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
    [[1, 0], [0, 1], [-1, 0], [0, -1]].map((v, i, ar) => math.core
      .counter_clockwise_angle2(v, ar[(i + 1) % ar.length]))
  );
  testEqual(
    [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].map((v, i, ar) => math.core
      .counter_clockwise_angle2(v, ar[(i + 1) % ar.length]))
  );
});

test("counter-clockwise vector sorting", () => {
  testEqual(
    [0, 1, 2, 3],
    math.core.counter_clockwise_vector_order([1, 1], [-1, 1], [-1, -1], [1, -1])
  );
  testEqual(
    [0, 3, 2, 1],
    math.core.counter_clockwise_vector_order([1, -1], [-1, -1], [-1, 1], [1, 1])
  );
});

test("sectors", () => {
  testEqual(Math.PI / 2, math.sector.fromVectors([1, 0], [0, 1]).angle);
  testEqual(true, math.sector.fromVectors([1, 0], [0, 1]).contains([1, 1]));
  testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, 1]));
  testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, -1]));
  testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([1, -1]));
});

test("junctions", () => {
  testEqual([[1, 1], [1, -1], [-1, 1], [-1, -1]],
    math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectors);
  testEqual([0, 2, 3, 1],
    math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectorOrder);
  testEqual([Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
    math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).angles());
});

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

// test("sectors", () => {
//   testEqual(Math.PI / 2, math.sector.fromVectors([1, 0], [0, 1]).angle);
//   testEqual(true, math.sector.fromVectors([1, 0], [0, 1]).contains([1, 1]));
//   testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, 1]));
//   testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, -1]));
//   testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([1, -1]));
// });

// test("junctions", () => {
//   testEqual([[1, 1], [1, -1], [-1, 1], [-1, -1]],
//     math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectors);
//   testEqual([0, 2, 3, 1],
//     math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectorOrder);
//   testEqual([Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
//     math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).angles());
// });

test("clockwise_angle2_radians", () => {
  expect(math.core.clockwise_angle2_radians(Math.PI, Math.PI/2))
    .toBeCloseTo(Math.PI*1/2);
  expect(math.core.clockwise_angle2_radians(Math.PI/2, Math.PI))
    .toBeCloseTo(Math.PI*3/2);
  // same as above with negative numbers
  expect(math.core.clockwise_angle2_radians(Math.PI + Math.PI*2*4, Math.PI/2 - Math.PI*2*8))
    .toBeCloseTo(Math.PI*1/2);
  expect(math.core.clockwise_angle2_radians(Math.PI/2 - Math.PI*2*3, Math.PI + Math.PI*2*4))
    .toBeCloseTo(Math.PI*3/2);
  expect(math.core.clockwise_angle2_radians(Math.PI - Math.PI*2*4, Math.PI/2 - Math.PI*2*8))
    .toBeCloseTo(Math.PI*1/2);
  expect(math.core.clockwise_angle2_radians(Math.PI/2 - Math.PI*2*3, Math.PI - Math.PI*2*4))
    .toBeCloseTo(Math.PI*3/2);
});

test("counter_clockwise_angle2_radians", () => {
  expect(math.core.counter_clockwise_angle2_radians(Math.PI, Math.PI/2))
    .toBeCloseTo(Math.PI*3/2);
  expect(math.core.counter_clockwise_angle2_radians(Math.PI/2, Math.PI))
    .toBeCloseTo(Math.PI*1/2);
  // same as above with negative numbers
  expect(math.core.counter_clockwise_angle2_radians(Math.PI - Math.PI*2*4, Math.PI/2 - Math.PI*2*5))
    .toBeCloseTo(Math.PI*3/2);
  expect(math.core.counter_clockwise_angle2_radians(Math.PI + Math.PI*2*4, Math.PI/2 + Math.PI*2*5))
    .toBeCloseTo(Math.PI*3/2);
  expect(math.core.counter_clockwise_angle2_radians(Math.PI/2 - Math.PI*2*7, Math.PI - Math.PI*2*3))
    .toBeCloseTo(Math.PI*1/2);
});

test("clockwise_angle2", () => {
  expect(math.core.clockwise_angle2([1,0], [0,1])).toBeCloseTo(Math.PI*3/2);
  expect(math.core.clockwise_angle2([0,1], [1,0])).toBeCloseTo(Math.PI*1/2);
});

test("counter_clockwise_angle2", () => {
  expect(math.core.counter_clockwise_angle2([1,0], [0,1]))
    .toBeCloseTo(Math.PI*1/2);
  expect(math.core.counter_clockwise_angle2([0,1], [1,0]))
    .toBeCloseTo(Math.PI*3/2);
});

// test("counter_clockwise_vector_order", () => {
//   math.core.counter_clockwise_vector_order(...vectors)
// });

// test("interior_angles2", () => {
//   math.core.interior_angles2(a, b)
// });

// test("interior_angles", () => {
//   math.core.interior_angles(...vecs)
// });

// test("bisect_vectors", () => {
//   math.core.bisect_vectors(a, b)
// });

// test("bisect_lines2", () => {
//   math.core.bisect_lines2(vectorA, pointA, vectorB, pointB)
// });

// test("subsect_radians", () => {
//   math.core.subsect_radians(divisions, angleA, angleB)
// });

// test("subsect", () => {
//   math.core.subsect(divisions, vectorA, vectorB)
// });

// test("circumcircle", () => {
//   math.core.circumcircle(a, b, c)
// });

// test("signed_area", () => {
//   math.core.signed_area(points)
// });

// test("centroid", () => {
//   math.core.centroid(points)
// });

// test("enclosing_rectangle", () => {
//   math.core.enclosing_rectangle(points)
// });

// test("make_regular_polygon", () => {
//   math.core.make_regular_polygon(sides, x, y, radius)
// });

// test("split_polygon", () => {
//   math.core.split_polygon(poly, lineVector, linePoint)
// });

test("split_convex_polygon", () => {
  const rect_counter = [
    [-1, -1],
    [+1, -1],
    [+1, +1],
    [-1, +1],
  ];
  const rect_clock = [
    [-1, -1],
    [-1, +1],
    [+1, +1],
    [+1, -1],
  ];
  const res0 = math.core.split_convex_polygon(rect_counter, [1,2], [0,0]);
  [[-1,1], [-1,-1], [-0.5,-1], [0.5,1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
  });
  [[1,-1], [1,1], [0.5,1], [-0.5,-1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
  });
});

test("convex_hull", () => {
  const rect = [
    [1,0],
    [0,0],
    [1,1],
    [0,1],
  ];
  const rect_collinear = [
    [1,0],
    [0,0],
    [0.5, 0],
    [1,1],
    [0, 0.5],
    [0,1],
  ];
  const res0 = math.core.convex_hull(rect);
  const res1 = math.core.convex_hull(rect_collinear);
  // todo this second parameter has been muted
  const res0b = math.core.convex_hull(rect, true);
  const res1b = math.core.convex_hull(rect_collinear, true);

  expect(res0.length).toBe(4);
  expect(res1.length).toBe(4);
  expect(res0b.length).toBe(4);
  // expect(res1b.length).toBe(6);
});

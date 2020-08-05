const math = require("../math");

test("equivalent", () => {

});

test("equivalent numbers", () => {
  expect(math.core.equivalent_numbers()).toBe(false);
  expect(math.core.equivalent_numbers([[[1, 1, 1, 1, 1]]])).toBe(true);
  expect(math.core.equivalent_numbers([[[1, 1, 1, 1, 1, 4]]])).toBe(false);
  expect(math.core.equivalent_numbers([1, 1, 1, 1, 1, 1], [1, 2])).toBe(false);
});

test("overlap.segment_point_inclusive", () => {
  expect(math.overlap.segment_point_inclusive([3, 3], [6, 3], [4, 3])).toBe(true);
  expect(math.overlap.segment_point_inclusive([3, 3], [6, 3], [3, 3])).toBe(true);
  expect(math.overlap.segment_point_inclusive([3, 3], [6, 3], [2.9, 3])).toBe(false);
  expect(math.overlap.segment_point_inclusive([3, 3], [6, 3], [2.9999999999, 3])).toBe(true);
  expect(math.overlap.segment_point_inclusive([3, 3], [6, 3], [6.1, 3])).toBe(false);
  expect(math.overlap.segment_point_inclusive([3, 3], [6, 3], [6.0000000001, 3])).toBe(true);

  expect(math.overlap.segment_point_inclusive([2, 2], [4, 4], [3.5, 3.5])).toBe(true);
  expect(math.overlap.segment_point_inclusive([2, 2], [4, 4], [2.9, 3.1])).toBe(false);
  expect(math.overlap.segment_point_inclusive([2, 2], [4, 4], [2.99999999, 3.000000001])).toBe(true);
  // degenerate edge still tests positive if the point is in common
  expect(math.overlap.segment_point_inclusive([2, 2], [2, 2], [2, 2])).toBe(true);
  expect(math.overlap.segment_point_inclusive([2, 2], [2, 2], [2.1, 2.1])).toBe(false);
  expect(math.overlap.segment_point_inclusive([2, 2], [2, 2], [2.000000001, 2.00000001])).toBe(true);
});

// equivalent is doing weird things by on ly checking 2 arguments sometimes.
/**
 * queries
 */
// test("equivalent function", () => {
//   expect(math.core.equivalent(4, 4, 4)).toBe(true);
//   expect(math.core.equivalent(4, 4, 5)).toBe(false);
//   expect(math.core.equivalent([0], [0], [0])).toBe(true);
//   // expect(math.core.equivalent([0], [0, 0], [0])).toBe(false);
//   expect(math.core.equivalent([0], [0], [1])).toBe(false);
//   expect(math.core.equivalent([1], [0], [1])).toBe(false);
//   expect(math.core.equivalent(1, 1, 0.99999999999)).toBe(true);
//   expect(math.core.equivalent([1], [1], [0.99999999999])).toBe(true);
//   expect(math.core.equivalent([1], [1, 1], [1])).toBe(false);
//   expect(math.core.equivalent([1], [1, 0], [1])).toBe(false);
//   expect(math.core.equivalent(true, true, true, true)).toBe(true);
//   expect(math.core.equivalent(false, false, false, false)).toBe(true);
//   expect(math.core.equivalent(false, false, false, true)).toBe(false);
//   // equivalency has not yet been made to work with other types.
//   // inside the equivalent function, it calls equivalent_vectors which calls
//   // get_vector_of_vectors, which is forcing the removal of data that isn't a number
//   // tests 1 and 2 work, 3 doesn't
//   // testEqual(true, math.core.equivalent("hi", "hi", "hi"));
//   // testEqual(false, math.core.equivalent("hi", "hi", "bye"));
//   // testEqual(false, math.core.equivalent(["hi", "hi"], ["hi", "hi", "hi"]));
// });

const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};


/**
 * queries
 */
test("equivalent function", () => {
  testEqual(true, math.core.equivalent(4, 4, 4));
  testEqual(false, math.core.equivalent(4, 4, 5));
  testEqual(true, math.core.equivalent([0], [0], [0]));
  testEqual(false, math.core.equivalent([0], [0, 0], [0]));
  testEqual(false, math.core.equivalent([0], [0], [1]));
  testEqual(false, math.core.equivalent([1], [0], [1]));
  testEqual(true, math.core.equivalent(1, 1, 0.99999999999));
  testEqual(true, math.core.equivalent([1], [1], [0.99999999999]));
  testEqual(false, math.core.equivalent([1], [1, 1], [1]));
  testEqual(false, math.core.equivalent([1], [1, 0], [1]));
  testEqual(true, math.core.equivalent(true, true, true, true));
  testEqual(true, math.core.equivalent(false, false, false, false));
  testEqual(false, math.core.equivalent(false, false, false, true));
  // equivalency has not yet been made to work with other types.
  // inside the equivalent function, it calls equivalent_vectors which calls
  // get_vector_of_vectors, which is forcing the removal of data that isn't a number
  // tests 1 and 2 work, 3 doesn't
  // testEqual(true, math.core.equivalent("hi", "hi", "hi"));
  // testEqual(false, math.core.equivalent("hi", "hi", "bye"));
  // testEqual(false, math.core.equivalent(["hi", "hi"], ["hi", "hi", "hi"]));
});

test("equivalent numbers", () => {
  testEqual(true, math.core.equivalent_numbers([[[1, 1, 1, 1, 1]]]));
  testEqual(false, math.core.equivalent_numbers([[[1, 1, 1, 1, 1, 4]]]));
  testEqual(false, math.core.equivalent_numbers([1, 1, 1, 1, 1, 1], [1, 2]));
});

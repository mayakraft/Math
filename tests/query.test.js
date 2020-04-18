const math = require("../math");

test("equivalent", () => {

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

// test("equivalent numbers", () => {
//   expect(math.core.equivalent_numbers([[[1, 1, 1, 1, 1]]])).toBe(true);
//   expect(math.core.equivalent_numbers([[[1, 1, 1, 1, 1, 4]]])).toBe(false);
//   expect(math.core.equivalent_numbers([1, 1, 1, 1, 1, 1], [1, 2])).toBe(false);
// });

const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};


/**
 * number cleaning
 */
test("clean number", () => {
  // this is the most decimal places javascript uses
  testEqual(true, math.core.clean_number(0.12345678912345678)
    === 0.12345678912345678);
  testEqual(true, math.core.clean_number(0.12345678912345678, 5)
    === 0.12345678912345678);
  testEqual(true, math.core.clean_number(0.00000678912345678, 5)
    === 0.00000678912345678);
  testEqual(true, math.core.clean_number(0.00000078912345678, 5)
    === 0);
  testEqual(true, math.core.clean_number(0.00000000000000001)
    === 0);
  testEqual(true, math.core.clean_number(0.0000000000000001)
    === 0);
  testEqual(true, math.core.clean_number(0.000000000000001)
    === 0.000000000000001);
  testEqual(true, math.core.clean_number(0.00000000001, 9)
    === 0);
  testEqual(true, math.core.clean_number(0.0000000001, 9)
    === 0);
  testEqual(true, math.core.clean_number(0.000000001, 9)
    === 0.000000001);
});


/**
 * inputs and argument inference
 */
// test("semi-flatten input", () => {
//   testEqual([{ x: 5, y: 3 }], math.core.semi_flatten_arrays({ x: 5, y: 3 }));
//   testEqual([{ x: 5, y: 3 }], math.core.semi_flatten_arrays([[[{ x: 5, y: 3 }]]]));
//   testEqual([5, 3], math.core.semi_flatten_arrays([[[5, 3]]]));
//   testEqual([[5], [3]], math.core.semi_flatten_arrays([[[5], [3]]]));
//   testEqual([[[5]], [[3]]], math.core.semi_flatten_arrays([[[5]], [[3]]]));
//   testEqual([[[[5]]], [[[3]]]], math.core.semi_flatten_arrays([[[5]]], [[[3]]]));
//   testEqual(true, undefined === math.core.get_vector(undefined, undefined));
// });


test("new semi-flatten arrays", () => {
  testEqual([[0,1,2], [2,3,4]], flatten_arrays([0,1,2], [2,3,4]));
  testEqual([[0,1,2], [2,3,4]], flatten_arrays([[0,1,2]], [[2,3,4]]));
  testEqual([[0,1,2], [2,3,4]], flatten_arrays([[[0,1,2]], [[2,3,4]]]));
  testEqual([[0,1,2], [2,3,4]], flatten_arrays([[[[0,1,2]], [[2,3,4]]]]));
  testEqual([[[0],[1],[2]], [2,3,4]], flatten_arrays([[[[0],[1],[2]]], [[2,3,4]]]));
  testEqual([[[0],[1],[2]], [2,3,4]], flatten_arrays([[[[[[0]]],[[[1]]],[2]]], [[2,3,4]]]));
});


test("flatten input", () => {
  testEqual([1], math.core.flatten_arrays([[[1]], []]));
  testEqual([1, 2, 3, 4], math.core.flatten_arrays([[[1, 2, 3, 4]]]));
  testEqual([1, 2, 3, 4], math.core.flatten_arrays(1, 2, 3, 4));
  testEqual([1, 2, 3, 4, 2, 4],
    math.core.flatten_arrays([1, 2, 3, 4], [2, 4]));
  testEqual([1, 2, 3, 4, 6, 7, 6],
    math.core.flatten_arrays([1, 2, 3, 4], [6, 7], 6));
  testEqual([1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
    math.core.flatten_arrays([1, 2, 3, 4], [6, 7], 6, 2, 4, 5));
  testEqual([{ x: 5, y: 3 }], math.core.flatten_arrays({ x: 5, y: 3 }));
  testEqual([{ x: 5, y: 3 }], math.core.flatten_arrays([[{ x: 5, y: 3 }]]));
  testEqual([1, 2, 3, 4, 5, 6],
    math.core.flatten_arrays([[[1], [2, 3]]], 4, [5, 6]));
  testEqual([undefined, undefined], math.core.flatten_arrays([[[undefined,[[undefined]]]]]));

});

// test("semi-flatten input", () => {
//   testEqual([1, 2, 3, 4], math.core.get_vector([[[1, 2, 3, 4]]]));
//   testEqual([1, 2, 3, 4], math.core.get_vector(1, 2, 3, 4));
//   testEqual([1, 2, 3, 4, 2, 4], math.core.get_vector([1, 2, 3, 4], [2, 4]));
//   testEqual([1, 2, 3, 4, 6, 7, 6], math.core.get_vector([1, 2, 3, 4], [6, 7], 6));
//   testEqual([1, 2, 3, 4, 6, 7, 6, 2, 4, 5], math.core.get_vector([1, 2, 3, 4], [6, 7], 6, 2, 4, 5));
//   testEqual([5, 3], math.core.get_vector({ x: 5, y: 3 }));
//   testEqual([5, 3], math.core.get_vector([[[{ x: 5, y: 3 }]]]));
//   testEqual([5, 3], math.core.get_vector([[[5, 3]]]));
//   testEqual([5, 3], math.core.get_vector([[[5], [3]]]));
//   testEqual([5, 3], math.core.get_vector([[[5]], [[3]]]));
//   testEqual([5, 3], math.core.get_vector([[[5]]], [[[3]]]));
//   testEqual([5, 3], math.core.get_vector([[[5]]], 3));
// });

test("get vector of vectors", () => {
  testEqual([[1, 2], [3, 4]],
    math.core.get_vector_of_vectors({ x: 1, y: 2 }, { x: 3, y: 4 }));
  testEqual([[1, 2], [3, 4]],
    math.core.get_vector_of_vectors([[[{ x: 1, y: 2 }, { x: 3, y: 4 }]]]));
  testEqual([[1, 2], [3, 4]],
    math.core.get_vector_of_vectors([[[1, 2], [3, 4]]]));
  testEqual([[1, 2], [3, 4]],
    math.core.get_vector_of_vectors([[[1, 2]], [[3, 4]]]));
  testEqual([[1, 2], [3, 4]],
    math.core.get_vector_of_vectors([[[1, 2]]], [[[3, 4]]]));
  testEqual([[1], [2], [3], [4]],
    math.core.get_vector_of_vectors([[[1], [2], [3], [4]]]));
  testEqual([[1], [2], [3], [4]],
    math.core.get_vector_of_vectors([[[1]], [[2]], [[3]], [[4]]]));
  testEqual([[1], [2], [3], [4]],
    math.core.get_vector_of_vectors([[[1]]], 2, 3, 4));
  testEqual([[1], [2], [3], [4]],
    math.core.get_vector_of_vectors([[[1, 2, 3, 4]]]));
});

test("get two vectors", () => {
  testEqual([[1, 2], [3, 4]], math.segment(1, 2, 3, 4));
  testEqual([[1, 2], [3, 4]], math.segment([1, 2], [3, 4]));
  testEqual([[1, 2], [3, 4]], math.segment([1, 2, 3, 4]));
  testEqual([[1, 2], [3, 4]], math.segment([[1, 2], [3, 4]]));
});

test("get matrix", () => {
  testEqual([1, 2, 3, 4, 5, 6], math.core.get_matrix2([[[1, 2, 3, 4, 5, 6]]]));
  testEqual([1, 2, 3, 4, 0, 0], math.core.get_matrix2([[1, 2, 3, 4]]));
  testEqual([1, 2, 3, 1, 0, 0], math.core.get_matrix2(1, 2, 3));
  testEqual([1, 2, 3, 1, 0, 0], math.core.get_matrix2(math.matrix2(1, 2, 3, 1)));
});

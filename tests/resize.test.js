const math = require("../math");

/**
 * test equal runs the equivalent() function which incorporates an epsilon
 * such that the test "1e-8 is equivalent to 0" will come back true
 */
const equalTest = (a, b) => expect(JSON.stringify(a))
  .toBe(JSON.stringify(b));


test("resize", () => {
  const a = [1, 2, 3];
  const _a = math.core.resize(5, a);
  equalTest(_a, [1, 2, 3, 0, 0]);
});

test("resize_up", () => {
  const a = [1, 2, 3];
  const b = [4, 5];
  expect(a.length).toBe(3);
  expect(b.length).toBe(2);
  const [_a, _b] = math.core.resize_up(a, b);
  expect(_a.length).toBe(3);
  expect(_b.length).toBe(3);
});

test("resize_down", () => {
  const a = [1, 2, 3];
  const b = [4, 5];
  expect(a.length).toBe(3);
  expect(b.length).toBe(2);
  const [_a, _b] = math.core.resize_down(a, b);
  expect(_a.length).toBe(2);
  expect(_b.length).toBe(2);
});

test("clean_number", () => {
  // this is the most decimal places javascript uses
  equalTest(math.core.clean_number(0.12345678912345678), 0.12345678912345678);
  equalTest(math.core.clean_number(0.12345678912345678, 5), 0.12345678912345678);
  equalTest(math.core.clean_number(0.00000678912345678, 5), 0.00000678912345678);
  equalTest(math.core.clean_number(0.00000078912345678, 5), 0);
  equalTest(math.core.clean_number(0.00000000000000001), 0);
  equalTest(math.core.clean_number(0.0000000000000001), 0);
  equalTest(math.core.clean_number(0.000000000000001), 0.000000000000001);
  equalTest(math.core.clean_number(0.00000000001, 9), 0);
  equalTest(math.core.clean_number(0.0000000001, 9), 0);
  equalTest(math.core.clean_number(0.000000001, 9), 0.000000001);
});

/**
 * inputs and argument inference
 */
test("semi flatten arrays", () => {
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    math.core.semi_flatten_arrays([0, 1, 2], [2, 3, 4])
  );
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    math.core.semi_flatten_arrays([[0, 1, 2]], [[2, 3, 4]])
  );
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    math.core.semi_flatten_arrays([[[0, 1, 2]], [[2, 3, 4]]])
  );
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    math.core.semi_flatten_arrays([[[[0, 1, 2]], [[2, 3, 4]]]])
  );
  equalTest(
    [[[0], [1], [2]], [2, 3, 4]],
    math.core.semi_flatten_arrays([[[[0], [1], [2]]], [[2, 3, 4]]])
  );
  equalTest(
    [[[0], [1], [2]], [2, 3, 4]],
    math.core.semi_flatten_arrays([[[[[[0]]], [[[1]]], [2]]], [[2, 3, 4]]])
  );
});

test("flatten arrays", () => {
  equalTest(
    [1],
    math.core.flatten_arrays([[[1]], []])
  );
  equalTest(
    [1, 2, 3, 4],
    math.core.flatten_arrays([[[1, 2, 3, 4]]])
  );
  equalTest(
    [1, 2, 3, 4],
    math.core.flatten_arrays(1, 2, 3, 4)
  );
  equalTest(
    [1, 2, 3, 4, 2, 4],
    math.core.flatten_arrays([1, 2, 3, 4], [2, 4])
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6],
    math.core.flatten_arrays([1, 2, 3, 4], [6, 7], 6)
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
    math.core.flatten_arrays([1, 2, 3, 4], [6, 7], 6, 2, 4, 5)
  );
  equalTest(
    [{ x: 5, y: 3 }],
    math.core.flatten_arrays({ x: 5, y: 3 })
  );
  equalTest(
    [{ x: 5, y: 3 }],
    math.core.flatten_arrays([[{ x: 5, y: 3 }]])
  );
  equalTest(
    [1, 2, 3, 4, 5, 6],
    math.core.flatten_arrays([[[1], [2, 3]]], 4, [5, 6])
  );
  equalTest(
    [undefined, undefined],
    math.core.flatten_arrays([[[undefined, [[undefined]]]]])
  );
});

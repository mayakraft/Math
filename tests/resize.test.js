const math = require("../math");

const equalTest = (a, b) => expect(JSON.stringify(a))
  .toBe(JSON.stringify(b));

test("resize", () => {
  const a = [1, 2, 3];
  const _a = math.core.resize(5, a);
  equalTest(_a, [1, 2, 3, 0, 0]);
});

test("resize empty", () => {
	const res = math.core.resize(3, []);
	expect(math.core.equivalentVectors([0, 0, 0], res)).toBe(true);
});

test("resize undefined", () => {
	try {
		math.core.resize(3);
	} catch(err) {
		expect(err).not.toBe(undefined);
	}
});

test("resizeUp", () => {
  const a = [1, 2, 3];
  const b = [4, 5];
  expect(a.length).toBe(3);
  expect(b.length).toBe(2);
  const [_a, _b] = math.core.resizeUp(a, b);
  expect(_a.length).toBe(3);
  expect(_b.length).toBe(3);
});

test("resizeDown", () => {
  const a = [1, 2, 3];
  const b = [4, 5];
  expect(a.length).toBe(3);
  expect(b.length).toBe(2);
  const [_a, _b] = math.core.resizeDown(a, b);
  expect(_a.length).toBe(2);
  expect(_b.length).toBe(2);
});

test("cleanNumber", () => {
  // this is the most decimal places javascript uses
  equalTest(math.core.cleanNumber(0.12345678912345678), 0.12345678912345678);
  equalTest(math.core.cleanNumber(0.12345678912345678, 5), 0.12345678912345678);
  equalTest(math.core.cleanNumber(0.00000678912345678, 5), 0.00000678912345678);
  equalTest(math.core.cleanNumber(0.00000078912345678, 5), 0);
  equalTest(math.core.cleanNumber(0.00000000000000001), 0);
  equalTest(math.core.cleanNumber(0.0000000000000001), 0);
  equalTest(math.core.cleanNumber(0.000000000000001), 0.000000000000001);
  equalTest(math.core.cleanNumber(0.00000000001, 9), 0);
  equalTest(math.core.cleanNumber(0.0000000001, 9), 0);
  equalTest(math.core.cleanNumber(0.000000001, 9), 0.000000001);
});

test("cleanNumber invalid input", () => {
  // this is the most decimal places javascript uses
  expect(math.core.cleanNumber("50.00000000001")).toBe("50.00000000001");
  expect(math.core.cleanNumber(undefined)).toBe(undefined);
  expect(math.core.cleanNumber(true)).toBe(true);
  expect(math.core.cleanNumber(false)).toBe(false);
  const arr = [];
  expect(math.core.cleanNumber(arr)).toBe(arr);
});

/**
 * inputs and argument inference
 */
test("semi flatten arrays", () => {
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    math.core.semiFlattenArrays([0, 1, 2], [2, 3, 4])
  );
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    math.core.semiFlattenArrays([[0, 1, 2]], [[2, 3, 4]])
  );
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    math.core.semiFlattenArrays([[[0, 1, 2]], [[2, 3, 4]]])
  );
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    math.core.semiFlattenArrays([[[[0, 1, 2]], [[2, 3, 4]]]])
  );
  equalTest(
    [[[0], [1], [2]], [2, 3, 4]],
    math.core.semiFlattenArrays([[[[0], [1], [2]]], [[2, 3, 4]]])
  );
  equalTest(
    [[[0], [1], [2]], [2, 3, 4]],
    math.core.semiFlattenArrays([[[[[[0]]], [[[1]]], [2]]], [[2, 3, 4]]])
  );
});

test("flatten arrays", () => {
  equalTest(
    [1],
    math.core.flattenArrays([[[1]], []])
  );
  equalTest(
    [1, 2, 3, 4],
    math.core.flattenArrays([[[1, 2, 3, 4]]])
  );
  equalTest(
    [1, 2, 3, 4],
    math.core.flattenArrays(1, 2, 3, 4)
  );
  equalTest(
    [1, 2, 3, 4, 2, 4],
    math.core.flattenArrays([1, 2, 3, 4], [2, 4])
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6],
    math.core.flattenArrays([1, 2, 3, 4], [6, 7], 6)
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
    math.core.flattenArrays([1, 2, 3, 4], [6, 7], 6, 2, 4, 5)
  );
  equalTest(
    [{ x: 5, y: 3 }],
    math.core.flattenArrays({ x: 5, y: 3 })
  );
  equalTest(
    [{ x: 5, y: 3 }],
    math.core.flattenArrays([[{ x: 5, y: 3 }]])
  );
  equalTest(
    [1, 2, 3, 4, 5, 6],
    math.core.flattenArrays([[[1], [2, 3]]], 4, [5, 6])
  );
  equalTest(
    [undefined, undefined],
    math.core.flattenArrays([[[undefined, [[undefined]]]]])
  );
});

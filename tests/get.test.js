const math = require("../math");

const equalTest = (a, b) => expect(JSON.stringify(a))
  .toBe(JSON.stringify(b));

test("get with real types", () => {
  const vector = math.vector(1,2,3);
  const matrix = math.matrix(1,2,3,4);
  const line = math.line(1,2);
  const ray = math.ray(1,2);
  const segment = math.segment([1,2],[3,4]);
  const circle = math.circle(1);
  const rect = math.rect(2,4);
  const ellipse = math.ellipse(1,2);
  expect(math.core.getVector(vector)[2]).toBe(3);
  // expect(math.core.getVectorOfVectors(segment)[0]).toBe(1);
  expect(math.core.getSegment(segment)[0][1]).toBe(2);
  expect(math.core.getLine(line).vector[1]).toBe(2);
  expect(math.core.getRect(rect).height).toBe(4);
  expect(math.core.getMatrix3x4(matrix)[4]).toBe(4);
//  expect(math.core.get_matrix2(matrix)[1]).toBe(2);
});

test("getVector", () => {
  equalTest(
    [1, 2, 3, 4],
    math.core.getVector([[[1, 2, 3, 4]]])
  );
  equalTest(
    [1, 2, 3, 4],
    math.core.getVector(1, 2, 3, 4)
  );
  equalTest(
    [1, 2, 3, 4, 2, 4],
    math.core.getVector([1, 2, 3, 4], [2, 4])
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6],
    math.core.getVector([1, 2, 3, 4], [6, 7], 6)
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
    math.core.getVector([1, 2, 3, 4], [6, 7], 6, 2, 4, 5)
  );
  equalTest(
    [5, 3],
    math.core.getVector({ x: 5, y: 3 })
  );
  equalTest(
    [5, 3],
    math.core.getVector([[[{ x: 5, y: 3 }]]])
  );
  equalTest(
    [5, 3],
    math.core.getVector([[[5, 3]]])
  );
  equalTest(
    [5, 3],
    math.core.getVector([[[5], [3]]])
  );
  equalTest(
    [5, 3],
    math.core.getVector([[[5]], [[3]]])
  );
  equalTest(
    [5, 3],
    math.core.getVector([[[5]]], [[[3]]])
  );
  equalTest(
    [5, 3],
    math.core.getVector([[[5]]], 3)
  );
});

test("getLine", () => {
  equalTest(math.core.getLine(1), { vector: [1], origin: [] });
  equalTest(math.core.getLine(1, 2), { vector: [1, 2], origin: [] });
  equalTest(math.core.getLine(1, 2, 3), { vector: [1, 2, 3], origin: [] });
  equalTest(math.core.getLine([1], [2]), { vector: [1], origin: [2] });
  equalTest(math.core.getLine([1, 2], [2, 3]), { vector: [1, 2], origin: [2, 3] });
  equalTest(math.core.getLine(), { vector: [], origin: [] });
  equalTest(math.core.getLine({}), { vector: [], origin: [] });
});

test("getVectorOfVectors", () => {
  equalTest([[1, 2], [3, 4]],
    math.core.getVectorOfVectors({ x: 1, y: 2 }, { x: 3, y: 4 }));
  equalTest([[1, 2], [3, 4]],
    math.core.getVectorOfVectors([[[{ x: 1, y: 2 }, { x: 3, y: 4 }]]]));
  equalTest([[1, 2], [3, 4]],
    math.core.getVectorOfVectors([[[1, 2], [3, 4]]]));
  equalTest([[1, 2], [3, 4]],
    math.core.getVectorOfVectors([[[1, 2]], [[3, 4]]]));
  equalTest([[1, 2], [3, 4]],
    math.core.getVectorOfVectors([[[1, 2]]], [[[3, 4]]]));
  equalTest([[1], [2], [3], [4]],
    math.core.getVectorOfVectors([[[1], [2], [3], [4]]]));
  equalTest([[1], [2], [3], [4]],
    math.core.getVectorOfVectors([[[1]], [[2]], [[3]], [[4]]]));
  equalTest([[1], [2], [3], [4]],
    math.core.getVectorOfVectors([[[1]]], 2, 3, 4));
  equalTest([[1], [2], [3], [4]],
    math.core.getVectorOfVectors([[[1, 2, 3, 4]]]));
});

test("getSegment", () => {
  equalTest([[1, 2], [3, 4]], math.core.getSegment(1, 2, 3, 4));
  equalTest([[1, 2], [3, 4]], math.core.getSegment([1, 2], [3, 4]));
  equalTest([[1, 2], [3, 4]], math.core.getSegment([1, 2, 3, 4]));
  equalTest([[1, 2], [3, 4]], math.core.getSegment([[1, 2], [3, 4]]));
});

// test("get_matrix2", () => {
//   equalTest(
//     [1, 2, 3, 4, 5, 6],
//     math.core.get_matrix2([[[1, 2, 3, 4, 5, 6]]])
//   );
//   equalTest(
//     [1, 2, 3, 4, 0, 0],
//     math.core.get_matrix2([[1, 2, 3, 4]])
//   );
//   equalTest(
//     [1, 2, 3, 1, 0, 0],
//     math.core.get_matrix2(1, 2, 3)
//   );
//   equalTest(
//     [1, 2, 3, 1, 0, 0],
//     math.core.get_matrix2(1, 2, 3, 1)
//   );
// });

test("getMatrix3x4", () => {
  equalTest(
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    math.core.getMatrix3x4([[[]]]),
  );
  equalTest(
    [1, 2, 0, 3, 4, 0, 0, 0, 1, 0, 0, 0],
    math.core.getMatrix3x4([[[1, 2, 3, 4]]]),
  );
  equalTest(
    [1, 2, 0, 3, 4, 0, 0, 0, 1, 5, 6, 0],
    math.core.getMatrix3x4([[[1, 2, 3, 4, 5, 6]]]),
  );
  equalTest(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0],
    math.core.getMatrix3x4([[[1, 2, 3, 4, 5, 6, 7, 8, 9]]]),
  );
});

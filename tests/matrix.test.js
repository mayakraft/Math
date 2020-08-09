const math = require("../math");


test("copy", () => {
  const matrix = math.matrix(1,2,3,4,5,6,7,8,9);
  const result = matrix.copy();
  matrix.set(1,0,0,0,1,0,0,0,1,0,0,0);
  expect(result[3]).toBe(4);
});
test("set", () => {
  const matrix = math.matrix(1,2,3,4,5,6,7,8,9);
  matrix.set(1,0,0,0,1,0,0,0,1,0,0,0);
  expect(matrix[3]).toBe(0);
});
test("isIdentity", () => {
  expect(math.matrix(1,2,3,4,5,6,7,8,9).isIdentity()).toBe(false);
  expect(math.matrix().isIdentity()).toBe(true);
  expect(math.matrix(1,0,0,0,1,0,0,0,1,4,5,6).isIdentity()).toBe(false);
  expect(math.matrix(1,0,0,0,1,0,0,0,1,0,0,0).isIdentity()).toBe(true);
});
test("multiply", () => {
  const matrix = math.matrix();
  const m = math.matrix().multiply(math.matrix().rotateX(Math.PI/4).rotateZ(Math.PI/4));
  const sq = Math.sqrt(2)/2;
  [sq,0.5,0.5,-sq,0.5,0.5,0,-sq,sq,0,0,0]
    .forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});
test("determinant", () => {
  expect(math.matrix().determinant()).toBe(1);
});
test("inverse", () => {
  const m = math.matrix(0,-1,0,1,0,0,0,0,1).inverse();
  [0,1,-0,-1,0,0,0,-0,1,0,0,0].forEach((a, i) => expect(a).toBeCloseTo(m[i]));

});
test("translate", () => {
  expect(math.matrix().translate(4,5,6)[9]).toBe(4);
  expect(math.matrix().translate(4,5,6)[10]).toBe(5);
  expect(math.matrix().translate(4,5,6)[11]).toBe(6);
});
test("rotateX", () => {
  const sq = Math.sqrt(2)/2;
  const m = math.matrix().rotateX(Math.PI/4);
  [1,0,0,0,sq,sq,0,-sq,sq,0,0,0].forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});
test("rotateY", () => {
  const sq = Math.sqrt(2)/2;
  const m = math.matrix().rotateY(Math.PI/4);
  [sq,0,-sq,0,1,0,sq,0,sq,0,0,0].forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});
test("rotateZ", () => {
  const sq = Math.sqrt(2)/2;
  const m = math.matrix().rotateZ(Math.PI/4);
  [sq,sq,0,-sq,sq,0,0,0,1,0,0,0].forEach((a, i) => expect(a).toBeCloseTo(m[i]));
});
test("rotate", () => {
  const m = math.matrix().rotate(Math.PI/2, [1, 1, 1], [0, 0, 0]);
  expect(m[2]).toBeCloseTo(m[3]);
  expect(m[0]).toBeCloseTo(m[4]);
  expect(m[1]).toBeCloseTo(m[5]);
});
test("scale", () => {
  expect(math.matrix().scale(0.5)[0]).toBe(0.5);
});
test("reflectZ", () => {
  const m = math.matrix().reflectZ([1, 1, 1], [0, 0, 0]);
  expect(m[1]).toBeCloseTo(m[3]);
  expect(m[0]).toBeCloseTo(m[4]);
  expect(m[2]).toBeCloseTo(m[5]);
  expect(m[5]).toBeCloseTo(m[6]);
});
test("transform", () => {
  const matrix = math.matrix().rotateZ(Math.PI/2).translate(4,5,6);
  const result = matrix.transform(math.segment([-1, 0], [1, 0]));
});
test("transformVector", () => {
  const vector = math.vector(1,2,3);
  expect(math.matrix().scale(0.5).transformVector(vector).x).toBeCloseTo(0.5);
  expect(math.matrix().scale(0.5).transformVector(vector).y).toBeCloseTo(1);
  expect(math.matrix().scale(0.5).transformVector(vector).z).toBeCloseTo(1.5);
});
test("transformLine", () => {
  const line = math.line([0.707, 0.707, 0], [1, 0, 0]);
  const result = math.matrix().scale(0.5).transformLine(line);
  expect(result.vector.x).toBeCloseTo(0.3535);
  expect(result.vector.y).toBeCloseTo(0.3535);
  expect(result.vector.z).toBeCloseTo(0);
  expect(result.origin.x).toBeCloseTo(0.5);
  expect(result.origin.y).toBeCloseTo(0);
  expect(result.origin.z).toBeCloseTo(0);
});
// test("transformLine with 2D vectors", () => {
//   const vector = math.line([0.707, 0.707], [1, 0]);
//   console.log(math.matrix().scale(0.5).transformLine(vector));
// });

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};

const sqrt05 = Math.sqrt(0.5);

/**
 * matrices
 */

test("matrix 2 core", () => {
  expect(math.core.invert_matrix2([1,0,0,1,0,0])).not.toBe(undefined);
  const r1 = math.core.make_matrix2_translate();
  expect(r1[0]).toBe(1);
  expect(r1[4]).toBe(0);
  expect(r1[5]).toBe(0);
  const r2 = math.core.make_matrix2_scale(2,-1)
  expect(r2[0]).toBe(2);
  expect(r2[3]).toBe(-1);
});

test("matrix core invert", () => {
  expect(math.core.invert_matrix2([1,0,0,1,0,0])).not.toBe(undefined);
  expect(math.core.invert_matrix3([1,0,0,0,1,0,0,0,1,0,0,0])).not.toBe(undefined);
  expect(math.core.invert_matrix2([5,5,4,4,3,3])).toBe(undefined);
  expect(math.core.invert_matrix3([0,1,1,0,1,1,0,1,1,1,1,1])).toBe(undefined);
});

// todo: test matrix3 methods (invert) with the translation component to make sure it carries over
test("matrix 3 core, transforms", () => {
  const result1 = math.core.make_matrix3_translate();
  [1,0,0,0,1,0,0,0,1,0,0,0].forEach((n, i) => expect(n).toBe(result1[i]));
  // rotate 360 degrees about an arbitrary axis and origin
  testEqual([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    math.core.make_matrix3_rotate(Math.PI * 2,
      [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
      [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]));

  testEqual(math.core.make_matrix3_rotateX(Math.PI / 6),
    math.core.make_matrix3_rotate(Math.PI / 6, [1, 0, 0]));
  testEqual(math.core.make_matrix3_rotateY(Math.PI / 6),
    math.core.make_matrix3_rotate(Math.PI / 6, [0, 1, 0]));
  testEqual(math.core.make_matrix3_rotateZ(Math.PI / 6),
    math.core.make_matrix3_rotate(Math.PI / 6, [0, 0, 1]));
  // source wikipedia https://en.wikipedia.org/wiki/Rotation_matrix#Examples
  testEqual([
    0.35612209405955486, -0.8018106071106572, 0.47987165414043453,
    0.47987165414043464, 0.5975763087872217, 0.6423595182829954,
    -0.8018106071106572, 0.0015183876574496047, 0.5975763087872216,
    0, 0, 0
  ], math.core.make_matrix3_rotate(-74 / 180 * Math.PI, [-1 / 3, 2 / 3, 2 / 3]));

  testEqual([1, 0, 0, 0, 0.8660254, 0.5, 0, -0.5, 0.8660254, 0, 0, 0],
    math.core.make_matrix3_rotate(Math.PI / 6, [1, 0, 0]));
});

test("matrix 3 core", () => {
  testEqual(12, math.core.determinant3([1, 2, 3, 2, 4, 8, 7, 8, 9]));
  testEqual(10, math.core.determinant3([3, 2, 0, 0, 0, 1, 2, -2, 1, 0, 0, 0]));
  testEqual([4, 5, -8, -5, -6, 9, -2, -2, 3, 0, 0, 0],
    math.core.invert_matrix3([0, 1, -3, -3, -4, 4, -2, -2, 1, 0, 0, 0]));
  testEqual([0.2, -0.2, 0.2, 0.2, 0.3, -0.3, 0, 1, 0, 0, 0, 0],
    math.core.invert_matrix3([3, 2, 0, 0, 0, 1, 2, -2, 1, 0, 0, 0]));
  const mat_3d_ref = math.core.make_matrix3_reflectionZ([1, -2], [12, 13]);
  testEqual(math.core.make_matrix2_reflection([1, -2], [12, 13]),
    [mat_3d_ref[0], mat_3d_ref[1], mat_3d_ref[3], mat_3d_ref[4], mat_3d_ref[9], mat_3d_ref[10]]);

  // source wolfram alpha
  testEqual([-682, 3737, -5545, 2154, -549, -1951, 953, -3256, 4401, 0, 0, 0],
    math.core.multiply_matrices3([5, -52, 85, 15, -9, -2, 32, 2, -50, 0, 0, 0],
      [-77, 25, -21, 3, 53, 42, 63, 2, 19, 0, 0, 0]));
});


// test("matrices", () => {
//   const ident = math.matrix();
//   testEqual(ident.rotateX(Math.PI / 2).translate(40, 20, 10),
//     [1, 0, 0, 0, 0, 1, 0, -1, 0, 40, -10, 20]);
//   // top level types
//   testEqual([1, 2, 3, 4, 5, 6], math.matrix2(1, 2, 3, 4, 5, 6));
//   testEqual([1, 0, 0, 1, 6, 7], math.matrix2.makeTranslation(6, 7));
//   testEqual([3, 0, 0, 3, -2, 0], math.matrix2.makeScale(3, 3, [1, 0]));
//   testEqual([0, 1, 1, -0, -8, 8], math.matrix2.makeReflection([1, 1], [-5, 3]));
//   testEqual(
//     [sqrt05, sqrt05, -sqrt05, sqrt05, 1, 1],
//     math.matrix2.makeRotation(Math.PI / 4, [1, 1])
//   );
//   testEqual(
//     [sqrt05, -sqrt05, sqrt05, sqrt05, -sqrt05, sqrt05],
//     math.matrix2(sqrt05, sqrt05, -sqrt05, sqrt05, 1, 0).inverse()
//   );
//   testEqual(
//     [Math.sqrt(4.5), sqrt05, -sqrt05, Math.sqrt(4.5), Math.sqrt(4.5), sqrt05],
//     math.matrix2(sqrt05, -sqrt05, sqrt05, sqrt05, 0, 0)
//       .multiply(math.matrix2(1, 2, -2, 1, 1, 2))
//   );
//   testEqual([0, 3], math.matrix2(2, 1, -1, 2, -1, 0).transform(1, 1));
//   testEqual([-2, 3], math.matrix2.makeScale(3, 3, [1, 0]).transform([0, 1]));
//   testEqual([-1, 2], math.matrix2.makeScale(3, 3, [0.5, 0.5]).transform([0, 1]));
//   testEqual([1, 1], math.matrix2.makeScale(0.5, 0.5, [1, 1]).transform([1, 1]));
//   testEqual([0.75, 0.75], math.matrix2.makeScale(0.5, 0.5, [0.5, 0.5]).transform([1, 1]));
// });

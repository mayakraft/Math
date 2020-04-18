const math = require("../math");

// const testEqual = function (...args) {
//   expect(math.core.equivalent(...args)).toBe(true);
// };

test("arguments", () => {
  expect(math.vector(1,2,3)[2]).toBe(3);
  expect(math.vector([1,2,3])[2]).toBe(3);
  expect(math.vector([[1,2,3]])[2]).toBe(3);
  expect(math.vector([[], [1,2,3]])[2]).toBe(3);
  expect(math.vector([[1],[2],[3]])[2]).toBe(3);
  expect(math.vector({x:1,y:2,z:3})[2]).toBe(3);
  expect(math.vector([{x:1,y:2,z:3}])[2]).toBe(3);
  expect(math.vector([[{x:1,y:2,z:3}]])[2]).toBe(3);
  expect(math.vector([[], {x:1,y:2,z:3}])[2]).toBe(3);
});


/**
 * vectors
 */

test("magnitude", () => {
  const v = math.vector(1,2,3).normalize();
  expect(v.magnitude()).toBe(1);
});

test("isEquivalent", () => {
  const v = math.vector(1,2,3);
  expect(v.isEquivalent([1,2,2.99999999])).toBe(true);
  expect(v.isEquivalent([1,2,2.9999999])).toBe(true);
  // this is where the current epsilon is
  expect(v.isEquivalent([1,2,2.999999])).toBe(false);
  expect(v.isEquivalent([1,2])).toBe(false);
  expect(v.isEquivalent([1,2,0])).toBe(false);
  expect(v.isEquivalent([1,2,3,4])).toBe(false);
})

test("isParallel", () => {
  const v = math.vector(1,2,3).normalize();
  expect(v.isParallel([-1,-2,-3])).toBe(true);
});

test("dot", () => {
  const v = math.vector(1,2);
  expect(v.dot([-2,1])).toBe(0);
});

test("distanceTo", () => {
  const v = math.vector(3,0)
  expect(v.distanceTo([-3,0])).toBe(6);
});

// test("bisect", () => {
//   const v = math.vector(1,2,3)
//   expect(v.bisect([-1,2,3])).toBe(true);
// });

// test("copy", () => {
//   const v = math.vector(1,2,3).normalize();
//   expect(v.copy([-1,2,3])).toBe(true);
// });

// test("normalize", () => {
//   const v = math.vector(1,2,3).normalize();
//   expect(v.normalize$[-1,2,3]1()).toBe(true);
// });

// test("scale", () => {
//   const v = math.vector(1,2,3).normalize();
//   expect(v.scale([-1,2,3]mag)).toBe(true);
// });

test("cross", () => {
  const v = math.vector(1,2,3).normalize();
  let w = math.vector(3,4).normalize()

  // [0, 0, 0.8]
  expect(0.8 - w.cross(2,4)[2]).toBeLessThan(1e-6); 
  expect(w.cross(2,-4,5)[0]).toBe(4);
  expect(w.cross(2,-4,5)[1]).toBe(3);
  expect(w.cross(2,-4,5)[2]).toBe(-4);
  expect(w.cross(2,-4)[2]).toBe(-4);
});

test("add", () => {
  const v = math.vector(1,2,3);
  for (let i = 0; i < v.length; i++) {
    expect(v.add([-1,2,3])[i]).toBe([0, 4, 6][i]);
  }
  for (let i = 0; i < v.length; i++) {
    expect(v.add([-1,2])[i]).toBe([0, 4, 3][i]);
  }
});

test("subtract", () => {
  const v = math.vector(1,2,3);
  for (let i = 0; i < v.length; i++) {
    expect(v.subtract([-1,2,3])[i]).toBe([2, 0, 0][i]);
  }
  for (let i = 0; i < v.length; i++) {
    expect(v.subtract([-1,2])[i]).toBe([2, 0, 3][i]);
  }
});

// test("rotateZ90", () => {
//   const v = math.vector(1,2,3).normalize();
//   expect(v.rotateZ90([-1,2,3])).toBe(true);
// });

// test("rotateZ180", () => {
//   const v = math.vector(1,2,3).normalize();
//   expect(v.rotateZ180([-1,2,3])).toBe(true);
// });

// test("rotateZ270", () => {
//   const v = math.vector(1,2,3).normalize();
//   expect(v.rotateZ270([-1,2,3])).toBe(true);
// });

// test("flip", () => {
//   const v = math.vector(1,2,3).normalize();
//   expect(v.flip([-1,2,3])).toBe(true);
// });

test("lerp", () => {
  const v = math.vector(2, 0)
  expect(v.lerp([-2, 0], 0.5)[0]).toBe(0);
  expect(v.lerp([-2, 0], 0.25)[0]).toBe(1);
  expect(v.lerp([-2, 0], 0.75)[0]).toBe(-1);
  expect(v.lerp([-2], 0.25)[0]).toBe(1);
  expect(v.lerp([-2], 0.75)[0]).toBe(-1);
});

test("midpoint", () => {
  const v = math.vector(1,2,3);
  expect(v.midpoint([1,2])[2]).toBe(1.5);
  // expect(v.midpoint([1,2, 10])).toBe([1, 2, 6.5]);
  // expect(v.midpoint([1,2, 10, 20])).toBe([1, 2, 6.5, 10]);
  // expect(v.midpoint([1])).toBe([1, 1, 1.5]);
  // expect(v.midpoint([])).toBe([0.5, 1, 1.5]);
  // expect(v.midpoint()).toBe([0.5, 1, 1.5]  );
});



// test("vector normalize, scale", () => {
//   testEqual([Math.sqrt(2), Math.sqrt(2)],
//     math.vector(10, 10).normalize().scale(2));
// });

// test("vector dot", () => {
//   testEqual(0, math.vector(2, 1).normalize().dot(math.vector(1, -2).normalize()));
//   testEqual(1, math.vector(2, 1).normalize().dot(math.vector(4, 2).normalize()));
// });

// test("vector cross", () => {
//   testEqual([0, 0, -5], math.vector(2, 1).cross(math.vector(1, -2)));
// });

// test("vector parallel", () => {
//   testEqual(true, math.vector(3, 4).isParallel(math.vector(-6, -8)));
// });

// test("lines parallel", () => {
//   testEqual(true, math.line(100, 101, 3, 4).isParallel(math.line(5, 5, -6, -8)));
// });

// test("vector lerp", () => {
//   testEqual([15.5, 3.5, 3], math.vector(30, 5, 3).lerp([1, 2, 3], 0.5));
// });

// test("vector copy", () => {
//   testEqual([1, 2, 3], math.vector(1, 2, 3).copy().copy());
// });

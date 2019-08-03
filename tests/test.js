// isomorphic
var window;
const math = (window !== undefined) ? window.math : require("../math");

const verbose = true;
const bar = "============================================================";
// globals keep track of tests for more information during a fail
let name = "beginning of tests";
let testNumber = 1;
const failedTests = [];

// math constants
const sqrt05 = Math.sqrt(0.5);


const testName = function (newName) {
  name = newName;
  testNumber = 1;
};
/**
 * test equal runs the equivalent() function which incorporates an epsilon
 * such that the test "1e-8 is equivalent to 0" will come back true
 */
const testEqual = function (...args) {
  if (!math.core.equivalent(...args)) {
    // test failed
    const message = `xxx test failed. #${testNumber} of ${name}`;
    failedTests.push({ message, args });
    if (verbose) { console.log(message); }
  } else {
    // test passed
    if (verbose) {
      console.log(`... test passed #${testNumber} of ${name}`);
    }
  }
  testNumber += 1;
};

/**
 * inputs and argument inference
 */
testName("semi-flatten input");
testEqual([{ x: 5, y: 3 }], math.core.semi_flatten_input({ x: 5, y: 3 }));
testEqual([{ x: 5, y: 3 }], math.core.semi_flatten_input([[[{ x: 5, y: 3 }]]]));
testEqual([5, 3], math.core.semi_flatten_input([[[5, 3]]]));
testEqual([[5], [3]], math.core.semi_flatten_input([[[5], [3]]]));
testEqual([[[5]], [[3]]], math.core.semi_flatten_input([[[5]], [[3]]]));
testEqual([[[[5]]], [[[3]]]], math.core.semi_flatten_input([[[5]]], [[[3]]]));
testEqual(true, undefined === math.core.get_vector(undefined, undefined));

testName("flatten input");
testEqual([1], math.core.flatten_input([[[1]], []]));
testEqual([1, 2, 3, 4], math.core.flatten_input([[[1, 2, 3, 4]]]));
testEqual([1, 2, 3, 4], math.core.flatten_input(1, 2, 3, 4));
testEqual([1, 2, 3, 4, 2, 4],
  math.core.flatten_input([1, 2, 3, 4], [2, 4]));
testEqual([1, 2, 3, 4, 6, 7, 6],
  math.core.flatten_input([1, 2, 3, 4], [6, 7], 6));
testEqual([1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
  math.core.flatten_input([1, 2, 3, 4], [6, 7], 6, 2, 4, 5));
testEqual([{ x: 5, y: 3 }], math.core.flatten_input({ x: 5, y: 3 }));
testEqual([{ x: 5, y: 3 }], math.core.flatten_input([[{ x: 5, y: 3 }]]));
testEqual([1, 2, 3, 4, 5, 6],
  math.core.flatten_input([[[1], [2, 3]]], 4, [5, 6]));

testName("get vector");
testEqual([1, 2, 3, 4], math.core.get_vector([[[1, 2, 3, 4]]]));
testEqual([1, 2, 3, 4], math.core.get_vector(1, 2, 3, 4));
testEqual([1, 2, 3, 4, 2, 4], math.core.get_vector([1, 2, 3, 4], [2, 4]));
testEqual([1, 2, 3, 4, 6, 7, 6], math.core.get_vector([1, 2, 3, 4], [6, 7], 6));
testEqual([1, 2, 3, 4, 6, 7, 6, 2, 4, 5], math.core.get_vector([1, 2, 3, 4], [6, 7], 6, 2, 4, 5));
testEqual([5, 3], math.core.get_vector({ x: 5, y: 3 }));
testEqual([5, 3], math.core.get_vector([[[{ x: 5, y: 3 }]]]));
testEqual([5, 3], math.core.get_vector([[[5, 3]]]));
testEqual([5, 3], math.core.get_vector([[[5], [3]]]));
testEqual([5, 3], math.core.get_vector([[[5]], [[3]]]));
testEqual([5, 3], math.core.get_vector([[[5]]], [[[3]]]));
testEqual([5, 3], math.core.get_vector([[[5]]], 3));

testName("get vector of vectors");
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

testName("get two vectors");
testEqual([[1, 2], [3, 4]], math.segment(1, 2, 3, 4));
testEqual([[1, 2], [3, 4]], math.segment([1, 2], [3, 4]));
testEqual([[1, 2], [3, 4]], math.segment([1, 2, 3, 4]));
testEqual([[1, 2], [3, 4]], math.segment([[1, 2], [3, 4]]));

testName("get matrix");
testEqual([1, 2, 3, 4, 5, 6], math.core.get_matrix2([[[1, 2, 3, 4, 5, 6]]]));
testEqual([1, 2, 3, 4, 0, 0], math.core.get_matrix2([[1, 2, 3, 4]]));
testEqual([1, 2, 3, 1, 0, 0], math.core.get_matrix2(1, 2, 3));
testEqual([1, 2, 3, 1, 0, 0], math.core.get_matrix2(math.matrix2(1, 2, 3, 1)));

/**
 * queries
 */

testName("equivalent function");
testEqual(true, math.core.equivalent(4, 4, 4));
testEqual(false, math.core.equivalent(4, 4, 5));
testEqual(true, math.core.equivalent([0], [0], [0]));
testEqual(false, math.core.equivalent([0], [0, 0], [0]));
testEqual(false, math.core.equivalent([0], [0], [1]));
testEqual(false, math.core.equivalent([1], [0], [1]));
testEqual(true, math.core.equivalent(1, 1, 0.99999999999));
testEqual(true, math.core.equivalent([1], [1], [0.99999999999]));
testEqual(false, math.core.equivalent([1], [1, 0], [1]));
testEqual(true, math.core.equivalent(true, true, true, true));
testEqual(true, math.core.equivalent(false, false, false, false));
testEqual(false, math.core.equivalent(false, false, false, true));

testName("equivalent numbers");
testEqual(true, math.core.equivalent_numbers([[[1, 1, 1, 1, 1]]]));
testEqual(false, math.core.equivalent_numbers([[[1, 1, 1, 1, 1, 4]]]));
testEqual(false, math.core.equivalent_numbers([1, 1, 1, 1, 1, 1], [1, 2]));

/**
 * algebra core
 */

testName("average function");
testEqual([3.75, 4.75],
  math.core.average([4, 1], [5, 6], [4, 6], [2, 6]));
testEqual([4, 5, 3],
  math.core.average([1, 2, 3], [4, 5, 6], [7, 8]));
testEqual([4, 5, 6],
  math.core.average([1, 2, 3], [4, 5, 6], [7, 8, 9]));

/**
 * vectors
 */

testName("vector normalize, scale");
testEqual([Math.sqrt(2), Math.sqrt(2)],
  math.vector(10, 10).normalize().scale(2));

testName("vector dot");
testEqual(0, math.vector(2, 1).normalize().dot(math.vector(1, -2).normalize()));
testEqual(1, math.vector(2, 1).normalize().dot(math.vector(4, 2).normalize()));

testName("vector cross");
testEqual([0, 0, -5], math.vector(2, 1).cross(math.vector(1, -2)));

testName("vector parallel");
testEqual(true, math.vector(3, 4).isParallel(math.vector(-6, -8)));
testName("lines parallel");
testEqual(true, math.line(100, 101, 3, 4).isParallel(math.line(5, 5, -6, -8)));

testName("vector lerp");
testEqual([15.5, 3.5, 3], math.vector(30, 5, 3).lerp([1, 2, 3], 0.5));

/**
 * matrices
 */

testName("matrices");
testEqual([1, 2, 3, 4, 5, 6], math.matrix2(1, 2, 3, 4, 5, 6));
testEqual([1, 0, 0, 1, 6, 7], math.matrix2.makeTranslation(6, 7));
testEqual([3, 0, 0, 3, -2, 0], math.matrix2.makeScale(3, [1, 0]));
testEqual([0, 1, 1, -0, -8, 8], math.matrix2.makeReflection([1, 1], [-5, 3]));
testEqual(
  [sqrt05, sqrt05, -sqrt05, sqrt05, 1, 1],
  math.matrix2.makeRotation(Math.PI / 4, [1, 1])
);
testEqual(
  [sqrt05, -sqrt05, sqrt05, sqrt05, -sqrt05, sqrt05],
  math.matrix2(sqrt05, sqrt05, -sqrt05, sqrt05, 1, 0).inverse()
);
testEqual(
  [Math.sqrt(4.5), sqrt05, -sqrt05, Math.sqrt(4.5), Math.sqrt(4.5), sqrt05],
  math.matrix2(sqrt05, -sqrt05, sqrt05, sqrt05, 0, 0)
    .multiply(math.matrix2(1, 2, -2, 1, 1, 2))
);
testEqual([0, 3], math.matrix2(2, 1, -1, 2, -1, 0).transform(1, 1));
testEqual([-2, 3], math.matrix2.makeScale(3, [1, 0]).transform([0, 1]));
testEqual([-1, 2], math.matrix2.makeScale(3, [0.5, 0.5]).transform([0, 1]));
testEqual([1, 1], math.matrix2.makeScale(0.5, [1, 1]).transform([1, 1]));
testEqual([0.75, 0.75], math.matrix2.makeScale(0.5, [0.5, 0.5]).transform([1, 1]));

/**
 * lines, rays, segments
 */

testName("line ray segment intersections");
testEqual([5, 5], math.line(0, 0, 1, 1).intersect(math.line(10, 0, -1, 1)));
testEqual([5, 5], math.line(0, 0, 1, 1).intersect(math.ray(10, 0, -1, 1)));
testEqual([5, 5], math.line(0, 0, 1, 1).intersect(math.segment(10, 0, 0, 10)));

testName("line ray segment parallel");
testEqual(true, math.line(0, 0, 1, 1).isParallel(math.ray(10, 0, 1, 1)));
testEqual(true, math.line(0, 0, -1, 1).isParallel(math.segment(0, 0, -2, 2)));
testEqual(false, math.line(0, 0, -1, 1).isParallel(math.segment(10, 0, 1, 1)));

testName("line ray segment reflection matrices");
testEqual(
  math.line(10, 0, -1, 1).reflection(),
  math.ray(10, 0, -1, 1).reflection()
);
testEqual(
  math.segment(10, 0, 0, 10).reflection(),
  math.ray(10, 0, -1, 1).reflection()
);

testName("line ray segment nearest points");
testEqual([20, -10], math.line(10, 0, -1, 1).nearestPoint([20, -10]));
testEqual([-50, 60], math.line(10, 0, -1, 1).nearestPoint([-10, 100]));
testEqual([10, 0], math.ray(10, 0, -1, 1).nearestPoint([20, -10]));
testEqual([-50, 60], math.ray(10, 0, -1, 1).nearestPoint([-10, 100]));
testEqual([10, 0], math.segment(10, 0, 0, 10).nearestPoint([20, -10]));
testEqual([0, 10], math.segment(10, 0, 0, 10).nearestPoint([-10, 100]));
testEqual(
  math.ray(10, 0, -1, 1).nearestPoint([0, 0]),
  math.line(10, 0, -1, 1).nearestPoint([0, 0])
);
testEqual(
  math.segment(10, 0, 0, 10).nearestPoint([0, 0]),
  math.ray(10, 0, -1, 1).nearestPoint([0, 0])
);

/**
 * polygons
 */

testName("circle");
testEqual(5, math.circle(1, 2, 5).radius);
testEqual([1, 2], math.circle(1, 2, 5).origin);
testEqual(
  [[0.5, Math.sqrt(3) / 2], [0.5, -Math.sqrt(3) / 2]],
  math.circle(0, 0, 1).intersectionLine(math.line(0.5, 0, 0, 1))
);
// todo, this needs to be written
// testEqual(
//   [Math.sqrt(2) / 2, -Math.sqrt(2) / 2],
//   math.circle(0, 0, 1).intersectionRay(math.ray(0, 0, 0.1, 0.1))
// );
// testEqual(
//   [Math.sqrt(2) / 2, -Math.sqrt(2) / 2],
//   math.circle(0, 0, 1).intersectionEdge(math.segment(0, 0, 10, 10))
// );


testName("polygon");
testEqual(
  math.polygon.regularPolygon(4).clipLine(math.line(0.5, 0.5, 6, -11)),
  math.convexPolygon.regularPolygon(4).clipLine(math.line(0.5, 0.5, 6, -11))
);
testEqual([[-1, 0.5], [1, 0.5]],
  math.polygon.regularPolygon(4).clipLine(math.line(0.5, 0.5, 1, 0)));
testEqual([[1, 0], [0, 1.87], [-1, 0]], math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).points);

// testEqual(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).sides);
// testEqual(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).split);
// testEqual(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).overlaps);
// testEqual(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).scale);
// testEqual(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).rotate);

// clipEdge
// clipLine
// clipRay

testName("prototype member variables accessing 'this'");
testEqual(4, math.polygon.regularPolygon(4).edges.length);
testEqual(4, math.polygon.regularPolygon(4).area());

/**
 * junctions, sectors, interior angles
 */

testName("interior angles");
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

testName("counter-clockwise vector sorting");
testEqual(
  [0, 1, 2, 3],
  math.core.counter_clockwise_vector_order([1, 1], [-1, 1], [-1, -1], [1, -1])
);
testEqual(
  [0, 3, 2, 1],
  math.core.counter_clockwise_vector_order([1, -1], [-1, -1], [-1, 1], [1, 1])
);

testName("sectors");
testEqual(Math.PI / 2, math.sector.fromVectors([1, 0], [0, 1]).angle);
testEqual(true, math.sector.fromVectors([1, 0], [0, 1]).contains([1, 1]));
testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, 1]));
testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, -1]));
testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([1, -1]));

testName("junctions");
testEqual([[1, 1], [1, -1], [-1, 1], [-1, -1]],
  math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectors);
testEqual([0, 2, 3, 1],
  math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectorOrder);
testEqual([Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
  math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).angles());

testName("nearest point");
testEqual([5, 5], math.core.nearest_point2([10, 0],
  [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9]]));
testEqual([6, 6, 0], math.core.nearest_point([10, 0, 0],
  [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 1],
    [5, 5, 10], [6, 6, 0], [7, 7, 0], [8, 8, 0], [9, 9, 0]]));

if (failedTests.length) {
  console.log(`${bar}\nFailed tests and arguments\n`);
  failedTests.forEach(test => console.log(`${test.message}\n${test.args}\n${bar}`));
  throw new Error("tests failed");
} else {
  console.log(`${bar}\nall tests pass\n${bar}\n`);
}

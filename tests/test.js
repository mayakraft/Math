// isomorphic
var window;
const math = (window !== undefined) ? window.math : require("../math");

const bar = "============================================================";
// globals keep track of tests for more information during a fail
let name = "beginning of tests";
let testNumber = 0;

const testName = function (newName) {
  name = newName;
  testNumber = 0;
};
/**
 * test equal runs the equivalent() function which incorporates an epsilon
 * such that the test "1e-8 is equivalent to 0" will come back true
 */
const testEqual = function (...args) {
  if (!math.core.equivalent(...args)) {
    console.log(`${bar}\ntest failed. #${testNumber} of ${name}\n${bar}`);
    throw args;
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

testName("get matrix");
testEqual([1, 2, 3, 4, 5, 6], math.core.get_matrix2([[[1, 2, 3, 4, 5, 6]]]));
testEqual([1, 2, 3, 4, 0, 0], math.core.get_matrix2([[1, 2, 3, 4]]));
testEqual([1, 2, 3, 1, 0, 0], math.core.get_matrix2(1, 2, 3));

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
 * lines, rays, edges
 */

testName("line ray edge intersections");
testEqual([5, 5], math.line(0, 0, 1, 1).intersect(math.line(10, 0, -1, 1)));
testEqual([5, 5], math.line(0, 0, 1, 1).intersect(math.ray(10, 0, -1, 1)));
testEqual([5, 5], math.line(0, 0, 1, 1).intersect(math.edge(10, 0, 0, 10)));

testName("line ray edge parallel");
testEqual(true, math.line(0, 0, 1, 1).isParallel(math.ray(10, 0, 1, 1)));
testEqual(true, math.line(0, 0, -1, 1).isParallel(math.edge(0, 0, -2, 2)));
testEqual(false, math.line(0, 0, -1, 1).isParallel(math.edge(10, 0, 1, 1)));

testName("line ray edge reflection matrices");
testEqual(
  math.line(10, 0, -1, 1).reflection().m,
  math.ray(10, 0, -1, 1).reflection().m
);
testEqual(
  math.edge(10, 0, 0, 10).reflection().m,
  math.ray(10, 0, -1, 1).reflection().m
);

testName("line ray edge nearest points");
testEqual([20, -10], math.line(10, 0, -1, 1).nearestPoint([20, -10]));
testEqual([-50, 60], math.line(10, 0, -1, 1).nearestPoint([-10, 100]));
testEqual([10, 0], math.ray(10, 0, -1, 1).nearestPoint([20, -10]));
testEqual([-50, 60], math.ray(10, 0, -1, 1).nearestPoint([-10, 100]));
testEqual([10, 0], math.edge(10, 0, 0, 10).nearestPoint([20, -10]));
testEqual([0, 10], math.edge(10, 0, 0, 10).nearestPoint([-10, 100]));
testEqual(
  math.ray(10, 0, -1, 1).nearestPoint([0, 0]),
  math.line(10, 0, -1, 1).nearestPoint([0, 0])
);
testEqual(
  math.edge(10, 0, 0, 10).nearestPoint([0, 0]),
  math.ray(10, 0, -1, 1).nearestPoint([0, 0])
);

testName("circle");
testEqual(
  [[0.5, Math.sqrt(3) / 2], [0.5, -Math.sqrt(3) / 2]],
  math.circle(0, 0, 1).intersectionLine(math.line(0.5, 0, 0, 1)),
);

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

console.log(`${bar}\nall tests pass\n${bar}`);

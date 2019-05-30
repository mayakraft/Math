// isomorphic
var window;
const math = (window !== undefined)
  ? window.math
  : require("../math");

/**
 * test equal runs the equivalent() function which incorporates an epsilon
 * such that the test "1e-8 is equivalent to 0" will come back true
 */

let name = "beginning of tests";

const testEqual = function (...args) {
  if (!math.core.equivalent(...args)) {
    console.log(`tests failed at ${name}`);
    throw args;
  }
};

// const testEqualVectors = function (...args) {
//   if (!math.core.equivalent_vectors(...args)) {
//     console.log(`tests failed at ${name}`);
//     throw args;
//   }
// };

name = "equivalent function";
testEqual(true, math.core.equivalent(4, 4, 4));
testEqual(false, math.core.equivalent(4, 4, 5));
testEqual(true, math.core.equivalent([0], [0], [0]));
testEqual(false, math.core.equivalent([0], [0, 0], [0]));
testEqual(false, math.core.equivalent([0], [0], [1]));
testEqual(false, math.core.equivalent([1], [0], [1]));
testEqual(true, math.core.equivalent([1], [1], [1]));
testEqual(false, math.core.equivalent([1], [1, 0], [1]));
testEqual(true, math.core.equivalent(true, true, true, true));
testEqual(true, math.core.equivalent(false, false, false, false));
testEqual(false, math.core.equivalent(false, false, false, true));

name = "equivalent numbers";
testEqual(true, math.core.equivalent_numbers([[[1, 1, 1, 1, 1]]]));
testEqual(false, math.core.equivalent_numbers([[[1, 1, 1, 1, 1, 4]]]));
testEqual(false, math.core.equivalent_numbers([1, 1, 1, 1, 1, 1], [1, 2]));

name = "average function";
testEqual([3.75, 4.75],
  math.core.average([4, 1], [5, 6], [4, 6], [2, 6]));
testEqual([4, 5, 3],
  math.core.average([1, 2, 3], [4, 5, 6], [7, 8]));
testEqual([4, 5, 6],
  math.core.average([1, 2, 3], [4, 5, 6], [7, 8, 9]));

name = "get vector";
testEqual([1, 2, 3, 4], math.core.get_vector([[[1, 2, 3, 4]]]));
testEqual([1, 2, 3, 4], math.core.get_vector(1, 2, 3, 4));
testEqual([1, 2, 3, 4], math.core.get_vector([1, 2, 3, 4], [2, 4]));
testEqual([1, 2, 3, 4], math.core.get_vector([1, 2, 3, 4], [6, 7], 6));
testEqual([1, 2, 3, 4], math.core.get_vector([1, 2, 3, 4], [6, 7], 6, 2, 4, 5));

name = "get matrix";
testEqual([1, 0, 0, 1, 5, 6], math.core.get_matrix2([[[1, 0, 0, 1, 5, 6]]]));
testEqual([1, 0, 0, 1, 5, 6], math.core.get_matrix2([[1, 0, 0, 1, 5, 6]]));
testEqual([1, 0, 0, 1, 5, 6], math.core.get_matrix2(1, 0, 0, 1, 5, 6));

name = "vector lerp";
testEqual([15.5, 3.5, 3], math.Vector(30, 5, 3).lerp([1, 2, 3], 0.5));

name = "vector normalize, scale";
testEqual([Math.sqrt(2), Math.sqrt(2)],
  math.Vector(10, 10).normalize().scale(2));

name = "vector dot";
testEqual(0, math.Vector(2, 1).normalize().dot(math.Vector(1, -2).normalize()));
testEqual(1, math.Vector(2, 1).normalize().dot(math.Vector(4, 2).normalize()));

name = "vector cross";
testEqual([0, 0, -5], math.Vector(2, 1).cross(math.Vector(1, -2)));

name = "vector parallel";
testEqual(true, math.Vector(3, 4).isParallel(math.Vector(-6, -8)));
name = "lines parallel";
testEqual(true, math.Line(100, 101, 3, 4).isParallel(math.Line(5, 5, -6, -8)));

name = "line ray edge intersections";
testEqual([5, 5], math.Line(0, 0, 1, 1).intersect(math.Line(10, 0, -1, 1)));
testEqual([5, 5], math.Line(0, 0, 1, 1).intersect(math.Ray(10, 0, -1, 1)));
testEqual([5, 5], math.Line(0, 0, 1, 1).intersect(math.Edge(10, 0, 0, 10)));

name = "line ray edge parallel";
testEqual(true, math.Line(0, 0, 1, 1).isParallel(math.Ray(10, 0, 1, 1)));
testEqual(true, math.Line(0, 0, -1, 1).isParallel(math.Edge(0, 0, -2, 2)));
testEqual(false, math.Line(0, 0, -1, 1).isParallel(math.Edge(10, 0, 1, 1)));

name = "line ray edge reflection matrices";
testEqual(
  math.Line(10, 0, -1, 1).reflection().m,
  math.Ray(10, 0, -1, 1).reflection().m,
);
testEqual(
  math.Edge(10, 0, 0, 10).reflection().m,
  math.Ray(10, 0, -1, 1).reflection().m,
);

name = "line ray edge nearest points";
testEqual([20, -10], math.Line(10, 0, -1, 1).nearestPoint([20, -10]));
testEqual([-50, 60], math.Line(10, 0, -1, 1).nearestPoint([-10, 100]));
testEqual([10, 0], math.Ray(10, 0, -1, 1).nearestPoint([20, -10]));
testEqual([-50, 60], math.Ray(10, 0, -1, 1).nearestPoint([-10, 100]));
testEqual([10, 0], math.Edge(10, 0, 0, 10).nearestPoint([20, -10]));
testEqual([0, 10], math.Edge(10, 0, 0, 10).nearestPoint([-10, 100]));
testEqual(
  math.Ray(10, 0, -1, 1).nearestPoint([0, 0]),
  math.Line(10, 0, -1, 1).nearestPoint([0, 0]),
);
testEqual(
  math.Edge(10, 0, 0, 10).nearestPoint([0, 0]),
  math.Ray(10, 0, -1, 1).nearestPoint([0, 0]),
);

// name = "circle";
// testEqualVectors(
//   [[0.5, Math.sqrt(3) / 2], [0.5, -Math.sqrt(3) / 2]],
//   math.Circle(0, 0, 1).intersectionLine(math.Line(0.5, 0, 0, 1)),
// );

// name = "polygon";
// testEqual(
//   math.Polygon.regularPolygon(4).clipLine(math.Line(10, 0, -1, 1)),
//   math.ConvexPolygon.regularPolygon(4).clipLine(math.Line(10, 0, -1, 1)),
// );

name = "prototype member variables accessing 'this'";
testEqual(4, math.Polygon.regularPolygon(4).edges.length);
testEqual(4, math.Polygon.regularPolygon(4).area());

console.log("all tests pass");

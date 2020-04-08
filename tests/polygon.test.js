const math = require("../math");

const testEqual = function (...args) {
  expect(math.core.equivalent(...args)).toBe(true);
};


/**
 * polygons
 */
test("polygon", () => {
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
});

// clipEdge
// clipLine
// clipRay

test("prototype member variables accessing 'this'", () => {
  testEqual(4, math.polygon.regularPolygon(4).edges.length);
  testEqual(4, math.polygon.regularPolygon(4).area());
});

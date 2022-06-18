const math = require("../math");

test("overlap method", () => {
  const polygon = math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
  const circle = math.circle(1);
  const line = math.line([1, 2], [0.5, 0]);
  const ray = math.ray([-1, 2], [0.5, -0.1]);
  const segment = math.segment([-2, 0.5], [2, 0.5]);
  const vector = math.vector(0.75, 0.5);

  const polygon2 = math.polygon([0, -1.15], [1, 0.577], [-1, 0.577]);
  const circle2 = math.circle(1, [0.5, 0]);
  const line2 = math.line([-1, 2], [0.5, 0]);
  const ray2 = math.ray([1, 2], [-0.5, 0]);
  const segment2 = math.segment([0.5, -2], [0.5, 2]);
  const vector2 = math.vector(0, 1);
  const vector3 = math.vector(0, 1, 0);

  [
    polygon.overlap(polygon2),
    // polygon.overlap(circle),
    // polygon.overlap(line),
    // polygon.overlap(ray),
    // polygon.overlap(segment),
    polygon.overlap(vector2),
    // circle.overlap(polygon),
    // circle.overlap(circle2),
    // circle.overlap(line),
    // circle.overlap(ray),
    // circle.overlap(segment),
    circle.overlap(vector),
    // line.overlap(polygon),
    // line.overlap(circle),
    line.overlap(line2),
    line.overlap(ray),
    line.overlap(segment),
    line.overlap(vector),
    // ray.overlap(polygon),
    // ray.overlap(circle),
    ray.overlap(line),
    ray.overlap(ray2),
    ray.overlap(segment),
    ray2.overlap(vector2),
    // segment.overlap(polygon),
    // segment.overlap(circle),
    segment.overlap(line),
    segment.overlap(ray),
    segment.overlap(segment2),
    segment.overlap(vector),
    vector2.overlap(polygon),
    vector.overlap(circle),
    vector.overlap(line),
    vector2.overlap(ray2),
    vector.overlap(segment),
    vector2.overlap(vector3),
  ].forEach(overlap => expect(overlap).toBe(true));
});


test("point on line", () => {
  expect(math.core.overlapLinePoint([5, 5], [0, 0], [2, 2])).toBe(true);
  expect(math.core.overlapLinePoint([1, 1], [0, 0], [2, 2])).toBe(true);
  expect(math.core.overlapLinePoint([2, 2], [0, 0], [2.1, 2.1])).toBe(true);
  expect(math.core.overlapLinePoint([2, 2], [0, 0], [2.000000001, 2.000000001])).toBe(true);
  expect(math.core.overlapLinePoint([2, 2], [0, 0], [-1, -1])).toBe(true);

  expect(math.core.overlapLinePoint(
    [5, 5], [0, 0], [2, 2], math.core.includeR)).toBe(true);
  expect(math.core.overlapLinePoint(
    [1, 1], [0, 0], [2, 2], math.core.includeR)).toBe(true);
  expect(math.core.overlapLinePoint(
    [2, 2], [0, 0], [2.1, 2.1], math.core.includeR)).toBe(true);
  expect(math.core.overlapLinePoint(
    [2, 2], [0, 0], [2.000000001, 2.000000001], math.core.includeR)).toBe(true);
  expect(math.core.overlapLinePoint(
    [-1, -1], [0, 0], [2, 2], math.core.includeR)).toBe(false);
  expect(math.core.overlapLinePoint(
    [1, 1], [0, 0], [-0.1, -0.1], math.core.includeR)).toBe(false);
  expect(math.core.overlapLinePoint(
    [1, 1], [0, 0], [-0.000000001, -0.000000001], math.core.includeR)).toBe(true);
  expect(math.core.overlapLinePoint(
    [1, 1], [0, 0], [-0.000000001, -0.000000001], math.core.excludeR)).toBe(false);

  expect(math.core.overlapLinePoint(
    [5, 5], [0, 0], [2, 2], math.core.includeS)).toBe(true);
  expect(math.core.overlapLinePoint(
    [1, 1], [0, 0], [2, 2], math.core.includeS)).toBe(false);
  expect(math.core.overlapLinePoint(
    [2, 2], [0, 0], [2.1, 2.1], math.core.includeS)).toBe(false);
  expect(math.core.overlapLinePoint(
    [2, 2], [0, 0], [2.000000001, 2.000000001], math.core.includeS)).toBe(true);
  expect(math.core.overlapLinePoint(
    [-1, -1], [0, 0], [2, 2], math.core.includeS)).toBe(false);
  expect(math.core.overlapLinePoint(
    [2, 2], [0, 0], [2.000000001, 2.000000001], math.core.excludeS)).toBe(false);
});

test("overlap.point_on_segment_inclusive", () => {
  expect(math.core.overlapLinePoint(
    [3, 0], [3, 3], [4, 3], math.core.includeS
  )).toBe(true);
  expect(math.core.overlapLinePoint(
    [3, 0], [3, 3], [3, 3], math.core.includeS
  )).toBe(true);
  expect(math.core.overlapLinePoint(
    [3, 0], [3, 3], [2.9, 3], math.core.includeS
  )).toBe(false);
  expect(math.core.overlapLinePoint(
    [3, 0], [3, 3], [2.9999999999, 3], math.core.includeS
  )).toBe(true);
  expect(math.core.overlapLinePoint(
    [3, 0], [3, 3], [6.1, 3], math.core.includeS
  )).toBe(false);
  expect(math.core.overlapLinePoint(
    [3, 0], [3, 3], [6.0000000001, 3], math.core.includeS
  )).toBe(true);

  expect(math.core.overlapLinePoint(
    [2, 2], [2, 2], [3.5, 3.5], math.core.includeS
  )).toBe(true);
  expect(math.core.overlapLinePoint(
    [2, 2], [2, 2], [2.9, 3.1], math.core.includeS
  )).toBe(false);
  expect(math.core.overlapLinePoint(
    [2, 2], [2, 2], [2.99999999, 3.000000001], math.core.includeS
  )).toBe(true);
  // degenerate edge returns false
  expect(math.core.overlapLinePoint(
    [0, 0], [2, 2], [2, 2], math.core.includeS
  )).toBe(false);
  expect(math.core.overlapLinePoint(
    [0, 0], [2, 2], [2.1, 2.1], math.core.includeS
  )).toBe(false);
  expect(math.core.overlapLinePoint(
    [0, 0], [2, 2], [2.000000001, 2.00000001], math.core.includeS
  )).toBe(false);
});


test("point on line epsilon", () => {

});

test("point in poly", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  expect(math.core.overlapConvexPolygonPoint(poly, [0.0, 0.0])).toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.999, 0.0])).toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.9999999999, 0.0])).toBe(false);
  // edge collinear
  expect(math.core.overlapConvexPolygonPoint(poly, [0.5, 0.5])).toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.49, 0.49])).toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.51, 0.51])).toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.500000001, 0.500000001])).toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.5, -0.5])).toBe(false);
  // expect(math.core.overlapConvexPolygonPoint(poly, [-0.5, 0.5])).toBe(false);
  // expect(math.core.overlapConvexPolygonPoint(poly, [-0.5, -0.5])).toBe(false);
  // polygon points
  expect(math.core.overlapConvexPolygonPoint(poly, [1.0, 0.0])).toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.0, 1.0])).toBe(false);
  // expect(math.core.overlapConvexPolygonPoint(poly, [-1.0, 0.0])).toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.0, -1.0])).toBe(false);
});

test("convex point in poly inclusive", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  expect(math.core.overlapConvexPolygonPoint(poly, [0.0, 0.0], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.999, 0.0], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.9999999999, 0.0], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [1.1, 0.0], math.core.include))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [1.000000001, 0.0], math.core.include))
    .toBe(true);
  // edge collinear
  expect(math.core.overlapConvexPolygonPoint(poly, [0.5, 0.5], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.49, 0.49], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.499999999, 0.499999999], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.51, 0.51], math.core.include))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.500000001, 0.500000001], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.5, -0.5], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [-0.5, 0.5], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [-0.5, -0.5], math.core.include))
    .toBe(true);
  // polygon points
  expect(math.core.overlapConvexPolygonPoint(poly, [1.0, 0.0], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.0, 1.0], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [-1.0, 0.0], math.core.include))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.0, -1.0], math.core.include))
    .toBe(true);
});

test("convex point in poly exclusive", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  expect(math.core.overlapConvexPolygonPoint(poly, [0.0, 0.0], math.core.exclude))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.999, 0.0], math.core.exclude))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.9999999999, 0.0], math.core.exclude))
    .toBe(false);
  // edge collinear
  expect(math.core.overlapConvexPolygonPoint(poly, [0.5, 0.5], math.core.exclude))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.49, 0.49], math.core.exclude))
    .toBe(true);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.499999999, 0.499999999], math.core.exclude))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.51, 0.51], math.core.exclude))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.5, -0.5], math.core.exclude))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [-0.5, 0.5], math.core.exclude))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [-0.5, -0.5], math.core.exclude))
    .toBe(false);
  // polygon points
  expect(math.core.overlapConvexPolygonPoint(poly, [1.0, 0.0], math.core.exclude))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.0, 1.0], math.core.exclude))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [-1.0, 0.0], math.core.exclude))
    .toBe(false);
  expect(math.core.overlapConvexPolygonPoint(poly, [0.0, -1.0], math.core.exclude))
    .toBe(false);
});

test("overlap lines", () => {
  const aV = [2, 3];
  const aP = [-1, 1];
  const bV = [-3, 2];
  const bP = [5, 0];

  const a0 = [-1, 1];
  const a1 = [1, 4];
  const b0 = [5, 0];
  const b1 = [2, 2];

  expect(math.core.overlapLineLine(aV, aP, bV, bP, math.core.includeL, math.core.includeL)).toBe(true);
  expect(math.core.overlapLineLine(aV, aP, bV, bP, math.core.includeL, math.core.includeR)).toBe(true);
  expect(math.core.overlapLineLine(aV, aP, math.core.subtract(b1, b0), b0, math.core.includeL, math.core.includeS)).toBe(false);
  expect(math.core.overlapLineLine(aV, aP, bV, bP, math.core.includeR, math.core.includeR)).toBe(true);
  expect(math.core.overlapLineLine(aV, aP, math.core.subtract(b1, b0), b0, math.core.includeR, math.core.includeS)).toBe(false);
  expect(math.core.overlapLineLine(math.core.subtract(a1, a0), a0, math.core.subtract(b1, b0), b0, math.core.includeS, math.core.includeS)).toBe(false);
  expect(math.core.overlapLineLine(aV, aP, bV, bP, math.core.excludeL, math.core.excludeL)).toBe(true);
  expect(math.core.overlapLineLine(aV, aP, bV, bP, math.core.excludeL, math.core.excludeR)).toBe(true);
  expect(math.core.overlapLineLine(aV, aP, math.core.subtract(b1, b0), b0, math.core.excludeL, math.core.excludeS)).toBe(false);
  expect(math.core.overlapLineLine(aV, aP, bV, bP, math.core.excludeR, math.core.excludeR)).toBe(true);
  expect(math.core.overlapLineLine(aV, aP, math.core.subtract(b1, b0), b0, math.core.excludeR, math.core.excludeS)).toBe(false);
  expect(math.core.overlapLineLine(math.core.subtract(a1, a0), a0, math.core.subtract(b1, b0), b0, math.core.excludeS, math.core.excludeS)).toBe(false);
});
// if we choose to bring back exclusive / inclusive polygon overlap
// test("convex polygons overlap with point inside each other", () => {
// 	const poly1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
// 	const polyA = [[0.5, 0.5], [10, 10], [10, 0]];
// 	const polyB = [[-10, -10], [10, -10], [10, 10], [-10, 10]];
// 	expect(math.core.overlapConvexPolygons(poly1, polyA, math.core.includeS, math.core.include)).toBe(true);
// 	expect(math.core.overlapConvexPolygons(poly1, polyB, math.core.includeS, math.core.include)).toBe(true);
// 	expect(math.core.overlapConvexPolygons(polyA, poly1, math.core.includeS, math.core.include)).toBe(true);
// 	expect(math.core.overlapConvexPolygons(polyB, poly1, math.core.includeS, math.core.include)).toBe(true);
// });

// test("convex polygons overlap", () => {
//   const poly1 = [[1,0], [0,1], [-1,0]];  // top
//   const poly2 = [[0,1], [-1,0], [0,-1]]; // left
//   const poly3 = [[1,0], [0,1], [0,-1]];  // right
//   // inclusive
//   expect(math.core.overlapConvexPolygons(poly1, poly2, math.core.includeS, math.core.include)).toBe(true);
//   expect(math.core.overlapConvexPolygons(poly2, poly3, math.core.includeS, math.core.include)).toBe(true);
//   expect(math.core.overlapConvexPolygons(poly1, poly3, math.core.includeS, math.core.include)).toBe(true);
//   // exclusive
//   expect(math.core.overlapConvexPolygons(poly1, poly2, math.core.excludeS, math.core.exclude)).toBe(true);
//   expect(math.core.overlapConvexPolygons(poly2, poly3, math.core.excludeS, math.core.exclude)).toBe(false);
//   expect(math.core.overlapConvexPolygons(poly1, poly3, math.core.excludeS, math.core.exclude)).toBe(true);
// });
// until then, exclusive only
test("convex polygons overlap", () => {
  const poly1 = [[1,0], [0,1], [-1,0]];  // top
  const poly2 = [[0,1], [-1,0], [0,-1]]; // left
  const poly3 = [[1,0], [0,1], [0,-1]];  // right
  // exclusive
  expect(math.core.overlapConvexPolygons(poly1, poly2)).toBe(true);
  expect(math.core.overlapConvexPolygons(poly2, poly3)).toBe(false);
  expect(math.core.overlapConvexPolygons(poly1, poly3)).toBe(true);
});

test("encloseConvexPolygonsInclusive", () => {
  const poly1 = [[1,0], [0,1], [-1,0], [0,-1]];
  const poly2 = [[10,0], [0,10], [-10,0], [0,-10]];
  const poly3 = [[8,8], [-8,8], [-8,-8], [8,-8]];
  expect(math.core.encloseConvexPolygonsInclusive(poly2, poly1)).toBe(true);
  expect(math.core.encloseConvexPolygonsInclusive(poly3, poly1)).toBe(true);
  // todo, this should be false i think
  // expect(math.core.encloseConvexPolygonsInclusive(poly2, poly3)).toBe(false);
  expect(math.core.encloseConvexPolygonsInclusive(poly1, poly2)).toBe(false);
  expect(math.core.encloseConvexPolygonsInclusive(poly1, poly3)).toBe(false);
});


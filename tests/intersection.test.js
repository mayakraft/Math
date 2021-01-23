const math = require("../math");

test("intersections", () => {
  const polygon = math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
  const circle = math.circle(1);
  const line = math.line([1, 2], [0.5, 0]);
  const ray = math.ray([-1, 2], [0.5, -0.1]);
  const segment = math.segment([-2, 0.5], [2, 0.5]);

  const polygon2 = math.polygon([0, -1.15], [1, 0.577], [-1, 0.577]);
  const circle2 = math.circle(1, [0.5, 0]);
  const line2 = math.line([-1, 2], [0.5, 0]);
  const ray2 = math.ray([1, 2], [-0.5, 0]);
  const segment2 = math.segment([0.5, -2], [0.5, 2]);

  [
    // polygon.intersect(polygon2),
    // polygon.intersect(circle),
    polygon.intersect(line),
    polygon.intersect(ray),
    polygon.intersect(segment),
    // circle.intersect(polygon),
    circle.intersect(circle2),
    circle.intersect(line),
    circle.intersect(ray),
    circle.intersect(segment),
    line.intersect(polygon),
    line.intersect(circle),
    line.intersect(line2),
    line.intersect(ray),
    line.intersect(segment),
    ray.intersect(polygon),
    ray.intersect(circle),
    ray.intersect(line),
    ray.intersect(ray2),
    ray.intersect(segment),
    segment.intersect(polygon),
    segment.intersect(circle),
    segment.intersect(line),
    segment.intersect(ray),
    segment.intersect(segment2),
  ].forEach(intersect => expect(intersect).not.toBe(undefined));
});


test("intersect_line_line include exclude", () => {
  const res0 = math.core
    .intersect_line_line([0, 1], [1, 0], [1, 0], [0, 1]);
  const res1 = math.core
    .intersect_line_line([0, 1], [1, 0], [1, 0], [0, 1], math.core.include_s, math.core.include_s);
  const res2 = math.core
    .intersect_line_line([0, 1], [1, 0], [1, 0], [0, 1], math.core.exclude_s, math.core.exclude_s);
  expect(res0).not.toBe(undefined);
  expect(res1).not.toBe(undefined);
  expect(res2).toBe(undefined);
});

test("intersect_convex_polygon_line include exclude vertex aligned", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  // two lines, vertex aligned
  const res0 = math.core.intersect_convex_polygon_line(poly, [0,1], [1,-5],
      math.core.include_s, math.core.include_l);
  const res1 = math.core.intersect_convex_polygon_line(poly, [0,1], [1,-5],
      math.core.exclude_s, math.core.exclude_l);
  // two segements endpoint on vertex
  const res2 = math.core.intersect_convex_polygon_line(poly, [0,1], [1,-1],
      math.core.include_s, math.core.include_s);
  const res3 = math.core.intersect_convex_polygon_line(poly, [0,1], [1,-1],
      math.core.include_s, math.core.exclude_s);
  const res4 = math.core.intersect_convex_polygon_line(poly, [0,1], [1,-1],
      math.core.exclude_s, math.core.include_s);
  const res5 = math.core.intersect_convex_polygon_line(poly, [0,1], [1,-1],
      math.core.exclude_s, math.core.exclude_s);
  // line works if polygon is inclusive
  expect(res0).not.toBe(undefined);
  expect(res1).toBe(undefined);
  // segment vertex aligned works only if both are inclusive
  // if either or both are exclusive, does not intersect
  expect(res2).not.toBe(undefined);
  expect(res3).toBe(undefined);
  expect(res4).toBe(undefined);
  expect(res5).toBe(undefined);
});

test("intersect_convex_polygon_line include exclude edge aligned", () => {
  const poly = [[0,0], [1,0], [1,1], [0,1]];
  const res0 = math.core.intersect_convex_polygon_line(poly, [0,1], [1,-5],
      math.core.include_s, math.core.exclude_l);
  const res1 = math.core.intersect_convex_polygon_line(poly, [0,1], [1,-5],
      math.core.exclude_s, math.core.exclude_l);
  expect(res0).not.toBe(undefined);
  expect(res1).toBe(undefined);
});

const convex_poly_line_inclusive = (poly, vec, org, ep) =>
  math.core.intersect_convex_polygon_line(poly, vec, org, math.core.include_s, math.core.include_l, ep);
const convex_poly_ray_inclusive = (poly, vec, org, ep) =>
  math.core.intersect_convex_polygon_line(poly, vec, org, math.core.include_s, math.core.include_r, ep);
const convex_poly_segment_inclusive = (poly, pt0, pt1, ep) =>
  math.core.intersect_convex_polygon_line(poly, math.core.subtract(pt1, pt0), pt0, math.core.include_s, math.core.include_s, ep);

const convex_poly_line_exclusive = (poly, vec, org, ep) =>
  math.core.intersect_convex_polygon_line(poly, vec, org, math.core.exclude_s, math.core.exclude_l, ep);
const convex_poly_ray_exclusive = (poly, vec, org, ep) =>
  math.core.intersect_convex_polygon_line(poly, vec, org, math.core.exclude_s, math.core.exclude_r, ep);
const convex_poly_segment_exclusive = (poly, pt0, pt1, ep) =>
  math.core.intersect_convex_polygon_line(poly, math.core.subtract(pt1, pt0), pt0, math.core.exclude_s, math.core.exclude_s, ep);

test("core polygon intersection lines", () => {
  const poly = [[0,0], [1,0], [0.5, 0.866]];
  const vector = [1, 1];
  const point = [0.5, 0.866 / 2];
  const segmentA = [...point];
  const segmentB = [point[0] + 4, point[1] + 4];

  expect(convex_poly_line_exclusive(poly, vector, point).length)
    .toBe(2);
  expect(convex_poly_ray_inclusive(poly, vector, point).length)
    .toBe(1);
  expect(convex_poly_ray_exclusive(poly, vector, point).length)
    .toBe(1);
  expect(convex_poly_segment_inclusive(poly, segmentA, segmentB).length)
    .toBe(1);
  expect(convex_poly_segment_exclusive(poly, segmentA, segmentB).length)
    .toBe(1);
});

test("core polygon intersection lines, collinear to edge", () => {
  const poly = [[0,0], [1,0], [0.5, 0.866]];
  const vector = [1, 0];
  const point = [-5, 0];
  const segmentA = [0, 0];
  const segmentB = [1, 0];

  expect(convex_poly_line_inclusive(poly, vector, point).length)
    .toBe(2);
  expect(convex_poly_line_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(convex_poly_ray_inclusive(poly, vector, point).length)
    .toBe(2);
  expect(convex_poly_ray_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(convex_poly_segment_inclusive(poly, segmentA, segmentB).length)
    .toBe(2);
  expect(convex_poly_segment_exclusive(poly, segmentA, segmentB))
    .toBe(undefined);
});

test("core polygon intersection lines, collinear to vertex", () => {
  const poly = [[0,0], [1,0], [0.5, 0.866]];
  const vector = [1, 0];
  const point = [-5, 0.866];
  const segmentA = [0, 0.866];
  const segmentB = [1, 0.866];

  expect(convex_poly_line_inclusive(poly, vector, point).length)
    .toBe(1);
  expect(convex_poly_line_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(convex_poly_ray_inclusive(poly, vector, point).length)
    .toBe(1);
  expect(convex_poly_ray_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(convex_poly_segment_inclusive(poly, segmentA, segmentB).length)
    .toBe(1);
  expect(convex_poly_segment_exclusive(poly, segmentA, segmentB))
    .toBe(undefined);
});

test("core polygon intersection lines, collinear to polygon vertices", () => {
  const lineSeg = math.polygon.regularPolygon(4).intersect(math.line([1, 0]));
  expect(Math.abs(lineSeg[0][0])).toBeCloseTo(1);
  expect(lineSeg[0][1]).toBeCloseTo(0);
  expect(Math.abs(lineSeg[1][0])).toBeCloseTo(1);
  expect(lineSeg[1][1]).toBeCloseTo(0);

  const raySeg1 = math.polygon.regularPolygon(4).intersect(math.ray([1, 0]));
  expect(raySeg1.length).toBe(1);
  expect(Math.abs(raySeg1[0][0])).toBeCloseTo(1);
  expect(raySeg1[0][1]).toBeCloseTo(0);
  const raySeg2 = math.polygon.regularPolygon(4).intersect(math.ray([1, 0], [-10, 0]));
  expect(raySeg2.length).toBe(2);
  expect(Math.abs(raySeg2[0][0])).toBeCloseTo(1);
  expect(raySeg2[0][1]).toBeCloseTo(0);
  expect(Math.abs(raySeg2[1][0])).toBeCloseTo(1);
  expect(raySeg2[1][1]).toBeCloseTo(0);
  const raySeg3 = math.polygon.regularPolygon(4).intersect(math.ray([1, 0], [10, 0]));
  expect(raySeg3).toBe(undefined);
});

test("core polygon intersection lines, no intersections", () => {
  const poly = [[0,0], [1,0], [0.5, 0.866]];
  const vector = [1, 0];
  const point = [-5, 10];
  const segmentA = [0, 10];
  const segmentB = [1, 10];

  expect(convex_poly_line_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(convex_poly_ray_inclusive(poly, vector, point))
    .toBe(undefined);
  expect(convex_poly_ray_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(convex_poly_segment_inclusive(poly, segmentA, segmentB))
    .toBe(undefined);
  expect(convex_poly_segment_exclusive(poly, segmentA, segmentB))
    .toBe(undefined);
});

// test("core polygon intersection circle", () => {
//   convex_poly_circle(poly, center, radius)  
// });

test("collinear line intersections", () => {
  const intersect = math.core.intersect_line_line;
  [
    // INCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.include_l, math.core.include_l),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      math.core.include_l, math.core.include_l),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.include_l, math.core.include_l),
    // INCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      math.core.include_l, math.core.include_l),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      math.core.include_l, math.core.include_l),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      math.core.include_l, math.core.include_l),
    // INCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      math.core.include_l, math.core.include_l),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      math.core.include_l, math.core.include_l),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      math.core.include_l, math.core.include_l),
    // EXCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.exclude_l, math.core.exclude_l),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      math.core.exclude_l, math.core.exclude_l),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.exclude_l, math.core.exclude_l),
    // EXCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      math.core.exclude_l, math.core.exclude_l),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      math.core.exclude_l, math.core.exclude_l),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      math.core.exclude_l, math.core.exclude_l),
    // EXCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      math.core.exclude_l, math.core.exclude_l),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      math.core.exclude_l, math.core.exclude_l),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      math.core.exclude_l, math.core.exclude_l),
  ].forEach(res => expect(res).toBe(undefined));
});

test("collinear ray intersections", () => {
  const intersect = math.core.intersect_line_line;
  [
    // INCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.include_r, math.core.include_r),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      math.core.include_r, math.core.include_r),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.include_r, math.core.include_r),
    // INCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      math.core.include_r, math.core.include_r),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      math.core.include_r, math.core.include_r),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      math.core.include_r, math.core.include_r),
    // INCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      math.core.include_r, math.core.include_r),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      math.core.include_r, math.core.include_r),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      math.core.include_r, math.core.include_r),
    // EXCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.exclude_r, math.core.exclude_r),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      math.core.exclude_r, math.core.exclude_r),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.exclude_r, math.core.exclude_r),
    // EXCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      math.core.exclude_r, math.core.exclude_r),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      math.core.exclude_r, math.core.exclude_r),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      math.core.exclude_r, math.core.exclude_r),
    // EXCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      math.core.exclude_r, math.core.exclude_r),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      math.core.exclude_r, math.core.exclude_r),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      math.core.exclude_r, math.core.exclude_r),
  ].forEach(res => expect(res).toBe(undefined));
});

test("collinear segment intersections", () => {
  const intersect = math.core.intersect_line_line;
  [
    // INCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.include_s, math.core.include_s),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      math.core.include_s, math.core.include_s),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.include_s, math.core.include_s),
    // INCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      math.core.include_s, math.core.include_s),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      math.core.include_s, math.core.include_s),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      math.core.include_s, math.core.include_s),
    // INCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      math.core.include_s, math.core.include_s),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      math.core.include_s, math.core.include_s),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      math.core.include_s, math.core.include_s),
    // EXCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.exclude_s, math.core.exclude_s),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      math.core.exclude_s, math.core.exclude_s),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      math.core.exclude_s, math.core.exclude_s),
    // EXCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      math.core.exclude_s, math.core.exclude_s),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      math.core.exclude_s, math.core.exclude_s),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      math.core.exclude_s, math.core.exclude_s),
    // EXCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      math.core.exclude_s, math.core.exclude_s),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      math.core.exclude_s, math.core.exclude_s),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      math.core.exclude_s, math.core.exclude_s),
  ].forEach(res => expect(res).toBe(undefined));
});

test("collinear segment intersections, types not core", () => {
  [ // horizontal
    math.segment([0, 2], [2, 2]).intersect(math.segment([-1, 2], [10, 2])),
    math.segment([0, 2], [2, 2]).intersect(math.segment([10, 2], [-1, 2])),
    // vertical
    math.segment([2, 0], [2, 2]).intersect(math.segment([2, -1], [2, 10])),
    math.segment([2, 0], [2, 2]).intersect(math.segment([2, 10], [2, -1])),
    // diagonal
    math.segment([0, 0], [2, 2]).intersect(math.segment([-1, -1], [5, 5])),
    math.segment([0, 0], [2, 2]).intersect(math.segment([5, 5], [-1, -1])),
  ].forEach(res => expect(res).toBe(undefined));
});

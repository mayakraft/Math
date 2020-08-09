const math = require("../math");

test("intersections", () => {
  const polygon = math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
  const circle = math.circle(1);
  const line = math.line([1, 2], [0.5, 0]);
  const ray = math.ray([-1, 2], [0.5, 0]);
  const segment = math.segment([-2, 0.5], [2, 0.5]);

  const polygon2 = math.polygon([0, -1.15], [1, 0.577], [-1, 0.577]);
  const circle2 = math.circle(1, 0.5, 0);
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



// test("core polygon intersection circle", () => {
//   convex_poly_circle(poly, center, radius)  
// })

test("core polygon intersection lines", () => {
  const poly = [[0,0], [1,0], [0.5, 0.866]];
  const vector = [1, 1];
  const point = [0.5, 0.866 / 2];
  const segmentA = [...point];
  const segmentB = [point[0] + 4, point[1] + 4];

  expect(math.core.convex_poly_line(poly, vector, point).length)
    .toBe(2);
  expect(math.core.convex_poly_ray_inclusive(poly, vector, point).length)
    .toBe(1);
  expect(math.core.convex_poly_ray_exclusive(poly, vector, point).length)
    .toBe(1);
  // todo
  // expect(math.core.convex_poly_segment_inclusive(poly, segmentA, segmentB).length)
  //   .toBe(1);
  expect(math.core.convex_poly_segment_exclusive(poly, segmentA, segmentB).length)
    .toBe(1);
});

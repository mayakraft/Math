const math = require("../math");

const equalTest = (a, b) => expect(JSON.stringify(a))
  .toBe(JSON.stringify(b));

test("prototype member variables accessing 'this'", () => {
  expect(math.polygon.regularPolygon(4).sides.length).toBe(4);
  expect(math.polygon.regularPolygon(4).area()).toBeCloseTo(2);
});

test("isConvex", () => {
  expect(math.polygon.regularPolygon(4).isConvex).toBe(true);
});
test(".segments", () => {
  const polygon = math.polygon.regularPolygon(4);
  const segments = polygon.segments();
  expect(segments.length).toBe(4);
  expect(polygon.sides[0]).toBe(polygon.segments()[0]);
});
test("intersect", () => {
  const segment = math.polygon.regularPolygon(4).intersect(math.line([1, 1]));
  expect(Math.abs(segment[0][0])).toBe(0.5);
  expect(Math.abs(segment[0][1])).toBe(0.5);
  expect(Math.abs(segment[1][0])).toBe(0.5);
  expect(Math.abs(segment[1][1])).toBe(0.5);
});
test("area", () => {
  expect(math.polygon([-0.5,-0.5], [0.5,-0.5], [0.5, 0.5], [-0.5, 0.5]).area()).toBeCloseTo(1);
});
test("convex Hull", () => {
  const result = math.polygon.convexHull([[1,0], [0.5,0], [0,1], [0,-1]]);
  expect(result.points.length).toBe(3);
});
test("skeleton", () => {
  const hull = math.polygon.convexHull(Array.from(Array(10))
    .map(() => [Math.random(), Math.random()]));
  const skeleton = hull.straightSkeleton();
  const skeletons = skeleton.filter(el => el.type === "skeleton");
  const perpendiculars = skeleton.filter(el => el.type === "perpendicular");
  expect(skeletons.length).toBe((hull.length - 3) * 2 + 3);
  expect(perpendiculars.length).toBe(hull.length - 2);
});
// test("midpoint", () => {
//   const result = math.polygon([-0.5,-0.5], [0.5,-0.5], [0.5, 0.5], [-0.5, 0.5]).midpoint();
//   expect(result[0]).toBeCloseTo(0);
//   expect(result[1]).toBeCloseTo(0);
// });
test("centroid", () => {
  const result = math.polygon([1,0], [0,1], [-1,0]).centroid();
  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeCloseTo(1/3);
});
test("enclosingRectangle", () => {
  const rect = math.polygon([[1,0], [0,1], [-1,0], [0,-1]]).enclosingRectangle();
  expect(rect.x).toBe(-1);
  expect(rect.y).toBe(-1);
  expect(rect.width).toBe(2);
  expect(rect.height).toBe(2);
});
test("contains", () => {
  expect(math.polygon([[1,0], [0,1], [-1,0], [0,-1]]).overlap(math.vector(0.49, 0.49)))
    .toBe(true);
  expect(math.polygon([[1,0], [0,1], [-1,0], [0,-1]]).overlap(math.vector(0.5, 0.5)))
    .toBe(false);
  expect(math.polygon([[1,0], [0,1], [-1,0], [0,-1]]).overlap(math.vector(0.51, 0.51)))
    .toBe(false);
});
test("scale", () => {
  const result = math.polygon([-0.5,-0.5], [0.5,-0.5], [0.5, 0.5], [-0.5, 0.5]).scale(2);
  expect(result.points[0][0]).toBeCloseTo(-1);
  expect(result.points[0][1]).toBeCloseTo(-1);
});
test("rotate", () => {
  const sq = Math.sqrt(2) / 2;
  const result = math.polygon([-sq,-sq], [sq,-sq], [sq, sq], [-sq, sq]).rotate(Math.PI/4);
  expect(result.points[0][0]).toBeCloseTo(0);
  expect(result.points[0][1]).toBeCloseTo(-1);
});
test("translate", () => {
  const result = math.polygon([[1,0], [0,1], [-1,0], [0,-1]]).translate(Math.PI/2);
});
test("transform", () => {
  const matrix = math.matrix(1,0,0,0,1,0,0,0,1,4,5,0);
  const result = math.polygon([-0.5,-0.5], [0.5,-0.5], [0.5, 0.5], [-0.5, 0.5]).transform(matrix);
  expect(result.points[0][0]).toBeCloseTo(3.5);
  expect(result.points[0][1]).toBeCloseTo(4.5);
});
// test("sectors", () => {
//   const result = math.polygon([[1,0], [0,1], [-1,0], [0,-1]]).sectors();
//   console.log("sectors", result);
// });
test("nearest", () => {
  const result = math.polygon([[1,0], [0,1], [-1,0], [0,-1]]).nearest(10, 10);
  expect(result.point[0]).toBe(0.5);
  expect(result.point[1]).toBe(0.5);
  expect(result.distance).toBeCloseTo(13.435028842544403);
  expect(result.edge[0][0]).toBeCloseTo(1);
  expect(result.edge[0][1]).toBeCloseTo(0);
});

test("overlap", () => {
  const poly1 = math.polygon([[1,0], [0,1], [-1,0]]);  // top
  const poly2 = math.polygon([[0,1], [-1,0], [0,-1]]); // left
  const poly3 = math.polygon([[1,0], [0,1], [0,-1]]);  // right
  const poly4 = math.polygon([[1,0], [-1,0], [0,-1]]);  // bottom
  expect(poly1.overlap(poly2)).toBe(true);
  expect(poly1.overlap(poly3)).toBe(true);
  expect(poly4.overlap(poly2)).toBe(true);
  expect(poly4.overlap(poly3)).toBe(true);

  expect(poly2.overlap(poly3)).toBe(false);
  expect(poly1.overlap(poly4)).toBe(false);
});
test("split", () => {
  const poly = math.polygon([[1,0], [0,1], [-1,0]]);
  const line1 = math.line([1, 0], [0, 0.5]);
  const line2 = math.line([1, 0], [0, -0.5]);
  const result1 = poly.split(line1);

  expect(result1[0][0][0]).toBe(-1);
  expect(result1[0][0][1]).toBe(0);

  expect(result1[0][1][0]).toBe(1);
  expect(result1[0][1][1]).toBe(0);

  expect(result1[0][2][0]).toBe(0.5);
  expect(result1[0][2][1]).toBe(0.5);

  expect(result1[0][3][0]).toBe(-0.5);
  expect(result1[0][3][1]).toBe(0.5);

  expect(result1[1][0][0]).toBe(0);
  expect(result1[1][0][1]).toBe(1);

  expect(result1[1][1][0]).toBe(-0.5);
  expect(result1[1][1][1]).toBe(0.5);

  expect(result1[1][2][0]).toBe(0.5);
  expect(result1[1][2][1]).toBe(0.5);
});

test("intersectLine", () => {
  const poly = math.polygon([[1,0], [0,1], [-1,0], [0,-1]]);
  const line = math.line([1,0], [0, 0.5]);
  const result = poly.intersect(line);
  expect(result[0][0]).toBeCloseTo(0.5);
  expect(result[0][1]).toBeCloseTo(0.5);
});
test("intersectRay", () => {
  const poly = math.polygon([[1,0], [0,1], [-1,0], [0,-1]]);
  const ray = math.ray([1,0], [0, 0.5]);
  const result = poly.intersect(ray);
});
test("intersectSegment", () => {
  const poly = math.polygon([[1,0], [0,1], [-1,0], [0,-1]]);
  const segment = math.segment([-2, 0.5], [2, 0.5]);
  const result = poly.intersect(segment);
  expect(result[0][0]).toBeCloseTo(0.5);
  expect(result[0][1]).toBeCloseTo(0.5);
  expect(result[1][0]).toBeCloseTo(-0.5);
  expect(result[1][1]).toBeCloseTo(0.5);
});
// test("svgPath", () => {
//   svgPath: function () 
// });


const math = require("../math");

test("core clip", () => {
  const poly = [...math.rect(-1, -1, 2, 2)];
  const vector = [1, 1];
  const origin = [0, 0];
  [ math.core.clip_line_in_convex_poly(poly, vector, origin),
    math.core.clip_ray_in_convex_poly_exclusive(poly, vector, origin),
    math.core.clip_ray_in_convex_poly_inclusive(poly, vector, origin),
    math.core.clip_segment_in_convex_poly_exclusive(poly, vector, origin),
    math.core.clip_segment_in_convex_poly_inclusive(poly, vector, origin),
  ].forEach(res => expect(res).not.toBe(undefined));
});

test("core no clip", () => {
  const poly = [...math.rect(-1, -1, 2, 2)];
  const vector = [1, 1];
  const origin = [10, 0];
  const seg0 = [10, 0];
  const seg1 = [0, 10];
  [ math.core.clip_line_in_convex_poly(poly, vector, origin),
    math.core.clip_ray_in_convex_poly_exclusive(poly, vector, origin),
    math.core.clip_ray_in_convex_poly_inclusive(poly, vector, origin),
    math.core.clip_segment_in_convex_poly_exclusive(poly, seg0, seg1),
    math.core.clip_segment_in_convex_poly_inclusive(poly, seg0, seg1),
  ].forEach(res => expect(res).toBe(undefined));
});

test("clip line in rect", () => {
  const rect = math.rect(-1, -1, 2, 2);
  const result1 = rect.clipLine(math.line(1, 1));
  expect(result1[0][0]).toBe(-1);
  expect(result1[0][1]).toBe(-1);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  const result2 = rect.clipLine(math.line([1, 0], [0, 1]));
  expect(result2[0][0]).toBe(1);
  expect(result2[0][1]).toBe(1);
  expect(result2[1][0]).toBe(-1);
  expect(result2[1][1]).toBe(1);
  const result3 = rect.clipLine(math.line(1, -1));
  expect(result3[0][0]).toBe(1);
  expect(result3[0][1]).toBe(-1);
  expect(result3[1][0]).toBe(-1);
  expect(result3[1][1]).toBe(1);
});

test("clip ray in rect", () => {
  const rect = math.rect(-1, -1, 2, 2);
  const result1 = rect.clipRay(math.ray(1, 1));
  expect(result1[0][0]).toBe(0);
  expect(result1[0][1]).toBe(0);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  const result2 = rect.clipRay(math.ray([1, 0], [0, 1]));
  expect(result2[0][0]).toBe(0);
  expect(result2[0][1]).toBe(1);
  expect(result2[1][0]).toBe(1);
  expect(result2[1][1]).toBe(1);
  const result3 = rect.clipRay(math.ray(1, -1));
  expect(result3[0][0]).toBe(0);
  expect(result3[0][1]).toBe(0);
  expect(result3[1][0]).toBe(1);
  expect(result3[1][1]).toBe(-1);
});

test("clip segment in segment", () => {
  const rect = math.rect(-1, -1, 2, 2);
  const result1 = rect.clipSegment(math.segment([0, 0], [1, 1]));
  expect(result1[0][0]).toBe(0);
  expect(result1[0][1]).toBe(0);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  const result2 = rect.clipSegment(math.segment([0, 0], [2, 2]));
  expect(result2[0][0]).toBe(0);
  expect(result2[0][1]).toBe(0);
  expect(result2[1][0]).toBe(1);
  expect(result2[1][1]).toBe(1);
  const result3 = rect.clipSegment(math.segment([0, 0], [1, -1]));
  expect(result3[0][0]).toBe(0);
  expect(result3[0][1]).toBe(0);
  expect(result3[1][0]).toBe(1);
  expect(result3[1][1]).toBe(-1);
});

test("no clips", () => {
  const rect = math.rect(-1, -1, 2, 2);
  const result1 = rect.clipLine(math.line([-0.707, 0.707], [2, 0]));
  expect(result1).toBe(undefined);
});

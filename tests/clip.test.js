const math = require("../math");

test("math types, clip line in rect", () => {
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

test("math types, clip ray in rect", () => {
  const rect = math.rect(-1, -1, 2, 2);
  const result1 = rect.clipRay(math.ray(1, 1));
  expect(result1[0][0]).toBe(0);
  expect(result1[0][1]).toBe(0);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  // ray is exclusive by default
  const result2 = rect.clipRay(math.ray([1, 0], [0, 1]));
  expect(result2).toBe(undefined);
  const result3 = rect.clipRay(math.ray(1, -1));
  expect(result3[0][0]).toBe(0);
  expect(result3[0][1]).toBe(0);
  expect(result3[1][0]).toBe(1);
  expect(result3[1][1]).toBe(-1);
});

test("math types, clip segment in segment", () => {
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

test("core clip segments exclusive", () => {
  const poly = [...math.rect(-1, -1, 2, 2)];
  // all inside
  const seg0 = [[0, 0], [0.2, 0.2]];
  const result0 = math.core.clip_segment_in_convex_poly_exclusive(poly, ...seg0);
  expect(math.core.equivalent(seg0[0], result0[0])).toBe(true);
  expect(math.core.equivalent(seg0[1], result0[1])).toBe(true);
  // all outside
  const seg1 = [[10, 10], [10.2, 10.2]];
  const result1 = math.core.clip_segment_in_convex_poly_exclusive(poly, ...seg1);
  expect(result1).toBe(undefined);
  // inside and collinear
  const seg2 = [[0, 0], [1, 0]];
  const result2 = math.core.clip_segment_in_convex_poly_exclusive(poly, ...seg2);
  expect(math.core.equivalent(seg2[0], result2[0])).toBe(true);
  expect(math.core.equivalent(seg2[1], result2[1])).toBe(true);
  // outside and collinear
  const seg3 = [[5, 0], [1, 0]];
  const result3 = math.core.clip_segment_in_convex_poly_exclusive(poly, ...seg3);
  expect(result3).toBe(undefined);
  // inside and collinear
  const seg4 = [[-1, 0], [1, 0]];
  const result4 = math.core.clip_segment_in_convex_poly_exclusive(poly, ...seg4);
  expect(math.core.equivalent(seg4[1], result4[0])).toBe(true);
  expect(math.core.equivalent(seg4[0], result4[1])).toBe(true);
});

test("core clip segments inclusive", () => {
  const poly = [...math.rect(-1, -1, 2, 2)];
  // all inside
  const seg0 = [[0, 0], [0.2, 0.2]];
  const result0 = math.core.clip_segment_in_convex_poly_inclusive(poly, ...seg0);
  expect(math.core.equivalent(seg0[0], result0[0])).toBe(true);
  expect(math.core.equivalent(seg0[1], result0[1])).toBe(true);
  // all outside
  const seg1 = [[10, 10], [10.2, 10.2]];
  const result1 = math.core.clip_segment_in_convex_poly_inclusive(poly, ...seg1);
  expect(result1).toBe(undefined);
  // inside and collinear
  const seg2 = [[0, 0], [1, 0]];
  const result2 = math.core.clip_segment_in_convex_poly_inclusive(poly, ...seg2);
  expect(math.core.equivalent(seg2[0], result2[0])).toBe(true);
  expect(math.core.equivalent(seg2[1], result2[1])).toBe(true);
  // outside and collinear
  const seg3 = [[5, 0], [1, 0]];
  const result3 = math.core.clip_segment_in_convex_poly_inclusive(poly, ...seg3);
  expect(result3).toBe(undefined);
  // inside and collinear
  const seg4 = [[-1, 0], [1, 0]];
  const result4 = math.core.clip_segment_in_convex_poly_inclusive(poly, ...seg4);
  expect(math.core.equivalent(seg4[1], result4[0])).toBe(true);
  expect(math.core.equivalent(seg4[0], result4[1])).toBe(true);
});

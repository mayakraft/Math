const math = require("../math");

test("smart detection", () => {
  expect(math.typeof({ x: 1, y: 2 })).toBe("vector");
});

test("primitives Typeof", () => {
  const vector = math.vector();
  const matrix = math.matrix();
  const line = math.line();
  const ray = math.ray();
  const segment = math.segment();
  const circle = math.circle();
  const rect = math.rect();
  const ellipse = math.ellipse();

  expect(math.typeof(vector)).toBe("vector");
  expect(math.typeof(matrix)).toBe("matrix");
  expect(math.typeof(line)).toBe("line");
  expect(math.typeof(ray)).toBe("ray");
  expect(math.typeof(segment)).toBe("segment");
  expect(math.typeof(circle)).toBe("circle");
  expect(math.typeof(rect)).toBe("rect");
  expect(math.typeof(ellipse)).toBe("ellipse");
});

test("primitives instanceof", () => {
  const vector = math.vector();
  const matrix = math.matrix();
  const line = math.line();
  const ray = math.ray();
  const segment = math.segment();
  const circle = math.circle();
  const rect = math.rect();
  const ellipse = math.ellipse();

  expect(vector instanceof math.vector).toBe(true);
  expect(matrix instanceof math.matrix).toBe(true);
  expect(line instanceof math.line).toBe(true);
  expect(ray instanceof math.ray).toBe(true);
  expect(segment instanceof math.segment).toBe(true);
  expect(circle instanceof math.circle).toBe(true);
  expect(rect instanceof math.rect).toBe(true);
  expect(ellipse instanceof math.ellipse).toBe(true);
});

test("primitives constructor", () => {
  const vector = math.vector();
  const matrix = math.matrix();
  const line = math.line();
  const ray = math.ray();
  const segment = math.segment();
  const circle = math.circle();
  const rect = math.rect();
  const ellipse = math.ellipse();

  expect(vector.constructor === math.vector).toBe(true);
  expect(matrix.constructor === math.matrix).toBe(true);
  expect(line.constructor === math.line).toBe(true);
  expect(ray.constructor === math.ray).toBe(true);
  expect(segment.constructor === math.segment).toBe(true);
  expect(circle.constructor === math.circle).toBe(true);
  expect(rect.constructor === math.rect).toBe(true);
  expect(ellipse.constructor === math.ellipse).toBe(true);
});

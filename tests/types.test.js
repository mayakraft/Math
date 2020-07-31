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

test("type guessing", () => {
  const vector1 = { x: 1, y: 2, z: 3};
  const vector2 = [1, 2, 3];
  const line = { vector: [1, 1], origin: [0.5, 0.5]};
  const segment = [[1,2], [4,5]];
  const circle = {radius: 1};
  const rect = { width: 2, height: 1 };

  expect(math.typeof(vector1)).toBe("vector");
  expect(math.typeof(vector2)).toBe("vector");
  expect(math.typeof(line)).toBe("line");
  expect(math.typeof(segment)).toBe("segment");
  expect(math.typeof(circle)).toBe("circle");
  expect(math.typeof(rect)).toBe("rect");
  expect(math.typeof({})).toBe(undefined);
  expect(math.typeof(4)).toBe(undefined);
  expect(math.typeof(true)).toBe(undefined);
  expect(math.typeof("s")).toBe(undefined);
});


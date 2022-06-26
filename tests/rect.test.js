const math = require("../math");

// static
test("static fromPoints", () => {
	const r = math.rect.fromPoints([1,1], [3,2]);
	expect(r.width).toBe(2);
	expect(r.height).toBe(1);
});

// native
test("area", () => {
  const r = math.rect(2, 3, 4, 5);
  expect(r.area()).toBe(4 * 5);
});

test("scale", () => {
  const r = math.rect(2, 3, 4, 5);
  expect(r.scale(2).area()).toBe((4 * 2) * (5 * 2));
});

test("segments", () => {
  const r = math.rect(2, 3, 4, 5);
  const seg = r.segments();
  expect(seg.length).toBe(4);
});

test("center", () => {
	const r = math.rect(2, 3, 4, 5);
	expect(r.center.x).toBe(2 + 4 / 2);
	expect(r.center.y).toBe(3 + 5 / 2);
});

test("centroid", () => {
  const r = math.rect(1, 2, 3, 4);
  const centroid = r.centroid();
  expect(centroid.x).toBe(1 + 3 / 2);
  expect(centroid.y).toBe(2 + 4 / 2);
});

test("boundingBox", () => {
  const r = math.rect(1, 2, 3, 4);
  const bounds = r.boundingBox();
  expect(bounds.min[0]).toBe(1);
  expect(bounds.min[1]).toBe(2);
  expect(bounds.span[0]).toBe(3);
  expect(bounds.span[1]).toBe(4);
});

test("contains", () => {
  const r = math.rect(1, 2, 3, 4);
  expect(r.overlap(math.vector(0, 0))).toBe(false);
  expect(r.overlap(math.vector(1.5, 3))).toBe(true);
});

test("svg", () => {
	const r = math.rect(1,2,3,4);
	expect(r.svgPath()).toBe("M1 2h3v4h-3Z");
});

// test("rotate", () => {
//   const r = math.rect(1, 2, 3, 4);
//   r.rotate();
// });

// test("translate", () => {
//   const r = math.rect(1, 2, 3, 4);
//   r.translate();
// });

// test("transform", () => {
//   const r = math.rect(1, 2, 3, 4);
//   r.transform();
// });

// test("sectors", () => {
//   const r = math.rect(1, 2, 3, 4);
//   r.sectors();
// });

// test("nearest", () => {
//   const r = math.rect(1, 2, 3, 4);
//   r.nearest();
// });

// test("clipSegment", () => {
//   const r = math.rect(1, 2, 3, 4);
//   r.clipSegment();
// });

// test("clipLine", () => {
//   const r = math.rect(1, 2, 3, 4);
//   r.clipLine();
// });

// test("clipRay", () => {
//   const r = math.rect(1, 2, 3, 4);
//   r.clipRay();
// });

// test("split", () => {
//   const r = math.rect(1, 2, 3, 4);
//   r.split();
// });

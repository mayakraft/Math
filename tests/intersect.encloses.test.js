const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("enclosingBoundingBoxes fully enclosed", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [0.25, 0.25], max: [0.75, 0.75] };
	expect(math.enclosingBoundingBoxes(box1, box2)).toBe(true);
});

test("enclosingBoundingBoxes edge collinear", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [0, 0], max: [0.5, 0.5] };
	expect(math.enclosingBoundingBoxes(box1, box2)).toBe(true);
});

test("enclosingBoundingBoxes edge collinear epsilon", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [0, 0], max: [0.5, 0.5] };
	expect(math.enclosingBoundingBoxes(box1, box2, -1e-4)).toBe(false);
	expect(math.enclosingBoundingBoxes(box1, box2, 1e-4)).toBe(true);
	const box3 = { min: [-1e-3, -1e-3], max: [0.5, 0.5] };
	expect(math.enclosingBoundingBoxes(box1, box3, -1e-4)).toBe(false);
	expect(math.enclosingBoundingBoxes(box1, box3, 1e-4)).toBe(false);
	expect(math.enclosingBoundingBoxes(box1, box3, 1e-2)).toBe(true);
});

// enclosing polygon polygon is never used anywhere here or in
// Rabbit Ear so it's no longer included in the build.
// test("enclosingPolygonPolygon", () => {
// 	const poly1 = [[1, 0], [0, 1], [-1, 0], [0, -1]];
// 	const poly2 = [[10, 0], [0, 10], [-10, 0], [0, -10]];
// 	const poly3 = [[8, 8], [-8, 8], [-8, -8], [8, -8]];
// 	expect(math.enclosingPolygonPolygon(poly2, poly1)).toBe(true);
// 	expect(math.enclosingPolygonPolygon(poly3, poly1)).toBe(true);
// 	// todo, this should be false i think
// 	// expect(math.enclosingPolygonPolygon(poly2, poly3)).toBe(false);
// 	expect(math.enclosingPolygonPolygon(poly1, poly2)).toBe(false);
// 	expect(math.enclosingPolygonPolygon(poly1, poly3)).toBe(false);
// });

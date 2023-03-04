const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("overlapBoundingBoxes, point overlap", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [0.9, 0.9], max: [2, 2] };
	expect(math.overlapBoundingBoxes(box1, box2)).toBe(true);
});

test("overlapBoundingBoxes, edge overlap", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [1, 0], max: [2, 1] };
	expect(math.overlapBoundingBoxes(box1, box2)).toBe(true);
});

test("overlapBoundingBoxes, point overlap, epsilon away", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [1 + 1e-2, 1 + 1e-2], max: [2, 2] };
	expect(math.overlapBoundingBoxes(box1, box2)).toBe(false);
});

test("overlapBoundingBoxes, edge overlap", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [1 + 1e-2, 0], max: [2, 1] };
	expect(math.overlapBoundingBoxes(box1, box2)).toBe(false);
});

// test("overlap on member types", () => {
// 	const polygon = math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
// 	const circle = math.circle(1);
// 	const line = math.line([1, 2], [0.5, 0]);
// 	const ray = math.ray([-1, 2], [0.5, -0.1]);
// 	const segment = math.segment([-2, 0.5], [2, 0.5]);
// 	const vector = math.vector(0.75, 0.5);

// 	const polygon2 = math.polygon([0, -1.15], [1, 0.577], [-1, 0.577]);
// 	const circle2 = math.circle(1, [0.5, 0]);
// 	const line2 = math.line([-1, 2], [0.5, 0]);
// 	const ray2 = math.ray([1, 2], [-0.5, 0]);
// 	const segment2 = math.segment([0.5, -2], [0.5, 2]);
// 	const vector2 = math.vector(0, 1);
// 	const vector3 = math.vector(0, 1, 0);

// 	[
// 		polygon.overlap(polygon2),
// 		// polygon.overlap(circle),
// 		// polygon.overlap(line),
// 		// polygon.overlap(ray),
// 		// polygon.overlap(segment),
// 		polygon.overlap(vector2),
// 		// circle.overlap(polygon),
// 		// circle.overlap(circle2),
// 		// circle.overlap(line),
// 		// circle.overlap(ray),
// 		// circle.overlap(segment),
// 		circle.overlap(vector),
// 		// line.overlap(polygon),
// 		// line.overlap(circle),
// 		line.overlap(line2),
// 		line.overlap(ray),
// 		line.overlap(segment),
// 		line.overlap(vector),
// 		// ray.overlap(polygon),
// 		// ray.overlap(circle),
// 		ray.overlap(line),
// 		ray.overlap(ray2),
// 		ray.overlap(segment),
// 		ray2.overlap(vector2),
// 		// segment.overlap(polygon),
// 		// segment.overlap(circle),
// 		segment.overlap(line),
// 		segment.overlap(ray),
// 		segment.overlap(segment2),
// 		segment.overlap(vector),
// 		vector2.overlap(polygon),
// 		vector.overlap(circle),
// 		vector.overlap(line),
// 		vector2.overlap(ray2),
// 		vector.overlap(segment),
// 		vector2.overlap(vector3),
// 	].forEach(overlap => expect(overlap).toBe(true));
// });

test("point on line", () => {
	expect(math.overlapLinePoint({ vector: [5, 5], origin: [0, 0] }, [2, 2])).toBe(true);
	expect(math.overlapLinePoint({ vector: [1, 1], origin: [0, 0] }, [2, 2])).toBe(true);
	expect(math.overlapLinePoint({ vector: [2, 2], origin: [0, 0] }, [2.1, 2.1])).toBe(true);
	expect(math.overlapLinePoint({ vector: [2, 2], origin: [0, 0] }, [2.000000001, 2.000000001]))
		.toBe(true);
	expect(math.overlapLinePoint({ vector: [2, 2], origin: [0, 0] }, [-1, -1])).toBe(true);

	expect(math.overlapLinePoint(
		{ vector: [5, 5], origin: [0, 0] },
		[2, 2],
		math.includeR,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[2, 2],
		math.includeR,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.1, 2.1],
		math.includeR,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.000000001, 2.000000001],
		math.includeR,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [-1, -1], origin: [0, 0] },
		[2, 2],
		math.includeR,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[-0.1, -0.1],
		math.includeR,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[-0.000000001, -0.000000001],
		math.includeR,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[-0.000000001, -0.000000001],
		math.excludeR,
	)).toBe(false);

	expect(math.overlapLinePoint(
		{ vector: [5, 5], origin: [0, 0] },
		[2, 2],
		math.includeS,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[2, 2],
		math.includeS,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.1, 2.1],
		math.includeS,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.000000001, 2.000000001],
		math.includeS,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [-1, -1], origin: [0, 0] },
		[2, 2],
		math.includeS,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.000000001, 2.000000001],
		math.excludeS,
	)).toBe(false);
});

test("overlap.point_on_segment_inclusive", () => {
	expect(math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[4, 3],
		math.includeS,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[3, 3],
		math.includeS,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[2.9, 3],
		math.includeS,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[2.9999999999, 3],
		math.includeS,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[6.1, 3],
		math.includeS,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[6.0000000001, 3],
		math.includeS,
	)).toBe(true);

	expect(math.overlapLinePoint(
		{ vector: [2, 2], origin: [2, 2] },
		[3.5, 3.5],
		math.includeS,
	)).toBe(true);
	expect(math.overlapLinePoint(
		{ vector: [2, 2], origin: [2, 2] },
		[2.9, 3.1],
		math.includeS,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [2, 2], origin: [2, 2] },
		[2.99999999, 3.000000001],
		math.includeS,
	)).toBe(true);
	// degenerate edge returns false
	expect(math.overlapLinePoint(
		{ vector: [0, 0], origin: [2, 2] },
		[2, 2],
		math.includeS,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [0, 0], origin: [2, 2] },
		[2.1, 2.1],
		math.includeS,
	)).toBe(false);
	expect(math.overlapLinePoint(
		{ vector: [0, 0], origin: [2, 2] },
		[2.000000001, 2.00000001],
		math.includeS,
	)).toBe(false);
});

test("point on line epsilon", () => {

});

test("point in poly", () => {
	const poly = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	expect(math.overlapConvexPolygonPoint(poly, [0.0, 0.0])).toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.999, 0.0])).toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.9999999999, 0.0])).toBe(false);
	// edge collinear
	expect(math.overlapConvexPolygonPoint(poly, [0.5, 0.5])).toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.49, 0.49])).toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.51, 0.51])).toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.500000001, 0.500000001])).toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.5, -0.5])).toBe(false);
	// expect(math.overlapConvexPolygonPoint(poly, [-0.5, 0.5])).toBe(false);
	// expect(math.overlapConvexPolygonPoint(poly, [-0.5, -0.5])).toBe(false);
	// polygon points
	expect(math.overlapConvexPolygonPoint(poly, [1.0, 0.0])).toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.0, 1.0])).toBe(false);
	// expect(math.overlapConvexPolygonPoint(poly, [-1.0, 0.0])).toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.0, -1.0])).toBe(false);
});

test("convex point in poly inclusive", () => {
	const poly = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	expect(math.overlapConvexPolygonPoint(poly, [0.0, 0.0], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.999, 0.0], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.9999999999, 0.0], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [1.1, 0.0], math.include))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [1.000000001, 0.0], math.include))
		.toBe(true);
	// edge collinear
	expect(math.overlapConvexPolygonPoint(poly, [0.5, 0.5], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.49, 0.49], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.499999999, 0.499999999], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.51, 0.51], math.include))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.500000001, 0.500000001], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.5, -0.5], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [-0.5, 0.5], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [-0.5, -0.5], math.include))
		.toBe(true);
	// polygon points
	expect(math.overlapConvexPolygonPoint(poly, [1.0, 0.0], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.0, 1.0], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [-1.0, 0.0], math.include))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.0, -1.0], math.include))
		.toBe(true);
});

test("convex point in poly exclusive", () => {
	const poly = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	expect(math.overlapConvexPolygonPoint(poly, [0.0, 0.0], math.exclude))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.999, 0.0], math.exclude))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.9999999999, 0.0], math.exclude))
		.toBe(false);
	// edge collinear
	expect(math.overlapConvexPolygonPoint(poly, [0.5, 0.5], math.exclude))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.49, 0.49], math.exclude))
		.toBe(true);
	expect(math.overlapConvexPolygonPoint(poly, [0.499999999, 0.499999999], math.exclude))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.51, 0.51], math.exclude))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.5, -0.5], math.exclude))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [-0.5, 0.5], math.exclude))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [-0.5, -0.5], math.exclude))
		.toBe(false);
	// polygon points
	expect(math.overlapConvexPolygonPoint(poly, [1.0, 0.0], math.exclude))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.0, 1.0], math.exclude))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [-1.0, 0.0], math.exclude))
		.toBe(false);
	expect(math.overlapConvexPolygonPoint(poly, [0.0, -1.0], math.exclude))
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

	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			math.includeL,
			math.includeL,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			math.includeL,
			math.includeR,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: math.subtract(b1, b0), origin: b0 },
			math.includeL,
			math.includeS,
		),
	).toBe(false);
	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			math.includeR,
			math.includeR,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: math.subtract(b1, b0), origin: b0 },
			math.includeR,
			math.includeS,
		),
	).toBe(false);
	expect(
		math.overlapLineLine(
			{ vector: math.subtract(a1, a0), origin: a0 },
			{ vector: math.subtract(b1, b0), origin: b0 },
			math.includeS,
			math.includeS,
		),
	).toBe(false);
	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			math.excludeL,
			math.excludeL,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			math.excludeL,
			math.excludeR,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: math.subtract(b1, b0), origin: b0 },
			math.excludeL,
			math.excludeS,
		),
	).toBe(false);
	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			math.excludeR,
			math.excludeR,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: math.subtract(b1, b0), origin: b0 },
			math.excludeR,
			math.excludeS,
		),
	).toBe(false);
	expect(
		math.overlapLineLine(
			{ vector: math.subtract(a1, a0), origin: a0 },
			{ vector: math.subtract(b1, b0), origin: b0 },
			math.excludeS,
			math.excludeS,
		),
	).toBe(false);
});

test("overlap lines parallel", () => {
	expect(
		math.overlapLineLine(
			{ vector: [1, 0], origin: [0, 0] },
			{ vector: [1, 0], origin: [0, 1] },
			math.includeL,
			math.includeL,
		),
	).toBe(false);
	expect(
		math.overlapLineLine(
			{ vector: [1, 0], origin: [0, 0] },
			{ vector: [1, 0], origin: [0, 0] },
			math.includeL,
			math.includeL,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [8, 0] },
			math.includeL,
			math.includeL,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [8, 0] },
			math.includeS,
			math.includeS,
		),
	).toBe(false);
	expect(
		math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [8, 0] },
			math.includeR,
			math.includeS,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [8, 0] },
			math.includeS,
			math.includeR,
		),
	).toBe(false);
	// segments
	expect(
		math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [3, 0] },
			math.includeS,
			math.includeS,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [3, 0] },
			math.includeS,
			math.excludeS,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [3, 0] },
			math.excludeS,
			math.includeS,
		),
	).toBe(true);
	expect(
		math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [3, 0] },
			math.excludeS,
			math.excludeS,
		),
	).toBe(false);
});

test("overlap circle point", () => {
	expect(
		math.overlapCirclePoint(
			{ radius: 1, origin: [0, 0] },
			[0.5, 0.5],
		),
	).toBe(true);
	expect(
		math.overlapCirclePoint(
			{ radius: 1, origin: [0, 0] },
			[Math.SQRT1_2, Math.SQRT1_2],
			math.include,
		),
	).toBe(true);
	expect(
		math.overlapCirclePoint(
			{ radius: 1, origin: [0, 0] },
			[Math.SQRT1_2, Math.SQRT1_2],
			math.exclude,
		),
	).toBe(false);
	expect(
		math.overlapCirclePoint(
			{ radius: 1, origin: [10, 0] },
			[10 + Math.SQRT1_2, Math.SQRT1_2],
			math.include,
		),
	).toBe(true);
	expect(
		math.overlapCirclePoint(
			{ radius: 1, origin: [10, 0] },
			[10 + Math.SQRT1_2, Math.SQRT1_2],
			math.exclude,
		),
	).toBe(false);
});

// if we choose to bring back exclusive / inclusive polygon overlap
// test("convex polygons overlap with point inside each other", () => {
// 	const poly1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
// 	const polyA = [[0.5, 0.5], [10, 10], [10, 0]];
// 	const polyB = [[-10, -10], [10, -10], [10, 10], [-10, 10]];
// 	expect(math.overlapConvexPolygons(poly1, polyA, math.includeS, math.include)).toBe(true);
// 	expect(math.overlapConvexPolygons(poly1, polyB, math.includeS, math.include)).toBe(true);
// 	expect(math.overlapConvexPolygons(polyA, poly1, math.includeS, math.include)).toBe(true);
// 	expect(math.overlapConvexPolygons(polyB, poly1, math.includeS, math.include)).toBe(true);
// });

// test("convex polygons overlap", () => {
//   const poly1 = [[1,0], [0,1], [-1,0]];  // top
//   const poly2 = [[0,1], [-1,0], [0,-1]]; // left
//   const poly3 = [[1,0], [0,1], [0,-1]];  // right
//   // inclusive
//   expect(math.overlapConvexPolygons(poly1, poly2, math.includeS, math.include)).toBe(true);
//   expect(math.overlapConvexPolygons(poly2, poly3, math.includeS, math.include)).toBe(true);
//   expect(math.overlapConvexPolygons(poly1, poly3, math.includeS, math.include)).toBe(true);
//   // exclusive
//   expect(math.overlapConvexPolygons(poly1, poly2, math.excludeS, math.exclude)).toBe(true);
//   expect(math.overlapConvexPolygons(poly2, poly3, math.excludeS, math.exclude)).toBe(false);
//   expect(math.overlapConvexPolygons(poly1, poly3, math.excludeS, math.exclude)).toBe(true);
// });
// until then, exclusive only
test("convex polygons overlap", () => {
	const poly1 = [[1, 0], [0, 1], [-1, 0]]; // top
	const poly2 = [[0, 1], [-1, 0], [0, -1]]; // left
	const poly3 = [[1, 0], [0, 1], [0, -1]]; // right
	// exclusive
	expect(math.overlapConvexPolygons(poly1, poly2)).toBe(true);
	expect(math.overlapConvexPolygons(poly2, poly3)).toBe(false);
	expect(math.overlapConvexPolygons(poly1, poly3)).toBe(true);
});

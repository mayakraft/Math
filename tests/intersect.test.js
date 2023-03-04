const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("intersectLineLine include exclude", () => {
	const res0 = math.intersectLineLine(
		{ vector: [0, 1], origin: [1, 0] },
		{ vector: [1, 0], origin: [0, 1] },
	);
	const res1 = math.intersectLineLine(
		{ vector: [0, 1], origin: [1, 0] },
		{ vector: [1, 0], origin: [0, 1] },
		math.includeS,
		math.includeS,
	);
	const res2 = math.intersectLineLine(
		{ vector: [0, 1], origin: [1, 0] },
		{ vector: [1, 0], origin: [0, 1] },
		math.excludeS,
		math.excludeS,
	);
	expect(res0).not.toBe(undefined);
	expect(res1).not.toBe(undefined);
	expect(res2).toBe(undefined);
});

test("intersectConvexPolygonLine include exclude vertex aligned", () => {
	const poly = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	// two lines, vertex aligned
	const res0 = math.intersectConvexPolygonLine(
		poly,
		{ vector: [0, 1], origin: [1, -5] },
		math.includeS,
		math.includeL,
	);
	const res1 = math.intersectConvexPolygonLine(
		poly,
		{ vector: [0, 1], origin: [1, -5] },
		math.excludeS,
		math.excludeL,
	);
	// two segements endpoint on vertex
	const res2 = math.intersectConvexPolygonLine(
		poly,
		{ vector: [0, 1], origin: [1, -1] },
		math.includeS,
		math.includeS,
	);
	const res3 = math.intersectConvexPolygonLine(
		poly,
		{ vector: [0, 1], origin: [1, -1] },
		math.includeS,
		math.excludeS,
	);
	const res4 = math.intersectConvexPolygonLine(
		poly,
		{ vector: [0, 1], origin: [1, -1] },
		math.excludeS,
		math.includeS,
	);
	const res5 = math.intersectConvexPolygonLine(
		poly,
		{ vector: [0, 1], origin: [1, -1] },
		math.excludeS,
		math.excludeS,
	);
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

test("intersectConvexPolygonLine include exclude edge aligned", () => {
	const poly = [[0, 0], [1, 0], [1, 1], [0, 1]];
	const res0 = math.intersectConvexPolygonLine(
		poly,
		{ vector: [0, 1], origin: [1, -5] },
		math.includeS,
		math.excludeL,
	);
	const res1 = math.intersectConvexPolygonLine(
		poly,
		{ vector: [0, 1], origin: [1, -5] },
		math.excludeS,
		math.excludeL,
	);
	expect(res0).not.toBe(undefined);
	expect(res1).toBe(undefined);
});

const convexPolyLineInclusive = (poly, vec, org, ep) => math.intersectConvexPolygonLine(
	poly,
	{ vector: vec, origin: org },
	math.includeS,
	math.includeL,
	ep,
);
const convexPolyRayInclusive = (poly, vec, org, ep) => math.intersectConvexPolygonLine(
	poly,
	{ vector: vec, origin: org },
	math.includeS,
	math.includeR,
	ep,
);
const convexPolySegmentInclusive = (poly, pt0, pt1, ep) => math.intersectConvexPolygonLine(
	poly,
	{ vector: math.subtract(pt1, pt0), origin: pt0 },
	math.includeS,
	math.includeS,
	ep,
);
const convexPolyLineExclusive = (poly, vec, org, ep) => math.intersectConvexPolygonLine(
	poly,
	{ vector: vec, origin: org },
	math.excludeS,
	math.excludeL,
	ep,
);
const convexPolyRayExclusive = (poly, vec, org, ep) => math.intersectConvexPolygonLine(
	poly,
	{ vector: vec, origin: org },
	math.excludeS,
	math.excludeR,
	ep,
);
const convexPolySegmentExclusive = (poly, pt0, pt1, ep) => math.intersectConvexPolygonLine(
	poly,
	{ vector: math.subtract(pt1, pt0), origin: pt0 },
	math.excludeS,
	math.excludeS,
	ep,
);
test("core polygon intersection lines", () => {
	const poly = [[0, 0], [1, 0], [0.5, 0.866]];
	const vector = [1, 1];
	const point = [0.5, 0.866 / 2];
	const segmentA = [...point];
	const segmentB = [point[0] + 4, point[1] + 4];

	expect(convexPolyLineExclusive(poly, vector, point).length)
		.toBe(2);
	expect(convexPolyRayInclusive(poly, vector, point).length)
		.toBe(1);
	expect(convexPolyRayExclusive(poly, vector, point).length)
		.toBe(1);
	expect(convexPolySegmentInclusive(poly, segmentA, segmentB).length)
		.toBe(1);
	expect(convexPolySegmentExclusive(poly, segmentA, segmentB).length)
		.toBe(1);
});

test("core polygon intersection lines, collinear to edge", () => {
	const poly = [[0, 0], [1, 0], [0.5, 0.866]];
	const vector = [1, 0];
	const point = [-5, 0];
	const segmentA = [0, 0];
	const segmentB = [1, 0];

	expect(convexPolyLineInclusive(poly, vector, point).length)
		.toBe(2);
	expect(convexPolyLineExclusive(poly, vector, point))
		.toBe(undefined);
	expect(convexPolyRayInclusive(poly, vector, point).length)
		.toBe(2);
	expect(convexPolyRayExclusive(poly, vector, point))
		.toBe(undefined);
	expect(convexPolySegmentInclusive(poly, segmentA, segmentB).length)
		.toBe(2);
	expect(convexPolySegmentExclusive(poly, segmentA, segmentB))
		.toBe(undefined);
});

test("core polygon intersection lines, collinear to vertex", () => {
	const poly = [[0, 0], [1, 0], [0.5, 0.866]];
	const vector = [1, 0];
	const point = [-5, 0.866];
	const segmentA = [0, 0.866];
	const segmentB = [1, 0.866];

	expect(convexPolyLineInclusive(poly, vector, point).length)
		.toBe(1);
	expect(convexPolyLineExclusive(poly, vector, point))
		.toBe(undefined);
	expect(convexPolyRayInclusive(poly, vector, point).length)
		.toBe(1);
	expect(convexPolyRayExclusive(poly, vector, point))
		.toBe(undefined);
	expect(convexPolySegmentInclusive(poly, segmentA, segmentB).length)
		.toBe(1);
	expect(convexPolySegmentExclusive(poly, segmentA, segmentB))
		.toBe(undefined);
});

test("core polygon intersection lines, collinear to polygon vertices", () => {
	const polygon = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const lineSeg = convexPolyLineInclusive(polygon, [1, 0], [0, 0]);
	expect(Math.abs(lineSeg[0][0])).toBeCloseTo(1);
	expect(lineSeg[0][1]).toBeCloseTo(0);
	expect(Math.abs(lineSeg[1][0])).toBeCloseTo(1);
	expect(lineSeg[1][1]).toBeCloseTo(0);

	const raySeg1 = convexPolyRayInclusive(polygon, [1, 0], [0, 0]);
	expect(raySeg1.length).toBe(1);
	expect(Math.abs(raySeg1[0][0])).toBeCloseTo(1);
	expect(raySeg1[0][1]).toBeCloseTo(0);
	const raySeg2 = convexPolyRayInclusive(polygon, [1, 0], [-10, 0]);
	expect(raySeg2.length).toBe(2);
	expect(Math.abs(raySeg2[0][0])).toBeCloseTo(1);
	expect(raySeg2[0][1]).toBeCloseTo(0);
	expect(Math.abs(raySeg2[1][0])).toBeCloseTo(1);
	expect(raySeg2[1][1]).toBeCloseTo(0);
	const raySeg3 = convexPolyRayInclusive(polygon, [1, 0], [10, 0]);
	expect(raySeg3).toBe(undefined);
});

test("core polygon intersection lines, no intersections", () => {
	const poly = [[0, 0], [1, 0], [0.5, 0.866]];
	const vector = [1, 0];
	const point = [-5, 10];
	const segmentA = [0, 10];
	const segmentB = [1, 10];

	expect(convexPolyLineExclusive(poly, vector, point))
		.toBe(undefined);
	expect(convexPolyRayInclusive(poly, vector, point))
		.toBe(undefined);
	expect(convexPolyRayExclusive(poly, vector, point))
		.toBe(undefined);
	expect(convexPolySegmentInclusive(poly, segmentA, segmentB))
		.toBe(undefined);
	expect(convexPolySegmentExclusive(poly, segmentA, segmentB))
		.toBe(undefined);
});

// test("core polygon intersection circle", () => {
//   convex_poly_circle(poly, center, radius)
// });

test("collinear line intersections", () => {
	const intersect = (a, b, c, d, ...args) => math.intersectLineLine(
		{ vector: a, origin: b },
		{ vector: c, origin: d },
		...args,
	);
	[
		// INCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.includeL, math.includeL),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.includeL, math.includeL),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.includeL, math.includeL),
		// INCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.includeL, math.includeL),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.includeL, math.includeL),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.includeL, math.includeL),
		// INCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.includeL, math.includeL),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.includeL, math.includeL),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.includeL, math.includeL),
		// EXCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.excludeL, math.excludeL),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.excludeL, math.excludeL),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.excludeL, math.excludeL),
		// EXCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.excludeL, math.excludeL),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.excludeL, math.excludeL),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.excludeL, math.excludeL),
		// EXCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.excludeL, math.excludeL),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.excludeL, math.excludeL),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.excludeL, math.excludeL),
	].forEach(res => expect(res).toBe(undefined));
});

test("collinear ray intersections", () => {
	const intersect = (a, b, c, d, ...args) => math.intersectLineLine(
		{ vector: a, origin: b },
		{ vector: c, origin: d },
		...args,
	);
	[
		// INCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.includeR, math.includeR),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.includeR, math.includeR),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.includeR, math.includeR),
		// INCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.includeR, math.includeR),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.includeR, math.includeR),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.includeR, math.includeR),
		// INCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.includeR, math.includeR),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.includeR, math.includeR),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.includeR, math.includeR),
		// EXCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.excludeR, math.excludeR),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.excludeR, math.excludeR),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.excludeR, math.excludeR),
		// EXCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.excludeR, math.excludeR),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.excludeR, math.excludeR),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.excludeR, math.excludeR),
		// EXCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.excludeR, math.excludeR),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.excludeR, math.excludeR),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.excludeR, math.excludeR),
	].forEach(res => expect(res).toBe(undefined));
});

test("collinear segment intersections", () => {
	const intersect = (a, b, c, d, ...args) => math.intersectLineLine(
		{ vector: a, origin: b },
		{ vector: c, origin: d },
		...args,
	);
	[
		// INCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.includeS, math.includeS),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.includeS, math.includeS),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.includeS, math.includeS),
		// INCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.includeS, math.includeS),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.includeS, math.includeS),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.includeS, math.includeS),
		// INCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.includeS, math.includeS),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.includeS, math.includeS),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.includeS, math.includeS),
		// EXCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.excludeS, math.excludeS),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.excludeS, math.excludeS),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.excludeS, math.excludeS),
		// EXCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.excludeS, math.excludeS),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.excludeS, math.excludeS),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.excludeS, math.excludeS),
		// EXCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.excludeS, math.excludeS),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.excludeS, math.excludeS),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.excludeS, math.excludeS),
	].forEach(res => expect(res).toBe(undefined));
});

test("collinear segment intersections, types not core", () => {
	const intersect = (a, b) => math.intersectLineLine(a, b);
	[
		// horizontal
		intersect(
			math.pointsToLine([0, 2], [2, 2]),
			math.pointsToLine([-1, 2], [10, 2]),
		),
		intersect(
			math.pointsToLine([0, 2], [2, 2]),
			math.pointsToLine([10, 2], [-1, 2]),
		),
		// vertical
		intersect(
			math.pointsToLine([2, 0], [2, 2]),
			math.pointsToLine([2, -1], [2, 10]),
		),
		intersect(
			math.pointsToLine([2, 0], [2, 2]),
			math.pointsToLine([2, 10], [2, -1]),
		),
		// diagonal
		intersect(
			math.pointsToLine([0, 0], [2, 2]),
			math.pointsToLine([-1, -1], [5, 5]),
		),
		intersect(
			math.pointsToLine([0, 0], [2, 2]),
			math.pointsToLine([5, 5], [-1, -1]),
		),
	].forEach(res => expect(res).toBe(undefined));
});

test("clip polygon polygon, same polygon", () => {
	// all of the "b" cases are flipped clockwise and should return no solution
	// same polygon
	const res1 = math.clipPolygonPolygon(
		[[60, 10], [50, 50], [20, 20]],
		[[50, 50], [20, 20], [60, 10]],
	);
	expect(res1.length).toBe(3);

	const res2 = math.clipPolygonPolygon(
		[[50, 50], [25, 25], [50, 0]],
		[[50, 50], [25, 25], [50, 0]],
	);
	expect(res2.length).toBe(3);

	const res2b = math.clipPolygonPolygon(
		[[50, 0], [25, 25], [50, 50]],
		[[50, 0], [25, 25], [50, 50]],
	);
	expect(res2b).toBe(undefined);

	// same polygon, array rotated
	const res3 = math.clipPolygonPolygon(
		[[50, 50], [25, 25], [50, 0]],
		[[25, 25], [50, 0], [50, 50]],
	);
	expect(res3.length).toBe(3);

	const res3b = math.clipPolygonPolygon(
		[[50, 0], [25, 25], [50, 50]],
		[[50, 50], [50, 0], [25, 25]],
	);
	expect(res3b).toBe(undefined);
});

test("polygon polygon, edge aligned", () => {
	// edge aligned

	const poly3 = [[40, 40], [100, 40], [80, 80]];
	const poly4 = [[100, 40], [40, 40], [80, 0]];
	const res2 = math.clipPolygonPolygon(poly3, poly4);
	expect(res2).toBe(undefined);

	const poly5 = [[40, 40], [100, 40], [80, 80]];
	const poly6 = [[90, 40], [50, 40], [80, 0]];
	const res3 = math.clipPolygonPolygon(poly5, poly6);
	expect(res3).toBe(undefined);

	const poly7 = [[40, 40], [100, 40], [80, 80]];
	const poly8 = [[200, 40], [50, 40], [80, 0]];
	const res4 = math.clipPolygonPolygon(poly7, poly8);
	expect(res4).toBe(undefined);

	const poly9 = [[40, 40], [100, 40], [80, 80]];
	const poly10 = [[200, 40], [20, 40], [80, 0]];
	const res5 = math.clipPolygonPolygon(poly9, poly10);
	expect(res5).toBe(undefined);
});

test("polygon polygon, epsilon", () => {
	// now with epsilon
	const ep = 1e-10;
	const poly11 = [[40, 40 - ep], [100, 40 - ep], [80, 80]];
	const poly12 = [[100, 40], [40, 40], [80, 0]];
	const res6 = math.clipPolygonPolygon(poly11, poly12);
	expect(res6).toBe(undefined);
	const res7 = math.clipPolygonPolygon(poly12, poly11);
	expect(res7).toBe(undefined);

	const poly13 = [[60, 10], [50, 50], [20, 20]];
	const poly14 = [[50 + ep, 50 + ep], [20, 20], [60, 10]];
	const res8 = math.clipPolygonPolygon(poly13, poly14);
	expect(res8.length).toBe(3);
	const res9 = math.clipPolygonPolygon(poly14, poly13);
	expect(res9.length).toBe(3);

	const poly15 = [[60, 10], [50, 50], [20, 20]];
	const poly16 = [[50 - ep, 50 - ep], [20, 20], [60, 10]];
	const res10 = math.clipPolygonPolygon(poly15, poly16);
	expect(res10.length).toBe(3);
	const res11 = math.clipPolygonPolygon(poly16, poly15);
	expect(res11.length).toBe(3);
});

test("polygon polygon collinear edge", () => {
	// problems because polygon1 has a pair of collinear edges.
	// method succeeds in one order but not the other.
	const polygon1 = [
		[-0.565685424949238, -0.14142135623730953],
		[-0.07071067811865475, 0.07071067811865477],
		[0, 0],
		[-0.3535533905932738, -0.35355339059327373],
		[-0.42426406871192857, -0.28284271247461895],
	];
	const polygon2 = [
		[-0.3535533905932738, -0.35355339059327373],
		[0, 0],
		[-0.21213203435596423, 0.21213203435596426],
		[-0.42426406871192857, -0.28284271247461895],
	];
	const res1 = math.clipPolygonPolygon(polygon1, polygon2);
	const res2 = math.clipPolygonPolygon(polygon2, polygon1);
});

test("intersect lines", () => {
	const clipLine = math.intersectCircleLine(
		{ radius: 1, origin: [0, 0] },
		{ vector: [0, 1], origin: [0.5, 0] },
	);
	const shouldBeLine = [[0.5, -Math.sqrt(3) / 2], [0.5, Math.sqrt(3) / 2]];
	math.epsilonEqualVectors(clipLine[0], shouldBeLine[0]);
	math.epsilonEqualVectors(clipLine[1], shouldBeLine[1]);
	// no intersect
	expect(math.intersectCircleLine(
		{ radius: 1, origin: [2, 2] },
		{ vector: [0, 1], origin: [10, 0] },
	)).toBe(undefined);
	// tangent
	const tangent = math.intersectCircleLine(
		{ radius: 1, origin: [2, 0] },
		{ vector: [0, 1], origin: [3, 0] },
	);
	expect(tangent[0][0]).toBe(3);
	expect(tangent[0][1]).toBe(0);

	const shouldBeRay = [Math.SQRT1_2, Math.SQRT1_2];
	const clipRay = math.intersectCircleLine(
		{ radius: 1, origin: [0, 0] },
		{ vector: [0.1, 0.1], origin: [0, 0] },
		math.include,
		math.includeR,
	);
	math.epsilonEqualVectors(shouldBeRay, clipRay[0]);

	const shouldBeSeg = [Math.SQRT1_2, Math.SQRT1_2];
	const clipSeg = math.intersectCircleLine(
		{ radius: 1, origin: [0, 0] },
		{ vector: [10, 10], origin: [0, 0] },
		math.include,
		math.includeS,
	);
	math.epsilonEqualVectors(shouldBeSeg, clipSeg[0]);
});

test("circle circle intersect", () => {
	// intersect
	const result0 = math.intersectCircleCircle(
		{ radius: 2, origin: [0, 0] },
		{ radius: 2, origin: [1, 0] },
	);
	expect(result0[0][0]).toBeCloseTo(0.5);
	expect(result0[1][0]).toBeCloseTo(0.5);
	expect(result0[0][1]).toBeCloseTo(-Math.sqrt(3.75));
	expect(result0[1][1]).toBeCloseTo(Math.sqrt(3.75));
	// same origin
	expect(math.intersectCircleCircle(
		{ radius: 1, origin: [0, 0] },
		{ radius: 2, origin: [0, 0] },
	)).toBe(undefined);
	// kissing circles
	const result1 = math.intersectCircleCircle(
		{ radius: 1, origin: [0, 0] },
		{ radius: 1, origin: [2, 0] },
	);
	expect(result1[0][0]).toBe(1);
	expect(result1[0][1]).toBe(0);
	const result2 = math.intersectCircleCircle(
		{ radius: 1, origin: [0, 0] },
		{ radius: 1, origin: [Math.SQRT2, Math.SQRT2] },
	);
	expect(result2[0][0]).toBeCloseTo(Math.SQRT1_2);
	expect(result2[0][1]).toBeCloseTo(Math.SQRT1_2);
	// circles are contained
	expect(math.intersectCircleCircle(
		{ radius: 10, origin: [0, 0] },
		{ radius: 1, origin: [2, 0] },
	)).toBe(undefined);
});

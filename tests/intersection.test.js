const { test, expect } = require("@jest/globals");
const math = require("../math");

test("intersections", () => {
	const polygon = math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
	const circle = math.circle(1);
	const line = math.line([1, 2], [0.5, 0]);
	const ray = math.ray([-1, 2], [0.5, -0.1]);
	const segment = math.segment([-2, 0.5], [2, 0.5]);

	const polygon2 = math.polygon([0, -1.15], [1, 0.577], [-1, 0.577]);
	const circle2 = math.circle(1, [0.5, 0]);
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

test("intersectLineLine include exclude", () => {
	const res0 = math.core
		.intersectLineLine([0, 1], [1, 0], [1, 0], [0, 1]);
	const res1 = math.core
		.intersectLineLine([0, 1], [1, 0], [1, 0], [0, 1], math.core.includeS, math.core.includeS);
	const res2 = math.core
		.intersectLineLine([0, 1], [1, 0], [1, 0], [0, 1], math.core.excludeS, math.core.excludeS);
	expect(res0).not.toBe(undefined);
	expect(res1).not.toBe(undefined);
	expect(res2).toBe(undefined);
});

test("intersectConvexPolygonLine include exclude vertex aligned", () => {
	const poly = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	// two lines, vertex aligned
	const res0 = math.core.intersectConvexPolygonLine(
		poly,
		[0, 1],
		[1, -5],
		math.core.includeS,
		math.core.includeL,
	);
	const res1 = math.core.intersectConvexPolygonLine(
		poly,
		[0, 1],
		[1, -5],
		math.core.excludeS,
		math.core.excludeL,
	);
	// two segements endpoint on vertex
	const res2 = math.core.intersectConvexPolygonLine(
		poly,
		[0, 1],
		[1, -1],
		math.core.includeS,
		math.core.includeS,
	);
	const res3 = math.core.intersectConvexPolygonLine(
		poly,
		[0, 1],
		[1, -1],
		math.core.includeS,
		math.core.excludeS,
	);
	const res4 = math.core.intersectConvexPolygonLine(
		poly,
		[0, 1],
		[1, -1],
		math.core.excludeS,
		math.core.includeS,
	);
	const res5 = math.core.intersectConvexPolygonLine(
		poly,
		[0, 1],
		[1, -1],
		math.core.excludeS,
		math.core.excludeS,
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
	const res0 = math.core.intersectConvexPolygonLine(
		poly,
		[0, 1],
		[1, -5],
		math.core.includeS,
		math.core.excludeL,
	);
	const res1 = math.core.intersectConvexPolygonLine(
		poly,
		[0, 1],
		[1, -5],
		math.core.excludeS,
		math.core.excludeL,
	);
	expect(res0).not.toBe(undefined);
	expect(res1).toBe(undefined);
});

const convexPolyLineInclusive = (poly, vec, org, ep) => math.core.intersectConvexPolygonLine(
	poly,
	vec,
	org,
	math.core.includeS,
	math.core.includeL,
	ep,
);
const convexPolyRayInclusive = (poly, vec, org, ep) => math.core.intersectConvexPolygonLine(
	poly,
	vec,
	org,
	math.core.includeS,
	math.core.includeR,
	ep,
);
const convexPolySegmentInclusive = (poly, pt0, pt1, ep) => math.core.intersectConvexPolygonLine(
	poly,
	math.core.subtract(pt1, pt0),
	pt0,
	math.core.includeS,
	math.core.includeS,
	ep,
);
const convexPolyLineExclusive = (poly, vec, org, ep) => math.core.intersectConvexPolygonLine(
	poly,
	vec,
	org,
	math.core.excludeS,
	math.core.excludeL,
	ep,
);
const convexPolyRayExclusive = (poly, vec, org, ep) => math.core.intersectConvexPolygonLine(
	poly,
	vec,
	org,
	math.core.excludeS,
	math.core.excludeR,
	ep,
);
const convexPolySegmentExclusive = (poly, pt0, pt1, ep) => math.core.intersectConvexPolygonLine(
	poly,
	math.core.subtract(pt1, pt0),
	pt0,
	math.core.excludeS,
	math.core.excludeS,
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
	const lineSeg = math.polygon.regularPolygon(4).intersect(math.line([1, 0]));
	expect(Math.abs(lineSeg[0][0])).toBeCloseTo(1);
	expect(lineSeg[0][1]).toBeCloseTo(0);
	expect(Math.abs(lineSeg[1][0])).toBeCloseTo(1);
	expect(lineSeg[1][1]).toBeCloseTo(0);

	const raySeg1 = math.polygon.regularPolygon(4).intersect(math.ray([1, 0]));
	expect(raySeg1.length).toBe(1);
	expect(Math.abs(raySeg1[0][0])).toBeCloseTo(1);
	expect(raySeg1[0][1]).toBeCloseTo(0);
	const raySeg2 = math.polygon.regularPolygon(4).intersect(math.ray([1, 0], [-10, 0]));
	expect(raySeg2.length).toBe(2);
	expect(Math.abs(raySeg2[0][0])).toBeCloseTo(1);
	expect(raySeg2[0][1]).toBeCloseTo(0);
	expect(Math.abs(raySeg2[1][0])).toBeCloseTo(1);
	expect(raySeg2[1][1]).toBeCloseTo(0);
	const raySeg3 = math.polygon.regularPolygon(4).intersect(math.ray([1, 0], [10, 0]));
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
	const intersect = math.core.intersectLineLine;
	[
		// INCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.core.includeL, math.core.includeL),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.core.includeL, math.core.includeL),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.core.includeL, math.core.includeL),
		// INCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.core.includeL, math.core.includeL),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.core.includeL, math.core.includeL),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.core.includeL, math.core.includeL),
		// INCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.core.includeL, math.core.includeL),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.core.includeL, math.core.includeL),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.core.includeL, math.core.includeL),
		// EXCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.core.excludeL, math.core.excludeL),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.core.excludeL, math.core.excludeL),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.core.excludeL, math.core.excludeL),
		// EXCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.core.excludeL, math.core.excludeL),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.core.excludeL, math.core.excludeL),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.core.excludeL, math.core.excludeL),
		// EXCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.core.excludeL, math.core.excludeL),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.core.excludeL, math.core.excludeL),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.core.excludeL, math.core.excludeL),
	].forEach(res => expect(res).toBe(undefined));
});

test("collinear ray intersections", () => {
	const intersect = math.core.intersectLineLine;
	[
		// INCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.core.includeR, math.core.includeR),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.core.includeR, math.core.includeR),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.core.includeR, math.core.includeR),
		// INCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.core.includeR, math.core.includeR),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.core.includeR, math.core.includeR),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.core.includeR, math.core.includeR),
		// INCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.core.includeR, math.core.includeR),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.core.includeR, math.core.includeR),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.core.includeR, math.core.includeR),
		// EXCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.core.excludeR, math.core.excludeR),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.core.excludeR, math.core.excludeR),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.core.excludeR, math.core.excludeR),
		// EXCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.core.excludeR, math.core.excludeR),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.core.excludeR, math.core.excludeR),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.core.excludeR, math.core.excludeR),
		// EXCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.core.excludeR, math.core.excludeR),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.core.excludeR, math.core.excludeR),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.core.excludeR, math.core.excludeR),
	].forEach(res => expect(res).toBe(undefined));
});

test("collinear segment intersections", () => {
	const intersect = math.core.intersectLineLine;
	[
		// INCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.core.includeS, math.core.includeS),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.core.includeS, math.core.includeS),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.core.includeS, math.core.includeS),
		// INCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.core.includeS, math.core.includeS),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.core.includeS, math.core.includeS),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.core.includeS, math.core.includeS),
		// INCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.core.includeS, math.core.includeS),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.core.includeS, math.core.includeS),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.core.includeS, math.core.includeS),
		// EXCLUDE horizontal
		intersect([1, 0], [2, 2], [1, 0], [-1, 2], math.core.excludeS, math.core.excludeS),
		intersect([1, 0], [2, 2], [-1, 0], [-1, 2], math.core.excludeS, math.core.excludeS),
		intersect([-1, 0], [2, 2], [1, 0], [-1, 2], math.core.excludeS, math.core.excludeS),
		// EXCLUDE vertical
		intersect([0, 1], [3, 0], [0, 1], [3, 3], math.core.excludeS, math.core.excludeS),
		intersect([0, 1], [3, 0], [0, -1], [3, 3], math.core.excludeS, math.core.excludeS),
		intersect([0, -1], [3, 0], [0, 1], [3, 3], math.core.excludeS, math.core.excludeS),
		// EXCLUDE diagonal
		intersect([1, 1], [2, 2], [1, 1], [-1, -1], math.core.excludeS, math.core.excludeS),
		intersect([-1, -1], [2, 2], [1, 1], [-1, -1], math.core.excludeS, math.core.excludeS),
		intersect([1, 1], [2, 2], [-1, -1], [-1, -1], math.core.excludeS, math.core.excludeS),
	].forEach(res => expect(res).toBe(undefined));
});

test("collinear segment intersections, types not core", () => {
	[ // horizontal
		math.segment([0, 2], [2, 2]).intersect(math.segment([-1, 2], [10, 2])),
		math.segment([0, 2], [2, 2]).intersect(math.segment([10, 2], [-1, 2])),
		// vertical
		math.segment([2, 0], [2, 2]).intersect(math.segment([2, -1], [2, 10])),
		math.segment([2, 0], [2, 2]).intersect(math.segment([2, 10], [2, -1])),
		// diagonal
		math.segment([0, 0], [2, 2]).intersect(math.segment([-1, -1], [5, 5])),
		math.segment([0, 0], [2, 2]).intersect(math.segment([5, 5], [-1, -1])),
	].forEach(res => expect(res).toBe(undefined));
});

test("clip polygon polygon, same polygon", () => {
	// all of the "b" cases are flipped clockwise and should return no solution
	// same polygon
	const res1 = math.core.clipPolygonPolygon(
		[[60, 10], [50, 50], [20, 20]],
		[[50, 50], [20, 20], [60, 10]],
	);
	expect(res1.length).toBe(3);

	const res2 = math.core.clipPolygonPolygon(
		[[50, 50], [25, 25], [50, 0]],
		[[50, 50], [25, 25], [50, 0]],
	);
	expect(res2.length).toBe(3);

	const res2b = math.core.clipPolygonPolygon(
		[[50, 0], [25, 25], [50, 50]],
		[[50, 0], [25, 25], [50, 50]],
	);
	expect(res2b).toBe(undefined);

	// same polygon, array rotated
	const res3 = math.core.clipPolygonPolygon(
		[[50, 50], [25, 25], [50, 0]],
		[[25, 25], [50, 0], [50, 50]],
	);
	expect(res3.length).toBe(3);

	const res3b = math.core.clipPolygonPolygon(
		[[50, 0], [25, 25], [50, 50]],
		[[50, 50], [50, 0], [25, 25]],
	);
	expect(res3b).toBe(undefined);
});

test("polygon polygon, edge aligned", () => {
	// edge aligned

	const poly3 = [[40, 40], [100, 40], [80, 80]];
	const poly4 = [[100, 40], [40, 40], [80, 0]];
	const res2 = math.core.clipPolygonPolygon(poly3, poly4);
	expect(res2).toBe(undefined);

	const poly5 = [[40, 40], [100, 40], [80, 80]];
	const poly6 = [[90, 40], [50, 40], [80, 0]];
	const res3 = math.core.clipPolygonPolygon(poly5, poly6);
	expect(res3).toBe(undefined);

	const poly7 = [[40, 40], [100, 40], [80, 80]];
	const poly8 = [[200, 40], [50, 40], [80, 0]];
	const res4 = math.core.clipPolygonPolygon(poly7, poly8);
	expect(res4).toBe(undefined);

	const poly9 = [[40, 40], [100, 40], [80, 80]];
	const poly10 = [[200, 40], [20, 40], [80, 0]];
	const res5 = math.core.clipPolygonPolygon(poly9, poly10);
	expect(res5).toBe(undefined);
});

test("polygon polygon, epsilon", () => {
	// now with epsilon
	const ep = 1e-10;
	const poly11 = [[40, 40 - ep], [100, 40 - ep], [80, 80]];
	const poly12 = [[100, 40], [40, 40], [80, 0]];
	const res6 = math.core.clipPolygonPolygon(poly11, poly12);
	expect(res6).toBe(undefined);
	const res7 = math.core.clipPolygonPolygon(poly12, poly11);
	expect(res7).toBe(undefined);

	const poly13 = [[60, 10], [50, 50], [20, 20]];
	const poly14 = [[50 + ep, 50 + ep], [20, 20], [60, 10]];
	const res8 = math.core.clipPolygonPolygon(poly13, poly14);
	expect(res8.length).toBe(3);
	const res9 = math.core.clipPolygonPolygon(poly14, poly13);
	expect(res9.length).toBe(3);

	const poly15 = [[60, 10], [50, 50], [20, 20]];
	const poly16 = [[50 - ep, 50 - ep], [20, 20], [60, 10]];
	const res10 = math.core.clipPolygonPolygon(poly15, poly16);
	expect(res10.length).toBe(3);
	const res11 = math.core.clipPolygonPolygon(poly16, poly15);
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
	const res1 = math.core.clipPolygonPolygon(polygon1, polygon2);
	const res2 = math.core.clipPolygonPolygon(polygon2, polygon1);
});

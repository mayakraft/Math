const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("intersections", () => {
	const polygon = [[0, 1.15], [-1, -0.577], [1, -0.577]];
	const circle = { radius: 1, origin: [0, 0] };
	const line = { vector: [1, 2], origin: [0.5, 0] };
	const ray = { vector: [-1, 2], origin: [0.5, -0.1], domain: math.excludeR };
	const segment = { vector: [4, 0], origin: [-2, 0.5], domain: math.excludeS };

	const polygon2 = [[0, -1.15], [1, 0.577], [-1, 0.577]];
	const circle2 = { radius: 1, origin: [0.5, 0] };
	const line2 = { vector: [-1, 2], origin: [0.5, 0] };
	const ray2 = { vector: [1, 2], origin: [-0.5, 0], domain: math.excludeR };
	const segment2 = { vector: [0, 4], origin: [0.5, -2], domain: math.excludeS };

	[
		math.intersect(polygon, line),
		math.intersect(polygon, ray),
		math.intersect(polygon, segment),
		math.intersect(circle, circle2),
		math.intersect(circle, line),
		math.intersect(circle, ray),
		math.intersect(circle, segment),
		math.intersect(line, polygon),
		math.intersect(line, circle),
		math.intersect(line, line2),
		math.intersect(line, ray),
		math.intersect(line, segment),
		math.intersect(ray, polygon),
		math.intersect(ray, circle),
		math.intersect(ray, line),
		math.intersect(ray, ray2),
		math.intersect(ray, segment),
		math.intersect(segment, polygon),
		math.intersect(segment, circle),
		math.intersect(segment, line),
		math.intersect(segment, ray),
		math.intersect(segment, segment2),
	].forEach(intersect => expect(intersect).not.toBe(undefined));

	// intersection between these types is not yet implemented
	[
		math.intersect(polygon, polygon2),
		math.intersect(polygon, circle),
		math.intersect(circle, polygon),
	].forEach(intersect => expect(intersect).toBe(undefined));
});

test("collinear segment intersections, types not core", () => {
	// horizontal
	const seg01 = math.pointsToLine([0, 2], [2, 2]);
	const seg02 = math.pointsToLine([-1, 2], [10, 2]);
	const seg03 = math.pointsToLine([0, 2], [2, 2]);
	const seg04 = math.pointsToLine([10, 2], [-1, 2]);
	// vertical
	const seg05 = math.pointsToLine([2, 0], [2, 2]);
	const seg06 = math.pointsToLine([2, -1], [2, 10]);
	const seg07 = math.pointsToLine([2, 0], [2, 2]);
	const seg08 = math.pointsToLine([2, 10], [2, -1]);
	// diagonal
	const seg09 = math.pointsToLine([0, 0], [2, 2]);
	const seg10 = math.pointsToLine([-1, -1], [5, 5]);
	const seg11 = math.pointsToLine([0, 0], [2, 2]);
	const seg12 = math.pointsToLine([5, 5], [-1, -1]);
	[seg01, seg02, seg03, seg04, seg05, seg06, seg07, seg08, seg09, seg10, seg11, seg12]
		.forEach(seg => { seg.domain = math.excludeS; });
	[[seg01, seg02],
		[seg03, seg04],
		[seg05, seg06],
		[seg07, seg08],
		[seg09, seg10],
		[seg11, seg12],
	].map(pair => math.intersect(...pair))
		.forEach(res => expect(res).toBe(undefined));
});

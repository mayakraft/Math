const { test, expect } = require("@jest/globals");
const math = require("../math.js");

const {
	exclude,
	include,
	includeL,
	excludeL,
	includeR,
	excludeR,
	includeS,
	excludeS,
} = math;

const clip_line_in_convex_poly_inclusive = function () {
	return math.clipLineConvexPolygon(
		...arguments,
		math.include,
		math.includeL,
	);
};
const clip_line_in_convex_poly_exclusive = function () {
	return math.clipLineConvexPolygon(
		...arguments,
		math.exclude,
		math.excludeL,
	);
};
const clip_ray_in_convex_poly_inclusive = function () {
	return math.clipLineConvexPolygon(
		...arguments,
		math.include,
		math.includeR,
	);
};
const clip_ray_in_convex_poly_exclusive = function () {
	return math.clipLineConvexPolygon(
		...arguments,
		math.exclude,
		math.excludeR,
	);
};
const clip_segment_in_convex_poly_inclusive = function (poly, s0, s1) {
	const vector = [s1[0] - s0[0], s1[1] - s0[1]];
	return math.clipLineConvexPolygon(
		poly,
		vector,
		s0,
		math.include,
		math.includeS,
	);
};
const clip_segment_in_convex_poly_exclusive = function (poly, s0, s1) {
	const vector = [s1[0] - s0[0], s1[1] - s0[1]];
	return math.clipLineConvexPolygon(
		poly,
		vector,
		s0,
		math.exclude,
		math.excludeS,
	);
};

test("collinear line", () => {
	// all inclusive cases will return a segment with unique endpoints
	// all exclusive cases will return undefined
	const rect = [[0, 0], [1, 0], [1, 1], [0, 1]];
	const lineHoriz1 = [[1, 0], [0.5, 0]];
	const lineHoriz2 = [[1, 0], [0.5, 1]];
	const lineVert1 = [[0, 1], [0, 0.5]];
	const lineVert2 = [[0, 1], [1, 0.5]];
	const result1 = math.clipLineConvexPolygon(rect, ...lineHoriz1, include, includeL);
	const result2 = math.clipLineConvexPolygon(rect, ...lineHoriz2, include, includeL);
	const result3 = math.clipLineConvexPolygon(rect, ...lineVert1, include, includeL);
	const result4 = math.clipLineConvexPolygon(rect, ...lineVert2, include, includeL);
	const result5 = math.clipLineConvexPolygon(rect, ...lineHoriz1, exclude, excludeL);
	const result6 = math.clipLineConvexPolygon(rect, ...lineHoriz2, exclude, excludeL);
	const result7 = math.clipLineConvexPolygon(rect, ...lineVert1, exclude, excludeL);
	const result8 = math.clipLineConvexPolygon(rect, ...lineVert2, exclude, excludeL);
	expect(result1.length).toBe(2);
	expect(result2.length).toBe(2);
	expect(result3.length).toBe(2);
	expect(result4.length).toBe(2);
	expect(result5).toBe(undefined);
	expect(result6).toBe(undefined);
	expect(result7).toBe(undefined);
	expect(result8).toBe(undefined);
	expect(JSON.stringify(result1[0])).not.toBe(JSON.stringify(result1[1]));
	expect(JSON.stringify(result2[0])).not.toBe(JSON.stringify(result2[1]));
	expect(JSON.stringify(result3[0])).not.toBe(JSON.stringify(result3[1]));
	expect(JSON.stringify(result4[0])).not.toBe(JSON.stringify(result4[1]));
});

test("vertex-incident line", () => {
	// all cases will return undefined
	const quad = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const lineHoriz1 = [[1, 0], [-1, 1]];
	const lineHoriz2 = [[1, 0], [-1, -1]];
	const lineVert1 = [[0, 1], [-1, -1]];
	const lineVert2 = [[0, 1], [1, -1]];
	const results = [
		math.clipLineConvexPolygon(quad, ...lineHoriz1, include, includeL),
		math.clipLineConvexPolygon(quad, ...lineHoriz2, include, includeL),
		math.clipLineConvexPolygon(quad, ...lineVert1, include, includeL),
		math.clipLineConvexPolygon(quad, ...lineVert2, include, includeL),
		math.clipLineConvexPolygon(quad, ...lineHoriz1, exclude, excludeL),
		math.clipLineConvexPolygon(quad, ...lineHoriz2, exclude, excludeL),
		math.clipLineConvexPolygon(quad, ...lineVert1, exclude, excludeL),
		math.clipLineConvexPolygon(quad, ...lineVert2, exclude, excludeL),
	];
	results.forEach(res => expect(res).toBe(undefined));
});

test("collinear core, segment", () => {
	const rect = [[0, 0], [1, 0], [1, 1], [0, 1]];
	// remember these are VECTORS, ORIGIN
	const segHoriz1 = [[1, 0], [0.5, 0]];
	const segHoriz2 = [[1, 0], [-0.5, 0]];
	const segVert1 = [[0, 1], [0, 0.5]];
	const segVert2 = [[0, 1], [1, 0.5]];
	const result1 = math.clipLineConvexPolygon(rect, ...segHoriz1, include, includeS);
	const result2 = math.clipLineConvexPolygon(rect, ...segHoriz2, include, includeS);
	const result3 = math.clipLineConvexPolygon(rect, ...segVert1, include, includeS);
	const result4 = math.clipLineConvexPolygon(rect, ...segVert2, include, includeS);
	const result5 = math.clipLineConvexPolygon(rect, ...segHoriz1, exclude, excludeS);
	const result6 = math.clipLineConvexPolygon(rect, ...segHoriz2, exclude, excludeS);
	const result7 = math.clipLineConvexPolygon(rect, ...segVert1, exclude, excludeS);
	const result8 = math.clipLineConvexPolygon(rect, ...segVert2, exclude, excludeS);
	expect(result1.length).toBe(2);
	expect(result2.length).toBe(2);
	expect(result3.length).toBe(2);
	expect(result4.length).toBe(2);
	expect(result5).toBe(undefined);
	expect(result6).toBe(undefined);
	expect(result7).toBe(undefined);
	expect(result8).toBe(undefined);
	expect(JSON.stringify(result1[0])).not.toBe(JSON.stringify(result1[1]));
	expect(JSON.stringify(result2[0])).not.toBe(JSON.stringify(result2[1]));
	expect(JSON.stringify(result3[0])).not.toBe(JSON.stringify(result3[1]));
	expect(JSON.stringify(result4[0])).not.toBe(JSON.stringify(result4[1]));
	expect(result1[0][0]).toBe(0.5);
	expect(result1[0][1]).toBe(0);
	expect(result1[1][0]).toBe(1);
	expect(result1[1][1]).toBe(0);
	expect(result2[0][0]).toBe(0);
	expect(result2[0][1]).toBe(0);
	expect(result2[1][0]).toBe(0.5);
	expect(result2[1][1]).toBe(0);
	// remember these are VECTORS, ORIGIN
	const segHoriz3 = [[0.5, 0], [0.25, 0]];
	const segVert3 = [[0, 2], [0, -0.5]];
	const result9 = math.clipLineConvexPolygon(rect, ...segHoriz3, include, includeS);
	const result10 = math.clipLineConvexPolygon(rect, ...segVert3, include, includeS);
	const result11 = math.clipLineConvexPolygon(rect, ...segHoriz3, exclude, excludeS);
	const result12 = math.clipLineConvexPolygon(rect, ...segVert3, exclude, excludeS);
	expect(result9[0][0]).toBe(0.25);
	expect(result9[0][1]).toBe(0);
	expect(result9[1][0]).toBe(0.75);
	expect(result9[1][1]).toBe(0);
	expect(result10[0][0]).toBe(0);
	expect(result10[0][1]).toBe(0);
	expect(result10[1][0]).toBe(0);
	expect(result10[1][1]).toBe(1);
});

test("vertex-incident segment", () => {
	// all cases will return undefined
	const quad = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const horiz1 = [[1, 0], [-1, 1]];
	const horiz2 = [[1, 0], [-1, -1]];
	const vert1 = [[0, 1], [-1, -1]];
	const vert2 = [[0, 1], [1, -1]];
	const results = [
		math.clipLineConvexPolygon(quad, ...horiz1, include, includeS),
		math.clipLineConvexPolygon(quad, ...horiz2, include, includeS),
		math.clipLineConvexPolygon(quad, ...vert1, include, includeS),
		math.clipLineConvexPolygon(quad, ...vert2, include, includeS),
		math.clipLineConvexPolygon(quad, ...horiz1, exclude, excludeS),
		math.clipLineConvexPolygon(quad, ...horiz2, exclude, excludeS),
		math.clipLineConvexPolygon(quad, ...vert1, exclude, excludeS),
		math.clipLineConvexPolygon(quad, ...vert2, exclude, excludeS),
	];
	results.forEach(res => expect(res).toBe(undefined));
});

test("collinear core, ray", () => {
	const rect = [[0, 0], [1, 0], [1, 1], [0, 1]];
	const rayHoriz1 = [[1, 0], [0.5, 0]];
	const rayHoriz2 = [[1, 0], [0.5, 1]];
	const rayVert1 = [[0, 1], [0, 0.5]];
	const rayVert2 = [[0, 1], [1, 0.5]];
	const result1 = math.clipLineConvexPolygon(rect, ...rayHoriz1, include, includeR);
	const result2 = math.clipLineConvexPolygon(rect, ...rayHoriz2, include, includeR);
	const result3 = math.clipLineConvexPolygon(rect, ...rayVert1, include, includeR);
	const result4 = math.clipLineConvexPolygon(rect, ...rayVert2, include, includeR);
	const result5 = math.clipLineConvexPolygon(rect, ...rayHoriz1, exclude, excludeR);
	const result6 = math.clipLineConvexPolygon(rect, ...rayHoriz2, exclude, excludeR);
	const result7 = math.clipLineConvexPolygon(rect, ...rayVert1, exclude, excludeR);
	const result8 = math.clipLineConvexPolygon(rect, ...rayVert2, exclude, excludeR);
	expect(result1.length).toBe(2);
	expect(result2.length).toBe(2);
	expect(result3.length).toBe(2);
	expect(result4.length).toBe(2);
	expect(result5).toBe(undefined);
	expect(result6).toBe(undefined);
	expect(result7).toBe(undefined);
	expect(result8).toBe(undefined);
	expect(JSON.stringify(result1[0])).not.toBe(JSON.stringify(result1[1]));
	expect(JSON.stringify(result2[0])).not.toBe(JSON.stringify(result2[1]));
	expect(JSON.stringify(result3[0])).not.toBe(JSON.stringify(result3[1]));
	expect(JSON.stringify(result4[0])).not.toBe(JSON.stringify(result4[1]));
});

test("vertex-incident ray", () => {
	// all cases will return undefined
	const quad = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const horiz1 = [[1, 0], [-1, 1]];
	const horiz2 = [[1, 0], [-1, -1]];
	const vert1 = [[0, 1], [-1, -1]];
	const vert2 = [[0, 1], [1, -1]];
	const results = [
		math.clipLineConvexPolygon(quad, ...horiz1, include, includeR),
		math.clipLineConvexPolygon(quad, ...horiz2, include, includeR),
		math.clipLineConvexPolygon(quad, ...vert1, include, includeR),
		math.clipLineConvexPolygon(quad, ...vert2, include, includeR),
		math.clipLineConvexPolygon(quad, ...horiz1, exclude, excludeR),
		math.clipLineConvexPolygon(quad, ...horiz2, exclude, excludeR),
		math.clipLineConvexPolygon(quad, ...vert1, exclude, excludeR),
		math.clipLineConvexPolygon(quad, ...vert2, exclude, excludeR),
	];
	results.forEach(res => expect(res).toBe(undefined));
});

test("collinear core, segment", () => {
	const rect = [[0, 0], [1, 0], [1, 1], [0, 1]];
	const segHoriz1 = [[1, 0], [0.5, 0]];
	const segHoriz2 = [[1, 0], [0.5, 1]];
	const segVert1 = [[0, 1], [0, 0.5]];
	const segVert2 = [[0, 1], [1, 0.5]];
	const result1 = clip_segment_in_convex_poly_exclusive(rect, ...segHoriz1);
	const result2 = clip_segment_in_convex_poly_exclusive(rect, ...segHoriz2);
	const result3 = clip_segment_in_convex_poly_exclusive(rect, ...segVert1);
	const result4 = clip_segment_in_convex_poly_exclusive(rect, ...segVert2);
});

test("collinear core, segment, spanning multiple points", () => {
	const poly = [
		[0, 0], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [0, 5],
	];
	const seg = [[5, -1], [5, 6]];
	const res = math.clipLineConvexPolygon(
		poly,
		math.subtract(seg[1], seg[0]),
		seg[0],
		math.include,
		math.includeS,
	);
	expect(res[0][0]).toBe(5);
	expect(res[0][1]).toBe(0);
	expect(res[1][0]).toBe(5);
	expect(res[1][1]).toBe(5);
});

test("collinear core, segment, spanning multiple points, inside", () => {
	const poly = [
		[0, 0], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [0, 5],
	];
	const seg = [[5, 0.5], [5, 4.5]];
	const res = clip_segment_in_convex_poly_inclusive(poly, ...seg);
	expect(res[0][0]).toBe(5);
	expect(res[0][1]).toBe(0.5);
	expect(res[1][0]).toBe(5);
	expect(res[1][1]).toBe(4.5);
});

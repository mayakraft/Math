const math = require("../math");

const exclude = math.core.exclude;
const include = math.core.include;
const includeL = math.core.includeL;
const excludeL = math.core.excludeL;
const includeR = math.core.includeR;
const excludeR = math.core.excludeR;
const includeS = math.core.includeS;
const excludeS = math.core.excludeS;

const clip_line_in_convex_poly_inclusive = function () {
	return math.core.clipLineConvexPolygon(...arguments,
		math.core.include, math.core.includeL);
};
const clip_line_in_convex_poly_exclusive = function () {
	return math.core.clipLineConvexPolygon(...arguments,
		math.core.exclude, math.core.excludeL);
};
const clip_ray_in_convex_poly_inclusive = function () {
	return math.core.clipLineConvexPolygon(...arguments,
		math.core.include, math.core.includeR);
};
const clip_ray_in_convex_poly_exclusive = function () {
	return math.core.clipLineConvexPolygon(...arguments,
		math.core.exclude, math.core.excludeR);
};
const clip_segment_in_convex_poly_inclusive = function (poly, s0, s1) {
	const vector = [s1[0] - s0[0], s1[1] - s0[1]];
	return math.core.clipLineConvexPolygon(poly, vector, s0,
		math.core.include, math.core.includeS);
};
const clip_segment_in_convex_poly_exclusive = function (poly, s0, s1) {
	const vector = [s1[0] - s0[0], s1[1] - s0[1]];
	return math.core.clipLineConvexPolygon(poly, vector, s0,
		math.core.exclude, math.core.excludeS);
};

test("collinear line", () => {
	// all inclusive cases will return a segment with unique endpoints
	// all exclusive cases will return undefined
	const rect = math.rect(1, 1);
	const lineHoriz1 = [[1, 0], [0.5, 0]];
	const lineHoriz2 = [[1, 0], [0.5, 1]];
	const lineVert1 = [[0, 1], [0, 0.5]];
	const lineVert2 = [[0, 1], [1, 0.5]];
	const result1 = math.core.clipLineConvexPolygon(rect, ...lineHoriz1, include, includeL);
	const result2 = math.core.clipLineConvexPolygon(rect, ...lineHoriz2, include, includeL);
	const result3 = math.core.clipLineConvexPolygon(rect, ...lineVert1, include, includeL);
	const result4 = math.core.clipLineConvexPolygon(rect, ...lineVert2, include, includeL);
	const result5 = math.core.clipLineConvexPolygon(rect, ...lineHoriz1, exclude, excludeL);
	const result6 = math.core.clipLineConvexPolygon(rect, ...lineHoriz2, exclude, excludeL);
	const result7 = math.core.clipLineConvexPolygon(rect, ...lineVert1, exclude, excludeL);
	const result8 = math.core.clipLineConvexPolygon(rect, ...lineVert2, exclude, excludeL);
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
	const quad = math.polygon([1,0], [0,1], [-1,0], [0,-1]);
	const lineHoriz1 = [[1, 0], [-1, 1]];
	const lineHoriz2 = [[1, 0], [-1, -1]];
	const lineVert1 = [[0, 1], [-1, -1]];
	const lineVert2 = [[0, 1], [1, -1]];
	const results = [
		math.core.clipLineConvexPolygon(quad, ...lineHoriz1, include, includeL),
		math.core.clipLineConvexPolygon(quad, ...lineHoriz2, include, includeL),
		math.core.clipLineConvexPolygon(quad, ...lineVert1, include, includeL),
		math.core.clipLineConvexPolygon(quad, ...lineVert2, include, includeL),
		math.core.clipLineConvexPolygon(quad, ...lineHoriz1, exclude, excludeL),
		math.core.clipLineConvexPolygon(quad, ...lineHoriz2, exclude, excludeL),
		math.core.clipLineConvexPolygon(quad, ...lineVert1, exclude, excludeL),
		math.core.clipLineConvexPolygon(quad, ...lineVert2, exclude, excludeL),
	];
	results.forEach(res => expect(res).toBe(undefined));
});

test("collinear core, segment", () => {
	const rect = math.rect(1, 1);
	// remember these are VECTORS, ORIGIN
	const segHoriz1 = [[1, 0], [0.5, 0]];
	const segHoriz2 = [[1, 0], [-0.5, 0]];
	const segVert1 = [[0, 1], [0, 0.5]];
	const segVert2 = [[0, 1], [1, 0.5]];
	const result1 = math.core.clipLineConvexPolygon(rect, ...segHoriz1, include, includeS);
	const result2 = math.core.clipLineConvexPolygon(rect, ...segHoriz2, include, includeS);
	const result3 = math.core.clipLineConvexPolygon(rect, ...segVert1, include, includeS);
	const result4 = math.core.clipLineConvexPolygon(rect, ...segVert2, include, includeS);
	const result5 = math.core.clipLineConvexPolygon(rect, ...segHoriz1, exclude, excludeS);
	const result6 = math.core.clipLineConvexPolygon(rect, ...segHoriz2, exclude, excludeS);
	const result7 = math.core.clipLineConvexPolygon(rect, ...segVert1, exclude, excludeS);
	const result8 = math.core.clipLineConvexPolygon(rect, ...segVert2, exclude, excludeS);
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
	const result9 = math.core.clipLineConvexPolygon(rect, ...segHoriz3, include, includeS);
	const result10 = math.core.clipLineConvexPolygon(rect, ...segVert3, include, includeS);
	const result11 = math.core.clipLineConvexPolygon(rect, ...segHoriz3, exclude, excludeS);
	const result12 = math.core.clipLineConvexPolygon(rect, ...segVert3, exclude, excludeS);
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
	const quad = math.polygon([1,0], [0,1], [-1,0], [0,-1]);
	const horiz1 = [[1, 0], [-1, 1]];
	const horiz2 = [[1, 0], [-1, -1]];
	const vert1 = [[0, 1], [-1, -1]];
	const vert2 = [[0, 1], [1, -1]];
	const results = [
		math.core.clipLineConvexPolygon(quad, ...horiz1, include, includeS),
		math.core.clipLineConvexPolygon(quad, ...horiz2, include, includeS),
		math.core.clipLineConvexPolygon(quad, ...vert1, include, includeS),
		math.core.clipLineConvexPolygon(quad, ...vert2, include, includeS),
		math.core.clipLineConvexPolygon(quad, ...horiz1, exclude, excludeS),
		math.core.clipLineConvexPolygon(quad, ...horiz2, exclude, excludeS),
		math.core.clipLineConvexPolygon(quad, ...vert1, exclude, excludeS),
		math.core.clipLineConvexPolygon(quad, ...vert2, exclude, excludeS),
	];
	results.forEach(res => expect(res).toBe(undefined));
});


test("collinear core, ray", () => {
	const rect = math.rect(1, 1);
	const rayHoriz1 = [[1, 0], [0.5, 0]];
	const rayHoriz2 = [[1, 0], [0.5, 1]];
	const rayVert1 = [[0, 1], [0, 0.5]];
	const rayVert2 = [[0, 1], [1, 0.5]];
	const result1 = math.core.clipLineConvexPolygon(rect, ...rayHoriz1, include, includeR);
	const result2 = math.core.clipLineConvexPolygon(rect, ...rayHoriz2, include, includeR);
	const result3 = math.core.clipLineConvexPolygon(rect, ...rayVert1, include, includeR);
	const result4 = math.core.clipLineConvexPolygon(rect, ...rayVert2, include, includeR);
	const result5 = math.core.clipLineConvexPolygon(rect, ...rayHoriz1, exclude, excludeR);
	const result6 = math.core.clipLineConvexPolygon(rect, ...rayHoriz2, exclude, excludeR);
	const result7 = math.core.clipLineConvexPolygon(rect, ...rayVert1, exclude, excludeR);
	const result8 = math.core.clipLineConvexPolygon(rect, ...rayVert2, exclude, excludeR);
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
	const quad = math.polygon([1,0], [0,1], [-1,0], [0,-1]);
	const horiz1 = [[1, 0], [-1, 1]];
	const horiz2 = [[1, 0], [-1, -1]];
	const vert1 = [[0, 1], [-1, -1]];
	const vert2 = [[0, 1], [1, -1]];
	const results = [
		math.core.clipLineConvexPolygon(quad, ...horiz1, include, includeR),
		math.core.clipLineConvexPolygon(quad, ...horiz2, include, includeR),
		math.core.clipLineConvexPolygon(quad, ...vert1, include, includeR),
		math.core.clipLineConvexPolygon(quad, ...vert2, include, includeR),
		math.core.clipLineConvexPolygon(quad, ...horiz1, exclude, excludeR),
		math.core.clipLineConvexPolygon(quad, ...horiz2, exclude, excludeR),
		math.core.clipLineConvexPolygon(quad, ...vert1, exclude, excludeR),
		math.core.clipLineConvexPolygon(quad, ...vert2, exclude, excludeR),
	];
	results.forEach(res => expect(res).toBe(undefined));
});

test("collinear core, segment", () => {
	const rect = math.rect(1, 1);
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
	const poly = [[0, 0], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [0, 5]];
	const seg = [[5, -1], [5, 6]];
	const res = math.core.clipLineConvexPolygon(poly,
		math.core.subtract(seg[1], seg[0]),
		seg[0],
		math.core.include,
		math.core.includeS);
	expect(res[0][0]).toBe(5);
	expect(res[0][1]).toBe(0);
	expect(res[1][0]).toBe(5);
	expect(res[1][1]).toBe(5);
});

test("collinear core, segment, spanning multiple points, inside", () => {
	const poly = [[0, 0], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [0, 5]];
	const seg = [[5, 0.5], [5, 4.5]];
	const res = clip_segment_in_convex_poly_inclusive(poly, ...seg);
	expect(res[0][0]).toBe(5);
	expect(res[0][1]).toBe(0.5);
	expect(res[1][0]).toBe(5);
	expect(res[1][1]).toBe(4.5);
});

test("math types, clip line in rect", () => {
	const rect = math.rect(-1, -1, 2, 2);
	rect.exclusive();
	expect(rect.clip(math.line(1, 1))).not.toBe(undefined);
	expect(rect.clip(math.line([1, 0], [0, 1]))).toBe(undefined);
	expect(rect.clip(math.line(1, -1))).not.toBe(undefined);
	rect.inclusive();
	expect(rect.clip(math.line([1, 0], [0, 1]))).not.toBe(undefined);

	// same as above, but inclusive test.
	const result1 = clip_line_in_convex_poly_inclusive(
		rect,
		math.line(1, 1).vector,
		math.line(1, 1).origin,
	);
	expect(result1[0][0]).toBe(-1);
	expect(result1[0][1]).toBe(-1);
	expect(result1[1][0]).toBe(1);
	expect(result1[1][1]).toBe(1);
	const result2 = clip_line_in_convex_poly_inclusive(
		rect,
		math.line([1, 0], [0, 1]).vector,
		math.line([1, 0], [0, 1]).origin,
	);
	expect(result2[0][0]).toBe(-1);
	expect(result2[0][1]).toBe(1);
	expect(result2[1][0]).toBe(1);
	expect(result2[1][1]).toBe(1);
	const result3 = clip_line_in_convex_poly_inclusive(
		rect,
		math.line(1, -1).vector,
		math.line(1, -1).origin,
	);
	expect(result3[0][0]).toBe(-1);
	expect(result3[0][1]).toBe(1);
	expect(result3[1][0]).toBe(1);
	expect(result3[1][1]).toBe(-1);
});

test("math types, clip ray in rect", () => {
	const rect = math.rect(-1, -1, 2, 2);
	const result1 = rect.clip(math.ray(1, 1));
	expect(result1[0][0]).toBe(0);
	expect(result1[0][1]).toBe(0);
	expect(result1[1][0]).toBe(1);
	expect(result1[1][1]).toBe(1);
	rect.inclusive();
	expect(rect.clip(math.ray([1, 0], [0, 1]))).not.toBe(undefined);
	rect.exclusive();
	expect(rect.clip(math.ray([1, 0], [0, 1]))).toBe(undefined);
	const result3 = rect.clip(math.ray(1, -1));
	expect(result3[0][0]).toBe(0);
	expect(result3[0][1]).toBe(0);
	expect(result3[1][0]).toBe(1);
	expect(result3[1][1]).toBe(-1);
});

test("math types, clip segment in rect", () => {
	const rect = math.rect(-1, -1, 2, 2);
	const result1 = rect.clip(math.segment([0, 0], [1, 1]));
	expect(result1[0][0]).toBe(0);
	expect(result1[0][1]).toBe(0);
	expect(result1[1][0]).toBe(1);
	expect(result1[1][1]).toBe(1);
	const result2 = rect.clip(math.segment([0, 0], [2, 2]));
	expect(result2[0][0]).toBe(0);
	expect(result2[0][1]).toBe(0);
	expect(result2[1][0]).toBe(1);
	expect(result2[1][1]).toBe(1);
	const result3 = rect.clip(math.segment([0, 0], [1, -1]));
	expect(result3[0][0]).toBe(0);
	expect(result3[0][1]).toBe(0);
	expect(result3[1][0]).toBe(1);
	expect(result3[1][1]).toBe(-1);
});

test("no clips", () => {
	const rect = math.rect(-1, -1, 2, 2);
	const result1 = rect.clip(math.line([-0.707, 0.707], [2, 0]));
	expect(result1).toBe(undefined);
});

test("core clip", () => {
	const poly = [...math.rect(-1, -1, 2, 2)];
	const vector = [1, 1];
	const origin = [0, 0];
	[ clip_line_in_convex_poly_inclusive(poly, vector, origin),
		clip_ray_in_convex_poly_exclusive(poly, vector, origin),
		clip_ray_in_convex_poly_inclusive(poly, vector, origin),
		clip_segment_in_convex_poly_exclusive(poly, vector, origin),
		clip_segment_in_convex_poly_inclusive(poly, vector, origin),
	].forEach(res => expect(res).not.toBe(undefined));
});

test("core no clip", () => {
	const poly = [...math.rect(-1, -1, 2, 2)];
	const vector = [1, 1];
	const origin = [10, 0];
	const seg0 = [10, 0];
	const seg1 = [0, 10];
	[ clip_line_in_convex_poly_inclusive(poly, vector, origin),
		clip_ray_in_convex_poly_exclusive(poly, vector, origin),
		clip_ray_in_convex_poly_inclusive(poly, vector, origin),
		clip_segment_in_convex_poly_exclusive(poly, seg0, seg1),
		clip_segment_in_convex_poly_inclusive(poly, seg0, seg1),
	].forEach(res => expect(res).toBe(undefined));
});

test("core clip segments exclusive", () => {
	const poly = [...math.rect(-1, -1, 2, 2)];
	// all inside
	const seg0 = [[0, 0], [0.2, 0.2]];
	const result0 = clip_segment_in_convex_poly_exclusive(poly, ...seg0);
	expect(math.core.fnEpsilonEqualVectors(seg0[0], result0[0])).toBe(true);
	expect(math.core.fnEpsilonEqualVectors(seg0[1], result0[1])).toBe(true);
	// all outside
	const seg1 = [[10, 10], [10.2, 10.2]];
	// const result1 = clip_segment_in_convex_poly_exclusive(poly, ...seg1);
	const result1 = math.core.clipLineConvexPolygon(
		[[-1, -1], [1, -1], [1, 1], [-1, 1]],
		[0.2, 0.2],
		[10, 10],
		math.core.include,
		math.core.includeS);
	expect(result1).toBe(undefined);
	// inside and collinear
	const seg2 = [[0, 0], [1, 0]];
	const result2 = math.core.clipLineConvexPolygon(
		poly,
		[1, 0],
		[0, 0],
		math.core.include,
		math.core.includeS);
	expect(math.core.fnEpsilonEqualVectors(seg2[0], result2[0])).toBe(true);
	expect(math.core.fnEpsilonEqualVectors(seg2[1], result2[1])).toBe(true);
	// outside and collinear
	const seg3 = [[5, 0], [1, 0]];
	// const result3 = clip_segment_in_convex_poly_exclusive(poly, ...seg3);
	const result3 = math.core.clipLineConvexPolygon(
		poly,
		[5, 0],
		[1, 0],
		math.core.exclude,
		math.core.excludeS);
	expect(result3).toBe(undefined);

	// inside and collinear
	const seg4 = [[-1, 0], [1, 0]];
	const result4 = clip_segment_in_convex_poly_exclusive(poly, ...seg4);
	expect(math.core.fnEpsilonEqualVectors(seg4[0], result4[0])).toBe(true);
	expect(math.core.fnEpsilonEqualVectors(seg4[1], result4[1])).toBe(true);
});

test("core clip segments inclusive", () => {
	const poly = [...math.rect(-1, -1, 2, 2)];
	// all inside
	const seg0 = [[0, 0], [0.2, 0.2]];
	const result0 = clip_segment_in_convex_poly_inclusive(poly, ...seg0);
	expect(math.core.fnEpsilonEqualVectors(seg0[0], result0[0])).toBe(true);
	expect(math.core.fnEpsilonEqualVectors(seg0[1], result0[1])).toBe(true);
	// all outside
	const seg1 = [[10, 10], [10.2, 10.2]];
	const result1 = clip_segment_in_convex_poly_inclusive(poly, ...seg1);
	expect(result1).toBe(undefined);
	// inside and collinear
	const seg2 = [[0, 0], [1, 0]];
	const result2 = clip_segment_in_convex_poly_inclusive(poly, ...seg2);
	expect(math.core.fnEpsilonEqualVectors(seg2[0], result2[0])).toBe(true);
	expect(math.core.fnEpsilonEqualVectors(seg2[1], result2[1])).toBe(true);
	// outside and collinear
	// const seg3 = [[5, 0], [1, 0]];
	// const result3 = clip_segment_in_convex_poly_inclusive(poly, ...seg3);
	const result3 = math.core.clipLineConvexPolygon(
		poly,
		[5, 0],
		[1, 0],
		math.core.include,
		math.core.includeS);
	expect(result3).toBe(undefined);
	// inside and collinear
	const seg4 = [[-1, 0], [1, 0]];
	const result4 = clip_segment_in_convex_poly_inclusive(poly, ...seg4);
	expect(math.core.fnEpsilonEqualVectors(seg4[0], result4[0])).toBe(true);
	expect(math.core.fnEpsilonEqualVectors(seg4[1], result4[1])).toBe(true);
});


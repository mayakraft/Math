const math = require("../math");

test("convexHull", () => {
	const rect = [
		[1,0],
		[0,0],
		[1,1],
		[0,1],
	];
	const res0 = math.core.convexHullPoints(rect);
	const res1 = math.core.convexHullPoints(rect, true);
	expect(res0.length).toBe(4);
	expect(res1.length).toBe(4);
});

test("convexHull collinear", () => {
	const rect_collinear = [
		[1, 0],
		[0, 0],
		[1, 1],
		[0, 1],
		[0.5, 0],
		[0, 0.5],
		[1, 0.5],
		[0.5, 1],
	];
	const res0 = math.core.convexHullPoints(rect_collinear);
	const res1 = math.core.convexHullPoints(rect_collinear, true);
	expect(res0.length).toBe(4);
	expect(res1.length).toBe(8);
});

test("convexHull axisaligned", () => {
	const rect = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
	];
	const res0 = math.core.convexHullPoints(rect);
	const res1 = math.core.convexHullPoints(rect, true);
	expect(res0.length).toBe(4);
	expect(res1.length).toBe(4);
});

test("convexHull collinear axisaligned", () => {
	const rect = [
		[1, 0],
		[0.5, 0.5],
		[-1, 0],
		[0, 1],
		[0, -1],
		[0.5, -0.5],
		[-0.5, -0.5],
		[-0.5, 0.5],
	];
	const res0 = math.core.convexHullPoints(rect);
	const res1 = math.core.convexHullPoints(rect, true);
	expect(res0.length).toBe(4);
	expect(res1.length).toBe(8);
});

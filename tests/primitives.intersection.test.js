const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("excluding primitives", () => expect(true).toBe(true));

// test("intersections", () => {
// 	const polygon = math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
// 	const circle = math.circle(1);
// 	const line = math.line([1, 2], [0.5, 0]);
// 	const ray = math.ray([-1, 2], [0.5, -0.1]);
// 	const segment = math.segment([-2, 0.5], [2, 0.5]);

// 	const polygon2 = math.polygon([0, -1.15], [1, 0.577], [-1, 0.577]);
// 	const circle2 = math.circle(1, [0.5, 0]);
// 	const line2 = math.line([-1, 2], [0.5, 0]);
// 	const ray2 = math.ray([1, 2], [-0.5, 0]);
// 	const segment2 = math.segment([0.5, -2], [0.5, 2]);

// 	[
// 		// polygon.intersect(polygon2),
// 		// polygon.intersect(circle),
// 		polygon.intersect(line),
// 		polygon.intersect(ray),
// 		polygon.intersect(segment),
// 		// circle.intersect(polygon),
// 		circle.intersect(circle2),
// 		circle.intersect(line),
// 		circle.intersect(ray),
// 		circle.intersect(segment),
// 		line.intersect(polygon),
// 		line.intersect(circle),
// 		line.intersect(line2),
// 		line.intersect(ray),
// 		line.intersect(segment),
// 		ray.intersect(polygon),
// 		ray.intersect(circle),
// 		ray.intersect(line),
// 		ray.intersect(ray2),
// 		ray.intersect(segment),
// 		segment.intersect(polygon),
// 		segment.intersect(circle),
// 		segment.intersect(line),
// 		segment.intersect(ray),
// 		segment.intersect(segment2),
// 	].forEach(intersect => expect(intersect).not.toBe(undefined));
// });

// test("collinear segment intersections, types not core", () => {
// 	[ // horizontal
// 		math.segment([0, 2], [2, 2]).intersect(math.segment([-1, 2], [10, 2])),
// 		math.segment([0, 2], [2, 2]).intersect(math.segment([10, 2], [-1, 2])),
// 		// vertical
// 		math.segment([2, 0], [2, 2]).intersect(math.segment([2, -1], [2, 10])),
// 		math.segment([2, 0], [2, 2]).intersect(math.segment([2, 10], [2, -1])),
// 		// diagonal
// 		math.segment([0, 0], [2, 2]).intersect(math.segment([-1, -1], [5, 5])),
// 		math.segment([0, 0], [2, 2]).intersect(math.segment([5, 5], [-1, -1])),
// 	].forEach(res => expect(res).toBe(undefined));
// });

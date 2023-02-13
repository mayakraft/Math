const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("nearestPointOnPolygon", () => {
	const polygon = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const result = math.nearestPointOnPolygon(polygon, [10, 10]);
	// result { point: [ 0.5, 0.5 ], edge: 0, distance: 13.435028842544403 }
	expect(result.point[0]).toBe(0.5);
	expect(result.point[1]).toBe(0.5);
	expect(result.distance).toBeCloseTo(13.435028842544403);
	expect(result.edge).toBe(0);
	expect(polygon[result.edge][0]).toBe(1);
	expect(polygon[result.edge][1]).toBe(0);

	expect(math.nearestPointOnPolygon(polygon, [-10, 10]).edge).toBe(1);
	expect(math.nearestPointOnPolygon(polygon, [-10, -10]).edge).toBe(2);
	expect(math.nearestPointOnPolygon(polygon, [10, -10]).edge).toBe(3);
});

test("nearestPointOnPolygon nearest to vertex", () => {
	const polygon = [[1, 0], [0, 1], [-1, 0], [0, -1]];

	const result1 = math.nearestPointOnPolygon(polygon, [10, 0]);
	const result2 = math.nearestPointOnPolygon(polygon, [0, 10]);
	const result3 = math.nearestPointOnPolygon(polygon, [-10, 0]);
	const result4 = math.nearestPointOnPolygon(polygon, [0, -10]);

	expect(result1.point[0]).toBe(1);
	expect(result1.point[1]).toBe(0);
	expect(result2.point[0]).toBe(0);
	expect(result2.point[1]).toBe(1);
	expect(result3.point[0]).toBe(-1);
	expect(result3.point[1]).toBe(0);
	expect(result4.point[0]).toBe(0);
	expect(result4.point[1]).toBe(-1);

	expect(result1.edge).toBe(0);
	expect(result2.edge).toBe(0);
	expect(result3.edge).toBe(1);
	expect(result4.edge).toBe(2);
});

test("nearestPointOnCircle", () => {
	const circle = { r: 1, o: [0, 0] };

	const result1 = math.nearestPointOnCircle(circle.r, circle.o, [10, 0]);
	const result2 = math.nearestPointOnCircle(circle.r, circle.o, [0, 10]);
	const result3 = math.nearestPointOnCircle(circle.r, circle.o, [-10, 0]);
	const result4 = math.nearestPointOnCircle(circle.r, circle.o, [0, -10]);

	const result5 = math.nearestPointOnCircle(circle.r, circle.o, [10, 10]);
	const result6 = math.nearestPointOnCircle(circle.r, circle.o, [-10, 10]);
	const result7 = math.nearestPointOnCircle(circle.r, circle.o, [-10, -10]);
	const result8 = math.nearestPointOnCircle(circle.r, circle.o, [10, -10]);

	expect(result1[0]).toBeCloseTo(1);
	expect(result1[1]).toBeCloseTo(0);
	expect(result2[0]).toBeCloseTo(0);
	expect(result2[1]).toBeCloseTo(1);
	expect(result3[0]).toBeCloseTo(-1);
	expect(result3[1]).toBeCloseTo(0);
	expect(result4[0]).toBeCloseTo(0);
	expect(result4[1]).toBeCloseTo(-1);

	expect(result5[0]).toBeCloseTo(Math.SQRT1_2);
	expect(result5[1]).toBeCloseTo(Math.SQRT1_2);
	expect(result6[0]).toBeCloseTo(-Math.SQRT1_2);
	expect(result6[1]).toBeCloseTo(Math.SQRT1_2);
	expect(result7[0]).toBeCloseTo(-Math.SQRT1_2);
	expect(result7[1]).toBeCloseTo(-Math.SQRT1_2);
	expect(result8[0]).toBeCloseTo(Math.SQRT1_2);
	expect(result8[1]).toBeCloseTo(-Math.SQRT1_2);
});

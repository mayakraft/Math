const { test, expect } = require("@jest/globals");
const math = require("../math.js");

const testEqualVectors = function (...args) {
	expect(math.epsilonEqualVectors(...args)).toBe(true);
};

test("isCounterClockwiseBetween", () => {
	expect(math.isCounterClockwiseBetween(0.5, 0, 1)).toBe(true);
	expect(math.isCounterClockwiseBetween(0.5, 1, 0)).toBe(false);
	expect(math.isCounterClockwiseBetween(11, 10, 12)).toBe(true);
	expect(math.isCounterClockwiseBetween(11, 12, 10)).toBe(false);
	expect(math.isCounterClockwiseBetween(
		Math.PI * (2 * 4) + Math.PI / 2,
		0,
		Math.PI,
	)).toBe(true);
	expect(math.isCounterClockwiseBetween(
		Math.PI * (2 * 4) + Math.PI / 2,
		Math.PI,
		0,
	)).toBe(false);
});

test("interior angles", () => {
	testEqualVectors(
		[Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
		[[1, 0], [0, 1], [-1, 0], [0, -1]]
			.map((v, i, ar) => math.counterClockwiseAngle2(v, ar[(i + 1) % ar.length])),
	);
	testEqualVectors(
		[Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
		[[1, 1], [-1, 1], [-1, -1], [1, -1]]
			.map((v, i, ar) => math.counterClockwiseAngle2(v, ar[(i + 1) % ar.length])),
	);
});

test("counter-clockwise vector sorting", () => {
	testEqualVectors(
		[0, 1, 2, 3],
		math.counterClockwiseOrder2([[1, 1], [-1, 1], [-1, -1], [1, -1]]),
	);
	testEqualVectors(
		[0, 3, 2, 1],
		math.counterClockwiseOrder2([[1, -1], [-1, -1], [-1, 1], [1, 1]]),
	);
});

// test("sectors", () => {
//   testEqual(Math.PI / 2, math.sector.fromVectors([1, 0], [0, 1]).angle);
//   testEqual(true, math.sector.fromVectors([1, 0], [0, 1]).contains([1, 1]));
//   testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, 1]));
//   testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, -1]));
//   testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([1, -1]));
// });

// test("junctions", () => {
//   testEqual([[1, 1], [1, -1], [-1, 1], [-1, -1]],
//     math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectors);
//   testEqual([0, 2, 3, 1],
//     math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectorOrder);
//   testEqual([Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
//     math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).angles());
// });

test("clockwiseAngleRadians", () => {
	expect(math.clockwiseAngleRadians(Math.PI, Math.PI / 2))
		.toBeCloseTo(Math.PI * (1 / 2));
	expect(math.clockwiseAngleRadians(Math.PI / 2, Math.PI))
		.toBeCloseTo(Math.PI * (3 / 2));
	// same as above with negative numbers
	expect(math.clockwiseAngleRadians(
		Math.PI + Math.PI * (2 * 4),
		Math.PI / 2 - Math.PI * (2 * 8),
	)).toBeCloseTo(Math.PI * (1 / 2));
	expect(math.clockwiseAngleRadians(
		Math.PI / 2 - Math.PI * (2 * 3),
		Math.PI + Math.PI * (2 * 4),
	)).toBeCloseTo(Math.PI * (3 / 2));
	expect(math.clockwiseAngleRadians(
		Math.PI - Math.PI * (2 * 4),
		Math.PI / 2 - Math.PI * (2 * 8),
	)).toBeCloseTo(Math.PI * (1 / 2));
	expect(math.clockwiseAngleRadians(
		Math.PI / 2 - Math.PI * (2 * 3),
		Math.PI - Math.PI * (2 * 4),
	)).toBeCloseTo(Math.PI * (3 / 2));
});

test("counterClockwiseAngleRadians", () => {
	expect(math.counterClockwiseAngleRadians(Math.PI, Math.PI / 2))
		.toBeCloseTo(Math.PI * (3 / 2));
	expect(math.counterClockwiseAngleRadians(Math.PI / 2, Math.PI))
		.toBeCloseTo(Math.PI * (1 / 2));
	// same as above with negative numbers
	expect(math.counterClockwiseAngleRadians(
		Math.PI - Math.PI * (2 * 4),
		Math.PI / 2 - Math.PI * (2 * 5),
	)).toBeCloseTo(Math.PI * (3 / 2));
	expect(math.counterClockwiseAngleRadians(
		Math.PI + Math.PI * (2 * 4),
		Math.PI / 2 + Math.PI * (2 * 5),
	)).toBeCloseTo(Math.PI * (3 / 2));
	expect(math.counterClockwiseAngleRadians(
		Math.PI / 2 - Math.PI * (2 * 7),
		Math.PI - Math.PI * (2 * 3),
	)).toBeCloseTo(Math.PI * (1 / 2));
});

test("clockwiseAngle2", () => {
	expect(math.clockwiseAngle2([1, 0], [0, 1])).toBeCloseTo(Math.PI * (3 / 2));
	expect(math.clockwiseAngle2([0, 1], [1, 0])).toBeCloseTo(Math.PI * (1 / 2));
});

test("counterClockwiseAngle2", () => {
	expect(math.counterClockwiseAngle2([1, 0], [0, 1]))
		.toBeCloseTo(Math.PI * (1 / 2));
	expect(math.counterClockwiseAngle2([0, 1], [1, 0]))
		.toBeCloseTo(Math.PI * (3 / 2));
});

// test("counter_clockwise_vector_order", () => {
//   math.counter_clockwise_vector_order(...vectors)
// });

test("interior sector angles", () => {
	expect(math.counterClockwiseSectors2([[1, 0], [0, 1], [-1, 0]])[0])
		.toBeCloseTo(Math.PI / 2);
	expect(math.counterClockwiseSectors2([[1, 0], [0, 1], [-1, 0]])[1])
		.toBeCloseTo(Math.PI / 2);
	expect(math.counterClockwiseSectors2([[1, 0], [0, 1], [-1, 0]])[2])
		.toBeCloseTo(Math.PI);
	expect(math.counterClockwiseSectors2([[1, 0], [-1, 0], [0, -1]])[0])
		.toBeCloseTo(Math.PI);
	expect(math.counterClockwiseSectors2([[1, 0], [-1, 0], [0, -1]])[1])
		.toBeCloseTo(Math.PI / 2);
	expect(math.counterClockwiseSectors2([[1, 0], [-1, 0], [0, -1]])[2])
		.toBeCloseTo(Math.PI / 2);
});

test("clockwise bisect", () => {
	expect(math.clockwiseBisect2([1, 0], [0, -1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.clockwiseBisect2([1, 0], [0, -1])[1]).toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.clockwiseBisect2([1, 0], [-1, 0])[0]).toBeCloseTo(0);
	expect(math.clockwiseBisect2([1, 0], [-1, 0])[1]).toBeCloseTo(-1);
	expect(math.clockwiseBisect2([1, 0], [0, 1])[0]).toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.clockwiseBisect2([1, 0], [0, 1])[1]).toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.clockwiseBisect2([1, 0], [1, 0])[0]).toBeCloseTo(1);
	expect(math.clockwiseBisect2([1, 0], [1, 0])[1]).toBeCloseTo(0);
});

test("counter-clockwise bisect", () => {
	expect(math.counterClockwiseBisect2([1, 0], [0, 1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.counterClockwiseBisect2([1, 0], [0, 1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.counterClockwiseBisect2([1, 0], [-1, 0])[0]).toBeCloseTo(0);
	expect(math.counterClockwiseBisect2([1, 0], [-1, 0])[1]).toBeCloseTo(1);
	expect(math.counterClockwiseBisect2([1, 0], [0, -1])[0]).toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.counterClockwiseBisect2([1, 0], [0, -1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.counterClockwiseBisect2([1, 0], [1, 0])[0]).toBeCloseTo(1);
	expect(math.counterClockwiseBisect2([1, 0], [1, 0])[1]).toBeCloseTo(0);
});

test("counterClockwiseBisect2", () => {
	expect(math.counterClockwiseBisect2([1, 0], [0, 1])[0])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.counterClockwiseBisect2([1, 0], [0, 1])[1])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.counterClockwiseBisect2([0, 1], [-1, 0])[0])
		.toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.counterClockwiseBisect2([0, 1], [-1, 0])[1])
		.toBeCloseTo(Math.sqrt(2) / 2);
	// flipped vectors
	expect(math.counterClockwiseBisect2([1, 0], [-1, 0])[0]).toBeCloseTo(0);
	expect(math.counterClockwiseBisect2([1, 0], [-1, 0])[1]).toBeCloseTo(1);
});

test("bisectLines2", () => {
	expect(math.bisectLines2(
		{ vector: [0, 1], origin: [0, 0] },
		{ vector: [0, 1], origin: [1, 0] },
	)[1])
		.toBe(undefined);
	expect(math.bisectLines2(
		{ vector: [0, 1], origin: [0, 0] },
		{ vector: [0, 1], origin: [1, 0] },
	)[0].vector[0])
		.toBeCloseTo(0);
	expect(math.bisectLines2(
		{ vector: [0, 1], origin: [0, 0] },
		{ vector: [0, 1], origin: [1, 0] },
	)[0].vector[1])
		.toBeCloseTo(1);
	expect(math.bisectLines2(
		{ vector: [0, 1], origin: [0, 0] },
		{ vector: [0, 1], origin: [1, 0] },
	)[0].origin[0])
		.toBeCloseTo(0.5);
	expect(math.bisectLines2(
		{ vector: [0, 1], origin: [0, 0] },
		{ vector: [0, 1], origin: [1, 0] },
	)[0].origin[1])
		.toBeCloseTo(0);

	expect(math.bisectLines2(
		{ vector: [0, 1], origin: [0, 0] },
		{ vector: [1, 1], origin: [1, 0] },
	)[0].vector[0])
		.toBeCloseTo(0.3826834323650897);
	expect(math.bisectLines2(
		{ vector: [0, 1], origin: [0, 0] },
		{ vector: [1, 1], origin: [1, 0] },
	)[0].vector[1])
		.toBeCloseTo(0.9238795325112867);
	expect(math.bisectLines2(
		{ vector: [0, 1], origin: [0, 0] },
		{ vector: [1, 1], origin: [1, 0] },
	)[0].origin[0])
		.toBeCloseTo(0);
	expect(math.bisectLines2(
		{ vector: [0, 1], origin: [0, 0] },
		{ vector: [1, 1], origin: [1, 0] },
	)[0].origin[1])
		.toBeCloseTo(-1);
});

test("counterClockwiseSubsectRadians", () => {
	testEqualVectors(
		math.counterClockwiseSubsectRadians(0, 3, 3),
		[1, 2],
	);
	testEqualVectors(
		math.counterClockwiseSubsectRadians(-1, 2, 3),
		[0, 1],
	);
	expect(math.counterClockwiseSubsectRadians(0, -Math.PI, 4)[0])
		.toBeCloseTo(Math.PI * (1 / 4));
	expect(math.counterClockwiseSubsectRadians(0, -Math.PI, 4)[1])
		.toBeCloseTo(Math.PI * (2 / 4));
	expect(math.counterClockwiseSubsectRadians(0, -Math.PI, 4)[2])
		.toBeCloseTo(Math.PI * (3 / 4));
	expect(math.counterClockwiseSubsectRadians(0, -Math.PI, 2)[0])
		.toBeCloseTo(Math.PI / 2);
	expect(math.counterClockwiseSubsectRadians(0, -Math.PI, 1).length)
		.toBe(0);
});

test("counterClockwiseSubsect2", () => {
	expect(math.counterClockwiseSubsect2([1, 0], [0, 1], 2)[0][0])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.counterClockwiseSubsect2([1, 0], [0, 1], 2)[0][1])
		.toBeCloseTo(Math.sqrt(2) / 2);

	expect(math.counterClockwiseSubsect2([1, 0], [-1, 0], 4)[0][0])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.counterClockwiseSubsect2([1, 0], [-1, 0], 4)[0][1])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.counterClockwiseSubsect2([1, 0], [-1, 0], 4)[1][0])
		.toBeCloseTo(0);
	expect(math.counterClockwiseSubsect2([1, 0], [-1, 0], 4)[1][1])
		.toBeCloseTo(1);
	expect(math.counterClockwiseSubsect2([1, 0], [-1, 0], 4)[2][0])
		.toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.counterClockwiseSubsect2([1, 0], [-1, 0], 4)[2][1])
		.toBeCloseTo(Math.sqrt(2) / 2);
});

test("clockwiseSubsectRadians", () => {
	testEqualVectors(math.clockwiseSubsectRadians(3, 0, 3), [4, 5]);
	testEqualVectors(math.clockwiseSubsectRadians(2, -1, 3), [3, 4]);
	testEqualVectors(math.clockwiseSubsectRadians(2, -2, 4), [3, 4, 5]);

	expect(math.clockwiseSubsectRadians(-Math.PI, 0, 4)[0])
		.toBeCloseTo(-Math.PI * (3 / 4));
	expect(math.clockwiseSubsectRadians(-Math.PI, 0, 4)[1])
		.toBeCloseTo(-Math.PI * (2 / 4));
	expect(math.clockwiseSubsectRadians(-Math.PI, 0, 4)[2])
		.toBeCloseTo(-Math.PI * (1 / 4));

	expect(math.clockwiseSubsectRadians(-Math.PI, 0, 2)[0])
		.toBeCloseTo(-Math.PI / 2);
	expect(math.clockwiseSubsectRadians(-Math.PI, 0, 1).length)
		.toBe(0);
});

test("clockwiseSubsect2", () => {
	expect(math.clockwiseSubsect2([0, 1], [1, 0], 2)[0][0])
		.toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.clockwiseSubsect2([0, 1], [1, 0], 2)[0][1])
		.toBeCloseTo(Math.sqrt(2) / 2);

	expect(math.clockwiseSubsect2([-1, 0], [1, 0], 4)[0][0])
		.toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.clockwiseSubsect2([-1, 0], [1, 0], 4)[0][1])
		.toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.clockwiseSubsect2([-1, 0], [1, 0], 4)[1][0])
		.toBeCloseTo(0);
	expect(math.clockwiseSubsect2([-1, 0], [1, 0], 4)[1][1])
		.toBeCloseTo(-1);
	expect(math.clockwiseSubsect2([-1, 0], [1, 0], 4)[2][0])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.clockwiseSubsect2([-1, 0], [1, 0], 4)[2][1])
		.toBeCloseTo(-Math.sqrt(2) / 2);
});

test("threePointTurnDirection", () => {
	expect(math.threePointTurnDirection([0, 0], [1, 0], [2, 0])).toBe(0);
	expect(math.threePointTurnDirection([0, 0], [1, 0], [2, 1])).toBe(1);
	expect(math.threePointTurnDirection([0, 0], [1, 0], [2, -1])).toBe(-1);
	// with epsilon
	expect(math.threePointTurnDirection([0, 0], [1, 0], [2, 0.000001], 0.001)).toBe(0);
	expect(math.threePointTurnDirection([0, 0], [1, 0], [2, 0.001], 0.000001)).toBe(1);
	expect(math.threePointTurnDirection([0, 0], [1, 0], [2, -0.000001], 0.001)).toBe(0);
	expect(math.threePointTurnDirection([0, 0], [1, 0], [2, -0.001], 0.000001)).toBe(-1);
	// 180 degree turn
	expect(math.threePointTurnDirection([0, 0], [2, 0], [1, 0])).toBe(undefined);
	expect(math.threePointTurnDirection([0, 0], [5, 5], [2, 2])).toBe(undefined);
	expect(math.threePointTurnDirection([0, 0], [5, 0], [0, 0])).toBe(undefined);
	expect(math.threePointTurnDirection([0, 0], [1, 0], [-1, 0])).toBe(undefined);
});

const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("straight skeleton triangle", () => {
	const f1f = Math.sqrt(2) - 1;
	const skeleton = math.straightSkeleton([[1, 0], [0, 1], [-1, 0]]);
	expect(skeleton.length).toBe(4);
	["skeleton", "skeleton", "skeleton", "perpendicular"]
		.forEach((key, i) => expect(skeleton[i].type).toBe(key));
	[[1, 0], [0, f1f]].forEach((pt, i) => math.epsilonEqualVectors(
		pt,
		skeleton[0].points[i],
	));
	[[0, 1], [0, f1f]].forEach((pt, i) => math.epsilonEqualVectors(
		pt,
		skeleton[1].points[i],
	));
	[[-1, 0], [0, f1f]].forEach((pt, i) => math.epsilonEqualVectors(
		pt,
		skeleton[2].points[i],
	));
});

test("straight skeleton quad", () => {
	const skeleton = math.straightSkeleton([[0, 0], [2, 0], [2, 1], [0, 1]]);
	expect(skeleton.length).toBe(7);
	// const points = skeleton.map(el => el.points);
	const keys = ["skeleton", "perpendicular"];
	[0, 0, 1, 0, 0, 0, 1].forEach((n, i) => expect(skeleton[i].type).toBe(keys[n]));
});

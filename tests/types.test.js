const { test, expect } = require("@jest/globals");
const math = require("../math");

const names = [
	"vector",
	"matrix",
	"segment",
	"ray",
	"line",
	"rect",
	"circle",
	"ellipse",
	"polygon",
	// "junction",
];

const primitives = names
	.map(key => math[key]());

test("smart detection", () => {
	expect(math.typeof({ x: 1, y: 2 })).toBe("vector");
});

test("primitive constructor function names", () => primitives
	.forEach((primitive, i) => expect(primitive.constructor.name)
		.toBe(names[i])));

test("primitives Typeof", () => primitives
	.forEach((primitive, i) => expect(math.typeof(primitive))
		.toBe(names[i])));

test("primitives instanceof", () => primitives
	.forEach((primitive, i) => expect(primitive instanceof math[names[i]])
		.toBe(true)));

test("primitives constructor", () => primitives
	.forEach((primitive, i) => expect(primitive.constructor === math[names[i]])
		.toBe(true)));

test("type guessing", () => {
	const vector1 = { x: 1, y: 2, z: 3 };
	const vector2 = [1, 2, 3];
	const line = { vector: [1, 1], origin: [0.5, 0.5] };
	const segment = [[1, 2], [4, 5]];
	const circle = { radius: 1 };
	const rect = { width: 2, height: 1 };

	expect(math.typeof(vector1)).toBe("vector");
	expect(math.typeof(vector2)).toBe("vector");
	expect(math.typeof(line)).toBe("line");
	expect(math.typeof(segment)).toBe("segment");
	expect(math.typeof(circle)).toBe("circle");
	expect(math.typeof(rect)).toBe("rect");
	expect(math.typeof({})).toBe(undefined);
	expect(math.typeof(4)).toBe(undefined);
	expect(math.typeof(true)).toBe(undefined);
	expect(math.typeof("s")).toBe(undefined);
});

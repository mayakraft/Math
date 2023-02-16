const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("type guessing", () => {
	const vector1 = [1, 2, 3];
	const vector2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const line = { vector: [1, 1], origin: [0.5, 0.5] };
	const segment1 = [[1, 2], [4, 5]];
	const polygon1 = [[1, 2]];
	const polygon2 = [[1, 2], [4, 5], [6, 7]];
	const polygon3 = [[1], [2], [3], [4]];
	const circle = { radius: 1, origin: [1, 2] };

	expect(math.typeof(vector1)).toBe("vector");
	expect(math.typeof(vector2)).toBe("vector");
	expect(math.typeof(line)).toBe("line");
	expect(math.typeof(segment1)).toBe("segment");
	expect(math.typeof(polygon1)).toBe("polygon");
	expect(math.typeof(polygon2)).toBe("polygon");
	expect(math.typeof(polygon3)).toBe("polygon");
	expect(math.typeof(circle)).toBe("circle");
	// Javascript primitives
	expect(math.typeof({})).toBe("object");
	expect(math.typeof([])).toBe("object");
	expect(math.typeof(() => {})).toBe("function");
	expect(math.typeof(4)).toBe("number");
	expect(math.typeof(true)).toBe("boolean");
	expect(math.typeof("s")).toBe("string");
});

// test("speed of type guessing", () => {
// 	const objects = [
// 		[1, 2, 3],
// 		[1, 2, 3, 4, 5, 6, 7, 8, 9],
// 		{ vector: [1, 1], origin: [0.5, 0.5] },
// 		[[1, 2], [4, 5]],
// 		[[1, 2]],
// 		[[1, 2], [4, 5], [6, 7]],
// 		[[1], [2], [3], [4]],
// 		{ radius: 1, origin: [1, 2] },
// 	];
// 	// one million takes 54 milliseconds
// 	console.time("type-speed");
// 	for (let i = 0; i < 1000000; i += 1) {
// 		math.typeof(objects[i % objects.length]);
// 	}
// 	console.timeEnd("type-speed");
// });

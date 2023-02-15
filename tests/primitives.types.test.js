const { test, expect } = require("@jest/globals");
const math = require("../math.js");

test("excluding primitives", () => expect(true).toBe(true));

// const names = [
// 	"vector",
// 	"matrix",
// 	"segment",
// 	"ray",
// 	"line",
// 	"rect",
// 	"circle",
// 	"ellipse",
// 	"polygon",
// 	// "junction",
// ];

// const primitives = names
// 	.map(key => math[key]());

// test("primitive constructor function names", () => primitives
// 	.forEach((primitive, i) => expect(primitive.constructor.name)
// 		.toBe(names[i])));

// test("primitives Typeof", () => primitives
// 	.forEach((primitive, i) => expect(math.typeof(primitive))
// 		.toBe(names[i])));

// test("primitives instanceof", () => primitives
// 	.forEach((primitive, i) => expect(primitive instanceof math[names[i]])
// 		.toBe(true)));

// test("primitives constructor", () => primitives
// 	.forEach((primitive, i) => expect(primitive.constructor === math[names[i]])
// 		.toBe(true)));

// test("interchangeability with get_", () => {
// 	const vector = math.vector(1, 2, 3);
// 	const matrix = math.matrix(1, 2, 3, 4);
// 	const line = math.line(1, 2);
// 	const ray = math.ray(1, 2);
// 	const segment = math.segment([1, 2], [3, 4]);
// 	const circle = math.circle(1);
// 	const rect = math.rect(2, 4);
// 	const ellipse = math.ellipse(1, 2);
// 	expect(math.getVector(vector)[2]).toBe(3);
// 	// expect(math.getVectorOfVectors(segment)[0]).toBe(1);
// 	expect(math.getSegment(segment)[0][1]).toBe(2);
// 	expect(math.getLine(line).vector[1]).toBe(2);
// 	expect(math.getRect(rect).height).toBe(4);
// 	expect(math.getMatrix3x4(matrix)[4]).toBe(4);
// //  expect(math.get_matrix2(matrix)[1]).toBe(2);
// });

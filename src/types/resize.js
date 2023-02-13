/**
 * Math (c) Kraft
 */
/**
 * @description Resize a vector to a particular length (duplicating it
 * in memory in the process) by either lengthening or shortening it.
 * In the case of lengthening, fill 0.
 * @param {number} dimension the desired length
 * @param {number[]} vector the vector to resize
 * @returns {number[]} a copy of the vector resized to the desired length.
 * @linkcode
 */
export const resize = (d, v) => (v.length === d
	? v
	: Array(d).fill(0).map((z, i) => (v[i] ? v[i] : z)));
/**
 * @description Make the two vectors match in dimension by appending the
 * smaller vector with 0s to match the dimension of the larger vector.
 * @param {number[]} a a vector
 * @param {number[]} b a vector
 * @param {number[][]} an array containing two vectors, a copy of
 * each of the input parameters.
 * @linkcode
 */
export const resizeUp = (a, b) => [a, b]
	.map(v => resize(Math.max(a.length, b.length), v));
/**
 * @description Make the two vectors match in dimension by clamping the
 * larger vector to match the dimension of the smaller vector.
 * @param {number[]} a a vector
 * @param {number[]} b a vector
 * @param {number[][]} an array containing two vectors, a copy of
 * each of the input parameters.
 * @linkcode
 */
// export const resizeDown = (a, b) => [a, b]
// 	.map(v => resize(Math.min(a.length, b.length), v));
/**
 * @description Count the number of places deep past the decimal point.
 * @param {number} num any number
 * @returns {number} an integer, the number of decimal digits.
 * @linkcode
 */
const countPlaces = function (num) {
	const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	if (!m) { return 0; }
	return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};
/**
 * @description clean floating point numbers, where 15.0000000000000002 becomes 15,
 * this method involves encoding and parsing so it is relatively expensive.
 * @param {number} num the floating point number to clean
 * @param {number} [places=15] the whole number of decimal places to
 * keep, beyond this point can be considered to be noise.
 * @returns {number} the cleaned floating point number
 */
export const cleanNumber = function (num, places = 15) {
	if (typeof num !== "number") { return num; }
	const crop = parseFloat(num.toFixed(places));
	if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
		return num;
	}
	return crop;
};

const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
/**
 * @description flatten only until the point of comma separated entities. recursive
 * @param {Array} args any array, intended to contain arrays of arrays.
 * @returns always an array
 * @linkcode
 */
export const semiFlattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? semiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...semiFlattenArrays(a)]
			: a));
	}
};
/**
 * @description totally flatten, recursive
 * @param {Array} args any array, intended to contain arrays of arrays.
 * @returns an array, always.
 * @linkcode
 */
export const flattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).reduce((a, b) => a.concat(b), []);
	}
};

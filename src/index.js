/**
 * Math (c) Kraft
 */
/**         _                       _                     _   _
					 (_)                     (_)                   | | | |
	___  _ __ _  __ _  __ _ _ __ ___  _     _ __ ___   __ _| |_| |__
 / _ \| '__| |/ _` |/ _` | '_ ` _ \| |   | '_ ` _ \ / _` | __| '_ \
| (_) | |  | | (_| | (_| | | | | | | |   | | | | | | (_| | |_| | | |
 \___/|_|  |_|\__, |\__,_|_| |_| |_|_|   |_| |_| |_|\__,_|\__|_| |_|
							 __/ |
							|___/
 */
import general from "./general/index.js";
import algebra from "./algebra/index.js";
import geometry from "./geometry/index.js";
import intersectMethods from "./intersect/index.js";
// import primitives from "./primitives/index.js";

/**
 * @typedef line
 * @type {object}
 * @description a line primitive
 * @property {number[]} vector a vector which represents the direction of the line
 * @property {number[]} origin a point which the line passes through
 */

/**
 * @typedef circle
 * @type {object}
 * @description a circle primitive
 * @property {number} radius
 * @property {number[]} origin by default this will be the origin [0, 0]
 */

/**
 * @description A small math library with a focus on linear algebra,
 * computational geometry, and computing the intersection of shapes.
 */
const math = {
	...general,
	...algebra,
	...geometry,
	...intersectMethods,
};
// const math = primitives;
// const math = Object.create(null);
// Object.assign(math, {
// 	...general,
// 	...types,
// 	...algebra,
// 	...geometry,
// 	...intersection,
// });
export default math;

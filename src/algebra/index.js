/**
 * Math (c) Kraft
 */
import * as vectors from "./vectors.js";
import * as matrix2 from "./matrix2.js";
import * as matrix3 from "./matrix3.js";
import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";

export default {
	...vectors,
	...matrix2,
	...matrix3,
	...matrix4,
	...quaternion,
};

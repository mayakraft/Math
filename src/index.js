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
import types from "./types/index.js";
import algebra from "./algebra/index.js";
import geometry from "./geometry/index.js";
import intersection from "./intersection/index.js";
// import primitives from "./primitives/index.js";

/**
 * @description A small math library with a focus on linear algebra,
 * computational geometry, and computing the intersection of shapes.
 */
const math = {
	...general,
	...types,
	...algebra,
	...geometry,
	...intersection,
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

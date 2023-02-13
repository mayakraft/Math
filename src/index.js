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
import algebra from "./algebra/index.js";
import geometry from "./geometry/index.js";
import intersection from "./intersection/index.js";
import types from "./types/index.js";
// import primitives from "./primitives/index.js";
/**
 * @description A collection of math functions with a focus on linear algebra,
 * computational geometry, intersection of shapes, and some origami-specific operations.
 */
// const math = primitives;
// const math = Object.create(null);
/*
 * the logic is under ".core", the primitives are under the top level.
 * the primitives have arguments type inference. the logic core is strict:
 *
 * points are array syntax [x,y]
 * segments are pairs of points [x,y], [x,y]
 * lines/rays are point-array value objects { vector: [x,y], origin: [x,y] }
 * polygons are an ordered set of points [[x,y], [x,y], ...]
 *
 * the primitives store object methods under their prototype,
 * the top level has properties like x, y, z.
 */
const math = {
	...algebra,
	...geometry,
	...intersection,
	...types,
};
// Object.assign(math, {
//   ...algebra,
//   ...geometry,
//   ...intersection,
//   ...types,
// });
export default math;

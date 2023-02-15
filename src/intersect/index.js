/**
 * Math (c) Kraft
 */
import * as encloses from "./encloses.js";
import * as overlap from "./overlap.js";
import * as intersect from "./intersect.js";
import * as clip from "./clip.js";
import * as split from "./split.js";

export default {
	...encloses,
	...overlap,
	...intersect,
	...clip,
	...split,
};

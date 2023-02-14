/**
 * Math (c) Kraft
 */
import * as convexHullMethods from "./convexHull.js";
import * as linesMethods from "./lines.js";
import * as nearestMethods from "./nearest.js";
import * as polygonMethods from "./polygons.js";
import * as radialMethods from "./radial.js";
import straightSkeleton from "./straightSkeleton.js";

export default {
	...convexHullMethods,
	...linesMethods,
	...nearestMethods,
	...polygonMethods,
	...radialMethods,
	straightSkeleton,
};

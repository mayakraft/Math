/**
 * Math (c) Kraft
 */
import * as convexHullMethods from "./convex-hull.js";
import * as linesMethods from "./lines.js";
import * as nearestMethods from "./nearest.js";
import * as polygonMethods from "./polygons.js";
import * as radialMethods from "./radial.js";
import straightSkeleton from "./straight-skeleton.js";

export default {
	...convexHullMethods,
	...linesMethods,
	...nearestMethods,
	...polygonMethods,
	...radialMethods,
	straightSkeleton,
};

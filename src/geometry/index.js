/**
 * Math (c) Kraft
 */
import * as convexHullMethods from "./convexHull.js";
import * as lineMethods from "./line.js";
import * as nearestMethods from "./nearest.js";
import * as polygonMethods from "./polygon.js";
import * as radialMethods from "./radial.js";
import straightSkeleton from "./straightSkeleton.js";

export default {
	...convexHullMethods,
	...lineMethods,
	...nearestMethods,
	...polygonMethods,
	...radialMethods,
	straightSkeleton,
};

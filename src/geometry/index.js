/**
 * Math (c) Kraft
 */
import * as convexHullMethods from "./convex-hull.js";
import * as pleatMethods from "./pleat.js";
import * as polygonMethods from "./polygons.js";
import * as radialMethods from "./radial.js";
import clipLineConvexPolygon from "./clip-line-polygon.js";
import clipPolygonPolygon from "./clip-polygon-polygon.js";
import splitConvexPolygon from "./split-polygon.js";
import straightSkeleton from "./straight-skeleton.js";

export default {
	...convexHullMethods,
	...pleatMethods,
	...polygonMethods,
	...radialMethods,
	clipLineConvexPolygon,
	clipPolygonPolygon,
	splitConvexPolygon,
	straightSkeleton,
};

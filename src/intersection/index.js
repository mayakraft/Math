/**
 * Math (c) Kraft
 */
import * as generalIntersect from "./general.js";
import * as encloses from "./encloses.js";
// import intersect from "./intersect.js";
// import overlap from "./overlap.js";
import clipLineConvexPolygon from "./clip-line-polygon.js";
import clipPolygonPolygon from "./clip-polygon-polygon.js";
import intersectConvexPolygonLine from "./intersect-polygon-line.js";
import intersectCircleCircle from "./intersect-circle-circle.js";
import intersectCircleLine from "./intersect-circle-line.js";
import intersectLineLine from "./intersect-line-line.js";
import overlapConvexPolygons from "./overlap-polygons.js";
import overlapConvexPolygonPoint from "./overlap-polygon-point.js";
import overlapBoundingBoxes from "./overlap-bounding-boxes.js";
import overlapLineLine from "./overlap-line-line.js";
import overlapLinePoint from "./overlap-line-point.js";
import splitConvexPolygon from "./split-polygon.js";

export default {
	...generalIntersect,
	...encloses,
	// intersect,
	// overlap,
	clipLineConvexPolygon,
	clipPolygonPolygon,
	intersectConvexPolygonLine,
	intersectCircleCircle,
	intersectCircleLine,
	intersectLineLine,
	overlapConvexPolygons,
	overlapConvexPolygonPoint,
	overlapBoundingBoxes,
	overlapLineLine,
	overlapLinePoint,
	splitConvexPolygon,
};

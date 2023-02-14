/**
 * Math (c) Kraft
 */
import * as encloses from "./encloses.js";
// import intersect from "./intersect.js";
// import overlap from "./overlap.js";
import clipLineConvexPolygon from "./clipLinePolygon.js";
import clipPolygonPolygon from "./clipPolygonPolygon.js";
import intersectConvexPolygonLine from "./intersectPolygonLine.js";
import intersectCircleCircle from "./intersectCircleCircle.js";
import intersectCircleLine from "./intersectCircleLine.js";
import intersectLineLine from "./intersectLineLine.js";
import overlapConvexPolygons from "./overlapPolygons.js";
import overlapConvexPolygonPoint from "./overlapPolygonPoint.js";
import overlapBoundingBoxes from "./overlapBoundingBoxes.js";
import overlapLineLine from "./overlapLineLine.js";
import overlapLinePoint from "./overlapLinePoint.js";
import splitConvexPolygon from "./splitPolygon.js";

export default {
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

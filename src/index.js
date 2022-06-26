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
import typeOf from "./arguments/typeof";
import * as resizers from "./arguments/resize";
import * as functions from "./arguments/functions";
import * as getters from "./arguments/get";

import * as constants from "./core/constants";
import * as algebra from "./core/algebra";
import * as equal from "./core/equal";
import * as sort from "./core/sort";
import * as geometry from "./core/geometry";
import * as radial from "./core/radial";
// import * as interpolation from "./core/interpolation";
import * as matrix2 from "./core/matrix2";
import * as matrix3 from "./core/matrix3";
import * as nearest from "./core/nearest";
import * as parameterize from "./core/parameterize";

import intersect from "./intersection/intersect";
import overlap from "./intersection/overlap";
import enclosingPolygonPolygon from "./intersection/enclose-polygons";
import intersectConvexPolygonLine from "./intersection/intersect-polygon-line";
import intersectCircleCircle from "./intersection/intersect-circle-circle";
import intersectCircleLine from "./intersection/intersect-circle-line";
import intersectLineLine from "./intersection/intersect-line-line";
import overlapConvexPolygons from "./intersection/overlap-polygons";
import overlapConvexPolygonPoint from "./intersection/overlap-polygon-point";
import overlapBoundingBoxes from "./intersection/overlap-bounding-boxes";
import overlapLineLine from "./intersection/overlap-line-line";
import overlapLinePoint from "./intersection/overlap-line-point";
import clipLineConvexPolygon from "./clip/line-polygon";
import clipPolygonPolygon from "./clip/polygon-polygon";

import primitives from "./primitives/index";
/**
 * @description A collection of math functions with a focus on linear algebra,
 * computational geometry, intersection of shapes, and some origami-specific operations.
 */
const math = primitives;
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
math.core = Object.assign(Object.create(null),
  constants,
  resizers,
  getters,
  functions,
  algebra,
  equal,
  sort,
  geometry,
  radial,
  // interpolation,
  matrix2,
  matrix3,
  nearest,
  parameterize,
  {
    enclosingPolygonPolygon,
    intersectConvexPolygonLine,
    intersectCircleCircle,
    intersectCircleLine,
    intersectLineLine,
    overlapConvexPolygons,
    overlapConvexPolygonPoint,
    overlapBoundingBoxes,
    overlapLineLine,
    overlapLinePoint,
    clipLineConvexPolygon,
    clipPolygonPolygon,
  }
);
math.typeof = typeOf;
math.intersect = intersect;
math.overlap = overlap;

export default math;

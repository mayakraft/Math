/**         _                       _                     _   _
           (_)                     (_)                   | | | |
  ___  _ __ _  __ _  __ _ _ __ ___  _     _ __ ___   __ _| |_| |__
 / _ \| '__| |/ _` |/ _` | '_ ` _ \| |   | '_ ` _ \ / _` | __| '_ \
| (_) | |  | | (_| | (_| | | | | | | |   | | | | | | (_| | |_| | | |
 \___/|_|  |_|\__, |\__,_|_| |_| |_|_|   |_| |_| |_|\__,_|\__|_| |_|
               __/ |
              |___/
 */
import Typeof from "./arguments/typeof";
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
import enclose_convex_polygons_inclusive from "./intersection/enclose-polygons";
import intersect_convex_polygon_line from "./intersection/intersect-polygon-line";
import intersect_polygon_polygon from "./intersection/intersect-polygon-polygon";
import intersect_circle_circle from "./intersection/intersect-circle-circle";
import intersect_circle_line from "./intersection/intersect-circle-line";
import intersect_line_line from "./intersection/intersect-line-line";
import overlap_convex_polygons from "./intersection/overlap-polygons";
import overlap_convex_polygon_point from "./intersection/overlap-polygon-point";
import overlap_bounding_boxes from "./intersection/overlap-bounding-boxes";
import overlap_line_line from "./intersection/overlap-line-line";
import overlap_line_point from "./intersection/overlap-line-point";
import clip_line_in_convex_polygon from "./clip/polygon";

import primitives from "./primitives/index";

const math = primitives;

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
    enclose_convex_polygons_inclusive,
    intersect_convex_polygon_line,
    intersect_polygon_polygon,
    intersect_circle_circle,
    intersect_circle_line,
    intersect_line_line,
    overlap_convex_polygons,
    overlap_convex_polygon_point,
    overlap_bounding_boxes,
    overlap_line_line,
    overlap_line_point,
    clip_line_in_convex_polygon,
  }
);

math.typeof = Typeof;
math.intersect = intersect;
math.overlap = overlap;

export default math;

/**           _                       _                      _   _
             (_)                     (_)                    | | | |
    ___  _ __ _  __ _  __ _ _ __ ___  _      _ __ ___   __ _| |_| |__
   / _ \| '__| |/ _` |/ _` | '_ ` _ \| |    | '_ ` _ \ / _` | __| '_ \
  | (_) | |  | | (_| | (_| | | | | | | |    | | | | | | (_| | |_| | | |
   \___/|_|  |_|\__, |\__,_|_| |_| |_|_|    |_| |_| |_|\__,_|\__|_| |_|
                 __/ |
                |___/
 */

import Typeof from "./arguments/typeof";
import * as resizers from "./arguments/resize";
import * as getters from "./arguments/get";

import * as constants from "./core/constants";
import * as algebra from "./core/algebra";
import * as equal from "./core/equal";
import * as geometry from "./core/geometry";
import * as radial from "./core/radial";
// import * as interpolation from "./core/interpolation";
import * as matrix2 from "./core/matrix2";
import * as matrix3 from "./core/matrix3";
import * as nearest from "./core/nearest";
import * as axioms from "./core/axioms";

import intersect from "./intersection/index";
import * as intersect_circle from "./intersection/circle";
import * as intersect_line_types from "./intersection/lines";
import * as intersect_polygon from "./intersection/polygon";
import {
  intersect_line_seg_include,
  intersect_line_seg_exclude,
  intersect_ray_seg_include,
  intersect_ray_seg_exclude,
  intersect_seg_seg_include,
  intersect_seg_seg_exclude,
} from "./intersection/helpers";
import overlap from "./overlap/index";
import * as clip_polygon from "./clip/polygon";

import primitives from "./primitives/index";

const math = primitives;

/*
 * the logic is under ".core", the primitives are under the top level.
 * the primitives have arguments type inference. the logic core is strict:
 *
 * all points are array syntax [x,y]
 * all segments are array syntax [[x,y], [x,y]]
 * all infinite lines are defined as point and vector [[x,y], [x,y]]
 * all polygons are an ordered set of points [[x,y], ...]
 * (it might be the case that counter-clockwise winding direction is preferred)
 *
 * the primitives store object methods under their prototype,
 * the top level has properties like x, y, z.
 */

math.core = Object.assign(Object.create(null),
  constants,
  algebra,
  equal,
  geometry,
  radial,
  // interpolation,
  matrix2,
  matrix3,
  nearest,
  axioms,
  overlap,
  getters,
  resizers,
  intersect_circle,
  intersect_line_types,
  intersect_polygon,
  clip_polygon,
  {
    intersect_line_seg_include,
    intersect_line_seg_exclude,
    intersect_ray_seg_include,
    intersect_ray_seg_exclude,
    intersect_seg_seg_include,
    intersect_seg_seg_exclude,
  },
);

math.typeof = Typeof;
math.intersect = intersect;

export default math;

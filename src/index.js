/**              _                       _                      _   _
                (_)                     (_)                    | | | |
       ___  _ __ _  __ _  __ _ _ __ ___  _      _ __ ___   __ _| |_| |__
      / _ \| '__| |/ _` |/ _` | '_ ` _ \| |    | '_ ` _ \ / _` | __| '_ \
     | (_) | |  | | (_| | (_| | | | | | | |    | | | | | | (_| | |_| | | |
      \___/|_|  |_|\__, |\__,_|_| |_| |_|_|    |_| |_| |_|\__,_|\__|_| |_|
                    __/ |
                   |___/
 */
/*
 * the logic is under ".core", the primitives are under the top level.
 * the primitives have arguments type inference. the logic core is strict:
 *
 * all points are array syntax [x,y]
 * all edges are array syntax [[x,y], [x,y]]
 * all infinite lines are defined as point and vector, both [x,y]
 * all polygons are an ordered set of points ([x,y]), either winding direction
 *
 * the primitives store object methods under their prototype,
 * the top level has properties like x, y, z.
 */

import * as algebra from "./core/algebra";
import * as geometry from "./core/geometry";
import * as query from "./core/query";
import * as intersection from "./core/intersection";
import * as args from "./parse/arguments";
import { EPSILON, clean_number } from "./parse/clean";

import vector from "./primitives/vector";
import matrix2 from "./primitives/matrix";
import line from "./primitives/line";
import ray from "./primitives/ray";
import edge from "./primitives/edge";
import circle from "./primitives/circle";
import polygon from "./primitives/polygon";
import convexPolygon from "./primitives/convexPolygon";
import rectangle from "./primitives/rectangle";
import junction from "./primitives/junction";
import sector from "./primitives/sector";

const core = Object.create(null);
Object.assign(core, algebra, geometry, query, args);
core.EPSILON = EPSILON;
core.intersection = intersection;
core.clean_number = clean_number;
Object.freeze(core);

const math = {
  vector,
  matrix2,
  line,
  ray,
  edge,
  circle,
  polygon,
  convexPolygon,
  rectangle,
  junction,
  sector,
  core,
};

export default math;

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
 * all the logic of the library is accessible under the .core subpath
 * inside .core, strictly obey:
 * all points are array syntax [x,y]
 * all edges are array syntax [[x,y], [x,y]]
 * all infinite lines are defined as point and vector, both [x,y]
 * all polygons are an ordered set of points ([x,y]), either winding direction
 */

/*
 * the primitives are much more accessible, they type check all their inputs
 * and hide their methods into their prototypes as best they can
 * the top level is trying to only contain properties (x,y,z for Vector)
 */

import * as algebra from "./core/algebra";
import * as geometry from "./core/geometry";
import * as query from "./core/query";
import * as intersection from "./core/intersection";
import * as input from "./parse/input";
import { EPSILON, clean_number } from "./parse/clean";

import Vector from "./primitives/vector";
import Matrix2 from "./primitives/matrix";
import Line from "./primitives/line";
import Ray from "./primitives/ray";
import Edge from "./primitives/edge";
import Circle from "./primitives/circle";
import Polygon from "./primitives/polygon";
import ConvexPolygon from "./primitives/convexPolygon";
import Rectangle from "./primitives/rectangle";
import Junction from "./primitives/junction";
import Sector from "./primitives/sector";

const core = Object.create(null);
Object.assign(core, algebra, geometry, query, input);
core.EPSILON = EPSILON;
core.intersection = intersection;
core.clean_number = clean_number;
Object.freeze(core);

export {
  Vector,
  Circle,
  Polygon,
  ConvexPolygon,
  Rectangle,
  Matrix2,
  Line,
  Ray,
  Edge,
  Junction,
  Sector,
  core,
};

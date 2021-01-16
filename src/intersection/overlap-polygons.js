import { EPSILON } from "../core/constants";
import {
  dot,
  cross2,
  subtract,
  normalize,
  magnitude,
  mag_squared
} from "../core/algebra";
import {
  include,
  exclude,
  include_s,
  exclude_s,
} from "../arguments/functions";
import overlap_convex_polygon_point from "./overlap-polygon-point";
import overlap_line_line from "./overlap-line-line";

/** do two convex polygons overlap one another */
const overlap_convex_polygons = (poly1, poly2, fn_line = exclude_s, fn_point = exclude, epsilon = EPSILON) => {
  if (overlap_convex_polygon_point(poly1, poly2[0], fn_point, epsilon)) { return true; }
  if (overlap_convex_polygon_point(poly2, poly1[0], fn_point, epsilon)) { return true; }
  // convert array of points into [vector, origin] form
  const e1 = poly1.map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p]);
  const e2 = poly2.map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p]);
  for (let i = 0; i < e1.length; i += 1) {
    for (let j = 0; j < e2.length; j += 1) {
      if (overlap_line_line(e1[i][0], e1[i][1], e2[j][0], e2[j][1], fn_line, fn_line, epsilon)) {
        return true;
      }
    }
  }
  return false;
};

export default overlap_convex_polygons;

// export const overlap_convex_polygons_inclusive = (poly1, poly2, epsilon = EPSILON) =>
//   overlap_convex_polygons(poly1, poly2, include_s, include, epsilon);
// export const overlap_convex_polygons_exclusive = (poly1, poly2, epsilon = EPSILON) =>
//   overlap_convex_polygons(poly1, poly2, exclude_s, exclude, epsilon);


/**
 * Math (c) Kraft
 */
import { EPSILON } from "./constants";
import { resize } from "../arguments/resize";
import {
  mag_squared,
  distance,
  distance2,
  add,
  subtract,
  normalize,
  dot,
  scale
} from "./algebra";
import {
  ray_limiter,
  segment_limiter,
} from "../arguments/functions";

export const smallest_comparison_search = (obj, array, compare_func) => {
  const objs = array.map((o, i) => ({ o, i, d: compare_func(obj, o) }));
  let index;
  let smallest_value = Infinity;
  for (let i = 0; i < objs.length; i += 1) {
    if (objs[i].d < smallest_value) {
      index = i;
      smallest_value = objs[i].d;
    }
  }
  return index;
};
/**
 * find the one point in array_of_points closest to point.
 */
export const nearest_point2 = (point, array_of_points) => {
  // todo speed up with partitioning
  const index = smallest_comparison_search(point, array_of_points, distance2);
  return index === undefined ? undefined : array_of_points[index];
};
/**
 * find the one point in array_of_points closest to point.
 */
export const nearest_point = (point, array_of_points) => {
  // todo speed up with partitioning
  const index = smallest_comparison_search(point, array_of_points, distance);
  return index === undefined ? undefined : array_of_points[index];
};

export const nearest_point_on_line = (vector, origin, point, limiterFunc, epsilon = EPSILON) => {
  origin = resize(vector.length, origin);
  point = resize(vector.length, point);
  const magSquared = mag_squared(vector);
  const vectorToPoint = subtract(point, origin);
  const dotProd = dot(vector, vectorToPoint);
  const dist = dotProd / magSquared;
  // limit depending on line, ray, segment
  const d = limiterFunc(dist, epsilon);
  return add(origin, scale(vector, d))
};

export const nearest_point_on_polygon = (polygon, point) => {
  const v = polygon
    .map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
  return polygon
    .map((p, i) => nearest_point_on_line(v[i], p, point, segment_limiter))
    .map((p, i) => ({ point: p, i, distance: distance(p, point) }))
    .sort((a, b) => a.distance - b.distance)
    .shift();
};

export const nearest_point_on_circle = (radius, origin, point) => add(
  origin, scale(normalize(subtract(point, origin)), radius)
);

// todo
export const nearest_point_on_ellipse = () => false;

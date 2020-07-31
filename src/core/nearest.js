import { EPSILON } from "./equal";
import {
  distance,
  distance2,
  add,
  subtract,
  normalize,
  scale
} from "./algebra";

const smallest_comparison_search = (obj, array, compare_func) => {
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

export const nearest_point_on_line = (lineVec, linePoint, point, limiterFunc, epsilon = EPSILON) => {
  const magSquared = (lineVec[0] ** 2) + (lineVec[1] ** 2);
  const vectorToPoint = [0, 1].map((_, i) => point[i] - linePoint[i]);
  // const pTo0 = [0, 1].map((_, i) => point[i] - linePoint[i]);
  const dot = [0, 1].map((_, i) => lineVec[i] * vectorToPoint[i])
    .reduce((a, b) => a + b, 0);
  const dist = dot / magSquared;
  // limit depending on line, ray, segment
  const d = limiterFunc(dist, epsilon);
  return [0, 1].map((_, i) => linePoint[i] + lineVec[i] * d);
};

export const segment_limiter = (dist) => {
  if (dist < -EPSILON) { return 0; }
  if (dist > 1 + EPSILON) { return 1; }
  return dist;
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

export const nearest_point_on_ellipse = () => false;

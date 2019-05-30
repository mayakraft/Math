import {
  get_line,
  get_ray,
  get_two_vec2,
} from "../parse/input";

import {
  circle_line,
  circle_ray,
  circle_edge,
} from "../core/intersection";

import Vector from "./vector";

export default function (...args) {
  let origin;
  let radius;

  const params = Array.from(args);
  const numbers = params.filter(param => !isNaN(param));
  if (numbers.length === 3) {
    origin = Vector(numbers[0], numbers[1]);
    [, , radius] = numbers;
  }

  const intersectionLine = function (...innerArgs) {
    const line = get_line(innerArgs);
    const p2 = [line.point[0] + line.vector[0], line.point[1] + line.vector[1]];
    const result = circle_line(origin, radius, line.point, p2);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };

  const intersectionRay = function (...innerArgs) {
    const ray = get_ray(innerArgs);
    const result = circle_ray(origin, radius, ray[0], ray[1]);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };

  const intersectionEdge = function (...innerArgs) {
    const edge = get_two_vec2(innerArgs);
    const result = circle_edge(origin, radius, edge[0], edge[1]);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };

  // return Object.freeze( {
  return {
    intersectionLine,
    intersectionRay,
    intersectionEdge,
    get origin() { return origin; },
    get radius() { return radius; },
    set origin(innerArgs) { origin = Vector(innerArgs); },
    set radius(newRadius) { radius = newRadius; },
  };
}

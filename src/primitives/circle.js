import {
  get_line,
  get_ray,
  get_two_vec2,
} from "../parsers/arguments";

import {
  circle_line,
  circle_ray,
  circle_segment,
} from "../core/intersection";

import Vector from "./vector";

const Circle = function (...args) {
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
    const p2 = [line.origin[0] + line.vector[0], line.origin[1] + line.vector[1]];
    const result = circle_line(origin, radius, line.origin, p2);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };

  const intersectionRay = function (...innerArgs) {
    const ray = get_ray(innerArgs);
    const result = circle_ray(origin, radius, ray[0], ray[1]);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };

  const intersectionSegment = function (...innerArgs) {
    const segment = get_two_vec2(innerArgs);
    const result = circle_segment(origin, radius, segment[0], segment[1]);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };

  // const tangentThroughPoint
  // give us two tangent lines that intersect a point (outside the circle)

  // return Object.freeze( {
  return {
    intersectionLine,
    intersectionRay,
    intersectionSegment,
    get origin() { return origin; },
    get radius() { return radius; },
    set origin(innerArgs) { origin = Vector(innerArgs); },
    set radius(newRadius) { radius = newRadius; },
  };
};

export default Circle;

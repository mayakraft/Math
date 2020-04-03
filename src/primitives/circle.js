import {
  get_line,
  get_ray,
  get_vector_of_vectors,
} from "../parsers/arguments";

import { distance2 } from "../core/algebra";

import {
  circle_line,
  circle_ray,
  circle_segment,
} from "../core/intersection";

import Vector from "./vector";

const Circle = function (...args) {
  let origin;
  let radius;

  // const params = Array.from(args);
  const numbers = args.filter(param => !isNaN(param));
  const vectors = get_vector_of_vectors(args);
  if (numbers.length === 3) {
    origin = Vector(numbers[0], numbers[1]);
    [, , radius] = numbers;
  } else if (vectors.length === 2) {
    radius = distance2(...vectors);
    origin = Vector(...vectors[0]);
  }

  const intersectionLine = function (...innerArgs) {
    const line = get_line(innerArgs);
    const result = circle_line(origin, radius, line.origin, line.vector);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };

  const intersectionRay = function (...innerArgs) {
    const ray = get_ray(innerArgs);
    const result = circle_ray(origin, radius, ray[0], ray[1]);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };

  const intersectionSegment = function (...innerArgs) {
    const segment = get_vector_of_vectors(innerArgs);
    const result = circle_segment(origin, radius, segment[0], segment[1]);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };

  const intersectionCircle = function (...innerArgs) {
    const circle = get_circle(innerArgs);
    
  };

  // const tangentThroughPoint
  // give us two tangent lines that intersect a point (outside the circle)

  // return Object.freeze( {
  return {
    intersectionLine,
    intersectionRay,
    intersectionSegment,
    get origin() { return origin; },
    get x() { return origin[0]; },
    get y() { return origin[1]; },
    get radius() { return radius; },
    set origin(innerArgs) { origin = Vector(innerArgs); },
    set radius(newRadius) { radius = newRadius; },
  };
};

// Circle.fromPoints = () => {
// };

export default Circle;

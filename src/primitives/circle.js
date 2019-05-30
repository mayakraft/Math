import * as Input from "../parse/input";
import * as Intersection from "../core/intersection";
import { Vector } from "./vector";

export default function (...args) {
  let _origin;
  let _radius;

  const params = Array.from(args);
  const numbers = params.filter(param => !isNaN(param));
  if (numbers.length === 3) {
    _origin = Vector(numbers.slice(0, 2));
    _radius = numbers[2];
  }

  const intersectionLine = function() {
    const line = Input.get_line(...arguments);
    const p2 = [line.point[0] + line.vector[0], line.point[1] + line.vector[1]];
    const intersection = Intersection.circle_line(_origin, _radius, line.point, p2);
    return (intersection === undefined
      ? undefined
      : intersection.map(i => Vector(i))
    );
  };

  const intersectionRay = function() {
    let points = Input.get_ray(...arguments);
    let intersection = Intersection.circle_ray(_origin, _radius, points[0], points[1]);
    return (intersection === undefined
      ? undefined
      : intersection.map(i => Vector(i))
    );
  };

  const intersectionEdge = function() {
    let points = Input.get_two_vec2(...arguments);
    let intersection = Intersection.circle_edge(_origin, _radius, points[0], points[1]);
    return (intersection === undefined
      ? undefined
      : intersection.map(i => Vector(i))
    );
  }

  // return Object.freeze( {
  return {
    intersectionLine,
    intersectionRay,
    intersectionEdge,
    get origin() { return _origin; },
    get radius() { return _radius; },
    set radius(newRadius) { _radius = newRadius; },
  };
}

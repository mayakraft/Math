import {
  get_vector
} from "../parsers/arguments";

import {
  counter_clockwise_angle2,
  subsect
} from "../core/geometry";

// in progress: thinking that "center" isn't necessary, should we remove?
// import Ray from "./ray";

// a sector is defined as the interior angle space FROM A to B
// it's important you supply parameters in that order
const Sector = function (vectorA, vectorB, center = [0, 0]) {
  const vectors = [get_vector(vectorA), get_vector(vectorB)];

  const bisect = function () {
    const interior_angle = counter_clockwise_angle2(vectors[0], vectors[1]);
    const vectors_radians = vectors.map(el => Math.atan2(el[1], el[0]));
    const bisected = vectors_radians[0] + interior_angle * 0.5;
    return [Math.cos(bisected), Math.sin(bisected)];
  };

  // const subsect = function(divisions:number):Ray[]{
  const subsect_sector = function (divisions) {
    return subsect(divisions, vectors[0], vectors[1])
      .map(vec => [vec[0], vec[1]]);
  };

  /** a sector contains a point if it is between the two edges in counter-clockwise order */
  const contains = function (...args) {
    // move the point into the sector's space
    const point = get_vector(args).map((n, i) => n + center[i]);
    const cross0 = (point[1] - vectors[0][1]) * -vectors[0][0]
                 - (point[0] - vectors[0][0]) * -vectors[0][1];
    const cross1 = point[1] * vectors[1][0] - point[0] * vectors[1][1];
    return cross0 < 0 && cross1 < 0;
  };

  // return Object.freeze( {
  return {
    contains,
    bisect,
    subsect: subsect_sector,
    get center() { return center; },
    get vectors() { return vectors; },
    get angle() { return counter_clockwise_angle2(vectors[0], vectors[1]); },
  };
};

Sector.fromVectors = function (vectorA, vectorB) {
  return Sector(vectorA, vectorB);
};

Sector.fromPoints = function (pointA, pointB, center = [0, 0]) {
  const vectors = [pointA, pointB].map(p => p.map((_, i) => p[i] - center[i]));
  return Sector(vectors[0], vectors[1], center);
};

export default Sector;

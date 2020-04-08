import {
  Typeof,
  get_line,
  get_ray,
  get_vector_of_vectors,
} from "../../parsers/arguments";

import {
  circle_line,
  circle_ray,
  circle_segment,
} from "../../core/intersection";

import vector from "../vector/index";

import Intersect from "../../methods/intersect";


const M = {
  intersectionLine: function () {
    const line = get_line(arguments);
    const result = circle_line(origin, radius, line.origin, line.vector);
    return (result === undefined ? undefined : result.map(i => vector(i)));
  },
  intersectionRay: function () {
    const ray = get_ray(arguments);
    const result = circle_ray(origin, radius, ray.origin, ray.vector);
    return (result === undefined ? undefined : result.map(i => vector(i)));
  },
  intersectionSegment: function () {
    const segment = get_vector_of_vectors(arguments);
    const result = circle_segment(origin, radius, segment[0], segment[1]);
    return (result === undefined ? undefined : result.map(i => vector(i)));
  },
  intersectionCircle: function () {
    // const circle = get_circle(arguments);
  },
  intersect: function (object) {
    return Intersect(circle, object);
  },
};

// const tangentThroughPoint
// give us two tangent lines that intersect a point (outside the circle)

export default M;

import {
  Typeof,
  get_line,
  get_vector_of_vectors,
} from "../../parsers/arguments";

import vector from "../vector/index";

import Intersect from "../../intersection/index";


const CircleMethods = {
  // intersectionLine: function () {
  //   const line = get_line(arguments);
  //   const result = circle_line(this.origin, this.radius, line.origin, line.vector);
  //   return (result === undefined ? undefined : result.map(i => vector(i)));
  // },
  // intersectionRay: function () {
  //   const ray = get_ray(arguments);
  //   const result = circle_ray(this.origin, this.radius, ray.origin, ray.vector);
  //   return (result === undefined ? undefined : result.map(i => vector(i)));
  // },
  // intersectionSegment: function () {
  //   const segment = get_vector_of_vectors(arguments);
  //   const result = circle_segment(this.origin, this.radius, segment[0], segment[1]);
  //   return (result === undefined ? undefined : result.map(i => vector(i)));
  // },
  // intersectionCircle: function () {
  //   // const circle = get_circle(arguments);
  // },
  intersect: function (object) {
    return Intersect(this, object);
  },
};

// const tangentThroughPoint
// give us two tangent lines that intersect a point (outside the circle)

export default CircleMethods;

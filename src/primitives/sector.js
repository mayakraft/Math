import { get_vector } from "../parse/input";
import { counter_clockwise_angle2 } from "../core/geometry";
import Ray from "./ray";

// a sector is defined as the interior angle space FROM A to B
// it's important you supply parameters in that order
const Sector = function (center_point, pointA, pointB) {
  const center = get_vector(center_point);
  // const points = [get_vector(pointA), get_vector(pointB)];
  const points = [pointA, pointB];
  const vectors = points.map(p => p.map((_, i) => p[i] - center[i]));
  const angle = counter_clockwise_angle2(vectors[0], vectors[1]);

  const bisect = function () {
    const angles = vectors.map(el => Math.atan2(el[1], el[0]));
    const bisected = angles[0] + angle * 0.5;
    return Ray(center[0], center[1], Math.cos(bisected), Math.sin(bisected));
  };
  // const subsect = function(divisions:number):Ray[]{
  // const subsect = function (divisions) {
  //   if(divisions == undefined || divisions < 2){
  //    throw "subset() requires number parameter > 1";
  //   }
  //   var angles = this.vectors().map(function(el){ return Math.atan2(el.y, el.x); });
  //   while(angles[0] < 0){ angles[0] += Math.PI*2; }
  //   while(angles[1] < 0){ angles[1] += Math.PI*2; }
  //   var interior = counter_clockwise_angle2_radians(angles[0], angles[1]);
  //   var rays = [];
  //   for(var i = 1; i < divisions; i++){
  //    var angleA = angles[0] + interior * (i/divisions);
  //    rays.push(new Ray(new XY(this.origin.x, this.origin.y),
  //    new XY(Math.cos(angleA), Math.sin(angleA))));
  //   }
  //   return rays;
  // };

  /** a sector contains a point if it is between the two edges in counter-clockwise order */
  const contains = function (...args) {
    const point = get_vector(args);
    const cross0 = (point[1] - points[0][1]) * (center[0] - points[0][0])
                 - (point[0] - points[0][0]) * (center[1] - points[0][1]);
    const cross1 = (point[1] - center[1]) * (points[1][0] - center[0])
                 - (point[0] - center[0]) * (points[1][1] - center[1]);
    return cross0 < 0 && cross1 < 0;
  };

  // return Object.freeze( {
  return {
    contains,
    bisect,
    // subsect,
    get center() { return center; },
    get points() { return points; },
    get vectors() { return vectors; },
    get angle() { return angle; },
  };
};

export default Sector;

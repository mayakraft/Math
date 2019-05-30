import * as Input from "../parse/input";
import * as Geometry from "../core/geometry";
import { Vector } from "./vector";
import { Ray } from "./lines";
import { clean_number } from "../parse/clean";

// a sector is defined as the interior angle space FROM A to B
// it's important you supply parameters in that order
export function Sector(center, pointA, pointB) {

  let _center = Input.get_vector(center);
  // let _points = [Input.get_vector(pointA), Input.get_vector(pointB)];
  let _points = [pointA, pointB];
  let _vectors = _points.map(p => p.map((_,i) => p[i] - _center[i]));
  let _angle = Geometry.counter_clockwise_angle2(_vectors[0], _vectors[1]);
  const bisect = function() {
    let angles = _vectors.map(el => Math.atan2(el[1], el[0]));
    let bisected = angles[0] + _angle*0.5;
    return Ray(_center[0], _center[1], Math.cos(bisected), Math.sin(bisected));
  }
  // const subsect = function(divisions:number):Ray[]{
  const subsect = function(divisions) {
    // if(divisions == undefined || divisions < 2){ throw "subset() requires number parameter > 1"; }
    // var angles = this.vectors().map(function(el){ return Math.atan2(el.y, el.x); });
    // while(angles[0] < 0){ angles[0] += Math.PI*2; }
    // while(angles[1] < 0){ angles[1] += Math.PI*2; }
    // var interior = Geometry.counter_clockwise_angle2_radians(angles[0], angles[1]);
    // var rays = [];
    // for(var i = 1; i < divisions; i++){
    //  var angle = angles[0] + interior * (i/divisions);
    //  rays.push(new Ray(new XY(this.origin.x, this.origin.y), new XY(Math.cos(angle), Math.sin(angle))));
    // }
    // return rays;
  }

  /** a sector contains a point if it is between the two edges in counter-clockwise order */
  const contains = function() {
    let point = Input.get_vector(...arguments);
    var cross0 = (point[1] - _points[0][1]) * (_center[0] - _points[0][0]) - 
                 (point[0] - _points[0][0]) * (_center[1] - _points[0][1]);
    var cross1 = (point[1] - _center[1]) * (_points[1][0] - _center[0]) - 
                 (point[0] - _center[0]) * (_points[1][1] - _center[1]);
    return cross0 < 0 && cross1 < 0;
  }

  // return Object.freeze( {
  return {
    contains,
    bisect,
    subsect,
    get center() { return _center; },
    get points() { return _points; },
    get vectors() { return _vectors; },
    get angle() { return _angle; },
  };
}

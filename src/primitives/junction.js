import {
  get_vector,
  get_array_of_vec,
} from "../parse/arguments";

import { counter_clockwise_angle2 } from "../core/geometry";

import Sector from "./sector";

const Junction = function (center_point, adjacent_points) {
  const points = get_array_of_vec(adjacent_points);
  if (points === undefined) {
    // todo, best practices here
    return undefined;
  }

  const center = get_vector(center_point);
  const vectors = points.map(p => p.map((_, i) => p[i] - center_point[i]));
  const angles = vectors.map(v => Math.atan2(v[1], v[0]));

  let clockwise_order = Array.from(Array(angles.length))
    .map((_, i) => i)
    .sort((a, b) => angles[a] - angles[b]);
  clockwise_order = clockwise_order
    .slice(clockwise_order.indexOf(0), clockwise_order.length)
    .concat(clockwise_order.slice(0, clockwise_order.indexOf(0)));

  const kawasaki = function () {
    // const kAngles = points
    //   .map(p => [p.position[0] - sketch.width/2, p.position[1] - sketch.height/2])
    //   .map(v => Math.atan2(v[1], v[0]))
    //   .sort((a,b) => a - b);
    // // vectors.forEach((v) => v["angle"] = RabbitEar.math.core.geometry.clockwise_angle2(v.vector));
    // const r = (sketch.width > sketch.height) ? sketch.height*0.4 : sketch.width*0.4;
    // const wedges = kAngles.map((_, i, arr) =>
    //   RabbitEar.svg.wedge(sketch.width / 2, sketch.height / 2, r, kAngles[i], kAngles[(i+1)%arr.length])
    // );
    // const wedgeColors = ["#314f69", "#e35536"];
    // wedges.forEach((w, i) => w.setAttribute("fill", wedgeColors[i%2]));
    // wedges.forEach(w => sketch.sectorLayer.appendChild(w));
  };

  // const alternatingAngleSum = function () {
  //  // only computes if number of interior angles are even
  //  if(angles.length % 2 != 0){ return undefined; }
  //  const sums = [0, 0];
  //  angles.forEach((angle,i) => sums[i%2] += angle );
  //  return sums;
  // }

  const sectors = function () {
    return clockwise_order.map((_, i) => Sector(center,
      points[clockwise_order[i]],
      points[clockwise_order[(i + 1) % clockwise_order.length]]));
  };

  const alternatingAngleSum = function () {
    const interior = sectors().map(s => s.angle);
    return [
      interior.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0),
      interior.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0),
    ];
  };

  const kawasaki_from_even = function (array) {
    // sums is 2 arrays, array filtered into even and odd, summed
    return [0, 1].map(e_o => array
      .filter((_, i) => i % 2 === e_o)
      .reduce((a, b) => a + b, 0))
      .map(s => Math.PI - s);
    // if (even_sum > Math.PI) { return undefined; }
  };
  const kawasaki_solutions = function () {
    // get the interior angles of sectors around a vertex
    return clockwise_order.map((_, i, arr) => {
      const thisV = vectors[arr[i]];
      const nextV = vectors[arr[(i + 1) % arr.length]];
      return counter_clockwise_angle2(thisV, nextV);
    })
      .map((_, i, arr) => arr
        .slice(i + 1, arr.length).concat(arr.slice(0, i)))
      // for every sector, get an array of all the OTHER sectors
      .map(a => kawasaki_from_even(a))
      // change these relative angle solutions to absolute angles
      .map((kawasakis, i) => (kawasakis == null
        ? undefined
        : angles[clockwise_order[i]] + kawasakis[0]))
      // convert to vectors
      .map(k => (k === undefined
        ? undefined
        : [Math.cos(k), Math.sin(k)]));
  };

  // return Object.freeze( {
  return {
    kawasaki,
    kawasaki_solutions,
    alternatingAngleSum,
    sectors,
    get center() { return center; },
    get points() { return points; },
    get vectors() { return vectors; },
    get angles() { return angles; },
  };
};

Junction.fromVectors = function (center, vectors) {
  const points = get_array_of_vec(vectors)
    .map(v => v.map((n, i) => n + center[i]));
  return Junction(center, points);
};

export default Junction;

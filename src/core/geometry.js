import { EPSILON } from "./equal";
import { clean_number } from "../arguments/resize";
import { rect_form } from "../arguments/get";
import { point_on_line } from "../overlap/points";
import {
  dot,
  normalize,
  midpoint,
  add,
  rotate90,
} from "./algebra";
import {
  intersect_lines,
  exclude_l_s,
} from "../intersection/lines";

export const R2D = 180 / Math.PI;
export const D2R = Math.PI / 180;
export const TWO_PI = Math.PI * 2;

export const is_counter_clockwise_between = (angle, angleA, angleB) => {
  while (angleB < angleA) { angleB += TWO_PI; }
  while (angle > angleA) { angle -= TWO_PI; }
  while (angle < angleA) { angle += TWO_PI; }
  return angle < angleB;
};
/** There are 2 interior angles between 2 absolute angle measurements, from A to B return the clock
wise one
 * @param {number} angle in radians, angle PI/2 is along the +Y axis
 * @returns {number} clockwise interior angle (from a to b) in radians
 */
export const clockwise_angle2_radians = (a, b) => {
  // this is on average 50 to 100 times faster than clockwise_angle2
  while (a < 0) { a += TWO_PI; }
  while (b < 0) { b += TWO_PI; }
  while (a > TWO_PI) { a -= TWO_PI; }
  while (b > TWO_PI) { b -= TWO_PI; }
  const a_b = a - b;
  return (a_b >= 0)
    ? a_b
    : TWO_PI - (b - a);
};

// @returns {number}
export const counter_clockwise_angle2_radians = (a, b) => {
  // this is on average 50 to 100 times faster than counter_clockwise_angle2
  while (a < 0) { a += TWO_PI; }
  while (b < 0) { b += TWO_PI; }
  while (a > TWO_PI) { a -= TWO_PI; }
  while (b > TWO_PI) { b -= TWO_PI; }
  const b_a = b - a;
  return (b_a >= 0)
    ? b_a
    : TWO_PI - (a - b);
};
/** There are 2 angles between 2 vectors, from A to B return the clockwise one.
 * @param {[number, number]} vector
 * @returns {number} clockwise angle (from a to b) in radians
 */
export const clockwise_angle2 = (a, b) => {
  const dotProduct = b[0] * a[0] + b[1] * a[1];
  const determinant = b[0] * a[1] - b[1] * a[0];
  let angle = Math.atan2(determinant, dotProduct);
  if (angle < 0) { angle += TWO_PI; }
  return angle;
};

// @returns {number}
export const counter_clockwise_angle2 = (a, b) => {
  const dotProduct = a[0] * b[0] + a[1] * b[1];
  const determinant = a[0] * b[1] - a[1] * b[0];
  let angle = Math.atan2(determinant, dotProduct);
  if (angle < 0) { angle += TWO_PI; }
  return angle;
};
/**
 * given vectors, make a separate array of radially-sorted vector indices
 *
 * maybe there is such thing as an absolute radial origin (x axis?)
 * but this chooses the first element as the first element
 * and sort everything else counter-clockwise around it.
 *
 * @returns {number[]}, already c-cwise sorted would give [0,1,2,3,4]
 */
export const counter_clockwise_vector_order = (...vectors) => {
  const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
  const counter_clockwise = Array.from(Array(vectors_radians.length))
    .map((_, i) => i)
    .sort((a, b) => vectors_radians[a] - vectors_radians[b]);
  return counter_clockwise
    .slice(counter_clockwise.indexOf(0), counter_clockwise.length)
    .concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
/** There are 2 interior angles between 2 vectors, return both,
 * (no longer the the smaller first, but counter-clockwise from the first)
 * @param {[number, number]} vector
 * @returns {[number, number]} 2 angle measurements between vectors
 */
// export const interior_angles2 = (a, b) => {
//   const interior1 = counter_clockwise_angle2(a, b);
//   const interior2 = Math.PI * 2 - interior1;
//   // return (interior1 < interior2)
//   //   ? [interior1, interior2]
//   //   : [interior2, interior1];
//   return [interior1, interior2];
// };
/**
 * very important! this does not do any sorting. it calculates the interior
 * angle between each consecutive vector. if you need them to add up to 360deg,
 * you'll need to pre-sort your vectors with counter_clockwise_vector_order
 */
export const interior_angles = (...vecs) => vecs
  .map((v, i, ar) => counter_clockwise_angle2(v, ar[(i + 1) % ar.length]));

const interior_angles_unsorted = function (...vectors) {
};

/**
 * This bisects 2 vectors into the smaller of their two angle bisections
 * technically this works in any dimension... unless the vectors are 180deg
 * from each other, there are an infinite number of solutions in 3D but
 * 2 solutions in 2D, this will return one of the 2D solutions.
 * todo: reconsider these assumptions
 * @param {[number, number]} vector
 * @returns {[[number, number],[number, number]]} 2 vectors, the smaller first
 */
export const bisect_vectors = (a, b) => {
  const aV = normalize(a);
  const bV = normalize(b);
  return dot(aV, bV) < (-1 + EPSILON)
    ? [-aV[1], aV[0]]
    : normalize(add(aV, bV));
};
/** This bisects 2 lines
 * @param {[number, number]} all vectors, lines defined by points and vectors
 * @returns [ [number,number], [number,number] ] // line, defined as
 * point then vector, in that order
 *
 * second entry is 90 degrees counter clockwise from first entry
 */
export const bisect_lines2 = (vectorA, pointA, vectorB, pointB) => {
  const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
  if (Math.abs(denominator) < EPSILON) { /* parallel */
    const solution = [[vectorA[0], vectorA[1]], midpoint(pointA, pointB)];
    const array = [solution, solution];
    const dt = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
    delete array[(dt > 0 ? 1 : 0)];
    return array;
  }
  // const vectorC = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
  const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
  const t = numerator / denominator;
  const origin = [
    pointA[0] + vectorA[0] * t,
    pointA[1] + vectorA[1] * t,
  ];
  const bisects = [bisect_vectors(vectorA, vectorB)];
  bisects[1] = rotate90(bisects[0]);
  return bisects.map(vector => ({ vector, origin }));
};
/**
 * subsect the angle between two vectors already converted to radians
 */
export const subsect_radians = (divisions, angleA, angleB) => {
  const angle = counter_clockwise_angle2_radians(angleA, angleB) / divisions;
  return Array.from(Array(divisions - 1))
    .map((_, i) => angleA + angle * i);
};
/**
 * subsect the angle between two vectors (counter-clockwise from A to B)
 */
export const subsect = (divisions, vectorA, vectorB) => {
  const angleA = Math.atan2(vectorA[1], vectorA[0]);
  const angleB = Math.atan2(vectorB[1], vectorB[0]);
  return subsect_radians(divisions, angleA, angleB)
    .map(rad => [Math.cos(rad), Math.sin(rad)]);
};
/**
 * subsect the angle between two lines, can handle parallel lines
 */
// export const subsectLines = function (divisions, pointA, vectorA, pointB, vectorB) {
//   const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
//   if (Math.abs(denominator) < EPSILON) { /* parallel */
//     const solution = [midpoint(pointA, pointB), [vectorA[0], vectorA[1]]];
//     const array = [solution, solution];
//     const dot = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
//     delete array[(dot > 0 ? 1 : 0)];
//     return array;
//   }
//   const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
//   const t = numerator / denominator;
//   const x = pointA[0] + vectorA[0] * t;
//   const y = pointA[1] + vectorA[1] * t;
//   const bisects = bisect_vectors(vectorA, vectorB);
//   bisects[1] = [-bisects[0][1], bisects[0][0]];
//   return bisects.map(el => [[x, y], el]);
// };

export const circumcircle = function (a, b, c) {
  const A = b[0] - a[0];
  const B = b[1] - a[1];
  const C = c[0] - a[0];
  const D = c[1] - a[1];
  const E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
  const F = C * (a[0] + c[0]) + D * (a[1] + c[1]);
  const G = 2 * (A * (c[1] - b[1]) - B * (c[0] - b[0]));
  if (Math.abs(G) < EPSILON) {
    const minx = Math.min(a[0], b[0], c[0]);
    const miny = Math.min(a[1], b[1], c[1]);
    const dx = (Math.max(a[0], b[0], c[0]) - minx) * 0.5;
    const dy = (Math.max(a[1], b[1], c[1]) - miny) * 0.5;
    return {
      origin: [minx + dx, miny + dy],
      radius: Math.sqrt(dx * dx + dy * dy),
    };
  }
  const origin = [(D * E - B * F) / G, (A * F - C * E) / G];
  const dx = origin[0] - a[0];
  const dy = origin[1] - a[1];
  return {
    origin,
    radius: Math.sqrt(dx * dx + dy * dy),
  };
};

/** Calculates the signed area of a polygon. This requires the polygon be non-intersecting.
 * @returns {number} the area of the polygon
 * @example
 * var area = polygon.signedArea()
 */
export const signed_area = points => 0.5 * points
  .map((el, i, arr) => {
    const next = arr[(i + 1) % arr.length];
    return el[0] * next[1] - next[0] * el[1];
  }).reduce((a, b) => a + b, 0);

/** Calculates the centroid or the center of mass of the polygon.
 * @returns {XY} the location of the centroid
 * @example
 * var centroid = polygon.centroid()
 */
export const centroid = (points) => {
  const sixthArea = 1 / (6 * signed_area(points));
  return points.map((el, i, arr) => {
    const next = arr[(i + 1) % arr.length];
    const mag = el[0] * next[1] - next[0] * el[1];
    return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
  }).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
    .map(c => c * sixthArea);
};

/**
 * works in any n-dimension (enclosing cube, hypercube..)
 * @returns array of arrays: [[x, y], [width, height]]
 */
export const enclosing_rectangle = (points) => {
  const mins = Array(points[0].length).fill(Infinity);
  const maxs = Array(points[0].length).fill(-Infinity);
  points.forEach(point => point
    .forEach((c, i) => {
      if (c < mins[i]) { mins[i] = c; }
      if (c > maxs[i]) { maxs[i] = c; }
    }));
  const lengths = maxs.map((max, i) => max - mins[i]);
  return rect_form(...lengths, ...mins);
};
/**
 * the radius parameter measures from the center to the midpoint of the edge
 * vertex-axis aligned
 * todo: also possible to parameterize the radius as the center to the points
 * todo: can be edge-aligned
 */
export const make_regular_polygon = (sides, radius = 1, x = 0, y = 0) => {
  const halfwedge = TWO_PI / sides / 2;
  const r = radius / 2 / Math.cos(halfwedge);
  return Array.from(Array(Math.floor(sides)))
    // const a = -(TWO_PI * i) / sides + halfwedge; // edge-aligned
    .map((_, i) => TWO_PI * (i / sides))
    .map(a => [x + r * Math.cos(a), y + r * Math.sin(a)])
    .map(p => p.map(n => clean_number(n, 14)));  // this step is costly!
};

const line_segment_exclusive = function (lineVector, linePoint, segmentA, segmentB) {
  const pt = segmentA;
  const vec = [segmentB[0] - segmentA[0], segmentB[1] - segmentA[1]];
  return intersect_lines(lineVector, linePoint, vec, pt, exclude_l_s);
};

export const split_polygon = () => console.warn("split polygon not done");

// export const split_polygon = (poly, lineVector, linePoint) => {
//   //    point: intersection [x,y] point or null if no intersection
//   // at_index: where in the polygon this occurs
//   const vertices_intersections = poly.map((v, i) => {
//     const intersection = point_line_overlap(linePoint, lineVector, v);
//     return { type: "v", point: intersection ? v : null, at_index: i };
//   }).filter(el => el.point != null);
//   const edges_intersections = poly.map((v, i, arr) => {
//     const intersection = line_segment_exclusive(
//       lineVector,
//       linePoint,
//       v,
//       arr[(i + 1) % arr.length]
//     );
//     return { type: "e", point: intersection, at_index: i };
//   }).filter(el => el.point != null);

//   const sorted = vertices_intersections
//     .concat(edges_intersections)
//     .sort((a, b) => (Math.abs(a.point[0] - b.point[0]) < EPSILON
//       ? a.point[1] - b.point[1]
//       : a.point[0] - b.point[0]));
//   console.log(sorted);
//   return poly;
// };

export const split_convex_polygon = (poly, lineVector, linePoint) => {
  // todo: should this return undefined if no intersection?
  //       or the original poly?

  //    point: intersection [x,y] point or null if no intersection
  // at_index: where in the polygon this occurs
  let vertices_intersections = poly.map((v, i) => {
    let intersection = point_on_line(v, lineVector, linePoint);
    return { point: intersection ? v : null, at_index: i };
  }).filter(el => el.point != null);
  let edges_intersections = poly.map((v, i, arr) => {
    let intersection = line_segment_exclusive(lineVector, linePoint, v, arr[(i + 1) % arr.length])
    return { point: intersection, at_index: i };
  }).filter(el => el.point != null);

  // three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
  if (edges_intersections.length == 2) {
    let sorted_edges = edges_intersections.slice()
      .sort((a,b) => a.at_index - b.at_index);

    let face_a = poly
      .slice(sorted_edges[1].at_index+1)
      .concat(poly.slice(0, sorted_edges[0].at_index+1))
    face_a.push(sorted_edges[0].point);
    face_a.push(sorted_edges[1].point);

    let face_b = poly
      .slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1);
    face_b.push(sorted_edges[1].point);
    face_b.push(sorted_edges[0].point);
    return [face_a, face_b];
  } else if (edges_intersections.length == 1 && vertices_intersections.length == 1) {
    vertices_intersections[0]["type"] = "v";
    edges_intersections[0]["type"] = "e";
    let sorted_geom = vertices_intersections.concat(edges_intersections)
      .sort((a,b) => a.at_index - b.at_index);

    let face_a = poly.slice(sorted_geom[1].at_index+1)
      .concat(poly.slice(0, sorted_geom[0].at_index+1))
    if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
    face_a.push(sorted_geom[1].point); // todo: if there's a bug, it's here. switch this

    let face_b = poly
      .slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1);
    if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
    face_b.push(sorted_geom[0].point); // todo: if there's a bug, it's here. switch this
    return [face_a, face_b];
  } else if (vertices_intersections.length == 2) {
    let sorted_vertices = vertices_intersections.slice()
      .sort((a,b) => a.at_index - b.at_index);
    let face_a = poly
      .slice(sorted_vertices[1].at_index)
      .concat(poly.slice(0, sorted_vertices[0].at_index+1))
    let face_b = poly
      .slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
    return [face_a, face_b];
  }
  return [poly.slice()];
};

export const convex_hull = (points, include_collinear = false, epsilon = EPSILON) => {
  // # points in the convex hull before escaping function
  let INFINITE_LOOP = 10000;
  // sort points by y. if ys are equivalent, sort by x
  let sorted = points.slice().sort((a, b) =>
    (Math.abs(a[1] - b[1]) < epsilon
      ? a[0] - b[0]
      : a[1] - b[1]))
  let hull = [];
  hull.push(sorted[0]);
  // the current direction the perimeter walker is facing
  let ang = 0;
  let infiniteLoop = 0;
  do {
    infiniteLoop += 1;
    let h = hull.length - 1;
    let angles = sorted
      // remove all points in the same location from this search
      .filter(el => !(Math.abs(el[0] - hull[h][0]) < epsilon
        && Math.abs(el[1] - hull[h][1]) < epsilon))
      // sort by angle, setting lowest values next to "ang"
      .map((el) => {
        let angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);
        while (angle < ang) { angle += Math.PI * 2; }
        return { node: el, angle, distance: undefined };
      }) // distance to be set later
      .sort((a, b) => ((a.angle < b.angle) ? -1 : (a.angle > b.angle) ? 1 : 0));
    if (angles.length === 0) { return undefined; }
    // narrowest-most right turn
    let rightTurn = angles[0];
    // collect all other points that are collinear along the same ray
    angles = angles.filter(el => Math.abs(rightTurn.angle - el.angle) < epsilon)
    // sort collinear points by their distances from the connecting point
      .map((el) => {
        let distance = Math.sqrt(((hull[h][0] - el.node[0]) ** 2) + ((hull[h][1] - el.node[1]) ** 2));
        el.distance = distance;
        return el;
      })
    // (OPTION 1) exclude all collinear points along the hull
      .sort((a, b) => ((a.distance < b.distance) ? 1 : (a.distance > b.distance) ? -1 : 0));
    // (OPTION 2) include all collinear points along the hull
    // .sort(function(a,b) {return (a.distance < b.distance)?-1:(a.distance > b.distance)?1:0});
    // if the point is already in the convex hull, we've made a loop. we're done
    // if (contains(hull, angles[0].node)) {
    // if (includeCollinear) {
    //  points.sort(function(a,b) {return (a.distance - b.distance)});
    // } else{
    //  points.sort(function(a,b) {return b.distance - a.distance});
    // }

    if (hull.filter(el => el === angles[0].node).length > 0) {
      return hull;
    }
    // add point to hull, prepare to loop again
    hull.push(angles[0].node);
    // update walking direction with the angle to the new point
    ang = Math.atan2(hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
  } while (infiniteLoop < INFINITE_LOOP);
  return undefined;
};

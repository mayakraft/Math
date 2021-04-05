/**
 * Rabbit Ear (c) Robby Kraft
 */
import { EPSILON } from "./constants";
import Constructors from "../primitives/constructors";
import { resize_up } from "../arguments/resize";
import { include_l } from "../arguments/functions";
import {
  mag_squared,
  dot,
  scale,
  normalize,
  midpoint,
  flip,
  distance,
  add,
  subtract,
  rotate90,
} from "./algebra";
import { axiom6ud } from "./axioms_ud";
import {
  vector_origin_to_ud,
  ud_to_vector_origin,
} from "./parameterize";
import {
  bisect_lines2,
} from "./radial";
import intersect_circle_line from "../intersection/intersect-circle-line";
import intersect_line_line from "../intersection/intersect-line-line";

/*           _                       _              _
            (_)                     (_)            (_)
   ___  _ __ _  __ _  __ _ _ __ ___  _    __ ___  ___  ___  _ __ ___  ___
  / _ \| '__| |/ _` |/ _` | '_ ` _ \| |  / _` \ \/ / |/ _ \| '_ ` _ \/ __|
 | (_) | |  | | (_| | (_| | | | | | | | | (_| |>  <| | (_) | | | | | \__ \
  \___/|_|  |_|\__, |\__,_|_| |_| |_|_|  \__,_/_/\_\_|\___/|_| |_| |_|___/
                __/ |
               |___/
*/
export const axiom1 = (pointA, pointB) => Constructors.line(
  normalize(subtract(...resize_up(pointB, pointA))),
  pointA
);

export const axiom2 = (pointA, pointB) => Constructors.line(
  normalize(rotate90(subtract(...resize_up(pointB, pointA)))),
  midpoint(pointA, pointB)
);
// make sure these all get a resize_up or whatever is necessary
export const axiom3 = (vectorA, originA, vectorB, originB) => bisect_lines2(
  vectorA, originA, vectorB, originB).map(Constructors.line);
/**
 * axiom 4
 * @description create a line perpendicular to a vector through a point
 * @param {number[]} the vector of the line
 * @param {number[]} the point
 * @returns {line} axiom 4 result
 */
export const axiom4 = (vector, point) => Constructors.line(
  rotate90(normalize(vector)),
  point
);

export const axiom5 = (vectorA, originA, pointA, pointB) => (intersect_circle_line(
    distance(pointA, pointB),
    pointA,
    vectorA,
    originA,
    include_l
  ) || []).map(sect => Constructors.line(
    normalize(rotate90(subtract(...resize_up(sect, pointB)))),
    midpoint(pointB, sect)
  ));
/**
 * @description axiom 6: make a crease by bringing pointA onto a
 *  lineA and pointB onto lineB
 * @param {number[]} vector of the first line
 * @param {number[]} origin of the first line
 * @param {number[]} vector of the second line
 * @param {number[]} origin of the second line
 * @param {number[]} point to bring to the first line
 * @param {number[]} point to bring to the second line
 */
export const axiom6 = (vectorA, originA, vectorB, originB, pointA, pointB) => {
  const lineA = vector_origin_to_ud({ vector: vectorA, origin: originA });
  const lineB = vector_origin_to_ud({ vector: vectorB, origin: originB });
  return axiom6ud(lineA, lineB, pointA, pointB)
    .map(ud_to_vector_origin)
    .map(Constructors.line);
};
/**
 * @description axiom 7: make a crease by bringing a point (pointC) onto a
 *  line () perpendicular to another line ()
 * @param {number[]} vector of the first line
 * @param {number[]} origin of the first line
 * @param {number[]} vector of the second line (origin is not needed)
 * @param {number[]} point involved in the folding
 */
export const axiom7 = (vectorA, originA, vectorB, pointC) => {
  const intersect = intersect_line_line(
    vectorA, originA,
    vectorB, pointC,
    include_l, include_l);
  return intersect === undefined
    ? undefined
    : Constructors.line(
        normalize(rotate90(subtract(...resize_up(intersect, pointC)))),
        midpoint(pointC, intersect)
    );
};

/**
 * Rabbit Ear (c) Robby Kraft
 */
//import Constructors from "../primitives/constructors";
import { resize_up } from "../arguments/resize";
import { include_l } from "../arguments/functions";
import {
  normalize2,
  midpoint2,
  distance2,
  subtract2,
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
/**
 * these origami axioms assume 2D geometry in the 2D plane,
 * where points are parameterized as vectors (Javascript arrays of numbers)
 * and lines are in vector-origin form (Javascript objects with "origin" and "vector")
 *   (themselves are Javascript Arrays, same as "points")
 * where the direction of the vector is along the line, and
 * is not necessarily normalized.
 */

/**
 * @description origami axiom 1: form a line that passes between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {{vector: number[], origin: number[]}} the line in {vector, origin} form
 */
export const axiom1 = (point1, point2) => ({
  vector: normalize2(subtract2(...resize_up(point2, point1))),
  origin: point1
});
/**
 * @description origami axiom 2: form a perpendicular bisector between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {{vector: number[], origin: number[]}} the line in {vector, origin} form
 */
export const axiom2 = (point1, point2) => ({
  vector: normalize2(rotate90(subtract2(...resize_up(point2, point1)))),
  origin: midpoint2(point1, point2)
});
// todo: make sure these all get a resize_up or whatever is necessary
/**
 * @description origami axiom 3: form two lines that make the two angular bisectors between
 * two input lines, and in the case of parallel inputs only one solution will be given
 * @param {{vector: number[], origin: number[]}} line1 one 2D line in {vector, origin} form
 * @param {{vector: number[], origin: number[]}} line2 one 2D line in {vector, origin} form
 * @returns {{vector: number[], origin: number[]}[]} an array of lines in {vector, origin} form
 */
export const axiom3 = (line1, line2) => bisect_lines2(
  line1.vector, line1.origin, line2.vector, line2.origin
);
/**
 * @description origami axiom 4: form a line perpendicular to a given line that
 * passes through a point.
 * @param {{vector: number[], origin: number[]}} line one 2D line in {vector, origin} form
 * @param {number[]} point one 2D point
 * @returns {{vector: number[], origin: number[]}} the line in {vector, origin} form
 */
export const axiom4 = (line, point) => ({
  vector: rotate90(normalize2(line.vector)),
  origin: point
});
/**
 * @description origami axiom 5: form up to two lines that pass through a point that also
 * brings another point onto a given line
 * @param {{vector: number[], origin: number[]}} line one 2D line in {vector, origin} form
 * @param {number[]} point one 2D point, the point that the line(s) pass through
 * @param {number[]} point one 2D point, the point that is being brought onto the line
 * @returns {{vector: number[], origin: number[]}[]} an array of lines in {vector, origin} form
 */
export const axiom5 = (line, point1, point2) => (intersect_circle_line(
    distance2(point1, point2),
    point1,
    line.vector,
    line.origin,
    include_l
  ) || []).map(sect => ({
    vector: normalize2(rotate90(subtract2(...resize_up(sect, point2)))),
    origin: midpoint2(point2, sect)
  }));
/**
 * @description origami axiom 6: form up to three lines that are made by bringing
 * a point to a line and a second point to a second line.
 * @param {{vector: number[], origin: number[]}} line1 one 2D line in {vector, origin} form
 * @param {{vector: number[], origin: number[]}} line2 one 2D line in {vector, origin} form
 * @param {number[]} point1 the point to bring to the first line
 * @param {number[]} point2 the point to bring to the second line
 * @returns {{vector: number[], origin: number[]}[]} an array of lines in {vector, origin} form
 */
export const axiom6 = (line1, line2, point1, point2) => axiom6ud(
  vector_origin_to_ud(line1),
  vector_origin_to_ud(line2),
  point1, point2).map(ud_to_vector_origin);
    // .map(Constructors.line);
/**
 * @description origami axiom 7: form a line by bringing a point onto a given line
 * while being perpendicular to another given line.
 * @param {{vector: number[], origin: number[]}} line1 one 2D line in {vector, origin} form,
 * the line the point will be brought onto.
 * @param {{vector: number[], origin: number[]}} line2 one 2D line in {vector, origin} form,
 * the line which the perpendicular will be based off.
 * @param {number[]} point the point to bring onto the line
 * @returns {{vector: number[], origin: number[]} | undefined} the line in {vector, origin} form
 * or undefined if the given lines are parallel
 */
export const axiom7 = (line1, line2, point) => {
  const intersect = intersect_line_line(
    line1.vector, line1.origin,
    line2.vector, point,
    include_l, include_l);
  return intersect === undefined
    ? undefined
    : ({//Constructors.line(
// todo: switch this out, but test it as you do
        vector: normalize2(rotate90(subtract2(...resize_up(intersect, point)))),
        // vector: normalize2(rotate90(line2.vector)),
        origin: midpoint2(point, intersect)
    });
};

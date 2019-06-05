import { interior_angles } from "./geometry";

/**
 * two varieties: vectors, radians, with a very important difference!:
 *
 * 1. the vectors describe the direction of the edge (length doesn't matter)
 * 2. the angles in radians are the INTERIOR ANGLES between the edges, not
 * the radians form of the vectors in case 1.
 *
 * case 2. is generally the faster way, vectors have to be turned into interior
 * angles.
 */

/**
 *
 *
 */
export const alternating_sum = function (...angles) {
  return [0, 1].map(even_odd => angles
    .filter((_, i) => i % 2 === even_odd)
    .reduce((a, b) => a + b, 0));
};

/**
 * sums is 2 arrays, array filtered into even and odd, summed
 *
 */
export const kawasaki_sector_score = function (...angles) {
  return alternating_sum(...angles).map(s => Math.PI - s);
};
// export const kawasaki_from_even_vectors = function (...vectors) {
//   return kawasaki_sector_score(...interior_angles(...vectors));
// };

/**
 *
 *
 */
export const kawasaki_solutions_radians = function (...angles) {
  // get the interior angles of sectors around a vertex
  return angles
    .map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
    // for every sector, get an array of all the OTHER sectors
    .map(a => kawasaki_sector_score(...a))
    // change these relative angle solutions to absolute angles
    .map((kawasakis, i) => (kawasakis == null
      ? undefined
      : angles[i] + kawasakis[0]))
    // convert to vectors
    .map(k => (k === undefined
      ? undefined
      : [Math.cos(k), Math.sin(k)]));
};

export const kawasaki_solutions_vectors = function (...vectors) {
  return kawasaki_solutions_radians(...interior_angles(...vectors));
};

/**
 * Math (c) Kraft
 */
import {
  magnitude,
  dot,
  scale,
  rotate90,
  rotate270,
} from "./algebra";
/**
 * @notes in Robert Lang's U-D parameterization definition, U is defined
 * to be any vector made from an angle constrained between [0...180), meaning
 * the y component will never be negative.
 * The D component is allowed to be any number between -Infinity...Infinity
 * 
 * The constraint on the normal-angle causes issues when converting back
 * and forth between vector-origin and UD parameterization. Lang's intention
 * is that lines do not have a directionality, whereas this library does,
 * (see: Axiom folding, which face to fold is decided by the line's vector).
 * 
 * Therefore, this library modifies the paramterization slightly to allow
 * unconstrained normals, where the angle can be anywhere [0...360).
 * The cost is when testing equality, the normal and its flip must be checked,
 * or, U normals can be flipped (and the sign of D flipped) ahead of time.
 *  return d < 0
 *    ? { u: scale(u, -1/mag), d: -d }
 *    : { u: scale(u, 1/mag), d };
 */

/**
 * @description convert a line from one parameterization into another.
 * convert vector-origin into u-d (normal, distance-to-origin)
 */
export const vector_origin_to_ud = ({ vector, origin }) => {
  const mag = magnitude(vector);
  const u = rotate90(vector);
  const d = dot(origin, u) / mag;
  return { u: scale(u, 1 / mag), d };

};
/**
 * @description convert a line from one parameterization into another.
 * convert u-d (normal, distance-to-origin) into vector-origin
 */
export const ud_to_vector_origin = ({ u, d }) => ({
  vector: rotate270(u),
  origin: scale(u, d),
});

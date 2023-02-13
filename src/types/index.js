/**
 * Math (c) Kraft
 */
import typeOf from "./typeof.js";
import * as resizers from "./resize.js";
import * as getters from "./get.js";
import * as parameterize from "./parameterize.js";

export default {
	...resizers,
	...parameterize,
	...getters,
	typeOf,
};

/**
 * @typedef BoundingBox
 * @type {object}
 * @description An n-dimensional axis-aligned bounding box that ecloses a space.
 * @property {number[]} min the corner point of the box that is a minima along all axes.
 * @property {number[]} max the corner point of the box that is a maxima along all axes.
 * @property {number[]} span the lengths of the box along all dimensions,
 * the difference between the maxima and minima.
 * @example
 * {
 *   min: [-3, -10],
 *   max: [5, -1],
 *   span: [8, 9],
 * }
 */

/**
 * @typedef RayLine
 * @type {object}
 * @description an object with a vector and an origin, representing a line or a ray.
 * @property {number[]} vector - the line's direction vector
 * @property {number[]} origin - one point that intersects with the line
 * @example
 * {
 *   vector: [0.0, 1.0],
 *   origin: [0.5, 0.5]
 * }
 */

/**
 * @typedef UniqueLine
 * @type {object}
 * @description This is a parameterization of an infinite line which gives each line a
 * unique parameterization, making checking for duplicates easily.
 * @property {number[]} normal - the line's normal vector
 * @property {number} distance - the shortest distance from the origin to the line
 */

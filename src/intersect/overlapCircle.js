/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import { exclude } from "../general/functions.js";
import { distance2 } from "../algebra/vectors.js";

export const overlapCirclePoint = ({ radius, origin }, point, fn = exclude, epsilon = EPSILON) => (
	fn(radius - distance2(origin, point), epsilon)
);

/**
 * Math (c) Kraft
 */
import { EPSILON } from "../algebra/constants.js";
import { distance2 } from "../algebra/vectors.js";
import { exclude } from "../algebra/functions.js";

export const overlapCirclePoint = (radius, origin, point, func = exclude, epsilon = EPSILON) => (
	func(radius - distance2(origin, point), epsilon)
);

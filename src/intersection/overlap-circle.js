/**
 * Math (c) Kraft
 */
import { EPSILON } from "../algebra/constants";
import { distance2 } from "../algebra/vectors";
import { exclude } from "../algebra/functions";

export const overlapCirclePoint = (radius, origin, point, func = exclude, epsilon = EPSILON) => (
	func(radius - distance2(origin, point), epsilon)
);

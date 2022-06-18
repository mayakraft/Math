/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";
import { distance2 } from "../core/algebra";
import { exclude } from "../arguments/functions";

export const overlapCirclePoint = (radius, origin, point, func = exclude, epsilon = EPSILON) =>
  func(radius - distance2(origin, point), epsilon);


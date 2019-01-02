/**
 *  Geometry library
 *  The goal of this user-facing library is to type check all arguments for a
 *  likely use case, which might slow runtime by a small fraction.
 *  Use the core library functions for fastest-possible calculations.
 */

// all static constructors start with "make". eg: Matrix.makeRotation(...)
// all boolean tests start with "is" or "are" eg: Line.isParallel(...)

// For now, this library is 2D.
// however a lot of types and operations are built to function in n-dimensions.


import * as algebra from './core/algebra';
//import * as constants from './core/constants';
import * as geometry from './core/geometry';
import * as intersection from './core/intersection';
import * as origami from './core/origami';

let core = { algebra, geometry, intersection, origami };

export { core };
export { Vector } from './primitives/vector';
export { Circle } from './primitives/circle';
export { Polygon, ConvexPolygon } from './primitives/polygon';
export { Matrix } from './primitives/matrix';
export { Line, Ray, Edge } from './primitives/lines';

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

import * as Core from './core';
import * as Input from './input';
import * as Intersection from './intersection';

// export * from './intersection';
let intersection = Intersection;
let core = Core;
let input = Input;

export { intersection }
export { core };
export { input };
export { Vector } from './primitives/vector';

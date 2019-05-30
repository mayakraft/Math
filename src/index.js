/**
 *  Geometry library
 *  The user-facing types (Vector, Sector) interpret arguments for the best
 *  use case. The core methods are as fast as possible and don't type check.
 *  in the core all vector types are expecting as Javascript arrays.
 */

import * as algebra from "./core/algebra";
import * as geometry from "./core/geometry";
import * as intersection from "./core/intersection";
import * as origami from "./core/origami";
import { EPSILON, clean_number } from "./parse/clean";

let core = Object.create(null);
Object.assign(core, algebra, geometry);
core.EPSILON = EPSILON;
core.intersection = intersection;
core.clean_number = clean_number;
core.axiom = [];
core.axiom[1] = origami.axiom1;
core.axiom[2] = origami.axiom2;
core.axiom[3] = origami.axiom3;
core.axiom[4] = origami.axiom4;
core.axiom[5] = origami.axiom5;
core.axiom[6] = origami.axiom6;
core.axiom[7] = origami.axiom7;
delete core.axiom[0];
Object.freeze(core.axiom);
Object.freeze(core);

import { Vector } from "./primitives/vector";
import Circle from "./primitives/circle";
import { Polygon, ConvexPolygon, Rectangle } from "./primitives/polygon";
import { Matrix2 } from "./primitives/matrix";
import { Line, Ray, Edge } from "./primitives/lines";
import { Junction } from "./primitives/junction";
import { Sector } from "./primitives/sector";

export {
	Vector,
	Circle,
	Polygon,
	ConvexPolygon,
	Rectangle,
	Matrix2,
	Line,
	Ray,
	Edge,
	Junction,
	Sector,
	core
};

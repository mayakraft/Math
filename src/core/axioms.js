/**
 * Rabbit Ear (c) Robby Kraft
 */
import { EPSILON } from "./constants";
import Constructors from "../primitives/constructors";
import { resize_up } from "../arguments/resize";
import {
	mag_squared,
	dot,
	scale,
  normalize,
  midpoint,
	flip,
  distance,
	add,
  subtract,
  rotate90,
} from "./algebra";
import {
  bisect_lines2,
} from "./radial";
import {
  intersect_circle_line,
} from "../intersection/circle";
import {
  include_l,
  intersect_lines,
} from "../intersection/lines";

/*           _                       _              _
            (_)                     (_)            (_)
   ___  _ __ _  __ _  __ _ _ __ ___  _    __ ___  ___  ___  _ __ ___  ___
  / _ \| '__| |/ _` |/ _` | '_ ` _ \| |  / _` \ \/ / |/ _ \| '_ ` _ \/ __|
 | (_) | |  | | (_| | (_| | | | | | | | | (_| |>  <| | (_) | | | | | \__ \
  \___/|_|  |_|\__, |\__,_|_| |_| |_|_|  \__,_/_/\_\_|\___/|_| |_| |_|___/
                __/ |
               |___/
*/
export const axiom1 = (pointA, pointB) => Constructors.line(
  normalize(subtract(...resize_up(pointB, pointA))),
  pointA
);

export const axiom2 = (pointA, pointB) => Constructors.line(
  normalize(rotate90(subtract(...resize_up(pointB, pointA)))),
  midpoint(pointA, pointB)
);
// make sure these all get a resize_up or whatever is necessary
export const axiom3 = (vectorA, originA, vectorB, originB) => bisect_lines2(
	vectorA, originA, vectorB, originB).map(Constructors.line);
/**
 * axiom 4
 * @description create a line perpendicular to a vector through a point
 * @param {number[]} the vector of the line
 * @param {number[]} the point
 * @returns {line} axiom 4 result
 */
export const axiom4 = (vector, point) => Constructors.line(
  rotate90(normalize(vector)),
  point
);

export const axiom5 = (vectorA, originA, pointA, pointB) => (intersect_circle_line(
    distance(pointA, pointB),
    pointA,
    vectorA,
    originA,
    () => true
  ) || []).map(sect => Constructors.line(
    normalize(rotate90(subtract(...resize_up(sect, pointB)))),
    midpoint(pointB, sect)
  ));

// counter-clockwise
const line_to_ud = (vector, origin) => {
	const mag = Math.sqrt((vector[0] ** 2) + (vector[1] ** 2));
	const u = [-vector[1], vector[0]];
	const d = (origin[0] * u[0] + origin[1] * u[1]) / mag;
	return d < 0
		? { u: [-u[0] / mag, -u[1] / mag], d: -d }
		: { u: [u[0] / mag, u[1] / mag], d };
};

// clockwise (undo counter-clockwise)
const ud_to_line = ({ u, d }) => ({
	vector: [u[1], -u[0]],
	origin: [d * u[0], d * u[1]],
});

// export const axiom5 = (vectorA, originA, pointA, pointB) => {
// 	const line = line_to_ud(vectorA, originA);
// 	// project A down to the line, get the distance
// 	const distA = line.d - dot(pointA, line.u);
// 	// if pointB-pointA is shorter than pointB to the line, no solution
// 	const base_sq = mag_squared(subtract(pointA, pointB)) - (distA ** 2);
// 	if (base_sq < 0) { return []; }
// 	// pythagoras with (a, b, c): distA, base, (pointA to pointB)
// 	const base = Math.sqrt(base_sq);
// 	// project pointA down to the line
// 	const projection = add(pointA, scale(line.u, distA));
// 	return [+1, -1]
// 		.map(sign => scale(vectorA, sign * base))
// 		.map(vec => add(projection, vec))
// 		.map(point => ({
// 			origin: midpoint(point, pointB),
// 			vector: rotate90(normalize(subtract(point, pointB))),
// 		}));
// 		// .map(point => normalize(subtract(point, pointB)))
// 		// .map(u => ud_to_line({ u, d: dot(pointA, u) }));
// };

// cube root that maintains sign
const cubrt = n => n < 0
	? -Math.pow(-n, 1/3)
	: Math.pow(n, 1/3);


// axiom 6 code from Robert Lang's Reference Finder
// https://langorigami.com/article/referencefinder/

/**
 * @description axiom 6: make a crease by bringing pointA onto a
 *  lineA and pointB onto lineB
 * @param {number[]} vector of the first line
 * @param {number[]} origin of the first line
 * @param {number[]} vector of the second line
 * @param {number[]} origin of the second line
 * @param {number[]} point to bring to the first line
 * @param {number[]} point to bring to the second line
 */
export const axiom6 = (vectorA, originA, vectorB, originB, pointA, pointB) => {
	const lineA = line_to_ud(vectorA, originA);
	const lineB = line_to_ud(vectorB, originB);
	// at least pointA must not be on lineA
	// for some reason this epsilon is much higher than 1e-6
	if (Math.abs(1 - (dot(lineA.u, pointA) / lineA.d)) < 0.02) { return []; }
	const lineAVec = [-lineA.u[1], lineA.u[0]];
	const vec1 = [
		pointA[0] + lineA.d * lineA.u[0] - 2 * pointB[0],
		pointA[1] + lineA.d * lineA.u[1] - 2 * pointB[1],
	];
	const vec2 = [
		lineA.d * lineA.u[0] - pointA[0],
		lineA.d * lineA.u[1] - pointA[1],
	];
	const c1 = dot(pointB, lineB.u) - lineB.d;
	const c2 = 2 * dot(vec2, lineAVec);
	const c3 = dot(vec2, vec2);
	const c4 = dot(add(vec1, vec2), lineAVec);
	const c5 = dot(vec1, vec2);
	const c6 = dot(lineAVec, lineB.u);
	const c7 = dot(vec2, lineB.u);
	const a = c6;
	const b = c1 + c4 * c6 + c7;
	const c = c1 * c2 + c5 * c6 + c4 * c7;
	const d = c1 * c3 + c5 * c7;
	// construct the solution from the root, the solution being the parameter
	// point reflected across the fold line, lying on the parameter line
	const make_point = root => [
		lineA.d * lineA.u[0] + root * lineAVec[0],
		lineA.d * lineA.u[1] + root * lineAVec[1],
	];
	let polynomial_degree = 0;
	if (Math.abs(c) > EPSILON) { polynomial_degree = 1; }
	if (Math.abs(b) > EPSILON) { polynomial_degree = 2; }
	if (Math.abs(a) > EPSILON) { polynomial_degree = 3; }
	const solutions = [];
	switch (polynomial_degree) {
		// linear
		case 1: 
		solutions.push(make_point(-d / c)); break;
		// quadratic
		case 2: {
			const discriminant = (c ** 2) - (4 * b * d);
			// no solution
			if (discriminant < -EPSILON) { 
				break; }
			// one solution
			const q1 = -c / (2 * b);
			if (discriminant < EPSILON) {
				solutions.push(make_point(q1));
				break;
			}
			// two solutions
			const q2 = Math.sqrt(discriminant) / (2 * b);
			solutions.push(
				make_point(q1 + q2),
				make_point(q1 - q2),
			);
			break;
		}
		// cubic
		case 3: {
			// Cardano's formula. convert to depressed cubic
			const a2 = b / a;
			const a1 = c / a;
			const a0 = d / a;
			const Q = (3 * a1 - (a2 ** 2)) / 9;
			const R = (9 * a2 * a1 - 27 * a0 - 2 * (a2 ** 3)) / 54;
			const D = (Q ** 3) + (R ** 2);
			const U = -a2 / 3;
			// one solution
			if (D > 0) {
				const sqrtD = Math.sqrt(D);
				const S = cubrt(R + sqrtD);
				const T = cubrt(R - sqrtD);
				solutions.push(make_point(U + S + T));
				break;
			}
			// two solutions
			if (Math.abs(D) < EPSILON) {
				const S = Math.pow(R, 1/3);
				// const S = cubrt(R);
				if (isNaN(S)) { break; }
				solutions.push(
					make_point(U + 2 * S),
					make_point(U - S),
				);
				break;
			}
			// three solutions
			const sqrtD = Math.sqrt(-D);
			const phi = Math.atan2(sqrtD, R) / 3;
			const rS = Math.pow((R ** 2) - D, 1/6);
			const Sr = rS * Math.cos(phi);
			const Si = rS * Math.sin(phi);
			solutions.push(
				make_point(U + 2 * Sr),
				make_point(U - Sr - Math.sqrt(3) * Si),
				make_point(U - Sr + Math.sqrt(3) * Si),
			);
			break;
		}
	}
	return solutions
		.map(p => normalize(subtract(p, pointA)))
		.map((u, i) => ({ u, d: dot(u, midpoint(solutions[i], pointA)) }))
		.map(ud_to_line)
		.map(Constructors.line);
};

/**
 * @description axiom 7: make a crease by bringing a point (pointC) onto a
 *  line () perpendicular to another line ()
 * @param {number[]} vector of the first line
 * @param {number[]} origin of the first line
 * @param {number[]} vector of the second line (origin is not needed)
 * @param {number[]} point involved in the folding
 */
export const axiom7 = (vectorA, originA, vectorB, pointC) => {
  const intersect = intersect_lines(vectorA, originA, vectorB, pointC, include_l, include_l);
  return intersect === undefined
    ? undefined
    : Constructors.line(
        normalize(rotate90(subtract(...resize_up(intersect, pointC)))),
        midpoint(pointC, intersect)
    );
};


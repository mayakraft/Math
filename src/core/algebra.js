// all points are array syntax [x,y]
// all edges are array syntax [[x,y], [x,y]]
// all infinite lines are defined as point and vector, both [x,y]
// all polygons are an ordered set of points ([x,y]), either winding direction

import { EPSILON } from '../parse/clean';

///////////////////////////////////////////////////////////////////////////////
// the following operations neatly generalize for n-dimensions
//
/** @param [number]
 *  @returns [number]
 */
export function normalize(v) {
	let m = magnitude(v);
	// todo: do we need to intervene for a divide by 0?
	return v.map(c => c / m);
}

/** @param [number]
 *  @returns number
 */
export function magnitude(v) {
	let sum = v
		.map(component => component * component)
		.reduce((prev,curr) => prev + curr);
	return Math.sqrt(sum);
}

/** @param [number]
 *  @returns boolean
 */
export function degenerate(v) {
	return Math.abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
}

///////////////////////////////////////////////////////////////////////////////
// these *can* generalize to n-dimensions, but lengths of arguments must match
// if the second argument larger than the first it will ignore leftover components
//
export function dot(a, b) {
	return a
		.map((ai,i) => ai * b[i])
		.reduce((prev,curr) => prev + curr, 0);
}

export function midpoint(a, b) {
	return a.map((ai,i) => (ai+b[i])*0.5);
}

export function equivalent(a, b, epsilon = EPSILON) {
	// rectangular bounds test for fast calculation
	return a
		.map((ai,i) => Math.abs(ai - b[i]) < epsilon)
		reduce((a,b) => a && b, true);
}

export function parallel(a, b, epsilon = EPSILON) {
	return 1 - Math.abs(dot(normalize(a), normalize(b))) < epsilon;
}


///////////////////////////////////////////////////////////////////////////////
// everything else that follows is hard-coded to certain dimensions
//

/** There are 2 interior angles between 2 absolute angle measurements, from A to B return the clockwise one
 * @param {number} angle in radians, angle PI/2 is along the +Y axis
 * @returns {number} clockwise interior angle (from a to b) in radians
 */
export function clockwise_angle2_radians(a, b) {
	// this is on average 50 to 100 times faster than clockwise_angle2
	while (a < 0) { a += Math.PI*2; }
	while (b < 0) { b += Math.PI*2; }
	var a_b = a - b;
	return (a_b >= 0)
		? a_b
		: Math.PI*2 - (b - a);
}
export function counter_clockwise_angle2_radians(a, b) {
	// this is on average 50 to 100 times faster than counter_clockwise_angle2
	while (a < 0) { a += Math.PI*2; }
	while (b < 0) { b += Math.PI*2; }
	var b_a = b - a;
	return (b_a >= 0)
		? b_a
		: Math.PI*2 - (a - b);
}

/** There are 2 angles between 2 vectors, from A to B return the clockwise one.
 * @param {[number, number]} vector
 * @returns {number} clockwise angle (from a to b) in radians
 */
export function clockwise_angle2(a, b) {
	var dotProduct = b[0]*a[0] + b[1]*a[1];
	var determinant = b[0]*a[1] - b[1]*a[0];
	var angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += Math.PI*2; }
	return angle;
}
export function counter_clockwise_angle2(a, b) {
	var dotProduct = a[0]*b[0] + a[1]*b[1];
	var determinant = a[0]*b[1] - a[1]*b[0];
	var angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += Math.PI*2; }
	return angle;
}
/** There are 2 interior angles between 2 vectors, return both, the smaller first
 * @param {[number, number]} vector
 * @returns {[number, number]} 2 angle measurements between vectors
 */
export function interior_angles2(a, b) {
	var interior1 = clockwise_angle2(a, b);
	var interior2 = Math.PI*2 - interior1;
	return (interior1 < interior2)
		? [interior1, interior2]
		: [interior2, interior1];
}
/** This bisects 2 vectors, returning both smaller and larger outside angle bisections [small, large]
 * @param {[number, number]} vector
 * @returns {[[number, number],[number, number]]} 2 vectors, the smaller angle first
 */
export function bisect_vectors(a, b) {
	let aV = normalize(a);
	let bV = normalize(b);
	let sum = aV.map((_,i) => aV[i] + bV[i]);
	let vecA = normalize( sum );
	let vecB = aV.map((_,i) => -aV[i] + -bV[i])
	return [vecA, normalize(vecB)];
}

/** This bisects 2 lines
 * @param {[number, number]} all vectors, lines defined by points and vectors
 * @returns [ [number,number], [number,number] ] // line, defined as point, vector, in that order
 */
export function bisect_lines2(pointA, vectorA, pointB, vectorB) {
	let denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
	if (Math.abs(denominator) < EPSILON) { /* parallel */
		return [midpoint(pointA, pointB), vectorA.slice()];
	}
	let vectorC = [pointB[0]-pointA[0], pointB[1]-pointA[1]];
	// var numerator = vectorC[0] * vectorB[1] - vectorB[0] * vectorC[1];
	let numerator = (pointB[0]-pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1]-pointA[1]);
	var t = numerator / denominator;
	let x = pointA[0] + vectorA[0]*t;
	let y = pointA[1] + vectorA[1]*t;
	var bisect = bisect_vectors(vectorA, vectorB);
	bisects[1] = [ bisects[1][1], -bisects[1][0] ];
	// swap to make smaller interior angle first
	if (Math.abs(cross2(vectorA, bisects[1])) <
	   Math.abs(cross2(vectorA, bisects[0]))) {
		var swap = bisects[0];
		bisects[0] = bisects[1];
		bisects[1] = swap;
	}
	return bisects.map((el) => [[x,y], el]);
}

// todo: check the implementation above, if it works, delete this:

// export function bisect_lines2(pointA, vectorA, pointB, vectorB) {
// 	if (parallel(vectorA, vectorB)) {
// 		return [midpoint(pointA, pointB), vectorA.slice()];
// 	} else{
// 		var inter = Intersection.line_line(pointA, vectorA, pointB, vectorB);
// 		var bisect = bisect_vectors(vectorA, vectorB);
// 		bisects[1] = [ bisects[1][1], -bisects[1][0] ];
// 		// swap to make smaller interior angle first
// 		if (Math.abs(cross2(vectorA, bisects[1])) <
// 		   Math.abs(cross2(vectorA, bisects[0]))) {
// 			var swap = bisects[0];
// 			bisects[0] = bisects[1];
// 			bisects[1] = swap;
// 		}
// 		return bisects.map((el) => [inter, el]);
// 	}
// }

/** apply a matrix transform on a point */
export function multiply_vector2_matrix2(vector, matrix) {
	return [ vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
	         vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5] ];
}

/** 
 * These all standardize a row-column order
 */
export function make_matrix2_reflection(vector, origin) {
	// the line of reflection passes through origin, runs along vector
	let angle = Math.atan2(vector[1], vector[0]);
	let cosAngle = Math.cos(angle);
	let sinAngle = Math.sin(angle);
	let _cosAngle = Math.cos(-angle);
	let _sinAngle = Math.sin(-angle);
	let a = cosAngle *  _cosAngle +  sinAngle * _sinAngle;
	let b = cosAngle * -_sinAngle +  sinAngle * _cosAngle;
	let c = sinAngle *  _cosAngle + -cosAngle * _sinAngle;
	let d = sinAngle * -_sinAngle + -cosAngle * _cosAngle;
	let tx = origin[0] + a * -origin[0] + -origin[1] * c;
	let ty = origin[1] + b * -origin[0] + -origin[1] * d;
	return [a, b, c, d, tx, ty];
}
export function make_matrix2_rotation(angle, origin) {
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	var c = -Math.sin(angle);
	var d = Math.cos(angle);
	var tx = (origin != null) ? origin[0] : 0;
	var ty = (origin != null) ? origin[1] : 0;
	return [a, b, c, d, tx, ty];
}
export function make_matrix2_inverse(m) {
	var det = m[0] * m[3] - m[1] * m[2];
	if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) { return undefined; }
	return [
		m[3]/det,
		-m[1]/det,
		-m[2]/det,
		m[0]/det, 
		(m[2]*m[5] - m[3]*m[4])/det,
		(m[1]*m[4] - m[0]*m[5])/det
	];
}
export function multiply_matrices2(m1, m2) {
	let a = m1[0] * m2[0] + m1[2] * m2[1];
	let c = m1[0] * m2[2] + m1[2] * m2[3];
	let tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	let b = m1[1] * m2[0] + m1[3] * m2[1];
	let d = m1[1] * m2[2] + m1[3] * m2[3];
	let ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
	return [a, b, c, d, tx, ty];
}

// these are all hard-coded to certain vector lengths
// the length is specified by the number at the end of the function name

export function cross2(a, b) {
	return [ a[0]*b[1], a[1]*b[0] ];
}

export function cross3(a, b) {
	return [
		a[1]*b[2] - a[2]*b[1],
		a[0]*b[2] - a[2]*b[0],
		a[0]*b[1] - a[1]*b[0]
	];
}

export function distance2(a, b) {
	return Math.sqrt(
		Math.pow(a[0] - b[0], 2) +
		Math.pow(a[1] - b[1], 2)
	);
}

export function distance3(a, b) {
	return Math.sqrt(
		Math.pow(a[0] - b[0], 2) +
		Math.pow(a[1] - b[1], 2) +
		Math.pow(a[2] - b[2], 2)
	);
}

// need to test:
// do two polygons overlap if they share a point in common? share an edge?

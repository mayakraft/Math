// all points are array syntax [x,y]
// all edges are array syntax [[x,y], [x,y]]
// all infinite lines are defined as point and vector, both [x,y]
// all polygons are an ordered set of points ([x,y]), either winding direction

import { EPSILON } from "../parse/clean";

///////////////////////////////////////////////////////////////////////////////
// the following operations neatly generalize for n-dimensions

/**
 * @param [number]
 * @returns [number]
 */
export function normalize(v) {
	let m = magnitude(v);
	// todo: do we need to intervene for a divide by 0?
	return v.map(c => c / m);
}

/**
 * @param [number]
 * @returns number
 */
export function magnitude(v) {
	let sum = v
		.map(component => component * component)
		.reduce((prev,curr) => prev + curr);
	return Math.sqrt(sum);
}

/**
 * @param [number]
 * @returns boolean
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
		.map((_,i) => a[i] * b[i])
		.reduce((prev,curr) => prev + curr, 0);
}

export function equivalent(a, b, epsilon = EPSILON) {
	// rectangular bounds test for fast calculation
	return a
		.map((_,i) => Math.abs(a[i] - b[i]) < epsilon)
		reduce((a,b) => a && b, true);
}

export function parallel(a, b, epsilon = EPSILON) {
	return 1 - Math.abs(dot(normalize(a), normalize(b))) < epsilon;
}

export function midpoint(a, b) {
	return a.map((ai,i) => (ai+b[i])*0.5);
}

// average is a midpoint function for n-number of arguments
export function average(vecs) {
	let initial = Array.from(Array(vecs.length)).map(_ => 0);
	return vecs.reduce((a,b) => a.map((_,i) => a[i]+b[i]), initial)
		.map(c => c / vecs.length);
}


///////////////////////////////////////////////////////////////////////////////
// everything else that follows is hard-coded to certain dimensions
//

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
	let c = a[0] - b[0];
	let d = a[1] - b[1];
	return Math.sqrt((c * c) + (d * d));
}

export function distance3(a, b) {
	let c = a[0] - b[0];
	let d = a[1] - b[1];
	let e = a[2] - b[2];
	return Math.sqrt((c * c) + (d * d) + (e * e));
}

// need to test:
// do two polygons overlap if they share a point in common? share an edge?

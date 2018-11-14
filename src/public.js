/**
 *  Geometry library
 *  The goal of this user-facing library is to type check all arguments for a
 *  likely use case, which might slow runtime by a small fraction.
 *  Use the core library functions for fastest-possible calculations.
 */

// For now, this library is implicitly 2D.
// however a lot of types and operations are built to function in n-dimensions.

import * as Input from './input';
import * as Intersection from './intersection';

// export * from './intersection';
let intersection = Intersection;
export { intersection }

import * as Core from './core';

export { Core };

export { Input };

/** 
 * 2D Matrix (2x3) with translation component in x,y
 */
export function Matrix() {
	let _m = Input.get_matrix(...arguments);

	const inverse = function() {
		return Matrix( Core.make_matrix2_inverse(_m) );
	}
	const multiply = function() {
		let m2 = Input.get_matrix(...arguments);
		return Matrix( Core.multiply_matrices2(_m, m2) );
	}
	const transform = function(){
		let v = Input.get_vec(...arguments);
		return Vector( Core.multiply_vector2_matrix2(v, _m) );
	}
	return Object.freeze( {
		inverse,
		multiply,
		transform,
		get m() { return _m; },
	} );
}
// static methods
Matrix.identity = function() {
	return Matrix(1,0,0,1,0,0);
}
Matrix.rotation = function(angle, origin) {
	return Matrix( Core.make_matrix2_rotation(angle, origin) );
}
Matrix.reflection = function(vector, origin) {
	return Matrix( Core.make_matrix2_reflection(vector, origin) );
}

/** n-dimensional vector */
export function Vector() {
	let _v = Input.get_vec(...arguments);

	const normalize = function() {
		return Vector( Core.normalize(_v) );
	}
	const magnitude = function() {
		return Core.magnitude(_v);
	}
	const dot = function() {
		let vec = Input.get_vec(...arguments);
		return _v.length > vec.length
			? Core.dot(vec, _v)
			: Core.dot(_v, vec);
	}
	// todo, generalize the cross product formula
	const cross2 = function() {
		let vec = Input.get_vec(...arguments);
		return _v[0] * vec[1] - _v[1] * vec[0];
	}
	const cross3 = function() {
		let b = Input.get_vec(...arguments);
		let a = _v.slice();
		if(a[2] == null){ a[2] = 0; }
		if(b[2] == null){ b[2] = 0; }
		return (a[1]*b[2] - a[2]*b[1]) - (a[0]*b[2] - a[2]*b[0]) + (a[0]*b[1] - a[1]*b[0]);
	}
	const cross = function() {
		return cross3(...arguments);
	}
	const distanceTo = function() {
		let vec = Input.get_vec(...arguments);
		let length = (_v.length < vec.length) ? _v.length : vec.length;
		let sum = Array.from(Array(length))
			.map((_,i) => Math.pow(_v[i] - vec[i], 2))
			.reduce((prev, curr) => prev + curr, 0);
		return Math.sqrt(sum);
	}
	const transform = function() {
		let m = Input.get_matrix(...arguments);
		return Vector( Core.multiply_vector2_matrix2(_v, m) );
	}
	// these are implicitly 2D functions, and will convert the vector into 2D
	const rotateZ = function(angle, origin) {
		var m = Core.make_matrix2_rotation(angle, origin);
		return Vector( Core.multiply_vector2_matrix2(_v, m) );
	}
	const rotateZ90 = function() {
		return Vector(-_v[1], _v[0]);
	}
	const rotateZ180 = function() {
		return Vector(-_v[0], -_v[1]);
	}
	const rotateZ270 = function() {
		return Vector(_v[1], -_v[0]);
	}
	const reflect = function() {
		let reflect = Input.get_line(...arguments);
		let m = Core.make_matrix2_reflection(reflect.vector, reflect.point);
		return Vector( Core.multiply_vector2_matrix2(_v, m) );
	}
	const lerp = function(vector, pct) {
		let vec = Input.get_vec(vector);
		let inv = 1.0 - pct;
		let length = (_v.length < vec.length) ? _v.length : vec.length;
		let components = Array.from(Array(length))
			.map((_,i) => _v[i] * pct + vec[i] * inv)
		return Vector(components);
	}
	const equivalent = function(vector, epsilon = EPSILON_HIGH) {
		// rect bounding box for now, much cheaper than radius calculation
		let vec = Input.get_vec(vector);
		let sm = (_v.length < vec.length) ? _v.slice() : vec;
		let lg = (_v.length < vec.length) ? vec : _v.slice();
		for(var i = sm.length; i < lg.length; i++){ sm[i] = 0; }
		return lg.map((_,i) => Math.abs(sm[i] - lg[i]) < epsilon)
			.reduce((prev,curr) => prev && curr, true);
	}
	const scale = function(mag) {
		return Vector( _v.map(v => v * mag) );
	}
	const midpoint = function() {
		let vec = Input.get_vec(...arguments);
		let sm = (_v.length < vec.length) ? _v.slice() : vec;
		let lg = (_v.length < vec.length) ? vec : _v.slice();
		for(var i = sm.length; i < lg.length; i++){ sm[i] = 0; }
		return Vector(lg.map((_,i) => (sm[i] + lg[i]) * 0.5));
	}

	return Object.freeze( {
		normalize,
		magnitude,
		dot,
		cross,
		distanceTo,
		transform,
		rotateZ,
		rotateZ90,
		rotateZ180,
		rotateZ270,
		reflect,
		lerp,
		equivalent,
		scale,
		midpoint,
		get vector() { return _v; },
		get x() { return _v[0]; },
		get y() { return _v[1]; },
		get z() { return _v[2]; },
	} );
}

export function Line(){
	const betweenPoints = function(){
		let points = gimme2Points(...arguments);
		return {
			point: [points[0][0], points[0][1], points[0][2]],
			direction: normalize([
				points[1][0] - points[0][0],
				points[1][1] - points[0][1],
				points[1][2] - points[0][2]
			])
		}
	}
	const perpendicularBisector = function(){
		// perpendicular bisector in 3D gives you a plane.
		// we're going to assume this plane intersects with the z=0 plane.
		// figure out a user friendly way to ask for this second plane
		let points = gimme2Points(...arguments);
		let vec = normalize([
			points[1][0] - points[0][0],
			points[1][1] - points[0][1],
			points[1][2] - points[0][2]
		]);
		return {
			point: midpoint(points[0], points[1]),
			direction: cross(vec, [0,0,1])
		}
	}
}

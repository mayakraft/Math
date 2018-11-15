/**
 *  Geometry library
 *  The goal of this user-facing library is to type check all arguments for a
 *  likely use case, which might slow runtime by a small fraction.
 *  Use the core library functions for fastest-possible calculations.
 */

// all static constructors start with "make". eg: Matrix.makeRotation(...)
// all boolean tests start with "is" or "are" eg: Line.isParallel(...)

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
Matrix.makeIdentity = function() {
	return Matrix(1,0,0,1,0,0);
}
Matrix.makeRotation = function(angle, origin) {
	return Matrix( Core.make_matrix2_rotation(angle, origin) );
}
Matrix.makeReflection = function(vector, origin) {
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
	const cross = function() {
		let b = Input.get_vec(...arguments);
		let a = _v.slice();
		if(a[2] == null){ a[2] = 0; }
		if(b[2] == null){ b[2] = 0; }
		return Vector( Core.cross3(a, b) );
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
	// let point, vector;
	let {vector, point} = Input.get_line(...arguments);

	const isParallel = function(){
		let line2 = Input.get_line(...arguments);
		let crossMag = Core.cross2(vector, line2.vector).reduce((a,b)=>a+b,0);
		return Math.abs(crossMag) < Core.EPSILON_HIGH;
	}

	return Object.freeze( {
		isParallel,
		get vector() { return vector; },
		get point() { return point; },
	} );
}

Line.makeBetweenPoints = function(){
	let points = Input.get_two_vec2(...arguments);
	return Line({
		point: points[0],
		vector: Core.normalize([
			points[1][0] - points[0][0],
			points[1][1] - points[0][1]
		])
	});
}

Line.makePerpendicularBisector = function() {
	let points = Input.get_two_vec2(...arguments);
	let vec = Core.normalize([
		points[1][0] - points[0][0],
		points[1][1] - points[0][1]
	]);
	return Line({
		point: Core.midpoint(points[0], points[1]),
		vector: [vec[1], -vec[0]]
		// vector: Core.cross3(vec, [0,0,1])
	});
}

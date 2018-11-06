/**
 *  Geometry library
 *  The goal of this user-facing library is to type check all arguments for a
 *  likely use case, which might slow runtime by a small fraction.
 *  Use the core library functions for fastest-possible calculations.
 */

import * as Input from './input';
import * as Intersection from './intersection';

// export * from './intersection';
let intersection = Intersection;
export { intersection }

import * as core from './core';

export { core };

let input = Input;
export { input };

/** n-dimensional vector */
export function Vector() {
	let _v = Input.get_vec(...arguments);

	const normalize = function() {
		let m = magnitude();
		let components = _v.map(c => c / m);
		return Vector(components);
	}
	const magnitude = function() {
		let sum = _v
			.map(component => component * component)
			.reduce((prev,curr) => prev + curr);
		return Math.sqrt(sum);
	}
	const dot = function() {
		let vec = Input.get_vec(...arguments);
		let length = (_v.length < vec.length) ? _v.length : vec.length;
		return Array.from(Array(length))
			.map((_,i) => _v[i] * vec[i])
			.reduce((prev,curr) => prev + curr, 0);
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
		return Vector(_v[0] * m[0] + _v[1] * m[2] + m[4],
		              _v[0] * m[1] + _v[1] * m[3] + m[5]);
	}
	const rotateZ = function(angle, origin) {
		return transform( Matrix().rotation(angle, origin) );
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
		let reflect = get_line(...arguments);
		return transform( Matrix().reflection(reflect.vector, reflect.point) );
	}
	const lerp = function(point, pct) {
		let vec = Input.get_vec(point);
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


/** 
 * 2D Matrix with translation component in x,y
 */
export function Matrix() {
	let _m = Input.get_matrix(...arguments);

	const inverse = function() {
		var det = _m[0] * _m[3] - _m[1] * _m[2];
		if (!det || isNaN(det) || !isFinite(_m[4]) || !isFinite(_m[5])) {
			return undefined;
		}
		let a =  _m[3]/det;
		let b = -_m[1]/det;
		let c = -_m[2]/det;
		let d =  _m[0]/det;
		let tx = (_m[2]*_m[5] - _m[3]*_m[4])/det;
		let ty = (_m[1]*_m[4] - _m[0]*_m[5])/det;
		return Matrix(a, b, c, d, tx, ty);
	}
	const multiply = function() {
		let m2 = Input.get_matrix(...arguments);
		let a = _m[0] * m2[0] + _m[2] * m2[1];
		let c = _m[0] * m2[2] + _m[2] * m2[3];
		let tx = _m[0] * m2[4] + _m[2] * m2[5] + _m[4];
		let b = _m[1] * m2[0] + _m[3] * m2[1];
		let d = _m[1] * m2[2] + _m[3] * m2[3];
		let ty = _m[1] * m2[4] + _m[3] * m2[5] + _m[5];
		return Matrix(a, b, c, d, tx, ty);
	}
	const transform = function(){
		let v = Input.get_vec(...arguments);
		return Vector(v[0] * _m[0] + v[1] * _m[2] + _m[4],
		              v[0] * _m[1] + v[1] * _m[3] + _m[5]);
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
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	var c = -Math.sin(angle);
	var d = Math.cos(angle);
	var tx = (origin != null) ? origin[0] : 0;
	var ty = (origin != null) ? origin[1] : 0;
	return Matrix(a, b, c, d, tx, ty);
}
Matrix.reflection = function(vector, origin) {
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
	return Matrix(a, b, c, d, tx, ty);
}

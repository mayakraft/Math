import * as Input from '../parse/input';
import * as Algebra from '../core/algebra';

/** n-dimensional vector */
export function Vector() {
	let _v = Input.get_vec(...arguments);

	const normalize = function() {
		return Vector( Algebra.normalize(_v) );
	}
	const magnitude = function() {
		return Algebra.magnitude(_v);
	}
	const dot = function() {
		let vec = Input.get_vec(...arguments);
		return _v.length > vec.length
			? Algebra.dot(vec, _v)
			: Algebra.dot(_v, vec);
	}
	const cross = function() {
		let b = Input.get_vec(...arguments);
		let a = _v.slice();
		if(a[2] == null){ a[2] = 0; }
		if(b[2] == null){ b[2] = 0; }
		return Vector( Algebra.cross3(a, b) );
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
		return Vector( Algebra.multiply_vector2_matrix2(_v, m) );
	}
	const add = function(){
		let vec = Input.get_vec(...arguments);
		return Vector( _v.map((v,i) => v + vec[i]) );
	}
	const subtract = function(){
		let vec = Input.get_vec(...arguments);
		return Vector( _v.map((v,i) => v - vec[i]) );
	}
	// these are implicitly 2D functions, and will convert the vector into 2D
	const rotateZ = function(angle, origin) {
		var m = Algebra.make_matrix2_rotation(angle, origin);
		return Vector( Algebra.multiply_vector2_matrix2(_v, m) );
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
		let m = Algebra.make_matrix2_reflection(reflect.vector, reflect.point);
		return Vector( Algebra.multiply_vector2_matrix2(_v, m) );
	}
	const lerp = function(vector, pct) {
		let vec = Input.get_vec(vector);
		let inv = 1.0 - pct;
		let length = (_v.length < vec.length) ? _v.length : vec.length;
		let components = Array.from(Array(length))
			.map((_,i) => _v[i] * pct + vec[i] * inv)
		return Vector(components);
	}
	const isEquivalent = function(vector) {
		// rect bounding box for now, much cheaper than radius calculation
		let vec = Input.get_vec(vector);
		let sm = (_v.length < vec.length) ? _v : vec;
		let lg = (_v.length < vec.length) ? vec : _v;
		return Algebra.equivalent(sm, lg);
	}
	const isParallel = function(vector) {
		let vec = Input.get_vec(vector);
		let sm = (_v.length < vec.length) ? _v : vec;
		let lg = (_v.length < vec.length) ? vec : _v;
		return Algebra.parallel(sm, lg);
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
	const bisect = function(vector){
		let vec = Input.get_vec(vector);
		return Algebra.bisect_vectors(_v, vec);
	}

	return Object.freeze(
		Object.assign({
			normalize,
			magnitude,
			dot,
			cross,
			distanceTo,
			transform,
			add,
			subtract,
			rotateZ,
			rotateZ90,
			rotateZ180,
			rotateZ270,
			reflect,
			lerp,
			isEquivalent,
			isParallel,
			scale,
			midpoint,
			bisect,
			get x() { return _v[0]; },
			get y() { return _v[1]; },
			get z() { return _v[2]; },
		}, _v)
	);
}

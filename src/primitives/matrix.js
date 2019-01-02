import * as Input from '../input';
import * as Algebra from '../core/algebra';

/** 
 * 2D Matrix (2x3) with translation component in x,y
 */
export function Matrix() {
	let _m = Input.get_matrix(...arguments);

	const inverse = function() {
		return Matrix( Algebra.make_matrix2_inverse(_m) );
	}
	const multiply = function() {
		let m2 = Input.get_matrix(...arguments);
		return Matrix( Algebra.multiply_matrices2(_m, m2) );
	}
	const transform = function(){
		let v = Input.get_vec(...arguments);
		return Vector( Algebra.multiply_vector2_matrix2(v, _m) );
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
	return Matrix( Algebra.make_matrix2_rotation(angle, origin) );
}
Matrix.makeReflection = function(vector, origin) {
	return Matrix( Algebra.make_matrix2_reflection(vector, origin) );
}

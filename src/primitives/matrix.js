import * as Input from "../parse/input";
import * as Algebra from "../core/algebra";
import { Vector } from "./vector";
/** 
 * 2D Matrix (2x3) with translation component in x,y
 */
export function Matrix2() {
	let _m = Input.get_matrix2(...arguments);

	const inverse = function() {
		return Matrix2( Algebra.make_matrix2_inverse(_m) );
	}
	const multiply = function() {
		let m2 = Input.get_matrix2(...arguments);
		return Matrix2( Algebra.multiply_matrices2(_m, m2) );
	}
	const transform = function() {
		let v = Input.get_vec(...arguments);
		return Vector( Algebra.multiply_vector2_matrix2(v, _m) );
	}
	// return Object.freeze( {
	return {
		inverse,
		multiply,
		transform,
		get m() { return _m; },
	};
}
// static methods
Matrix2.makeIdentity = function() {
	return Matrix2(1,0,0,1,0,0);
}
Matrix2.makeTranslation = function(tx, ty) {
	return Matrix2(1,0,0,1,tx,ty);
}
Matrix2.makeRotation = function(angle, origin) {
	return Matrix2( Algebra.make_matrix2_rotation(angle, origin) );
}
Matrix2.makeReflection = function(vector, origin) {
	return Matrix2( Algebra.make_matrix2_reflection(vector, origin) );
}

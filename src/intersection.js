import { EPSILON } from './core'

/** edge-edge intersection: four endpoints of the two edges */
var edge_intersection = function(a0, a1, b0, b1){
	let vecA = [a1[0]-a0[0], a1[1]-a0[1]];
	let vecB = [b1[0]-b0[0], b1[1]-b0[1]];
	return vector_intersection(a0, vecA, b0, vecB, edge_edge_comp_func);
}

/** 
 * line-edge intersection:
 * in the arguments line comes first (point, vector) followed by edge's two endpoints
 */
export function line_edge_intersection(point, vec, edge0, edge1){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	return vector_intersection(point, vec, edge0, edgeVec, line_edge_comp_func);
}

export function line_edge_intersect_exclusive(point, vec, edge0, edge1){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	let x = vector_intersection(point, vec, edge0, edgeVec, line_edge_comp_func);
	if (x == null){ return undefined; }
	if(points_equivalent(x, edge0) || points_equivalent(x, edge1)){
		return undefined;
	}
	return x;
}

/** 
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking 
 * line always returns true, ray is true for t > 0, edge must be between 0 < t < 1
*/
var vector_intersection = function(aOrigin, aVec, bOrigin, bVec, compFunction, epsilon = EPSILON){
	function det(a,b){ return a[0] * b[1] - b[0] * a[1]; }
	var denominator0 = det(aVec, bVec);
	var denominator1 = -denominator0;
	if(Math.abs(denominator0) < epsilon){ return undefined; } /* parallel */
	var numerator0 = det([bOrigin[0]-aOrigin[0], bOrigin[1]-aOrigin[1]], bVec);
	var numerator1 = det([aOrigin[0]-bOrigin[0], aOrigin[1]-bOrigin[1]], aVec);
	var t0 = numerator0 / denominator0;
	var t1 = numerator1 / denominator1;
	if(compFunction(t0,t1,epsilon)){ return [aOrigin[0] + aVec[0]*t0, aOrigin[1] + aVec[1]*t0]; }
}
/** comp functions for generalized vector intersection function */
const edge_edge_comp_func = function(t0,t1,ep = EPSILON){return t0 >= -ep && t0 <= 1+ep && t1 >= -ep && t1 <= 1+ep;}
const line_edge_comp_func = function(t0,t1,ep = EPSILON){return t1 >= -ep && t1 <= 1+ep;}


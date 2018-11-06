/** 
 *  all intersection functions are inclusive and return true if 
 *  intersection lies directly on an edge's endpoint. to exclude
 *  endpoints, use "exclusive" functions
 */

import { EPSILON, points_equivalent } from './core'


export function line_line(aPt, aVec, bPt, bVec, epsilon){
	return vector_intersection(aPt, aVec, bPt, bVec, line_line_comp, epsilon);
}
export function line_ray(linePt, lineVec, rayPt, rayVec, epsilon){
	return vector_intersection(linePt, lineVec, rayPt, rayVec, line_ray_comp, epsilon);
}
export function line_edge(point, vec, edge0, edge1, epsilon){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	return vector_intersection(point, vec, edge0, edgeVec, line_edge_comp, epsilon);
}
export function ray_ray(aPt, aVec, bPt, bVec, epsilon){
	return vector_intersection(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
}
export function ray_edge(rayPt, rayVec, edge0, edge1, epsilon){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	return vector_intersection(rayPt, rayVec, edge0, edgeVec, ray_edge_comp, epsilon);
}
export function edge_edge(a0, a1, b0, b1, epsilon){
	let aVec = [a1[0]-a0[0], a1[1]-a0[1]];
	let bVec = [b1[0]-b0[0], b1[1]-b0[1]];
	return vector_intersection(a0, aVec, b0, bVec, edge_edge_comp, epsilon);
}

export function line_edge_exclusive(point, vec, edge0, edge1){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	let x = vector_intersection(point, vec, edge0, edgeVec, line_edge_comp);
	if (x == null){ return undefined; }
	if(points_equivalent(x, edge0) || points_equivalent(x, edge1)){
		return undefined;
	}
	return x;
}

/** comparison functions for a generalized vector intersection function */
const line_line_comp = function() { return true; }
const line_ray_comp = function(t0, t1, epsilon = EPSILON) {
	return t1 >= -epsilon;
}
const line_edge_comp = function(t0, t1, epsilon = EPSILON) {
	return t1 >= -epsilon && t1 <= 1+epsilon;
}
const ray_ray_comp = function(t0, t1, epsilon = EPSILON){
	return t0 >= -epsilon && t1 >= -epsilon;
}
const ray_edge_comp = function(t0, t1, epsilon = EPSILON){
	return t0 >= -epsilon && t1 >= -epsilon && t1 <= 1+epsilon;
}
const edge_edge_comp = function(t0, t1, epsilon = EPSILON) {
	return t0 >= -epsilon && t0 <= 1+epsilon &&
	       t1 >= -epsilon && t1 <= 1+epsilon;
}


/** 
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking 
 * line always returns true, ray is true for t > 0, edge must be between 0 < t < 1
*/
var vector_intersection = function(aPt, aVec, bPt, bVec, compFunction, epsilon = EPSILON){
	function det(a,b){ return a[0] * b[1] - b[0] * a[1]; }
	var denominator0 = det(aVec, bVec);
	var denominator1 = -denominator0;
	if(Math.abs(denominator0) < epsilon){ return undefined; } /* parallel */
	var numerator0 = det([bPt[0]-aPt[0], bPt[1]-aPt[1]], bVec);
	var numerator1 = det([aPt[0]-bPt[0], aPt[1]-bPt[1]], aVec);
	var t0 = numerator0 / denominator0;
	var t1 = numerator1 / denominator1;
	if(compFunction(t0, t1, epsilon)) {
		return [aPt[0] + aVec[0]*t0, aPt[1] + aVec[1]*t0];
	}
}



/** 
 *  Boolean tests
 *  collinearity, overlap, contains
 */


// line_collinear - prev name
/** is a point collinear to a line, within an epsilon */
export function point_on_line(linePoint, lineVector, point, epsilon = EPSILON){
	let pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
	let cross = pointPoint[0]*lineVector[1] - pointPoint[1]*lineVector[0];
	return Math.abs(cross) < epsilon;
}

// edge_collinear - prev name
/** is a point collinear to an edge, between endpoints, within an epsilon */
export function point_on_edge(edge0, edge1, point, epsilon = EPSILON){
	// distance between endpoints A,B should be equal to point->A + point->B
	let dEdge = Math.sqrt(Math.pow(edge0[0]-edge1[0],2) + Math.pow(edge0[1]-edge1[1],2));
	let dP0 = Math.sqrt(Math.pow(point[0]-edge0[0],2) + Math.pow(point[1]-edge0[1],2));
	let dP1 = Math.sqrt(Math.pow(point[0]-edge1[0],2) + Math.pow(point[1]-edge1[1],2));
	return Math.abs(dEdge - dP0 - dP1) < epsilon;
}

/** is a point inside of a convex polygon? 
 * including along the boundary within epsilon 
 *
 * @param poly is an array of points [ [x,y], [x,y]...]
 * @returns {boolean} true if point is inside polygon
 */
export function point_in_polygon(poly, point, epsilon = EPSILON){
	if(poly == undefined || !(poly.length > 0)){ return false; }
	return poly.map( (p,i,arr) => {
		let nextP = arr[(i+1)%arr.length];
		let a = [ nextP[0]-p[0], nextP[1]-p[1] ];
		let b = [ point[0]-p[0], point[1]-p[1] ];
		return a[0] * b[1] - a[1] * b[0] > -epsilon;
	}).map((s,i,arr) => s == arr[0]).reduce((prev,curr) => prev && curr, true)
}

/** do two convex polygons overlap one another */
export function polygons_overlap(ps1, ps2){
	// convert array of points into edges [point, nextPoint]
	let e1 = ps1.map((p,i,arr) => [p, arr[(i+1)%arr.length]] )
	let e2 = ps2.map((p,i,arr) => [p, arr[(i+1)%arr.length]] )
	for(let i = 0; i < e1.length; i++){
		for(let j = 0; j < e2.length; j++){
			if(edge_edge_intersection(e1[i][0], e1[i][1], e2[j][0], e2[j][1]) != undefined){
				return true;
			}
		}
	}
	if(point_in_polygon(ps1, ps2[0])){ return true; }
	if(point_in_polygon(ps2, ps1[0])){ return true; }
	return false;
}



/** 
 *  Clipping operations
 *  
 */



/** clip an infinite line in a polygon, returns an edge or undefined if no intersection */
export function clip_line_in_poly(poly, linePoint, lineVector){
	let intersections = poly
		.map((p,i,arr) => [p, arr[(i+1)%arr.length]] ) // poly points into edge pairs
		.map(function(el){ return line_edge_intersection(linePoint, lineVector, el[0], el[1]); })
		.filter(function(el){return el != undefined; });
	switch(intersections.length){
	case 0: return undefined;
	case 1: return [intersections[0], intersections[0]]; // degenerate edge
	case 2: return intersections;
	default:
	// special case: line intersects directly on a poly point (2 edges, same point)
	//  filter to unique points by [x,y] comparison.
		for(let i = 1; i < intersections.length; i++){
			if( !points_equivalent(intersections[0], intersections[i])){
				return [intersections[0], intersections[i]];
			}
		}
	}
}

export function clipEdge(edge){
	var intersections = this.edges
		.map(function(el){ return intersectionEdgeEdge(edge, el); })
		.filter(function(el){return el !== undefined; })
		// filter out intersections equivalent to the edge points themselves
		.filter(function(el){ 
			return !el.equivalent(edge.nodes[0]) &&
			       !el.equivalent(edge.nodes[1]); });
	switch(intersections.length){
		case 0:
			if(this.contains(edge.nodes[0])){ return edge; } // completely inside
			return undefined;  // completely outside
		case 1:
			if(this.contains(edge.nodes[0])){
				return new Edge(edge.nodes[0], intersections[0]);
			}
			return new Edge(edge.nodes[1], intersections[0]);
		case 2: return new Edge(intersections[0], intersections[1]);
		// default: throw "clipping edge in a convex polygon resulting in 3 or more points";
		default:
			for(var i = 1; i < intersections.length; i++){
				if( !intersections[0].equivalent(intersections[i]) ){
					return new Edge(intersections[0], intersections[i]);
				}
			}
	}
}
export function clipLine(line){
	var intersections = this.edges
		.map(function(el){ return intersectionLineEdge(line, el); })
		.filter(function(el){return el !== undefined; });
	switch(intersections.length){
		case 0: return undefined;
		case 1: return new Edge(intersections[0], intersections[0]); // degenerate edge
		case 2: return new Edge(intersections[0], intersections[1]);
		// default: throw "clipping line in a convex polygon resulting in 3 or more points";
		default:
			for(var i = 1; i < intersections.length; i++){
				if( !intersections[0].equivalent(intersections[i]) ){
					return new Edge(intersections[0], intersections[i]);
				}
			}
	}
}
export function clipRay(ray){
	var intersections = this.edges
		.map(function(el){ return intersectionRayEdge(ray, el); })
		.filter(function(el){return el !== undefined; });
	switch(intersections.length){
		case 0: return undefined;
		case 1: return new Edge(ray.origin, intersections[0]);
		case 2: return new Edge(intersections[0], intersections[1]);
		// default: throw "clipping ray in a convex polygon resulting in 3 or more points";
		default:
			for(var i = 1; i < intersections.length; i++){
				if( !intersections[0].equivalent(intersections[i]) ){
					return new Edge(intersections[0], intersections[i]);
				}
			}
	}
}
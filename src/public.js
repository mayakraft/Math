/**
 *  Geometry library
 *  The goal of this user-facing library is to type check all arguments for a
 *  likely use case, which might slow runtime by a small fraction.
 *  Use the core library functions for fastest-possible calculations.
 */

// all static constructors start with "make". eg: Matrix.makeRotation(...)
// all boolean tests start with "is" or "are" eg: Line.isParallel(...)

// For now, this library is 2D.
// however a lot of types and operations are built to function in n-dimensions.

import * as Core from './core';
import * as Input from './input';
import * as Intersection from './intersection';

// export * from './intersection';
let intersection = Intersection;
let core = Core;
let input = Input;

export { intersection }
export { core };
export { input };

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
	const isEquivalent = function(vector) {
		// rect bounding box for now, much cheaper than radius calculation
		let vec = Input.get_vec(vector);
		let sm = (_v.length < vec.length) ? _v : vec;
		let lg = (_v.length < vec.length) ? vec : _v;
		return Core.equivalent(sm, lg);
	}
	const isParallel = function(vector) {
		let vec = Input.get_vec(vector);
		let sm = (_v.length < vec.length) ? _v : vec;
		let lg = (_v.length < vec.length) ? vec : _v;
		return Core.parallel(sm, lg);
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
		get vector() { return _v; },
		get x() { return _v[0]; },
		get y() { return _v[1]; },
		get z() { return _v[2]; },
	} );
}

export function Line(){
	let {point, vector} = Input.get_line(...arguments);

	const isParallel = function(){
		let line = Input.get_line(...arguments);
		return Core.parallel(vector, line.vector);
	}

	return Object.freeze( {
		isParallel,
		get vector() { return vector; },
		get point() { return point; },
	} );
}
// static methods
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


export function Ray(){
	let {point, vector} = Input.get_line(...arguments);

	return Object.freeze( {
		get vector() { return vector; },
		get point() { return point; },
		get origin() { return point; },
	} );
}


export function Edge(){
	let _endpoints = Input.get_two_vec2(...arguments);

	const vector = function(){
		return Vector(
			_endpoints[1][0] - _endpoints[0][0],
			_endpoints[1][1] - _endpoints[0][1]
		);
	}

	return Object.freeze( {
		vector,
		get endpoints() { return _endpoints; },
	} );
}


export function Circle(){
	let _origin, _radius;

	let params = Array.from(arguments);
	let numbers = params.filter((param) => !isNaN(param));
	if(numbers.length == 3){
		_origin = numbers.slice(0,2);
		_radius = numbers[2];
	}

	const intersectionLine = function(){
		let line = Input.get_line(...arguments);
		let point2 = [
			line.point[0] + line.vector[0],
			line.point[1] + line.vector[1]
		];
		let intersection = Intersection.intersection_circle_line(_origin, _radius, line.point, point2);
		return Vector(intersection);
	}

	const intersectionEdge = function(){
		let points = Input.get_two_vec2(...arguments);
		let intersection = Intersection.intersection_circle_line(_origin, _radius, points[0], points[1]);
		return Vector(intersection);
	}

	return Object.freeze( {
		intersectionLine,
		intersectionEdge,
		get origin() { return _origin; },
		get radius() { return _radius; },
	} );
}

export function Polygon(){

	let _points = Input.get_array_of_vec2(...arguments);

	/** Calculates the signed area of a polygon. This requires the polygon be non-intersecting.
	 * @returns {number} the area of the polygon
	 * @example
	 * var area = polygon.signedArea()
	 */
	const signedArea = function(){
		return 0.5 * _points.map((el,i,arr) => {
			var next = arr[(i+1)%arr.length];
			return el.x * next.y - next.x * el.y;
		})
		.reduce((a, b) => a + b, 0);
	}
	/** Calculates the centroid or the center of mass of the polygon.
	 * @returns {XY} the location of the centroid
	 * @example
	 * var centroid = polygon.centroid()
	 */
	const centroid = function(){
		return _points.map((el,i,arr) => {
			var next = arr[(i+1)%arr.length];
			var mag = el.x * next.y - next.x * el.y;
			return Vector( (el.x+next.x)*mag, (el.y+next.y)*mag );
		})
		.reduce((prev, curr) => prev.add(curr), Vector(0,0))
		.scale(1/(6 * this.signedArea(_points)));
	}
	/** Calculates the center of the bounding box made by the edges of the polygon.
	 * @returns {XY} the location of the center of the bounding box
	 * @example
	 * var boundsCenter = polygon.center()
	 */
	const center = function(){
		// this is not an average / means
		var xMin = Infinity, xMax = 0, yMin = Infinity, yMax = 0;
		for(var i = 0; i < _points.length; i++){ 
			if(_points[i].x > xMax){ xMax = _points[i].x; }
			if(_points[i].x < xMin){ xMin = _points[i].x; }
			if(_points[i].y > yMax){ yMax = _points[i].y; }
			if(_points[i].y < yMin){ yMin = _points[i].y; }
		}
		return Vector( xMin+(xMax-xMin)*0.5, yMin+(yMax-yMin)*0.5 );
	}
	/** Tests whether or not a point is contained inside a polygon. This is counting on the polygon to be convex.
	 * @returns {boolean} whether the point is inside the polygon or not
	 * @example
	 * var isInside = polygon.contains( {x:0.5, y:0.5} )
	 */
	const contains = function(point){
		var isInside = false;
		// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
		for(var i = 0, j = _points.length - 1; i < _points.length; j = i++) {
			if( (_points[i].y > point.y) != (_points[j].y > point.y) &&
			point.x < (_points[j].x - _points[i].x) * (point.y - _points[i].y) / (_points[j].y - _points[i].y) + _points[i].x ) {
				isInside = !isInside;
			}
		}
		return isInside;
	}
	// const liesOnEdge = function(p){
	// 	for(var i = 0; i < this.edges.length; i++){
	// 		if(this.edges[i].collinear(p)){ return true; }
	// 	}
	// 	return false;
	// }
	const clipEdge = function(edge){
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
	const clipLine = function(line){
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
	const clipRay = function(ray){
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
	const enclosingRectangle = function(){
		var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
		_points.forEach(p => {
			if(p.x > maxX){ maxX = p.x; }
			if(p.x < minX){ minX = p.x; }
			if(p.y > maxY){ maxY = p.y; }
			if(p.y < minY){ minY = p.y; }
		});
		return Rect(minX, minY, maxX-minX, maxY-minY);
	}
	/** deep copy this object and all its contents */
	// const copy = function(){
	// 	var p = new Polygon();
	// 	p.edges = this.edges.map(function(e){
	// 		return Edge(e.nodes[0].x, e.nodes[0].y, e.nodes[1].x, e.nodes[1].y);
	// 	});
	// 	return p;
	// }

	// const overlaps = function(poly){
	// 	for(var i = 0; i < this.edges.length; i++){
	// 		for(var j = 0; j < poly.edges.length; j++){
	// 			if(intersectionEdgeEdge(this.edges[i], poly.edges[j]) != undefined){ return true; }
	// 		}
	// 	}
	// 	if(this.contains(poly.edges[0].node[0])){ return true; }
	// 	if(poly.contains(this.edges[0].node[0])){ return true; }
	// 	return false;
	// }
	return Object.freeze( {



	} );
}

// Polygon.withPoints = function(points){
// 	var poly = new Polygon();
// 	poly.edges = points.map(function(el,i){
// 		var nextEl = points[ (i+1)%points.length ];
// 		return new Edge(el, nextEl);
// 	},this);
// 	return poly;
// }
// Polygon.regularPolygon = function(sides){
// 	var halfwedge = 2*Math.PI/sides * 0.5;
// 	var radius = Math.cos(halfwedge);
// 	var points = [];
// 	for(var i = 0; i < sides; i++){
// 		var a = -2 * Math.PI * i / sides + halfwedge;
// 		var x = cleanNumber(radius * Math.sin(a), 14);
// 		var y = cleanNumber(radius * Math.cos(a), 14);
// 		points.push( new XY(x, y) ); // align point along Y
// 	}
// 	this.setEdgesFromPoints(points);
// 	return this;
// }
Polygon.convexHull = function(points, includeCollinear = false){
	// validate input
	if(points == null || points.length === 0){ return undefined; }
	// # points in the convex hull before escaping function
	var INFINITE_LOOP = 10000;
	// sort points by x and y
	var sorted = points.slice().sort(function(a,b){
		if(epsilonEqual(a.y, b.y, EPSILON_HIGH)){ return a.x - b.x; }
		return a.y - b.y;
	});
	var hull = [];
	hull.push(sorted[0]);
	// the current direction the perimeter walker is facing
	var ang = 0;  
	var infiniteLoop = 0;
	do{
		infiniteLoop++;
		var h = hull.length-1;
		var angles = sorted
			// remove all points in the same location from this search
			.filter(function(el){ 
				return !(epsilonEqual(el.x, hull[h].x, EPSILON_HIGH) && epsilonEqual(el.y, hull[h].y, EPSILON_HIGH)) })
			// sort by angle, setting lowest values next to "ang"
			.map(function(el){
				var angle = Math.atan2(hull[h].y - el.y, hull[h].x - el.x);
				while(angle < ang){ angle += Math.PI*2; }
				return {node:el, angle:angle, distance:undefined}; })  // distance to be set later
			.sort(function(a,b){return (a.angle < b.angle)?-1:(a.angle > b.angle)?1:0});
		if(angles.length === 0){ return undefined; }
		// narrowest-most right turn
		var rightTurn = angles[0];
		// collect all other points that are collinear along the same ray
		angles = angles.filter(function(el){ return epsilonEqual(rightTurn.angle, el.angle, EPSILON_LOW); })
		// sort collinear points by their distances from the connecting point
		.map(function(el){ 
			var distance = Math.sqrt(Math.pow(hull[h].x-el.node.x, 2) + Math.pow(hull[h].y-el.node.y, 2));
			el.distance = distance;
			return el;})
		// (OPTION 1) exclude all collinear points along the hull 
		.sort(function(a,b){return (a.distance < b.distance)?1:(a.distance > b.distance)?-1:0});
		// (OPTION 2) include all collinear points along the hull
		// .sort(function(a,b){return (a.distance < b.distance)?-1:(a.distance > b.distance)?1:0});
		// if the point is already in the convex hull, we've made a loop. we're done
		// if(contains(hull, angles[0].node)){
		// if(includeCollinear){
		// 	points.sort(function(a,b){return (a.distance - b.distance)});
		// } else{
		// 	points.sort(function(a,b){return b.distance - a.distance});
		// }


		if(hull.filter(function(el){return el === angles[0].node; }).length > 0){
			return Polygon.withPoints(hull);
		}
		// add point to hull, prepare to loop again
		hull.push(angles[0].node);
		// update walking direction with the angle to the new point
		ang = Math.atan2( hull[h].y - angles[0].node.y, hull[h].x - angles[0].node.x);
	}while(infiniteLoop < INFINITE_LOOP);
	return undefined;
}

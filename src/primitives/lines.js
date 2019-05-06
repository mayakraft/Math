import * as Input from "../parse/input";
import * as Algebra from "../core/algebra";
import * as Intersection from "../core/intersection";
import { Vector } from "./vector";
import { Matrix2 } from "./matrix";
import { EPSILON } from "../parse/clean";

/**
 * this is a prototype for line types, it's required that you implement:
 * - a point, and a vector
 * - a function compare_function which takes two inputs (t0, epsilon) and returns
 *   true if t0 lies inside the boundary of the line, t0 is scaled to vector
 * - similarly, a function clip_function, takes two inputs (d, epsilon)
 *   and returns a modified d for what is considered valid space between 0-1
 */
function LinePrototype(proto) {
	if(proto == null) {
		proto = {};
	}

	const isParallel = function(line, epsilon){
		if (line.vector == null) {
			throw "line isParallel(): please ensure object contains a vector";
		}
		let this_is_smaller = (this.vector.length < line.vector.length);
		let sm = this_is_smaller ? this.vector : line.vector;
		let lg = this_is_smaller ? line.vector : this.vector;
		return Algebra.parallel(sm, lg, epsilon);
	}
	const isDegenerate = function(epsilon){
		return Algebra.degenerate(this.vector, epsilon);
	}
	const reflection = function() {
		return Matrix2.makeReflection(this.vector, this.point);
	}
	const nearestPoint = function() {
		let point = Input.get_vec(...arguments);
		return Vector(Intersection.nearest_point(this.point, this.vector, point, this.clip_function));
	}
	const intersect = function(other) {
		return Intersection.intersection_function(
			this.point, this.vector,
			other.point, other.vector,
			function(t0, t1, epsilon = EPSILON) {
				return this.compare_function(t0, epsilon)
				   && other.compare_function(t1, epsilon);
			}.bind(this)
		);
	}
	const intersectLine = function() {
		let line = Input.get_line(...arguments);
		return Intersection.intersection_function(
			this.point, this.vector,
			line.point, line.vector,
			compare_to_line.bind(this));
	}
	const intersectRay = function() {
		let ray = Input.get_ray(...arguments);
		return Intersection.intersection_function(
			this.point, this.vector,
			ray.point, ray.vector,
			compare_to_ray.bind(this));
	}
	const intersectEdge = function() {
		let edge = Input.get_edge(...arguments);
		let edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
		return Intersection.intersection_function(
			this.point, this.vector,
			edge[0], edgeVec,
			compare_to_edge.bind(this));
	}

	const compare_to_line = function(t0, t1, epsilon = EPSILON) {
		return this.compare_function(t0, epsilon) && true;
	}
	const compare_to_ray = function(t0, t1, epsilon = EPSILON) {
		return this.compare_function(t0, epsilon) && t1 >= -epsilon;
	}
	const compare_to_edge = function(t0, t1, epsilon = EPSILON) {
		return this.compare_function(t0, epsilon) && t1 >= -epsilon && t1 <= 1+epsilon;
	}

	// const collinear = function(point){}
	// const equivalent = function(line, epsilon){}

	Object.defineProperty(proto, "isParallel", {value: isParallel});
	Object.defineProperty(proto, "isDegenerate", {value: isDegenerate});
	Object.defineProperty(proto, "nearestPoint", {value: nearestPoint});
	Object.defineProperty(proto, "reflection", {value: reflection});
	Object.defineProperty(proto, "intersect", {value: intersect});
	Object.defineProperty(proto, "intersectLine", {value: intersectLine});
	Object.defineProperty(proto, "intersectRay", {value: intersectRay});
	Object.defineProperty(proto, "intersectEdge", {value: intersectEdge});
	// Object.defineProperty(proto, "compare_function", {value: compare_function});
	// Object.defineProperty(proto, "clip_function", {value: clip_function});

	return Object.freeze(proto);
}

export function Line() {
	let { point, vector } = Input.get_line(...arguments);

	const transform = function() {
		let mat = Input.get_matrix2(...arguments);
		let line = Algebra.multiply_line_matrix2(point, vector, mat);
		return Line(line[0], line[1]);
	}

	let line = Object.create(LinePrototype());
	const compare_function = function() { return true; }
	const clip_function = function(d) { return d; }
	Object.defineProperty(line, "compare_function", {value: compare_function});
	Object.defineProperty(line, "clip_function", {value: clip_function});

	Object.defineProperty(line, "point", {get: function(){ return Vector(point); }});
	Object.defineProperty(line, "vector", {get: function(){ return Vector(vector); }});
	Object.defineProperty(line, "length", {get: function(){ return Infinity; }});
	Object.defineProperty(line, "transform", {value: transform});

	// return Object.freeze(line);
	return line;
}
// static methods
Line.fromPoints = function() {
	let points = Input.get_two_vec2(...arguments);
	return Line({
		point: points[0],
		vector: Algebra.normalize([
			points[1][0] - points[0][0],
			points[1][1] - points[0][1]
		])
	});
}
Line.perpendicularBisector = function() {
	let points = Input.get_two_vec2(...arguments);
	let vec = Algebra.normalize([
		points[1][0] - points[0][0],
		points[1][1] - points[0][1]
	]);
	return Line({
		point: Algebra.midpoint(points[0], points[1]),
		vector: [vec[1], -vec[0]]
		// vector: Algebra.cross3(vec, [0,0,1])
	});
}


export function Ray() {
	let { point, vector } = Input.get_line(...arguments);

	const transform = function() {
		let mat = Input.get_matrix2(...arguments);
		let new_point = Algebra.multiply_vector2_matrix2(point, mat);
		let vec_point = vector.map((vec,i) => vec + point[i]);
		let new_vector = Algebra.multiply_vector2_matrix2(vec_point, mat)
			.map((vec,i) => vec - new_point[i]);
		return Ray(new_point, new_vector);
	}

	const rotate180 = function() {
		return Ray(point[0], point[1], -vector[0], -vector[1]);
	}

	let ray = Object.create(LinePrototype());
	const compare_function = function(t0, ep) { return t0 >= -ep; }
	const clip_function = function(d, ep) { return (d < -ep ? 0 : d); }
	Object.defineProperty(ray, "compare_function", {value: compare_function});
	Object.defineProperty(ray, "clip_function", {value: clip_function});

	Object.defineProperty(ray, "point", {get: function(){ return Vector(point); }});
	Object.defineProperty(ray, "vector", {get: function(){ return Vector(vector); }});
	Object.defineProperty(ray, "length", {get: function(){ return Infinity; }});
	Object.defineProperty(ray, "transform", {value: transform});
	Object.defineProperty(ray, "rotate180", {value: rotate180});

	// return Object.freeze(ray);
	return ray;
}
// static methods
Ray.fromPoints = function() {
	let points = Input.get_two_vec2(...arguments);
	return Ray({
		point: points[0],
		vector: Algebra.normalize([
			points[1][0] - points[0][0],
			points[1][1] - points[0][1]
		])
	});
}


export function Edge() {
	let inputs = Input.get_two_vec2(...arguments);
	let edge = Object.create(LinePrototype(Array()));

	let _endpoints = (inputs.length > 0 ? inputs.map(p => Vector(p)) : undefined);
	if (_endpoints === undefined) { return; }
	_endpoints.forEach((p,i) => edge[i] = p);
	// todo: that created an edge with 0 length. even if it contains elements

	const transform = function() {
		let mat = Input.get_matrix2(...arguments);
		let transformed_points = edge
			.map(point => Algebra.multiply_vector2_matrix2(point, mat));
		return Edge(transformed_points);
	}

	const vector = function() {
		return Vector(
			edge[1][0] - edge[0][0],
			edge[1][1] - edge[0][1]
		);
	}

	const length = function() {
		return Math.sqrt(Math.pow(edge[1][0] - edge[0][0],2)
		               + Math.pow(edge[1][1] - edge[0][1],2));
	}

	const compare_function = function(t0, ep) { return t0 >= -ep && t0 <= 1+ep; }
	const clip_function = function(d, ep) {
		if (d < -ep) { return 0; }
		if (d > 1+ep) { return 1; }
		return d;
	}
	Object.defineProperty(edge, "compare_function", {value: compare_function});
	Object.defineProperty(edge, "clip_function", {value: clip_function});

	// Object.defineProperty(edge, "points", {get: function(){ return edge; }});
	Object.defineProperty(edge, "point", {get: function(){ return edge[0]; }});
	Object.defineProperty(edge, "vector", {get: function(){ return vector(); }});
	Object.defineProperty(edge, "length", {get: function(){ return length(); }});
	Object.defineProperty(edge, "transform", {value: transform});

	// return Object.freeze(edge);
	return edge;
}

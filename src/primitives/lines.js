import * as Input from "../parse/input";
import * as Algebra from "../core/algebra";
import * as Intersection from "../core/intersection";
import { Vector } from "./vector";
import { EPSILON } from "../parse/clean";

function LinePrototype(proto) {
	if(proto == null) {
		proto = {};
	}

	// these will be overwritten for each line type. defaults for Line()
	// is it valid for t0 to be below 0, above 1, to the unit vector
	// const vec_comp_func = function(t0) { return true; }
	
	// cap d below 0 or above 1, to the unit vector, for rays/edges
	// const vec_cap_func = function(d) { return d; }

	// const parallel = function(line, epsilon){}
	// const collinear = function(point){}
	// const equivalent = function(line, epsilon){}
	// const degenrate = function(epsilon){}

	const reflection = function() {
		return Matrix2.makeReflection(this.vector, this.point);
	}

	const nearestPoint = function() {
		let point = Input.get_vec(...arguments);
		return Vector(Intersection.nearest_point(this.point, this.vector, point, this.vec_cap_func));
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
		return this.vec_comp_func(t0, epsilon) && true;
	}
	const compare_to_ray = function(t0, t1, epsilon = EPSILON) {
		return this.vec_comp_func(t0, epsilon) && t1 >= -epsilon;
	}
	const compare_to_edge = function(t0, t1, epsilon = EPSILON) {
		return this.vec_comp_func(t0, epsilon) && t1 >= -epsilon && t1 <= 1+epsilon;
	}

	Object.defineProperty(proto, "reflection", {value: reflection});
	Object.defineProperty(proto, "nearestPoint", {value: nearestPoint});
	Object.defineProperty(proto, "intersectLine", {value: intersectLine});
	Object.defineProperty(proto, "intersectRay", {value: intersectRay});
	Object.defineProperty(proto, "intersectEdge", {value: intersectEdge});
	// Object.defineProperty(proto, "vec_comp_func", {value: vec_comp_func});
	// Object.defineProperty(proto, "vec_cap_func", {value: vec_cap_func});

	return Object.freeze(proto);
}

export function Line() {
	let { point, vector } = Input.get_line(...arguments);

	const isParallel = function() {
		let line = Input.get_line(...arguments);
		return Algebra.parallel(vector, line.vector);
	}
	const transform = function() {
		let mat = Input.get_matrix2(...arguments);
		let new_point = Algebra.multiply_vector2_matrix2(point, mat);
		let vec_point = vector.map((vec,i) => vec + point[i]);
		let new_vector = Algebra.multiply_vector2_matrix2(vec_point, mat)
			.map((vec,i) => vec - new_point[i]);
		return Line(new_point, new_vector);
	}

	let line = Object.create(LinePrototype());
	const vec_comp_func = function() { return true; }
	const vec_cap_func = function(d) { return d; }
	Object.defineProperty(line, "vec_comp_func", {value: vec_comp_func});
	Object.defineProperty(line, "vec_cap_func", {value: vec_cap_func});

	Object.defineProperty(line, "point", {get: function(){ return Vector(point); }});
	Object.defineProperty(line, "vector", {get: function(){ return Vector(vector); }});
	Object.defineProperty(line, "length", {get: function(){ return Infinity; }});
	Object.defineProperty(line, "transform", {value: transform});
	Object.defineProperty(line, "isParallel", {value: isParallel});

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
	const vec_comp_func = function(t0, ep) { return t0 >= -ep; }
	const vec_cap_func = function(d, ep) { return (d < -ep ? 0 : d); }
	Object.defineProperty(ray, "vec_comp_func", {value: vec_comp_func});
	Object.defineProperty(ray, "vec_cap_func", {value: vec_cap_func});

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

	const vec_comp_func = function(t0, ep) { return t0 >= -ep && t0 <= 1+ep; }
	const vec_cap_func = function(d, ep) {
		if (d < -ep) { return 0; }
		if (d > 1+ep) { return 1; }
		return d;
	}
	Object.defineProperty(edge, "vec_comp_func", {value: vec_comp_func});
	Object.defineProperty(edge, "vec_cap_func", {value: vec_cap_func});

	// Object.defineProperty(edge, "points", {get: function(){ return edge; }});
	Object.defineProperty(edge, "point", {get: function(){ return edge[0]; }});
	Object.defineProperty(edge, "vector", {get: function(){ return vector(); }});
	Object.defineProperty(edge, "length", {get: function(){ return length(); }});
	Object.defineProperty(edge, "transform", {value: transform});

	// return Object.freeze(edge);
	return edge;
}

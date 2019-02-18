import * as Input from "../parse/input";
import * as Algebra from "../core/algebra";
import * as Intersection from "../core/intersection";
import { Vector } from "./vector";
import { EPSILON } from '../parse/clean';

function LinePrototype() {
	// these will be overwritten for each line type
	// is it valid for t0 to be below 0, above 1, to the unit vector
	const vec_comp_func = function(t0) { return true; }
	// cap d below 0 or above 1, to the unit vector, for rays/edges
	const vec_cap_func = function(d) { return d; }

	// const parallel = function(line, epsilon){}
	// const collinear = function(point){}
	// const equivalent = function(line, epsilon){}
	// const degenrate = function(epsilon){}

	const reflection = function() {
		return Matrix2.makeReflection(this.vector, this.point);
	}

	const nearestPoint = function() {
		let point = Input.get_vec(...arguments);
		return Intersection.nearest_point(this.point, this.vector, point, this.vec_cap_func);
	}
	
	const intersectLine = function() {
		let line = Input.get_line(...arguments);
		return Intersection.intersection_function(
			this.point, this.vector,
			line.point, line.vector,
			this_line_comp);
	}
	const intersectRay = function() {
		let ray = Input.get_ray(...arguments);
		return Intersection.intersection_function(
			this.point, this.vector,
			ray.point, ray.vector,
			this_ray_comp);
	}
	const intersectEdge = function() {
		let edge = Input.get_edge(...arguments);
		let edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
		return Intersection.intersection_function(
			this.point, this.vector,
			edge[0], edgeVec,
			this_edge_comp);
	}

	const this_line_comp = function(t0, t1, epsilon = EPSILON) {
		return vec_comp_func(t0, epsilon) && true;
	}
	const this_ray_comp = function(t0, t1, epsilon = EPSILON) {
		return vec_comp_func(t0, epsilon) && t1 >= -epsilon;
	}
	const this_edge_comp = function(t0, t1, epsilon = EPSILON) {
		return vec_comp_func(t0, epsilon) && t1 >= -epsilon && t1 <= 1+epsilon;
	}

	return Object.freeze( {
		reflection,
		nearestPoint,
		intersectLine,
		intersectRay,
		intersectEdge,
		vec_comp_func,
		vec_cap_func,
	} );
}

export function Line() {
	let { point, vector } = Input.get_line(...arguments);

	const isParallel = function() {
		let line = Input.get_line(...arguments);
		return Algebra.parallel(vector, line.vector);
	}
	const transform = function() {
		let mat = Input.get_matrix2(...arguments);
		// todo: a little more elegant of a solution, please
		let norm = Algebra.normalize(vector);
		let temp = point.map((p,i) => p + norm[i])
		if (temp == null) { return; }
		var p0 = Algebra.multiply_vector2_matrix2(point, mat);
		var p1 = Algebra.multiply_vector2_matrix2(temp, mat);
		return Line.withPoints([p0, p1]);
	}

	let line = Object.create(LinePrototype());
	const vec_comp_func = function() { return true; }
	const vec_cap_func = function(d) { return d; }
	Object.defineProperty(line, "vec_comp_func", {value: vec_comp_func});
	Object.defineProperty(line, "vec_cap_func", {value: vec_cap_func});

	Object.defineProperty(line, "point", {get: function(){ return point; }});
	Object.defineProperty(line, "vector", {get: function(){ return vector; }});
	Object.defineProperty(line, "length", {get: function(){ return Infinity; }});
	Object.defineProperty(line, "transform", {value: transform});
	Object.defineProperty(line, "isParallel", {value: isParallel});

	return Object.freeze(line);
}
// static methods
Line.withPoints = function() {
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
		// todo: a little more elegant of a solution, please
		let norm = Algebra.normalize(vector);
		let temp = point.map((p,i) => p + norm[i])
		if (temp == null) { return; }
		var p0 = Algebra.multiply_vector2_matrix2(point, mat);
		var p1 = Algebra.multiply_vector2_matrix2(temp, mat);
		return Ray.withPoints([p0, p1]);
	}

	let ray = Object.create(LinePrototype());
	const vec_comp_func = function(t0, ep) { return t0 >= -ep; }
	const vec_cap_func = function(d, ep) { return (d < -ep ? 0 : d); }
	Object.defineProperty(ray, "vec_comp_func", {value: vec_comp_func});
	Object.defineProperty(ray, "vec_cap_func", {value: vec_cap_func});

	Object.defineProperty(ray, "point", {get: function(){ return point; }});
	Object.defineProperty(ray, "vector", {get: function(){ return vector; }});
	Object.defineProperty(ray, "length", {get: function(){ return Infinity; }});
	Object.defineProperty(ray, "transform", {value: transform});

	return Object.freeze(ray);
}
// static methods
Ray.withPoints = function() {
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
	let _endpoints = Input.get_two_vec2(...arguments);

	const transform = function() {
		let mat = Input.get_matrix2(...arguments);
		let transformed_points = _endpoints
			.map(point => Algebra.multiply_vector2_matrix2(point, mat));
		return Edge(transformed_points);
	}

	const vector = function() {
		return Vector(
			_endpoints[1][0] - _endpoints[0][0],
			_endpoints[1][1] - _endpoints[0][1]
		);
	}

	const length = function() {
		return Math.sqrt(Math.pow(_endpoints[1][0] - _endpoints[0][0],2)
		               + Math.pow(_endpoints[1][1] - _endpoints[0][1],2));
	}

	let edge = Object.create(LinePrototype());
	let vec_comp_func = function(t0, ep) { return t0 >= -ep && t0 <= 1+ep; }
	const vec_cap_func = function(d, ep) {
		if (d < -ep) { return 0; }
		if (d > 1+ep) { return 1; }
		return d;
	}
	Object.defineProperty(edge, "vec_comp_func", {value: vec_comp_func});
	Object.defineProperty(edge, "vec_cap_func", {value: vec_cap_func});

	Object.defineProperty(edge, "points", {get: function(){ return _endpoints; }});
	Object.defineProperty(edge, "point", {get: function(){ return _endpoints[0]; }});
	Object.defineProperty(edge, "vector", {get: function(){ return vector(); }});
	Object.defineProperty(edge, "length", {get: function(){ return length(); }});
	Object.defineProperty(edge, "transform", {value: transform});

	return Object.freeze(edge);
}

import * as Input from "../parse/input";
import * as Geometry from "../core/geometry";
import * as Intersection from "../core/intersection";
import { Vector } from "./vector";
import { clean_number } from "../parse/clean";

export function Polygon() {

	let _points = Input.get_array_of_vec(...arguments);
	if (_points === undefined) {
		// todo, best practices here
		return undefined;
	}

	const contains = function() {
		let point = Input.get_vec(...arguments)
		return Intersection.point_in_poly(_points, point);
	}

	const scale = function(magnitude, center = Geometry.centroid(_points)) {
		let newPoints = _points
			.map(p => [0,1].map((_,i) => p[i] - center[i]))
			.map(vec => vec.map((_,i) => center[i] + vec[i] * magnitude))
		return Polygon(newPoints);
	}

	const rotate = function(angle, centerPoint = Geometry.centroid(_points)) {
		let newPoints = _points.map(p => {
			let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
			let mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
			let a = Math.atan2(vec[1], vec[0]);
			return [
				centerPoint[0] + Math.cos(a+angle) * mag, 
				centerPoint[1] + Math.sin(a+angle) * mag
			];
		});
		return Polygon(newPoints);
	}

	const split = function() {
		let line = Input.get_line(...arguments);
		return Geometry.split_polygon(_points, line.point, line.vector)
			.map(poly => Polygon(poly));
	}

	// todo: need non-convex clipping functions returns an array of edges
	const clipEdge = function() {
		let edge = Input.get_edge(...arguments);
		return Intersection.clip_edge_in_convex_poly(_points, edge[0], edge[1]);
	}
	const clipLine = function() {
		let line = Input.get_line(...arguments);
		return Intersection.clip_line_in_convex_poly(_points, line.point, line.vector);
	}
	const clipRay = function() {
		let line = Input.get_line(...arguments);
		return Intersection.clip_ray_in_convex_poly(_points, line.point, line.vector);
	}

	return Object.freeze( {
		contains,
		scale,
		rotate,
		split,
		clipEdge,
		clipLine,
		clipRay,
		get points() { return _points; },
		get area() { return Geometry.signed_area(_points); },
		get signedArea() { return Geometry.signed_area(_points); },
		get centroid() { return Geometry.centroid(_points); },
		get midpoint() { return Algebra.average(_points); },
		get enclosingRectangle() {
			return Rectangle(Geometry.enclosing_rectangle(_points));
		},
	} );
}

Polygon.regularPolygon = function(sides, x = 0, y = 0, radius = 1) {
	let points = Geometry.make_regular_polygon(sides, x, y, radius);
	return Polygon(points);
}
Polygon.convexHull = function(points, includeCollinear = false) {
	let hull = Geometry.convex_hull(points, includeCollinear);
	return Polygon(hull);
}


export function ConvexPolygon() {

	let polygon = Object.create(Polygon(...arguments));

	// const liesOnEdge = function(p) {
	// 	for(var i = 0; i < this.edges.length; i++) {
	// 		if (this.edges[i].collinear(p)) { return true; }
	// 	}
	// 	return false;
	// }

	const clipEdge = function() {
		let edge = Input.get_edge(...arguments);
		return Intersection.clip_edge_in_convex_poly(polygon.points, edge[0], edge[1]);
	}
	const clipLine = function() {
		let line = Input.get_line(...arguments);
		return Intersection.clip_line_in_convex_poly(polygon.points, line.point, line.vector);
	}
	const clipRay = function() {
		let line = Input.get_line(...arguments);
		return Intersection.clip_ray_in_convex_poly(polygon.points, line.point, line.vector);
	}

	const split = function() {
		let line = Input.get_line(...arguments);
		return Geometry.split_convex_polygon(polygon.points, line.point, line.vector)
			.map(poly => ConvexPolygon(poly));
	}

	const overlaps = function() {
		let points = Input.get_array_of_vec(...arguments);
		return Intersection.convex_polygons_overlap(polygon.points, points);
	}

	const scale = function(magnitude, center = Geometry.centroid(polygon.points)) {
		let newPoints = polygon.points
			.map(p => [0,1].map((_,i) => p[i] - center[i]))
			.map(vec => vec.map((_,i) => center[i] + vec[i] * magnitude));
		return ConvexPolygon(newPoints);
	}

	const rotate = function(angle, centerPoint = Geometry.centroid(polygon.points)) {
		let newPoints = polygon.points.map(p => {
			let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
			let mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
			let a = Math.atan2(vec[1], vec[0]);
			return [
				centerPoint[0] + Math.cos(a+angle) * mag, 
				centerPoint[1] + Math.sin(a+angle) * mag
			];
		});
		return ConvexPolygon(newPoints);
	}

	Object.defineProperty(polygon, "clipEdge", {value: clipEdge});
	Object.defineProperty(polygon, "clipLine", {value: clipLine});
	Object.defineProperty(polygon, "clipRay", {value: clipRay});
	Object.defineProperty(polygon, "split", {value: split});
	Object.defineProperty(polygon, "overlaps", {value: overlaps});
	Object.defineProperty(polygon, "scale", {value: scale});
	Object.defineProperty(polygon, "rotate", {value: rotate});
	
	return Object.freeze(polygon);
}

ConvexPolygon.regularPolygon = function(sides, x = 0, y = 0, radius = 1) {
	let points = Geometry.make_regular_polygon(sides, x, y, radius);
	return ConvexPolygon(points);
}
ConvexPolygon.convexHull = function(points, includeCollinear = false) {
	let hull = Geometry.convex_hull(points, includeCollinear);
	return ConvexPolygon(hull);
}

export function Rectangle(){
	let _origin, _width, _height;

	// get parameters
	let params = Array.from(arguments);
	let numbers = params.filter((param) => !isNaN(param));
	let arrays = params.filter((param) => param.constructor === Array);
	if (numbers.length === 4) {
		_origin = numbers.slice(0,2);
		_width = numbers[2];
		_height = numbers[3];
	}
	if (arrays.length === 1) { arrays = arrays[0]; }
	if (arrays.length === 2) {
		if (typeof arrays[0][0] === "number") {
			_origin = arrays[0].slice();
			_width = arrays[1][0];
			_height = arrays[1][1];
		}
	}
	// end get parameters
	let points = [
		[_origin[0], _origin[1]],
		[_origin[0] + _width, _origin[1]],
		[_origin[0] + _width, _origin[1] + _height],
		[_origin[0], _origin[1] + _height],
	];
	let rect = Object.create(ConvexPolygon(points));

	// redefinition of methods
	const scale = function(magnitude, center) {
		if (center == null) {
			center = [_origin[0] + _width, _origin[1] + _height];
		}
		let x = _origin[0] + (center[0] - _origin[0]) * (1-magnitude);
		let y = _origin[1] + (center[1] - _origin[1]) * (1-magnitude);
		return Rectangle(x, y, _width*magnitude, _height*magnitude);
	}

	Object.defineProperty(rect, "origin", {get: function(){ return _origin; }});
	Object.defineProperty(rect, "width", {get: function(){ return _width; }});
	Object.defineProperty(rect, "height", {get: function(){ return _height; }});
	Object.defineProperty(rect, "area", {
		get: function(){ return _width * _height; }
	});
	Object.defineProperty(rect, "scale", {value: scale});

	return Object.freeze(rect);
}


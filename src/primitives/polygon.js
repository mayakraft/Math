import * as Input from '../parse/input';
import * as Geometry from '../core/geometry';
import * as Intersection from '../core/intersection';
import { Vector } from './vector';
import { clean_number } from '../parse/clean';

export function Polygon() {

	let _points = Input.get_array_of_vec(...arguments);
	if (_points === undefined) {
		// todo, best practices here.
		return undefined;
	}

	const contains = function() {
		let point = Input.get_vec(...arguments)
		return Intersection.point_in_poly(_points, point);
	}

	/**
	 * The center of a polygon as the average of all points,
	 * only valid for regular polygons
	 */
	const center = function() {
		return _points.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
			.map(c => c / _points.length);
	}

	const scale = function(magnitude, centerPoint = centroid()) {
		let newPoints = _points.map(p => {
			let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
			return [centerPoint[0] + vec[0]*magnitude, centerPoint[1] + vec[1]*magnitude];
		});
		return Polygon(newPoints);
	}

	const rotate = function(angle, centerPoint = centroid()) {
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

	// todo: replace with non-convex
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
		// return {
		contains,
		get area() { return Geometry.signed_area(_points); },
		get signedArea() { return Geometry.signed_area(_points); },
		get centroid() { return Geometry.centroid(_points); },
		center,
		scale,
		rotate,
		split,
		clipEdge,
		clipLine,
		clipRay,
		get points() { return _points; },
	} );
// 	}

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

	// let {
	// 	contains,
	// 	signedArea,
	// 	centroid,
	// 	center,
	// 	points
	// } = Polygon(...arguments);
	// let _points = points;

	// const liesOnEdge = function(p) {
	// 	for(var i = 0; i < this.edges.length; i++) {
	// 		if (this.edges[i].collinear(p)) { return true; }
	// 	}
	// 	return false;
	// }

	const clipEdge = function() {
		console.log(arguments);
		let edge = Input.get_edge(...arguments);
		console.log(edge);
		return Intersection.clip_edge_in_convex_poly(polygon.points, edge[0], edge[1]);
	}

	Object.defineProperty(polygon, "clipEdge", {value: clipEdge});

	// polygon.clipLine = function() {
	// 	let line = Input.get_line(...arguments);
	// 	return Intersection.clip_line_in_convex_poly(_points, line.point, line.vector);
	// }
	// polygon.clipRay = function() {
	// 	let line = Input.get_line(...arguments);
	// 	return Intersection.clip_ray_in_convex_poly(_points, line.point, line.vector);
	// }
	// polygon.enclosingRectangle = function() {
	// 	var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
	// 	_points.forEach(p => {
	// 		if (p[0] > maxX) { maxX = p[0]; }
	// 		if (p[0] < minX) { minX = p[0]; }
	// 		if (p[1] > maxY) { maxY = p[1]; }
	// 		if (p[1] < minY) { minY = p[1]; }
	// 	});
	// 	return Rectangle(minX, minY, maxX-minX, maxY-minY);
	// }

	// polygon.split = function() {
	// 	let line = Input.get_line(...arguments);
	// 	return Geometry.split_convex_polygon(_points, line.point, line.vector)
	// 		.map(poly => ConvexPolygon(poly));
	// }

	// polygon.overlaps = function() {
	// 	let points = Input.get_array_of_vec(...arguments);
	// 	return Intersection.convex_polygons_overlap(_points, points);
	// }

	// polygon.scale = function(magnitude, centerPoint = centroid()) {
	// 	let newPoints = _points.map(p => {
	// 		let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
	// 		return [centerPoint[0] + vec[0]*magnitude, centerPoint[1] + vec[1]*magnitude];
	// 	});
	// 	return ConvexPolygon(newPoints);
	// }

	// polygon.rotate = function(angle, centerPoint = centroid()) {
	// 	let newPoints = _points.map(p => {
	// 		let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
	// 		let mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
	// 		let a = Math.atan2(vec[1], vec[0]);
	// 		return [
	// 			centerPoint[0] + Math.cos(a+angle) * mag, 
	// 			centerPoint[1] + Math.sin(a+angle) * mag
	// 		];
	// 	});
	// 	return ConvexPolygon(newPoints);
	// }

	return polygon;

	// return Object.freeze( {
	// 	signedArea,
	// 	centroid,
	// 	center,
	// 	contains,
	// 	clipEdge,
	// 	clipLine,
	// 	clipRay,
	// 	enclosingRectangle,
	// 	split,
	// 	overlaps,
	// 	scale,
	// 	rotate,
	// 	get points() { return _points; },
	// } );
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

	let params = Array.from(arguments);
	let numbers = params.filter((param) => !isNaN(param));
	if(numbers.length == 4){
		_origin = numbers.slice(0,2);
		_width = numbers[2];
		_height = numbers[3];
	}

	return Object.freeze( {
		get origin() { return _origin; },
		get width() { return _width; },
		get height() { return _height; },
	} );
}


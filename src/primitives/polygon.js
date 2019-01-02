import * as Input from '../input';
import * as Geometry from '../core/geometry';
import { Vector } from './vector';

export function Polygon(){

	let _points = Input.get_array_of_vec(...arguments);

	/** Calculates the signed area of a polygon. This requires the polygon be non-intersecting.
	 * @returns {number} the area of the polygon
	 * @example
	 * var area = polygon.signedArea()
	 */
	const signedArea = function(){
		return 0.5 * _points.map((el,i,arr) => {
			var next = arr[(i+1)%arr.length];
			return el[0] * next[1] - next[0] * el[1];
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
			var mag = el[0] * next[1] - next[0] * el[1];
			return Vector( (el[0]+next[0])*mag, (el[1]+next[1])*mag );
		})
		.reduce((prev, curr) => prev.add(curr), Vector(0,0))
		.scale(1/(6 * signedArea(_points)));
	}
	/** Calculates the center of the bounding box made by the edges of the polygon.
	 * @returns {XY} the location of the center of the bounding box
	 * @example
	 * var boundsCenter = polygon.center()
	 */
	const center = function(){
		// this is not an average / means
		var xMin = Infinity, xMax = 0, yMin = Infinity, yMax = 0;
		_points.forEach(p => {
			if(p[0] > xMax){ xMax = p[0]; }
			if(p[0] < xMin){ xMin = p[0]; }
			if(p[1] > yMax){ yMax = p[1]; }
			if(p[1] < yMin){ yMin = p[1]; }
		});
		return Vector( xMin+(xMax-xMin)*0.5, yMin+(yMax-yMin)*0.5 );
	}

	/** Tests whether or not a point is contained inside a polygon.
	 * @returns {boolean} whether the point is inside the polygon or not
	 * @example
	 * var isInside = polygon.contains( {x:0.5, y:0.5} )
	 */
	const contains = function(point){
		var isInside = false;
		// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
		for(var i = 0, j = _points.length - 1; i < _points.length; j = i++) {
			if( (_points[i][1] > point[1]) != (_points[j][1] > point[1]) &&
			point[0] < (_points[j][0] - _points[i][0]) * (point[1] - _points[i][1]) / (_points[j][1] - _points[i][1]) + _points[i][0] ) {
				isInside = !isInside;
			}
		}
		return isInside;
	}


	return Object.freeze( {
		signedArea,
		centroid,
		center,
		contains,
		get points() { return _points; },
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
Polygon.regularPolygon = function(sides, x = 0, y = 0, radius = 1){
	var halfwedge = 2*Math.PI/sides * 0.5;
	var r = radius / Math.cos(halfwedge);
	var points = Array.from(Array(Math.floor(sides))).map((_,i) => {
		var a = -2 * Math.PI * i / sides + halfwedge;
		var px = Input.clean_number(x + r * Math.sin(a), 14);
		var py = Input.clean_number(y + r * Math.cos(a), 14);
		return [px, py]; // align point along Y
	})
	return Polygon(points);
}
Polygon.convexHull = function(points, includeCollinear = false){
	// validate input
	if(points == null || points.length === 0){ return undefined; }
	let hull = Geometry.convex_hull(points);
	return Polygon(hull);
}



export function ConvexPolygon(){

	let {
		signedArea,
		centroid,
		center,
		contains,
		points
	} = Polygon(...arguments);

	let _points = points;


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
	const clipLine = function(){
		let line = Input.get_line(...arguments);
		return Intersection.clip_line_in_poly(_points, line.point, line.vector);
	}
	const clipRay = function(ray){
		let line = Input.get_line(...arguments);
		return Intersection.clip_ray_in_poly(_points, line.point, line.vector);
	}
	const enclosingRectangle = function(){
		var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
		_points.forEach(p => {
			if(p[0] > maxX){ maxX = p[0]; }
			if(p[0] < minX){ minX = p[0]; }
			if(p[1] > maxY){ maxY = p[1]; }
			if(p[1] < minY){ minY = p[1]; }
		});
		return Rect(minX, minY, maxX-minX, maxY-minY);
	}

	const scale = function(magnitude, centerPoint){
		if(centerPoint == null){ centerPoint = centroid(); }
		let newPoints = _points.map(p => {
			let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
			return [centerPoint[0] + vec[0]*magnitude, centerPoint[0] + vec[0]*magnitude];
		});
		return Polygon(newPoints);
	}

	const rotate = function(angle, centerPoint){
		if(centerPoint == null){ centerPoint = centroid(); }
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

	const split = function(){
		let line = Input.get_line(...arguments);
		return Geometry.split_convex_polygon(_points, line.point, line.vector)
			.map(poly => Polygon(poly));
	}

	const overlaps = function(poly) {
		let points = Input.get_array_of_vec(...arguments);
		return Intersection.polygons_overlap(_points, points);
	}

	return Object.freeze( {
		signedArea,
		centroid,
		center,
		contains,
		clipEdge,
		clipLine,
		clipRay,
		enclosingRectangle,
		split,
		overlaps,
		scale,
		rotate,
		get points() { return _points; },
	} );
}

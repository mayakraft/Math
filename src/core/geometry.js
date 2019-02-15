
import { point_on_line, line_edge_exclusive } from './intersection';
import { EPSILON_LOW, EPSILON, EPSILON_HIGH, clean_number } from '../parse/clean';
import { normalize, cross2 } from "./algebra";

export function make_regular_polygon(sides, x = 0, y = 0, radius = 1) {
	var halfwedge = 2*Math.PI/sides * 0.5;
	var r = radius / Math.cos(halfwedge);
	return Array.from(Array(Math.floor(sides))).map((_,i) => {
		var a = -2 * Math.PI * i / sides + halfwedge;
		var px = clean_number(x + r * Math.sin(a), 14);
		var py = clean_number(y + r * Math.cos(a), 14);
		return [px, py]; // align point along Y
	});
}

/** There are 2 interior angles between 2 absolute angle measurements, from A to B return the clockwise one
 * @param {number} angle in radians, angle PI/2 is along the +Y axis
 * @returns {number} clockwise interior angle (from a to b) in radians
 */
export function clockwise_angle2_radians(a, b) {
	// this is on average 50 to 100 times faster than clockwise_angle2
	while (a < 0) { a += Math.PI*2; }
	while (b < 0) { b += Math.PI*2; }
	var a_b = a - b;
	return (a_b >= 0)
		? a_b
		: Math.PI*2 - (b - a);
}
export function counter_clockwise_angle2_radians(a, b) {
	// this is on average 50 to 100 times faster than counter_clockwise_angle2
	while (a < 0) { a += Math.PI*2; }
	while (b < 0) { b += Math.PI*2; }
	var b_a = b - a;
	return (b_a >= 0)
		? b_a
		: Math.PI*2 - (a - b);
}

/** There are 2 angles between 2 vectors, from A to B return the clockwise one.
 * @param {[number, number]} vector
 * @returns {number} clockwise angle (from a to b) in radians
 */
export function clockwise_angle2(a, b) {
	var dotProduct = b[0]*a[0] + b[1]*a[1];
	var determinant = b[0]*a[1] - b[1]*a[0];
	var angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += Math.PI*2; }
	return angle;
}
export function counter_clockwise_angle2(a, b) {
	var dotProduct = a[0]*b[0] + a[1]*b[1];
	var determinant = a[0]*b[1] - a[1]*b[0];
	var angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += Math.PI*2; }
	return angle;
}
/** There are 2 interior angles between 2 vectors, return both, the smaller first
 * @param {[number, number]} vector
 * @returns {[number, number]} 2 angle measurements between vectors
 */
export function interior_angles2(a, b) {
	var interior1 = clockwise_angle2(a, b);
	var interior2 = Math.PI*2 - interior1;
	return (interior1 < interior2)
		? [interior1, interior2]
		: [interior2, interior1];
}
/** This bisects 2 vectors, returning both smaller and larger outside angle bisections [small, large]
 * @param {[number, number]} vector
 * @returns {[[number, number],[number, number]]} 2 vectors, the smaller angle first
 */
export function bisect_vectors(a, b) {
	let aV = normalize(a);
	let bV = normalize(b);
	let sum = aV.map((_,i) => aV[i] + bV[i]);
	let vecA = normalize( sum );
	let vecB = aV.map((_,i) => -aV[i] + -bV[i])
	return [vecA, normalize(vecB)];
}

/** This bisects 2 lines
 * @param {[number, number]} all vectors, lines defined by points and vectors
 * @returns [ [number,number], [number,number] ] // line, defined as point, vector, in that order
 */
export function bisect_lines2(pointA, vectorA, pointB, vectorB) {
	let denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
	if (Math.abs(denominator) < EPSILON) { /* parallel */
		return [midpoint(pointA, pointB), vectorA.slice()];
	}
	let vectorC = [pointB[0]-pointA[0], pointB[1]-pointA[1]];
	// var numerator = vectorC[0] * vectorB[1] - vectorB[0] * vectorC[1];
	let numerator = (pointB[0]-pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1]-pointA[1]);
	var t = numerator / denominator;
	let x = pointA[0] + vectorA[0]*t;
	let y = pointA[1] + vectorA[1]*t;
	var bisects = bisect_vectors(vectorA, vectorB);
	bisects[1] = [ bisects[1][1], -bisects[1][0] ];
	// swap to make smaller interior angle first
	if (Math.abs(cross2(vectorA, bisects[1])) <
	   Math.abs(cross2(vectorA, bisects[0]))) {
		var swap = bisects[0];
		bisects[0] = bisects[1];
		bisects[1] = swap;
	}
	return bisects.map((el) => [[x,y], el]);
}

// todo: check the implementation above, if it works, delete this:

// export function bisect_lines2(pointA, vectorA, pointB, vectorB) {
// 	if (parallel(vectorA, vectorB)) {
// 		return [midpoint(pointA, pointB), vectorA.slice()];
// 	} else{
// 		var inter = Intersection.line_line(pointA, vectorA, pointB, vectorB);
// 		var bisect = bisect_vectors(vectorA, vectorB);
// 		bisects[1] = [ bisects[1][1], -bisects[1][0] ];
// 		// swap to make smaller interior angle first
// 		if (Math.abs(cross2(vectorA, bisects[1])) <
// 		   Math.abs(cross2(vectorA, bisects[0]))) {
// 			var swap = bisects[0];
// 			bisects[0] = bisects[1];
// 			bisects[1] = swap;
// 		}
// 		return bisects.map((el) => [inter, el]);
// 	}
// }

/** Calculates the signed area of a polygon. This requires the polygon be non-intersecting.
 * @returns {number} the area of the polygon
 * @example
 * var area = polygon.signedArea()
 */
export function signed_area(points) {
	return 0.5 * points.map((el,i,arr) => {
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
export function centroid(points) {
	let sixthArea = 1/(6 * signed_area(points));
	return points.map((el,i,arr) => {
		var next = arr[(i+1)%arr.length];
		var mag = el[0] * next[1] - next[0] * el[1];
		return [(el[0]+next[0])*mag, (el[1]+next[1])*mag];
	})
	.reduce((a, b) => [a[0]+b[0], a[1]+b[1]], [0,0])
	.map(c => c * sixthArea);
}

/**
 * works in any n-dimension (enclosing cube, hypercube..)
 * @returns array of arrays: [[x, y], [width, height]]
 */
export function enclosing_rectangle(points) {
	let l = points[0].length;
	let mins = Array.from(Array(l)).map(_ => Infinity);
	let maxs = Array.from(Array(l)).map(_ => -Infinity);
	points.forEach(point => 
		point.forEach((c,i) => {
			if(c < mins[i]) { mins[i] = c; }
			if(c > maxs[i]) { maxs[i] = c; }
		})
	);
	let lengths = maxs.map((max,i) => max - mins[i]);
	return [mins, lengths];
}

export function convex_hull(points, include_collinear = false, epsilon = EPSILON_HIGH) {
	// # points in the convex hull before escaping function
	var INFINITE_LOOP = 10000;
	// sort points by y. if ys are equivalent, sort by x
	var sorted = points.slice().sort((a,b) =>
		(Math.abs(a[1]-b[1]) < epsilon
			? a[0] - b[0]
			: a[1] - b[1]))
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
			.filter(el => 
				!( Math.abs(el[0] - hull[h][0]) < epsilon
				&& Math.abs(el[1] - hull[h][1]) < epsilon))
			// sort by angle, setting lowest values next to "ang"
			.map(el => {
				var angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);
				while(angle < ang) { angle += Math.PI*2; }
				return {node:el, angle:angle, distance:undefined};
			})  // distance to be set later
			.sort((a,b) => (a.angle < b.angle)?-1:(a.angle > b.angle)?1:0);
		if (angles.length === 0) { return undefined; }
		// narrowest-most right turn
		var rightTurn = angles[0];
		// collect all other points that are collinear along the same ray
		angles = angles.filter(el => Math.abs(rightTurn.angle - el.angle) < epsilon)
		// sort collinear points by their distances from the connecting point
			.map(el => { 
				var distance = Math.sqrt(Math.pow(hull[h][0]-el.node[0], 2) + Math.pow(hull[h][1]-el.node[1], 2));
				el.distance = distance;
				return el;
			})
		// (OPTION 1) exclude all collinear points along the hull 
		.sort((a,b) => (a.distance < b.distance)?1:(a.distance > b.distance)?-1:0);
		// (OPTION 2) include all collinear points along the hull
		// .sort(function(a,b) {return (a.distance < b.distance)?-1:(a.distance > b.distance)?1:0});
		// if the point is already in the convex hull, we've made a loop. we're done
		// if (contains(hull, angles[0].node)) {
		// if (includeCollinear) {
		// 	points.sort(function(a,b) {return (a.distance - b.distance)});
		// } else{
		// 	points.sort(function(a,b) {return b.distance - a.distance});
		// }

		if (hull.filter(el => el === angles[0].node).length > 0) {
			return hull;
		}
		// add point to hull, prepare to loop again
		hull.push(angles[0].node);
		// update walking direction with the angle to the new point
		ang = Math.atan2( hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
	} while(infiniteLoop < INFINITE_LOOP);
	return undefined;
}


export function split_polygon(poly, linePoint, lineVector) {
	//    point: intersection [x,y] point or null if no intersection
	// at_index: where in the polygon this occurs
	let vertices_intersections = poly.map((v,i) => {
		let intersection = point_on_line(linePoint, lineVector, v);
		return { type: "v", point: intersection ? v : null, at_index: i };
	}).filter(el => el.point != null);
	let edges_intersections = poly.map((v,i,arr) => {
		let intersection = line_edge_exclusive(linePoint, lineVector, v, arr[(i+1)%arr.length])
		return { type: "e", point: intersection, at_index: i };
	}).filter(el => el.point != null);

	let sorted = vertices_intersections.concat(edges_intersections).sort((a,b) =>
		( Math.abs(a.point[0]-b.point[0]) < EPSILON
			? a.point[1] - b.point[1]
			: a.point[0] - b.point[0] )
	)
	console.log(sorted);
	return poly;
}

export function split_convex_polygon(poly, linePoint, lineVector) {
	// todo: should this return undefined if no intersection? 
	//       or the original poly?

	//    point: intersection [x,y] point or null if no intersection
	// at_index: where in the polygon this occurs
	let vertices_intersections = poly.map((v,i) => {
		let intersection = point_on_line(linePoint, lineVector, v);
		return { point: intersection ? v : null, at_index: i };
	}).filter(el => el.point != null);
	let edges_intersections = poly.map((v,i,arr) => {
		let intersection = line_edge_exclusive(linePoint, lineVector, v, arr[(i+1)%arr.length])
		return { point: intersection, at_index: i };
	}).filter(el => el.point != null);

	// three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
	if (edges_intersections.length == 2) {
		let sorted_edges = edges_intersections.slice()
			.sort((a,b) => a.at_index - b.at_index);

		let face_a = poly
			.slice(sorted_edges[1].at_index+1)
			.concat(poly.slice(0, sorted_edges[0].at_index+1))
		face_a.push(sorted_edges[0].point);
		face_a.push(sorted_edges[1].point);

		let face_b = poly
			.slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1);
		face_b.push(sorted_edges[1].point);
		face_b.push(sorted_edges[0].point);
		return [face_a, face_b];
	} else if (edges_intersections.length == 1 && vertices_intersections.length == 1) {
		vertices_intersections[0]["type"] = "v";
		edges_intersections[0]["type"] = "e";
		let sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a,b) => a.at_index - b.at_index);

		let face_a = poly.slice(sorted_geom[1].at_index+1)
			.concat(poly.slice(0, sorted_geom[0].at_index+1))
		if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
		face_a.push(sorted_geom[1].point); // todo: if there's a bug, it's here. switch this

		let face_b = poly
			.slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1);
		if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
		face_b.push(sorted_geom[0].point); // todo: if there's a bug, it's here. switch this
		return [face_a, face_b];
	} else if (vertices_intersections.length == 2) {
		let sorted_vertices = vertices_intersections.slice()
			.sort((a,b) => a.at_index - b.at_index);
		let face_a = poly
			.slice(sorted_vertices[1].at_index)
			.concat(poly.slice(0, sorted_vertices[0].at_index+1))
		let face_b = poly
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
		return [face_a, face_b];
	}
	return [poly.slice()];
}

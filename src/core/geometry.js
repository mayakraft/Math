
import { point_on_line, line_edge_exclusive } from './intersection';
import { EPSILON_LOW, EPSILON, EPSILON_HIGH, clean_number } from '../parse/clean';


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

import * as Input from "../parse/input";
import * as Geometry from "../core/geometry";
import { Vector } from "./vector";
import { Sector } from "./sector";
import { clean_number } from "../parse/clean";

export function Junction(center, points) {

	let _points = Input.get_array_of_vec(points);
	if (_points === undefined) {
		// todo, best practices here
		return undefined;
	}

	let _center = Input.get_vec(center);
	let _vectors = _points.map(p => p.map((_,i) => p[i] - center[i]));
	let _angles = _vectors.map(v => Math.atan2(v[1], v[0]));

	let clockwise_order = Array.from(Array(_angles.length))
		.map((_,i) => i)
		.sort((a,b) => _angles[a] - _angles[b]);

	const kawasaki = function() {
		let angles = points
			.map(p => [p.position[0] - sketch.width/2, p.position[1] - sketch.height/2])
			.map(v => Math.atan2(v[1], v[0]))
			.sort((a,b) => a - b);
		// vectors.forEach((v) => v["angle"] = RabbitEar.math.core.geometry.clockwise_angle2(v.vector));
		let r = (sketch.width > sketch.height) ? sketch.height*0.4 : sketch.width*0.4;
		let wedges = angles.map((_,i,arr) =>
			RabbitEar.svg.wedge(sketch.width/2, sketch.height/2, r, angles[i], angles[(i+1)%arr.length])
		);
		let wedgeColors = ["#314f69", "#e35536"];
		wedges.forEach((w,i) => w.setAttribute("fill", wedgeColors[i%2]));
		wedges.forEach(w => sketch.sectorLayer.appendChild(w));
	}

	// const alternatingAngleSum = function() {
	// 	// only computes if number of interior angles are even
	// 	if(_angles.length % 2 != 0){ return undefined; }
	// 	let sums = [0, 0];
	// 	_angles.forEach((angle,i) => sums[i%2] += angle );
	// 	return sums;
	// }

	const sectors = function() {
		return clockwise_order.map((_,i,arr) => Sector(_center, _points[clockwise_order[i]], _points[clockwise_order[(i+1)%clockwise_order.length]]));
	}

	const alternatingAngleSum = function() {
		let interior = sectors().map(s => s.angle)
		return [
			interior.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0),
			interior.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0)
		];
	}

	const kawasaki_solutions = function(graph, vertex) {
		let vectors = vertex_adjacent_vectors(graph, vertex);
		let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
		// get the interior angles of sectors around a vertex
		return vectors.map((v,i,arr) => {
			let nextV = arr[(i+1)%arr.length];
			return Geometry.counter_clockwise_angle2(v, nextV);
		}).map((_, i, arr) => {
			// for every sector, get an array of all the OTHER sectors
			let a = arr.slice();
			a.splice(i,1);
			return a;
		}).map(a => kawasaki_from_even(a))
		.map((kawasakis, i, arr) =>
			// change these relative angle solutions to absolute angles
			(kawasakis == null
				? undefined
				: vectors_as_angles[i] + kawasakis[1])
		).map(k => (k === undefined)
			// convert to vectors
			? undefined
			: [Math.cos(k), Math.sin(k)]
		);
	}


	return Object.freeze( {
		kawasaki,
		alternatingAngleSum,
		sectors,
		get points() { return _points; },
		get vectors() { return _vectors; },
		get angles() { return _angles; },
	} );
}

Junction.fromVectors = function(points) {
	return Junction([0,0], points);
}


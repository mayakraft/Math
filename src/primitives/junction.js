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
	clockwise_order = clockwise_order
		.slice(clockwise_order.indexOf(0), clockwise_order.length)
		.concat(clockwise_order.slice(0, clockwise_order.indexOf(0)));

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


	const kawasaki_from_even = function(array) {
		let even_sum = array.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0);
		let odd_sum = array.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0);
		// if (even_sum > Math.PI) { return undefined; }
		return [Math.PI - even_sum, Math.PI - odd_sum];
	}
	const kawasaki_solutions = function() {
		// get the interior angles of sectors around a vertex
		return clockwise_order.map((_,i) => {
			let thisV = _vectors[clockwise_order[i]];
			let nextV = _vectors[clockwise_order[(i+1)%clockwise_order.length]];
			return Geometry.counter_clockwise_angle2(thisV, nextV);
		}).map((_, i, arr) =>
			// for every sector, get an array of all the OTHER sectors
			arr.slice(i+1,arr.length).concat(arr.slice(0,i))
		).map(a => kawasaki_from_even(a))
		.map((kawasakis, i, arr) =>
			// change these relative angle solutions to absolute angles
			(kawasakis == null
				? undefined
				: _angles[clockwise_order[i]] + kawasakis[0])
		).map(k => (k === undefined)
			// convert to vectors
			? undefined
			: [Math.cos(k), Math.sin(k)]
		);
	}

	// return Object.freeze( {
	return {
		kawasaki,
		kawasaki_solutions,
		alternatingAngleSum,
		sectors,
		get center() { return _center; },
		get points() { return _points; },
		get vectors() { return _vectors; },
		get angles() { return _angles; },
	};
}

Junction.fromVectors = function(center, vectors) {
	let points = Input.get_array_of_vec(vectors)
		.map(v => v.map((n,i) => n + center[i]))
	return Junction(center, points);
}


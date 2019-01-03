import * as Input from '../parse/input';
import * as Intersection from '../core/intersection';

export function Circle(){
	let _origin, _radius;

	let params = Array.from(arguments);
	let numbers = params.filter((param) => !isNaN(param));
	if(numbers.length == 3){
		_origin = numbers.slice(0,2);
		_radius = numbers[2];
	}

	const intersectionLine = function(){
		let line = Input.get_line(...arguments);
		let point2 = [
			line.point[0] + line.vector[0],
			line.point[1] + line.vector[1]
		];
		let intersection = Intersection.intersection_circle_line(_origin, _radius, line.point, point2);
		return Vector(intersection);
	}

	const intersectionEdge = function(){
		let points = Input.get_two_vec2(...arguments);
		let intersection = Intersection.intersection_circle_line(_origin, _radius, points[0], points[1]);
		return Vector(intersection);
	}

	return Object.freeze( {
		intersectionLine,
		intersectionEdge,
		get origin() { return _origin; },
		get radius() { return _radius; },
	} );
}


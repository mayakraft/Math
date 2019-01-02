
export function Line(){
	let {point, vector} = Input.get_line(...arguments);

	const isParallel = function(){
		let line = Input.get_line(...arguments);
		return Core.parallel(vector, line.vector);
	}
	const transform = function(){
		let mat = Input.get_matrix(...arguments);
		// todo: a little more elegant of a solution, please
		let norm = Core.normalize(vector);
		let temp = point.map((p,i) => p + norm[i])
		if(temp == null){ return; }
		var p0 = Core.multiply_vector2_matrix2(point, mat);
		var p1 = Core.multiply_vector2_matrix2(temp, mat);
		return Line.withPoints([p0, p1]);
	}

	return Object.freeze( {
		isParallel,
		transform,
		get vector() { return vector; },
		get point() { return point; },
	} );
}
// static methods
Line.withPoints = function(){
	let points = Input.get_two_vec2(...arguments);
	return Line({
		point: points[0],
		vector: Core.normalize([
			points[1][0] - points[0][0],
			points[1][1] - points[0][1]
		])
	});
}
Line.perpendicularBisector = function() {
	let points = Input.get_two_vec2(...arguments);
	let vec = Core.normalize([
		points[1][0] - points[0][0],
		points[1][1] - points[0][1]
	]);
	return Line({
		point: Core.midpoint(points[0], points[1]),
		vector: [vec[1], -vec[0]]
		// vector: Core.cross3(vec, [0,0,1])
	});
}


export function Ray(){
	let {point, vector} = Input.get_line(...arguments);

	return Object.freeze( {
		get vector() { return vector; },
		get point() { return point; },
		get origin() { return point; },
	} );
}
// static methods
Ray.withPoints = function(){
	let points = Input.get_two_vec2(...arguments);
	return Ray({
		point: points[0],
		vector: Core.normalize([
			points[1][0] - points[0][0],
			points[1][1] - points[0][1]
		])
	});
}


export function Edge(){
	let _endpoints = Input.get_two_vec2(...arguments);

	const vector = function(){
		return Vector(
			_endpoints[1][0] - _endpoints[0][0],
			_endpoints[1][1] - _endpoints[0][1]
		);
	}

	const length = function() {
		return Math.sqrt(Math.pow(_endpoints[1][0] - _endpoints[0][0],2)
		               + Math.pow(_endpoints[1][1] - _endpoints[0][1],2));
	}

	const nearestPoint = function() {
		let point = Input.get_vec(...arguments);
		var answer = nearestPointNormalTo(...arguments);
		return (answer == null)
			? Vector(_endpoints.map(p => ({
					point: p,
					d: Math.sqrt(Math.pow(p[0] - point[0],2) + Math.pow(p[1] - point[1],2))
				}))
				.sort((a,b) => a.d - b.d)
				.shift()
				.point)
			: answer;
	}
	const nearestPointNormalTo = function() {
		let point = Input.get_vec(...arguments);
		let p = length();
		var u = ((point[0]-_endpoints[0][0]) * (_endpoints[1][0]-_endpoints[0][0])
		       + (point[1]-_endpoints[0][1]) * (_endpoints[1][1]-_endpoints[0][1]))
		       / (Math.pow(p, 2) );
		return (u < 0 || u > 1.0)
			? undefined
			: Vector(_endpoints[0][0] + u*(_endpoints[1][0]-_endpoints[0][0]),
		             _endpoints[0][1] + u*(_endpoints[1][1]-_endpoints[0][1]) );
	}

	return Object.freeze( {
		vector,
		length,
		nearestPoint,
		nearestPointNormalTo,
		get endpoints() { return _endpoints; },
	} );
}


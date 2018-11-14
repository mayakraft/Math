// Geometry for .fold file origami

// all points are array syntax [x,y]
// all edges are array syntax [[x,y], [x,y]]
// all infinite lines are defined as point and vector, both [x,y]
// all polygons are an ordered set of points ([x,y]), either winding direction

export const EPSILON_LOW  = 3e-6;
export const EPSILON      = 1e-10;
export const EPSILON_HIGH = 1e-14;

export function normalize(v) {
	let m = magnitude(v);
	return v.map(c => c / m);
}
export function magnitude(v) {
	let sum = v
		.map(component => component * component)
		.reduce((prev,curr) => prev + curr);
	return Math.sqrt(sum);
}


// these require that the two arguments are the same size.
// also valid is the second argument larger than the first
// the extra will get ignored as the iterator maps to the first length
export function dot(a, b) {
	return a
		.map((ai,i) => ai * b[i])
		.reduce((prev,curr) => prev + curr, 0);
}


/** apply a matrix transform on a point */
export function multiply_vector2_matrix2(vector, matrix){
	return [ vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
	         vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5] ];
}

/** 
 * These all standardize a row-column order
 */
export function make_matrix2_reflection(vector, origin){
	// the line of reflection passes through origin, runs along vector
	let angle = Math.atan2(vector[1], vector[0]);
	let cosAngle = Math.cos(angle);
	let sinAngle = Math.sin(angle);
	let _cosAngle = Math.cos(-angle);
	let _sinAngle = Math.sin(-angle);
	let a = cosAngle *  _cosAngle +  sinAngle * _sinAngle;
	let b = cosAngle * -_sinAngle +  sinAngle * _cosAngle;
	let c = sinAngle *  _cosAngle + -cosAngle * _sinAngle;
	let d = sinAngle * -_sinAngle + -cosAngle * _cosAngle;
	let tx = origin[0] + a * -origin[0] + -origin[1] * c;
	let ty = origin[1] + b * -origin[0] + -origin[1] * d;
	return [a, b, c, d, tx, ty];
}
export function make_matrix2_rotation(angle, origin){
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	var c = -Math.sin(angle);
	var d = Math.cos(angle);
	var tx = (origin != null) ? origin[0] : 0;
	var ty = (origin != null) ? origin[1] : 0;
	return [a, b, c, d, tx, ty];
}
export function make_matrix2_inverse(m){
	var det = m[0] * m[3] - m[1] * m[2];
	if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])){ return undefined; }
	return [
		m[3]/det,
		-m[1]/det,
		-m[2]/det,
		m[0]/det, 
		(m[2]*m[5] - m[3]*m[4])/det,
		(m[1]*m[4] - m[0]*m[5])/det
	];
}
export function multiply_matrices2(m1, m2){
	let a = m1[0] * m2[0] + m1[2] * m2[1];
	let c = m1[0] * m2[2] + m1[2] * m2[3];
	let tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	let b = m1[1] * m2[0] + m1[3] * m2[1];
	let d = m1[1] * m2[2] + m1[3] * m2[3];
	let ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
	return [a, b, c, d, tx, ty];
}

// these are all hard-coded to certain vector lengths
// the length is specified by the number at the end of the function name

/** are two points equivalent within an epsilon */
export function equivalent2(a, b, epsilon = EPSILON){
	// rectangular bounds test for faster calculation
	return Math.abs(a[0]-b[0]) < epsilon && Math.abs(a[1]-b[1]) < epsilon;
}

function midpoint2(a, b){
	var aZ = a[2] == null ? 0 : a[2];
	var bZ = b[2] == null ? 0 : b[2];
	return [(a[0]+b[0])*0.5, (a[1]+b[1])*0.5, (aZ+bZ)*0.5];
}
function cross2(a, b){
	return [
		a[1]*b[2] - a[2]*b[1],
		a[2]*b[0] - a[0]*b[2],
		a[0]*b[1] - a[1]*b[0]
	];
}

function distance2(a, b){
	return Math.sqrt(
		Math.pow(a[0] - b[0], 2) +
		Math.pow(a[1] - b[1], 2)
	);
}

function distance3(a, b){
	return Math.sqrt(
		Math.pow(a[0] - b[0], 2) +
		Math.pow(a[1] - b[1], 2) +
		Math.pow(a[2] - b[2], 2)
	);
}



function bisect_lines(a, b){
	if( a.parallel(b) ){
		return [new Line( a.point.midpoint(b.point), a.direction)];
	} else{
		var intersection = intersectionLineLine(a, b);
		var vectors = bisectVectors(a.direction, b.direction);
		vectors[1] = vectors[1].rotate90();
		if(Math.abs(a.direction.cross(vectors[1])) < Math.abs(a.direction.cross(vectors[0]))){
			var swap = vectors[0];
			vectors[0] = vectors[1];
			vectors[1] = swap;
		}
		return vectors.map((el) => new Line(intersection, el));
	}
}

// function gimme1Edge(a, b, c, d){
// 	// input is 1 edge, 2 XY, or 4 numbers
// 	if(a instanceof M.Edge){ return a; }
// 	if(a.nodes !== undefined){ return new M.Edge(a.nodes[0], a.nodes[1]); }
// 	if(isValidPoint(b) ){ return new M.Edge(a,b); }
// 	if(isValidNumber(d)){ return new M.Edge(a,b,c,d); }
// }

function axiom1(){
	return Line.betweenPoints(...arguments);
}
function axiom2(){
	return Line.perpendicularBisector(...arguments);
}
function axiom3(one, two){
	return new M.Edge(one)
		.infiniteLine()
		.bisect(new M.Edge(two).infiniteLine())
		.map(function (line) { return new CPLine(this, line); }, this);
}
function axiom4(line, point){
	return new CPLine(this, new M.Line(point, new M.Edge(line).vector().rotate90()));
}
function axiom5(origin, point, line){
	var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
	var intersections = new M.Circle(origin, radius).intersection(new M.Edge(line).infiniteLine());
	var lines = [];
	for(var i = 0; i < intersections.length; i++){ lines.push(this.axiom2(point, intersections[i])); }
	return lines;
}

function axiom7(point, ontoLine, perp){
	var newLine = new M.Line(point, new M.Edge(perp).vector());
	var intersection = newLine.intersection(new M.Edge(ontoLine).infiniteLine());
	if(intersection === undefined){ return undefined; }
	return this.axiom2(point, intersection);
};

// need to test:
// do two polygons overlap if they share a point in common? share an edge?



import { midpoint, normalize } from "./algebra";
import { bisect_lines2 } from "./geometry";

export function axiom1(a, b) {
	// n-dimension
	return [a, a.map((_,i) => b[i] - a[i])];
}
export function axiom2(a, b) {
	// 2-dimension
	let mid = midpoint(a, b);
	let vec = a.map((_,i) => b[i] - a[i]);
	return [mid, [vec[1], -vec[0]] ];
}
export function axiom3(pointA, vectorA, pointB, vectorB){
	return bisect_lines2(pointA, vectorA, pointB, vectorB);
}
export function axiom4(pointA, vectorA, pointB) {
	let norm = normalize(vectorA);
	let rightAngle = [norm[1], -norm[0]];
	return [[...pointB], rightAngle];
}
export function axiom5(pointA, vectorA, pointB, pointC) {
	// var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
	// var intersections = new M.Circle(origin, radius).intersection(new M.Edge(line).infiniteLine());
	// var lines = [];
	// for(var i = 0; i < intersections.length; i++){ lines.push(this.axiom2(point, intersections[i])); }
	// return lines;
}
export function axiom6(pointA, vectorA, pointB, vectorB, pointC, pointD) {
}
export function axiom7(pointA, vectorA, pointB, vectorB, pointC) {
	// var newLine = new M.Line(point, new M.Edge(perp).vector());
	// var intersection = newLine.intersection(new M.Edge(ontoLine).infiniteLine());
	// if(intersection === undefined){ return undefined; }
	// return this.axiom2(point, intersection);
};

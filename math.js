/* Math (c) Kraft, MIT License */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.math=f());})(this,(function(){'use strict';const EPSILON = 1e-6;
const R2D = 180 / Math.PI;
const D2R = Math.PI / 180;
const TWO_PI = Math.PI * 2;const constants=/*#__PURE__*/Object.freeze({__proto__:null,EPSILON,R2D,D2R,TWO_PI});const fnTrue = () => true;
const fnSquare = n => n * n;
const fnAdd = (a, b) => a + (b || 0);
const fnNotUndefined = a => a !== undefined;
const fnAnd = (a, b) => a && b;
const fnCat = (a, b) => a.concat(b);
const fnVec2Angle = v => Math.atan2(v[1], v[0]);
const fnToVec2 = a => [Math.cos(a), Math.sin(a)];
const fnEqual = (a, b) => a === b;
const fnEpsilonEqual = (a, b, epsilon = EPSILON) => Math.abs(a - b) < epsilon;
const fnEpsilonSort = (a, b, epsilon = EPSILON) => (
	fnEpsilonEqual(a, b, epsilon) ? 0 : Math.sign(b - a)
);
const fnEpsilonEqualVectors = (a, b, epsilon = EPSILON) => {
	for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
		if (!fnEpsilonEqual(a[i] || 0, b[i] || 0, epsilon)) { return false; }
	}
	return true;
};
const include = (n, epsilon = EPSILON) => n > -epsilon;
const exclude = (n, epsilon = EPSILON) => n > epsilon;
const includeL = fnTrue;
const excludeL = fnTrue;
const includeR = include;
const excludeR = exclude;
const includeS = (t, e = EPSILON) => t > -e && t < 1 + e;
const excludeS = (t, e = EPSILON) => t > e && t < 1 - e;
const clampLine = dist => dist;
const clampRay = dist => (dist < -EPSILON ? 0 : dist);
const clampSegment = (dist) => {
	if (dist < -EPSILON) { return 0; }
	if (dist > 1 + EPSILON) { return 1; }
	return dist;
};const functions=/*#__PURE__*/Object.freeze({__proto__:null,fnTrue,fnSquare,fnAdd,fnNotUndefined,fnAnd,fnCat,fnVec2Angle,fnToVec2,fnEqual,fnEpsilonEqual,fnEpsilonSort,fnEpsilonEqualVectors,include,exclude,includeL,excludeL,includeR,excludeR,includeS,excludeS,clampLine,clampRay,clampSegment});const magnitude = v => Math.sqrt(v
	.map(fnSquare)
	.reduce(fnAdd, 0));
const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
const magnitude3 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
const magSquared = v => v
	.map(fnSquare)
	.reduce(fnAdd, 0);
const normalize = (v) => {
	const m = magnitude(v);
	return m === 0 ? v : v.map(c => c / m);
};
const normalize2 = (v) => {
	const m = magnitude2(v);
	return m === 0 ? v : [v[0] / m, v[1] / m];
};
const normalize3 = (v) => {
	const m = magnitude3(v);
	return m === 0 ? v : [v[0] / m, v[1] / m, v[2] / m];
};
const scale = (v, s) => v.map(n => n * s);
const scale2 = (v, s) => [v[0] * s, v[1] * s];
const scale3 = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
const add3 = (v, u) => [v[0] + u[0], v[1] + u[1], v[2] + u[2]];
const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
const subtract3 = (v, u) => [v[0] - u[0], v[1] - u[1], v[2] - u[2]];
const dot = (v, u) => v
	.map((_, i) => v[i] * u[i])
	.reduce(fnAdd, 0);
const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
const dot3 = (v, u) => v[0] * u[0] + v[1] * u[1] + v[2] * u[2];
const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
const midpoint3 = (v, u) => scale3(add3(v, u), 0.5);
const average = function () {
	if (arguments.length === 0) { return []; }
	const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
	const sum = Array(dimension).fill(0);
	Array.from(arguments)
		.forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
	return sum.map(n => n / arguments.length);
};
const lerp = (v, u, t) => {
	const inv = 1.0 - t;
	return v.map((n, i) => n * inv + (u[i] || 0) * t);
};
const cross2 = (v, u) => v[0] * u[1] - v[1] * u[0];
const cross3 = (v, u) => [
	v[1] * u[2] - v[2] * u[1],
	v[2] * u[0] - v[0] * u[2],
	v[0] * u[1] - v[1] * u[0],
];
const distance = (v, u) => Math.sqrt(v
	.map((_, i) => (v[i] - u[i]) ** 2)
	.reduce(fnAdd, 0));
const distance2 = (v, u) => {
	const p = v[0] - u[0];
	const q = v[1] - u[1];
	return Math.sqrt((p * p) + (q * q));
};
const distance3 = (v, u) => {
	const a = v[0] - u[0];
	const b = v[1] - u[1];
	const c = v[2] - u[2];
	return Math.sqrt((a * a) + (b * b) + (c * c));
};
const flip = v => v.map(n => -n);
const rotate90 = v => [-v[1], v[0]];
const rotate270 = v => [v[1], -v[0]];
const degenerate = (v, epsilon = EPSILON) => v
	.map(n => Math.abs(n))
	.reduce(fnAdd, 0) < epsilon;
const parallelNormalized = (v, u, epsilon = EPSILON) => 1 - Math
	.abs(dot(v, u)) < epsilon;
const parallel = (v, u, epsilon = EPSILON) => parallelNormalized(
	normalize(v),
	normalize(u),
	epsilon,
);
const parallel2 = (v, u, epsilon = EPSILON) => Math
	.abs(cross2(v, u)) < epsilon;const vectors=/*#__PURE__*/Object.freeze({__proto__:null,magnitude,magnitude2,magnitude3,magSquared,normalize,normalize2,normalize3,scale,scale2,scale3,add,add2,add3,subtract,subtract2,subtract3,dot,dot2,dot3,midpoint,midpoint2,midpoint3,average,lerp,cross2,cross3,distance,distance2,distance3,flip,rotate90,rotate270,degenerate,parallelNormalized,parallel,parallel2});const resize = (d, v) => (v.length === d
	? v
	: Array(d).fill(0).map((z, i) => (v[i] ? v[i] : z)));
const resizeUp = (a, b) => [a, b]
	.map(v => resize(Math.max(a.length, b.length), v));
const countPlaces = function (num) {
	const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	if (!m) { return 0; }
	return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};
const cleanNumber = function (num, places = 15) {
	if (typeof num !== "number") { return num; }
	const crop = parseFloat(num.toFixed(places));
	if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
		return num;
	}
	return crop;
};
const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
const semiFlattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? semiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...semiFlattenArrays(a)]
			: a));
	}
};
const flattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).reduce((a, b) => a.concat(b), []);
	}
};const resizers=/*#__PURE__*/Object.freeze({__proto__:null,resize,resizeUp,cleanNumber,semiFlattenArrays,flattenArrays});const smallestComparisonSearch = (obj, array, compare_func) => {
	const objs = array.map((o, i) => ({ i, d: compare_func(obj, o) }));
	let index;
	let smallest_value = Infinity;
	for (let i = 0; i < objs.length; i += 1) {
		if (objs[i].d < smallest_value) {
			index = i;
			smallest_value = objs[i].d;
		}
	}
	return index;
};
const minimumAxisIndices = (vectors, axis = 0, compFn = fnEpsilonSort, epsilon = EPSILON) => {
	let smallSet = [0];
	for (let i = 1; i < vectors.length; i += 1) {
		switch (compFn(vectors[i][axis], vectors[smallSet[0]][axis], epsilon)) {
		case 0: smallSet.push(i); break;
		case 1: smallSet = [i]; break;
		}
	}
	return smallSet;
};
const minimum2DPointIndex = (points, epsilon = EPSILON) => {
	if (!points.length) { return undefined; }
	const smallSet = minimumAxisIndices(points, 0, fnEpsilonSort, epsilon);
	let sm = 0;
	for (let i = 1; i < smallSet.length; i += 1) {
		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
	}
	return smallSet[sm];
};
const nearestPoint2 = (point, array_of_points) => {
	const index = smallestComparisonSearch(point, array_of_points, distance2);
	return index === undefined ? undefined : array_of_points[index];
};
const nearestPoint = (point, array_of_points) => {
	const index = smallestComparisonSearch(point, array_of_points, distance);
	return index === undefined ? undefined : array_of_points[index];
};
const nearestPointOnLine = (vector, origin, point, limiterFunc, epsilon = EPSILON) => {
	origin = resize(vector.length, origin);
	point = resize(vector.length, point);
	const magSq = magSquared(vector);
	const vectorToPoint = subtract(point, origin);
	const dotProd = dot(vector, vectorToPoint);
	const dist = dotProd / magSq;
	const d = limiterFunc(dist, epsilon);
	return add(origin, scale(vector, d));
};
const nearestPointOnPolygon = (polygon, point) => {
	const v = polygon
		.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
	return polygon
		.map((p, i) => nearestPointOnLine(v[i], p, point, clampSegment))
		.map((p, i) => ({ point: p, i, distance: distance(p, point) }))
		.sort((a, b) => a.distance - b.distance)
		.shift();
};
const nearestPointOnCircle = (radius, origin, point) => (
	add(origin, scale(normalize(subtract(point, origin)), radius)));const nearest=/*#__PURE__*/Object.freeze({__proto__:null,smallestComparisonSearch,minimum2DPointIndex,nearestPoint2,nearestPoint,nearestPointOnLine,nearestPointOnPolygon,nearestPointOnCircle});const sortPointsAlongVector2 = (points, vector) => points
	.map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
	.sort((a, b) => a.d - b.d)
	.map(a => a.point);
const clusterIndicesOfSortedNumbers = (numbers, epsilon = EPSILON) => {
	const clusters = [[0]];
	let clusterIndex = 0;
	for (let i = 1; i < numbers.length; i += 1) {
		if (fnEpsilonEqual(numbers[i], numbers[i - 1], epsilon)) {
			clusters[clusterIndex].push(i);
		} else {
			clusterIndex = clusters.length;
			clusters.push([i]);
		}
	}
	return clusters;
};
const radialSortPointIndices = (points = [], epsilon = EPSILON) => {
	const first = minimum2DPointIndex(points, epsilon);
	const angles = points
		.map(p => subtract2(p, points[first]))
		.map(v => normalize2(v))
		.map(vec => dot2([0, 1], vec));
	const rawOrder = angles
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.filter(i => i !== first);
	return [[first]]
		.concat(clusterIndicesOfSortedNumbers(rawOrder.map(i => angles[i]), epsilon)
			.map(arr => arr.map(i => rawOrder[i]))
			.map(cluster => (cluster.length === 1 ? cluster : cluster
				.map(i => ({ i, len: distance2(points[i], points[first]) }))
				.sort((a, b) => a.len - b.len)
				.map(el => el.i))));
};const sortMethods=/*#__PURE__*/Object.freeze({__proto__:null,sortPointsAlongVector2,clusterIndicesOfSortedNumbers,radialSortPointIndices});const identity2x2 = [1, 0, 0, 1];
const identity2x3 = identity2x2.concat(0, 0);
const multiplyMatrix2Vector2 = (matrix, vector) => [
	matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
	matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5],
];
const multiplyMatrix2Line2 = (matrix, vector, origin) => ({
	vector: [
		matrix[0] * vector[0] + matrix[2] * vector[1],
		matrix[1] * vector[0] + matrix[3] * vector[1],
	],
	origin: [
		matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
		matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5],
	],
});
const multiplyMatrices2 = (m1, m2) => [
	m1[0] * m2[0] + m1[2] * m2[1],
	m1[1] * m2[0] + m1[3] * m2[1],
	m1[0] * m2[2] + m1[2] * m2[3],
	m1[1] * m2[2] + m1[3] * m2[3],
	m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
	m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];
const determinant2 = m => m[0] * m[3] - m[1] * m[2];
const invertMatrix2 = (m) => {
	const det = determinant2(m);
	if (Math.abs(det) < 1e-6
		|| Number.isNaN(det)
		|| !Number.isFinite(m[4])
		|| !Number.isFinite(m[5])) {
		return undefined;
	}
	return [
		m[3] / det,
		-m[1] / det,
		-m[2] / det,
		m[0] / det,
		(m[2] * m[5] - m[3] * m[4]) / det,
		(m[1] * m[4] - m[0] * m[5]) / det,
	];
};
const makeMatrix2Translate = (x = 0, y = 0) => identity2x2.concat(x, y);
const makeMatrix2Scale = (scale = [1, 1], origin = [0, 0]) => [
	scale[0],
	0,
	0,
	scale[1],
	scale[0] * -origin[0] + origin[0],
	scale[1] * -origin[1] + origin[1],
];
const makeMatrix2Rotate = (angle, origin = [0, 0]) => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return [
		cos,
		sin,
		-sin,
		cos,
		origin[0],
		origin[1],
	];
};
const makeMatrix2Reflect = (vector, origin = [0, 0]) => {
	const angle = Math.atan2(vector[1], vector[0]);
	const cosAngle = Math.cos(angle);
	const sinAngle = Math.sin(angle);
	const cos_Angle = Math.cos(-angle);
	const sin_Angle = Math.sin(-angle);
	const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
	const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
	const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
	const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
	const tx = origin[0] + a * -origin[0] + -origin[1] * c;
	const ty = origin[1] + b * -origin[0] + -origin[1] * d;
	return [a, b, c, d, tx, ty];
};const matrix2=/*#__PURE__*/Object.freeze({__proto__:null,identity2x2,identity2x3,multiplyMatrix2Vector2,multiplyMatrix2Line2,multiplyMatrices2,determinant2,invertMatrix2,makeMatrix2Translate,makeMatrix2Scale,makeMatrix2Rotate,makeMatrix2Reflect});const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
const identity3x4 = Object.freeze(identity3x3.concat(0, 0, 0));
const isIdentity3x4 = m => identity3x4
	.map((n, i) => Math.abs(n - m[i]) < EPSILON)
	.reduce((a, b) => a && b, true);
const multiplyMatrix3Vector3 = (m, vector) => [
	m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
	m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
	m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11],
];
const multiplyMatrix3Line3 = (m, vector, origin) => ({
	vector: [
		m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
		m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
		m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2],
	],
	origin: [
		m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
		m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
		m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11],
	],
});
const multiplyMatrices3 = (m1, m2) => [
	m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2],
	m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2],
	m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2],
	m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5],
	m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5],
	m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5],
	m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8],
	m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8],
	m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8],
	m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9],
	m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10],
	m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11],
];
const determinant3 = m => (
	m[0] * m[4] * m[8]
	- m[0] * m[7] * m[5]
	- m[3] * m[1] * m[8]
	+ m[3] * m[7] * m[2]
	+ m[6] * m[1] * m[5]
	- m[6] * m[4] * m[2]
);
const invertMatrix3 = (m) => {
	const det = determinant3(m);
	if (Math.abs(det) < 1e-6 || Number.isNaN(det)
		|| !Number.isFinite(m[9]) || !Number.isFinite(m[10]) || !Number.isFinite(m[11])) {
		return undefined;
	}
	const inv = [
		m[4] * m[8] - m[7] * m[5],
		-m[1] * m[8] + m[7] * m[2],
		m[1] * m[5] - m[4] * m[2],
		-m[3] * m[8] + m[6] * m[5],
		m[0] * m[8] - m[6] * m[2],
		-m[0] * m[5] + m[3] * m[2],
		m[3] * m[7] - m[6] * m[4],
		-m[0] * m[7] + m[6] * m[1],
		m[0] * m[4] - m[3] * m[1],
		-m[3] * m[7] * m[11] + m[3] * m[8] * m[10] + m[6] * m[4] * m[11]
			- m[6] * m[5] * m[10] - m[9] * m[4] * m[8] + m[9] * m[5] * m[7],
		m[0] * m[7] * m[11] - m[0] * m[8] * m[10] - m[6] * m[1] * m[11]
			+ m[6] * m[2] * m[10] + m[9] * m[1] * m[8] - m[9] * m[2] * m[7],
		-m[0] * m[4] * m[11] + m[0] * m[5] * m[10] + m[3] * m[1] * m[11]
			- m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4],
	];
	const invDet = 1.0 / det;
	return inv.map(n => n * invDet);
};
const makeMatrix3Translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);
const singleAxisRotate = (angle, origin, i0, i1, sgn) => {
	const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	mat[i0 * 3 + i0] = cos;
	mat[i0 * 3 + i1] = (sgn ? +1 : -1) * sin;
	mat[i1 * 3 + i0] = (sgn ? -1 : +1) * sin;
	mat[i1 * 3 + i1] = cos;
	return mat;
};
const makeMatrix3RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 1, 2, true));
const makeMatrix3RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 2, false));
const makeMatrix3RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 1, true));
const makeMatrix3Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize(vector));
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	const t = 1 - c;
	const trans = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
	const trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
	return multiplyMatrices3(trans_inv, multiplyMatrices3([
		t * x * x + c,     t * y * x + z * s, t * z * x - y * s,
		t * x * y - z * s, t * y * y + c,     t * z * y + x * s,
		t * x * z + y * s, t * y * z - x * s, t * z * z + c,
		0, 0, 0], trans));
};
const makeMatrix3Scale = (scale = [1, 1, 1], origin = [0, 0, 0]) => [
	scale[0], 0, 0,
	0, scale[1], 0,
	0, 0, scale[2],
	scale[0] * -origin[0] + origin[0],
	scale[1] * -origin[1] + origin[1],
	scale[2] * -origin[2] + origin[2],
];
const makeMatrix3ReflectZ = (vector, origin = [0, 0]) => {
	const m = makeMatrix2Reflect(vector, origin);
	return [m[0], m[1], 0, m[2], m[3], 0, 0, 0, 1, m[4], m[5], 0];
};const matrix3=/*#__PURE__*/Object.freeze({__proto__:null,identity3x3,identity3x4,isIdentity3x4,multiplyMatrix3Vector3,multiplyMatrix3Line3,multiplyMatrices3,determinant3,invertMatrix3,makeMatrix3Translate,makeMatrix3RotateX,makeMatrix3RotateY,makeMatrix3RotateZ,makeMatrix3Rotate,makeMatrix3Scale,makeMatrix3ReflectZ});const identity4x4 = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
const isIdentity4x4 = m => identity4x4
	.map((n, i) => Math.abs(n - m[i]) < EPSILON)
	.reduce((a, b) => a && b, true);
const multiplyMatrix4Vector3 = (m, vector) => [
	m[0] * vector[0] + m[4] * vector[1] + m[8] * vector[2] + m[12],
	m[1] * vector[0] + m[5] * vector[1] + m[9] * vector[2] + m[13],
	m[2] * vector[0] + m[6] * vector[1] + m[10] * vector[2] + m[14],
];
const multiplyMatrix4Line3 = (m, vector, origin) => ({
	vector: [
		m[0] * vector[0] + m[4] * vector[1] + m[8] * vector[2],
		m[1] * vector[0] + m[5] * vector[1] + m[9] * vector[2],
		m[2] * vector[0] + m[6] * vector[1] + m[10] * vector[2],
	],
	origin: [
		m[0] * origin[0] + m[4] * origin[1] + m[8] * origin[2] + m[12],
		m[1] * origin[0] + m[5] * origin[1] + m[9] * origin[2] + m[13],
		m[2] * origin[0] + m[6] * origin[1] + m[10] * origin[2] + m[14],
	],
});
const multiplyMatrices4 = (m1, m2) => [
	m1[0] * m2[0] + m1[4] * m2[1] + m1[8] * m2[2] + m1[12] * m2[3],
	m1[1] * m2[0] + m1[5] * m2[1] + m1[9] * m2[2] + m1[13] * m2[3],
	m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2] + m1[14] * m2[3],
	m1[3] * m2[0] + m1[7] * m2[1] + m1[11] * m2[2] + m1[15] * m2[3],
	m1[0] * m2[4] + m1[4] * m2[5] + m1[8] * m2[6] + m1[12] * m2[7],
	m1[1] * m2[4] + m1[5] * m2[5] + m1[9] * m2[6] + m1[13] * m2[7],
	m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6] + m1[14] * m2[7],
	m1[3] * m2[4] + m1[7] * m2[5] + m1[11] * m2[6] + m1[15] * m2[7],
	m1[0] * m2[8] + m1[4] * m2[9] + m1[8] * m2[10] + m1[12] * m2[11],
	m1[1] * m2[8] + m1[5] * m2[9] + m1[9] * m2[10] + m1[13] * m2[11],
	m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10] + m1[14] * m2[11],
	m1[3] * m2[8] + m1[7] * m2[9] + m1[11] * m2[10] + m1[15] * m2[11],
	m1[0] * m2[12] + m1[4] * m2[13] + m1[8] * m2[14] + m1[12] * m2[15],
	m1[1] * m2[12] + m1[5] * m2[13] + m1[9] * m2[14] + m1[13] * m2[15],
	m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14] * m2[15],
	m1[3] * m2[12] + m1[7] * m2[13] + m1[11] * m2[14] + m1[15] * m2[15],
];
const determinant4 = m => {
	const A2323 = m[10] * m[15] - m[11] * m[14];
	const A1323 = m[9] * m[15] - m[11] * m[13];
	const A1223 = m[9] * m[14] - m[10] * m[13];
	const A0323 = m[8] * m[15] - m[11] * m[12];
	const A0223 = m[8] * m[14] - m[10] * m[12];
	const A0123 = m[8] * m[13] - m[9] * m[12];
	return (
			m[0] * (m[5] * A2323 - m[6] * A1323 + m[7] * A1223)
		- m[1] * (m[4] * A2323 - m[6] * A0323 + m[7] * A0223)
		+ m[2] * (m[4] * A1323 - m[5] * A0323 + m[7] * A0123)
		- m[3] * (m[4] * A1223 - m[5] * A0223 + m[6] * A0123)
	);
};
const invertMatrix4 = (m) => {
	const det = determinant4(m);
	if (Math.abs(det) < 1e-6 || Number.isNaN(det)
		|| !Number.isFinite(m[12]) || !Number.isFinite(m[13]) || !Number.isFinite(m[14])) {
		return undefined;
	}
	const A2323 = m[10] * m[15] - m[11] * m[14];
	const A1323 = m[9] * m[15] - m[11] * m[13];
	const A1223 = m[9] * m[14] - m[10] * m[13];
	const A0323 = m[8] * m[15] - m[11] * m[12];
	const A0223 = m[8] * m[14] - m[10] * m[12];
	const A0123 = m[8] * m[13] - m[9] * m[12];
	const A2313 = m[6] * m[15] - m[7] * m[14];
	const A1313 = m[5] * m[15] - m[7] * m[13];
	const A1213 = m[5] * m[14] - m[6] * m[13];
	const A2312 = m[6] * m[11] - m[7] * m[10];
	const A1312 = m[5] * m[11] - m[7] * m[9];
	const A1212 = m[5] * m[10] - m[6] * m[9];
	const A0313 = m[4] * m[15] - m[7] * m[12];
	const A0213 = m[4] * m[14] - m[6] * m[12];
	const A0312 = m[4] * m[11] - m[7] * m[8];
	const A0212 = m[4] * m[10] - m[6] * m[8];
	const A0113 = m[4] * m[13] - m[5] * m[12];
	const A0112 = m[4] * m[9] - m[5] * m[8];
	const inv = [
		+(m[5] * A2323 - m[6] * A1323 + m[7] * A1223),
		-(m[1] * A2323 - m[2] * A1323 + m[3] * A1223),
		+(m[1] * A2313 - m[2] * A1313 + m[3] * A1213),
		-(m[1] * A2312 - m[2] * A1312 + m[3] * A1212),
		-(m[4] * A2323 - m[6] * A0323 + m[7] * A0223),
		+(m[0] * A2323 - m[2] * A0323 + m[3] * A0223),
		-(m[0] * A2313 - m[2] * A0313 + m[3] * A0213),
		+(m[0] * A2312 - m[2] * A0312 + m[3] * A0212),
		+(m[4] * A1323 - m[5] * A0323 + m[7] * A0123),
		-(m[0] * A1323 - m[1] * A0323 + m[3] * A0123),
		+(m[0] * A1313 - m[1] * A0313 + m[3] * A0113),
		-(m[0] * A1312 - m[1] * A0312 + m[3] * A0112),
		-(m[4] * A1223 - m[5] * A0223 + m[6] * A0123),
		+(m[0] * A1223 - m[1] * A0223 + m[2] * A0123),
		-(m[0] * A1213 - m[1] * A0213 + m[2] * A0113),
		+(m[0] * A1212 - m[1] * A0212 + m[2] * A0112),
	];
	const invDet = 1.0 / det;
	return inv.map(n => n * invDet);
};
const identity4x3 = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]);
const makeMatrix4Translate = (x = 0, y = 0, z = 0) => [...identity4x3, x, y, z, 1];
const singleAxisRotate4 = (angle, origin, i0, i1, sgn) => {
	const mat = makeMatrix4Translate(...origin);
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	mat[i0 * 4 + i0] = cos;
	mat[i0 * 4 + i1] = (sgn ? +1 : -1) * sin;
	mat[i1 * 4 + i0] = (sgn ? -1 : +1) * sin;
	mat[i1 * 4 + i1] = cos;
	return mat;
};
const makeMatrix4RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 1, 2, true));
const makeMatrix4RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 0, 2, false));
const makeMatrix4RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 0, 1, true));
const makeMatrix4Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize(vector));
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	const t = 1 - c;
	const trans = makeMatrix4Translate(-pos[0], -pos[1], -pos[2]);
	const trans_inv = makeMatrix4Translate(pos[0], pos[1], pos[2]);
	return multiplyMatrices4(trans_inv, multiplyMatrices4([
		t * x * x + c,     t * y * x + z * s, t * z * x - y * s, 0,
		t * x * y - z * s, t * y * y + c,     t * z * y + x * s, 0,
		t * x * z + y * s, t * y * z - x * s, t * z * z + c, 0,
		0, 0, 0, 1], trans));
};
const makeMatrix4Scale = (scale = [1, 1, 1], origin = [0, 0, 0]) => [
	scale[0], 0, 0, 0,
	0, scale[1], 0, 0,
	0, 0, scale[2], 0,
	scale[0] * -origin[0] + origin[0],
	scale[1] * -origin[1] + origin[1],
	scale[2] * -origin[2] + origin[2],
	1,
];
const makeMatrix4ReflectZ = (vector, origin = [0, 0]) => {
	const m = makeMatrix2Reflect(vector, origin);
	return [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, m[4], m[5], 0, 1];
};
const makePerspectiveMatrix4 = (FOV, aspect, near, far) => {
	const f = Math.tan(Math.PI * 0.5 - 0.5 * FOV);
	const rangeInv = 1.0 / (near - far);
	return [
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) * rangeInv, -1,
		0, 0, near * far * rangeInv * 2, 0,
	];
};
const makeOrthographicMatrix4 = (top, right, bottom, left, near, far) => [
	2 / (right - left), 0, 0, 0,
	0, 2 / (top - bottom), 0, 0,
	0, 0, 2 / (near - far), 0,
	(left + right) / (left - right),
	(bottom + top) / (bottom - top),
	(near + far) / (near - far),
	1,
];
const makeLookAtMatrix4 = (position, target, up) => {
	const zAxis = normalize3(subtract3(position, target));
	const xAxis = normalize3(cross3(up, zAxis));
	const yAxis = normalize3(cross3(zAxis, xAxis));
	return [
		xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], yAxis[1], yAxis[2], 0,
		zAxis[0], zAxis[1], zAxis[2], 0,
		position[0], position[1], position[2], 1,
	];
};const matrix4=/*#__PURE__*/Object.freeze({__proto__:null,identity4x4,isIdentity4x4,multiplyMatrix4Vector3,multiplyMatrix4Line3,multiplyMatrices4,determinant4,invertMatrix4,makeMatrix4Translate,makeMatrix4RotateX,makeMatrix4RotateY,makeMatrix4RotateZ,makeMatrix4Rotate,makeMatrix4Scale,makeMatrix4ReflectZ,makePerspectiveMatrix4,makeOrthographicMatrix4,makeLookAtMatrix4});const quaternionFromTwoVectors = (u, v) => {
	const w = cross3(u, v);
	const q = [w[0], w[1], w[2], dot(u, v)];
	q[3] += magnitude(q);
	return normalize(q);
};
const matrix4FromQuaternion = (quaternion) => multiplyMatrices4([
	quaternion[3], quaternion[2], -quaternion[1], quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], quaternion[2],
	-quaternion[0], -quaternion[1], -quaternion[2], quaternion[3],
], [
	quaternion[3], quaternion[2], -quaternion[1], -quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], -quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], -quaternion[2],
	quaternion[0], quaternion[1], quaternion[2], quaternion[3],
]);const quaternion=/*#__PURE__*/Object.freeze({__proto__:null,quaternionFromTwoVectors,matrix4FromQuaternion});const algebra = {
	...constants,
	...functions,
	...vectors,
	...sortMethods,
	...matrix2,
	...matrix3,
	...matrix4,
	...quaternion,
	...nearest,
};const isCounterClockwiseBetween = (angle, floor, ceiling) => {
	while (ceiling < floor) { ceiling += TWO_PI; }
	while (angle > floor) { angle -= TWO_PI; }
	while (angle < floor) { angle += TWO_PI; }
	return angle < ceiling;
};
const clockwiseAngleRadians = (a, b) => {
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const a_b = a - b;
	return (a_b >= 0)
		? a_b
		: TWO_PI - (b - a);
};
const counterClockwiseAngleRadians = (a, b) => {
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const b_a = b - a;
	return (b_a >= 0)
		? b_a
		: TWO_PI - (a - b);
};
const clockwiseAngle2 = (a, b) => {
	const dotProduct = b[0] * a[0] + b[1] * a[1];
	const determinant = b[0] * a[1] - b[1] * a[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
const counterClockwiseAngle2 = (a, b) => {
	const dotProduct = a[0] * b[0] + a[1] * b[1];
	const determinant = a[0] * b[1] - a[1] * b[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
const clockwiseBisect2 = (a, b) => fnToVec2(fnVec2Angle(a) - clockwiseAngle2(a, b) / 2);
const counterClockwiseBisect2 = (a, b) => (
	fnToVec2(fnVec2Angle(a) + counterClockwiseAngle2(a, b) / 2)
);
const clockwiseSubsectRadians = (divisions, angleA, angleB) => {
	const angle = clockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
const counterClockwiseSubsectRadians = (divisions, angleA, angleB) => {
	const angle = counterClockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
const clockwiseSubsect2 = (divisions, vectorA, vectorB) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return clockwiseSubsectRadians(divisions, angleA, angleB)
		.map(fnToVec2);
};
const counterClockwiseSubsect2 = (divisions, vectorA, vectorB) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return counterClockwiseSubsectRadians(divisions, angleA, angleB)
		.map(fnToVec2);
};
const bisectLines2 = (vectorA, originA, vectorB, originB, epsilon = EPSILON) => {
	const determinant = cross2(vectorA, vectorB);
	const dotProd = dot(vectorA, vectorB);
	const bisects = determinant > -epsilon
		? [counterClockwiseBisect2(vectorA, vectorB)]
		: [clockwiseBisect2(vectorA, vectorB)];
	bisects[1] = determinant > -epsilon
		? rotate90(bisects[0])
		: rotate270(bisects[0]);
	const numerator = (originB[0] - originA[0]) * vectorB[1] - vectorB[0] * (originB[1] - originA[1]);
	const t = numerator / determinant;
	const normalized = [vectorA, vectorB].map(vec => normalize(vec));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const origin = isParallel
		? midpoint(originA, originB)
		: [originA[0] + vectorA[0] * t, originA[1] + vectorA[1] * t];
	const solution = bisects.map(vector => ({ vector, origin }));
	if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
	return solution;
};
const counterClockwiseOrderRadians = function () {
	const radians = Array.from(arguments).flat();
	const counter_clockwise = radians
		.map((_, i) => i)
		.sort((a, b) => radians[a] - radians[b]);
	return counter_clockwise
		.slice(counter_clockwise.indexOf(0), counter_clockwise.length)
		.concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
const counterClockwiseOrder2 = function () {
	return counterClockwiseOrderRadians(
		semiFlattenArrays(arguments).map(fnVec2Angle),
	);
};
const counterClockwiseSectorsRadians = function () {
	const radians = Array.from(arguments).flat();
	const ordered = counterClockwiseOrderRadians(radians)
		.map(i => radians[i]);
	return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
		.map(pair => counterClockwiseAngleRadians(pair[0], pair[1]));
};
const counterClockwiseSectors2 = function () {
	return counterClockwiseSectorsRadians(
		semiFlattenArrays(arguments).map(fnVec2Angle),
	);
};
const threePointTurnDirection = (p0, p1, p2, epsilon = EPSILON) => {
	const v = normalize2(subtract2(p1, p0));
	const u = normalize2(subtract2(p2, p0));
	const cross = cross2(v, u);
	if (!fnEpsilonEqual(cross, 0, epsilon)) {
		return Math.sign(cross);
	}
	return fnEpsilonEqual(distance2(p0, p1) + distance2(p1, p2), distance2(p0, p2))
		? 0
		: undefined;
};const radialMethods=/*#__PURE__*/Object.freeze({__proto__:null,isCounterClockwiseBetween,clockwiseAngleRadians,counterClockwiseAngleRadians,clockwiseAngle2,counterClockwiseAngle2,clockwiseBisect2,counterClockwiseBisect2,clockwiseSubsectRadians,counterClockwiseSubsectRadians,clockwiseSubsect2,counterClockwiseSubsect2,bisectLines2,counterClockwiseOrderRadians,counterClockwiseOrder2,counterClockwiseSectorsRadians,counterClockwiseSectors2,threePointTurnDirection});const mirror = (arr) => arr.concat(arr.slice(0, -1).reverse());
const convexHullIndices = (points = [], includeCollinear = false, epsilon = EPSILON) => {
	if (points.length < 2) { return []; }
	const order = radialSortPointIndices(points, epsilon)
		.map(arr => (arr.length === 1 ? arr : mirror(arr)))
		.flat();
	order.push(order[0]);
	const stack = [order[0]];
	let i = 1;
	const funcs = {
		"-1": () => stack.pop(),
		1: (next) => { stack.push(next); i += 1; },
		undefined: () => { i += 1; },
	};
	funcs[0] = includeCollinear ? funcs["1"] : funcs["-1"];
	while (i < order.length) {
		if (stack.length < 2) {
			stack.push(order[i]);
			i += 1;
			continue;
		}
		const prev = stack[stack.length - 2];
		const curr = stack[stack.length - 1];
		const next = order[i];
		const turn = threePointTurnDirection(...[prev, curr, next].map(j => points[j]), epsilon);
		funcs[turn](next);
	}
	stack.pop();
	return stack;
};
const convexHull = (points = [], includeCollinear = false, epsilon = EPSILON) => (
	convexHullIndices(points, includeCollinear, epsilon)
		.map(i => points[i]));const convexHullMethods=/*#__PURE__*/Object.freeze({__proto__:null,convexHullIndices,convexHull});const vectorOriginForm = (vector, origin) => ({
	vector: vector || [],
	origin: origin || [],
});
const getVector = function () {
	let list = flattenArrays(arguments);
	if (list.length > 0
		&& typeof list[0] === "object"
		&& list[0] !== null
		&& !Number.isNaN(list[0].x)) {
		list = ["x", "y", "z"]
			.map(c => list[0][c])
			.filter(fnNotUndefined);
	}
	return list.filter(n => typeof n === "number");
};
const getVectorOfVectors = function () {
	return semiFlattenArrays(arguments)
		.map(el => getVector(el));
};
const getSegment = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 4) {
		return [
			[args[0], args[1]],
			[args[2], args[3]],
		];
	}
	return args.map(el => getVector(el));
};
const getLine = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0) { return vectorOriginForm([], []); }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector || [], args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};
const getRay = getLine;
const getRectParams = (x = 0, y = 0, width = 0, height = 0) => ({
	x, y, width, height,
});
const getRect = function () {
	const list = flattenArrays(arguments);
	if (list.length > 0
		&& typeof list[0] === "object"
		&& list[0] !== null
		&& !Number.isNaN(list[0].width)) {
		return getRectParams(...["x", "y", "width", "height"]
			.map(c => list[0][c])
			.filter(fnNotUndefined));
	}
	const numbers = list.filter(n => typeof n === "number");
	const rectParams = numbers.length < 4
		? [, , ...numbers]
		: numbers;
	return getRectParams(...rectParams);
};
const getCircleParams = (radius = 1, ...args) => ({
	radius,
	origin: [...args],
});
const getCircle = function () {
	const vectors = getVectorOfVectors(arguments);
	const numbers = flattenArrays(arguments).filter(a => typeof a === "number");
	if (arguments.length === 2) {
		if (vectors[1].length === 1) {
			return getCircleParams(vectors[1][0], ...vectors[0]);
		}
		if (vectors[0].length === 1) {
			return getCircleParams(vectors[0][0], ...vectors[1]);
		}
		if (vectors[0].length > 1 && vectors[1].length > 1) {
			return getCircleParams(distance2(...vectors), ...vectors[0]);
		}
	} else {
		switch (numbers.length) {
		case 0: return getCircleParams(1, 0, 0, 0);
		case 1: return getCircleParams(numbers[0], 0, 0, 0);
		default: return getCircleParams(numbers.pop(), ...numbers);
		}
	}
	return getCircleParams(1, 0, 0, 0);
};
const maps3x4 = [
	[0, 1, 3, 4, 9, 10],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	[0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11],
];
[11, 7, 3].forEach(i => delete maps3x4[2][i]);
const matrixMap3x4 = len => {
	let i;
	if (len < 8) i = 0;
	else if (len < 13) i = 1;
	else i = 2;
	return maps3x4[i];
};
const getMatrix3x4 = function () {
	const mat = flattenArrays(arguments);
	const matrix = [...identity3x4];
	matrixMap3x4(mat.length)
		.forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
	return matrix;
};const getters=/*#__PURE__*/Object.freeze({__proto__:null,getVector,getVectorOfVectors,getSegment,getLine,getRay,getRectParams,getRect,getCircle,getMatrix3x4});const intersectLineLine = (
	aVector,
	aOrigin,
	bVector,
	bOrigin,
	aFunction = includeL,
	bFunction = includeL,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize(aVector), normalize(bVector));
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(aVector, bVector);
	const determinant1 = -determinant0;
	const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, bVector) / determinant0;
	const t1 = cross2(b2a, aVector) / determinant1;
	if (aFunction(t0, epsilon / magnitude(aVector))
		&& bFunction(t1, epsilon / magnitude(bVector))) {
		return add(aOrigin, scale(aVector, t0));
	}
	return undefined;
};const pleatParallel = (count, a, b) => {
	const origins = Array.from(Array(count - 1))
		.map((_, i) => (i + 1) / count)
		.map(t => lerp(a.origin, b.origin, t));
	const vector = [...a.vector];
	return origins.map(origin => ({ origin, vector }));
};
const pleatAngle = (count, a, b) => {
	const origin = intersectLineLine(a.vector, a.origin, b.vector, b.origin);
	const vectors = clockwiseAngle2(a.vector, b.vector) < counterClockwiseAngle2(a.vector, b.vector)
		? clockwiseSubsect2(count, a.vector, b.vector)
		: counterClockwiseSubsect2(count, a.vector, b.vector);
	return vectors.map(vector => ({ origin, vector }));
};
const pleat = (count, a, b) => {
	const lineA = getLine(a);
	const lineB = getLine(b);
	return parallel(lineA.vector, lineB.vector)
		? pleatParallel(count, lineA, lineB)
		: pleatAngle(count, lineA, lineB);
};const pleatMethods=/*#__PURE__*/Object.freeze({__proto__:null,pleat});const angleArray = count => Array
	.from(Array(Math.floor(count)))
	.map((_, i) => TWO_PI * (i / count));
const anglesToVecs = (angles, radius) => angles
	.map(a => [radius * Math.cos(a), radius * Math.sin(a)])
	.map(pt => pt.map(n => cleanNumber(n, 14)));
const makePolygonCircumradius = (sides = 3, radius = 1) => (
	anglesToVecs(angleArray(sides), radius)
);
const makePolygonCircumradiusSide = (sides = 3, radius = 1) => {
	const halfwedge = Math.PI / sides;
	const angles = angleArray(sides).map(a => a + halfwedge);
	return anglesToVecs(angles, radius);
};
const makePolygonInradius = (sides = 3, radius = 1) => (
	makePolygonCircumradius(sides, radius / Math.cos(Math.PI / sides)));
const makePolygonInradiusSide = (sides = 3, radius = 1) => (
	makePolygonCircumradiusSide(sides, radius / Math.cos(Math.PI / sides)));
const makePolygonSideLength = (sides = 3, length = 1) => (
	makePolygonCircumradius(sides, (length / 2) / Math.sin(Math.PI / sides)));
const makePolygonSideLengthSide = (sides = 3, length = 1) => (
	makePolygonCircumradiusSide(sides, (length / 2) / Math.sin(Math.PI / sides)));
const makePolygonNonCollinear = (polygon, epsilon = EPSILON) => {
	const edges_vector = polygon
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(pair => subtract(pair[1], pair[0]));
	const vertex_collinear = edges_vector
		.map((vector, i, arr) => [vector, arr[(i + arr.length - 1) % arr.length]])
		.map(pair => !parallel(pair[1], pair[0], epsilon));
	return polygon
		.filter((vertex, v) => vertex_collinear[v]);
};
const circumcircle = function (a, b, c) {
	const A = b[0] - a[0];
	const B = b[1] - a[1];
	const C = c[0] - a[0];
	const D = c[1] - a[1];
	const E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
	const F = C * (a[0] + c[0]) + D * (a[1] + c[1]);
	const G = 2 * (A * (c[1] - b[1]) - B * (c[0] - b[0]));
	if (Math.abs(G) < EPSILON) {
		const minx = Math.min(a[0], b[0], c[0]);
		const miny = Math.min(a[1], b[1], c[1]);
		const dx = (Math.max(a[0], b[0], c[0]) - minx) * 0.5;
		const dy = (Math.max(a[1], b[1], c[1]) - miny) * 0.5;
		return {
			origin: [minx + dx, miny + dy],
			radius: Math.sqrt(dx * dx + dy * dy),
		};
	}
	const origin = [(D * E - B * F) / G, (A * F - C * E) / G];
	const dx = origin[0] - a[0];
	const dy = origin[1] - a[1];
	return {
		origin,
		radius: Math.sqrt(dx * dx + dy * dy),
	};
};
const signedArea = points => 0.5 * points
	.map((el, i, arr) => {
		const next = arr[(i + 1) % arr.length];
		return el[0] * next[1] - next[0] * el[1];
	}).reduce(fnAdd, 0);
const centroid = (points) => {
	const sixthArea = 1 / (6 * signedArea(points));
	return points.map((el, i, arr) => {
		const next = arr[(i + 1) % arr.length];
		const mag = el[0] * next[1] - next[0] * el[1];
		return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
	}).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(c => c * sixthArea);
};
const boundingBox = (points, padding = 0) => {
	if (!points || !points.length) { return undefined; }
	const min = Array(points[0].length).fill(Infinity);
	const max = Array(points[0].length).fill(-Infinity);
	points.forEach(point => point
		.forEach((c, i) => {
			if (c < min[i]) { min[i] = c - padding; }
			if (c > max[i]) { max[i] = c + padding; }
		}));
	const span = max.map((m, i) => m - min[i]);
	return { min, max, span };
};const polygonMethods=/*#__PURE__*/Object.freeze({__proto__:null,makePolygonCircumradius,makePolygonCircumradiusSide,makePolygonInradius,makePolygonInradiusSide,makePolygonSideLength,makePolygonSideLengthSide,makePolygonNonCollinear,circumcircle,signedArea,centroid,boundingBox});const overlapConvexPolygonPoint = (poly, point, func = exclude, epsilon = EPSILON) => poly
	.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	.map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])))
	.map(side => func(side, epsilon))
	.map((s, _, arr) => s === arr[0])
	.reduce((prev, curr) => prev && curr, true);const lineLineParameter = (
	lineVector,
	lineOrigin,
	polyVector,
	polyOrigin,
	polyLineFunc = includeS,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize(lineVector), normalize(polyVector));
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(lineVector, polyVector);
	const determinant1 = -determinant0;
	const a2b = subtract(polyOrigin, lineOrigin);
	const b2a = flip(a2b);
	const t0 = cross2(a2b, polyVector) / determinant0;
	const t1 = cross2(b2a, lineVector) / determinant1;
	if (polyLineFunc(t1, epsilon / magnitude(polyVector))) {
		return t0;
	}
	return undefined;
};
const linePointFromParameter = (vector, origin, t) => (
	add(origin, scale(vector, t))
);
const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
	.map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
	.map(side => lineLineParameter(
		vector,
		origin,
		side[0],
		side[1],
		polyLineFunc,
		epsilon,
	))
	.filter(fnNotUndefined)
	.sort((a, b) => a - b);
const getMinMax = (numbers, func, scaled_epsilon) => {
	let a = 0;
	let b = numbers.length - 1;
	while (a < b) {
		if (func(numbers[a + 1] - numbers[a], scaled_epsilon)) { break; }
		a += 1;
	}
	while (b > a) {
		if (func(numbers[b] - numbers[b - 1], scaled_epsilon)) { break; }
		b -= 1;
	}
	if (a >= b) { return undefined; }
	return [numbers[a], numbers[b]];
};
const clipLineConvexPolygon = (
	poly,
	vector,
	origin,
	fnPoly = include,
	fnLine = includeL,
	epsilon = EPSILON,
) => {
	const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
	if (numbers.length < 2) { return undefined; }
	const scaled_epsilon = (epsilon * 2) / magnitude(vector);
	const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
	if (ends === undefined) { return undefined; }
	const clip_fn = (t) => {
		if (fnLine(t)) { return t; }
		return t < 0.5 ? 0 : 1;
	};
	const ends_clip = ends.map(clip_fn);
	if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude(vector)) {
		return undefined;
	}
	const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
		? ends_clip.map(t => linePointFromParameter(vector, origin, t))
		: undefined;
};const clipPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	let cp1;
	let cp2;
	let s;
	let e;
	const inside = (p) => (
		(cp2[0] - cp1[0]) * (p[1] - cp1[1])) > ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon
	);
	const intersection = () => {
		const dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]];
		const dp = [s[0] - e[0], s[1] - e[1]];
		const n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0];
		const n2 = s[0] * e[1] - s[1] * e[0];
		const n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
		return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3];
	};
	let outputList = polygon1;
	cp1 = polygon2[polygon2.length - 1];
	for (let j in polygon2) {
		cp2 = polygon2[j];
		const inputList = outputList;
		outputList = [];
		s = inputList[inputList.length - 1];
		for (let i in inputList) {
			e = inputList[i];
			if (inside(e)) {
				if (!inside(s)) {
					outputList.push(intersection());
				}
				outputList.push(e);
			} else if (inside(s)) {
				outputList.push(intersection());
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};const overlapLinePoint = (vector, origin, point, func = excludeL, epsilon = EPSILON) => {
	const p2p = subtract(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
};const splitConvexPolygon = (poly, lineVector, linePoint) => {
	const vertices_intersections = poly.map((v, i) => {
		const intersection = overlapLinePoint(lineVector, linePoint, v, includeL);
		return { point: intersection ? v : null, at_index: i };
	}).filter(el => el.point != null);
	const edges_intersections = poly.map((v, i, arr) => ({
		point: intersectLineLine(
			lineVector,
			linePoint,
			subtract(v, arr[(i + 1) % arr.length]),
			arr[(i + 1) % arr.length],
			excludeL,
			excludeS,
		),
		at_index: i,
	}))
		.filter(el => el.point != null);
	if (edges_intersections.length === 2) {
		const sorted_edges = edges_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly
			.slice(sorted_edges[1].at_index + 1)
			.concat(poly.slice(0, sorted_edges[0].at_index + 1));
		face_a.push(sorted_edges[0].point);
		face_a.push(sorted_edges[1].point);
		const face_b = poly
			.slice(sorted_edges[0].at_index + 1, sorted_edges[1].at_index + 1);
		face_b.push(sorted_edges[1].point);
		face_b.push(sorted_edges[0].point);
		return [face_a, face_b];
	}
	if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
		vertices_intersections[0].type = "v";
		edges_intersections[0].type = "e";
		const sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly.slice(sorted_geom[1].at_index + 1)
			.concat(poly.slice(0, sorted_geom[0].at_index + 1));
		if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
		face_a.push(sorted_geom[1].point);
		const face_b = poly
			.slice(sorted_geom[0].at_index + 1, sorted_geom[1].at_index + 1);
		if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
		face_b.push(sorted_geom[0].point);
		return [face_a, face_b];
	}
	if (vertices_intersections.length === 2) {
		const sorted_vertices = vertices_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly
			.slice(sorted_vertices[1].at_index)
			.concat(poly.slice(0, sorted_vertices[0].at_index + 1));
		const face_b = poly
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index + 1);
		return [face_a, face_b];
	}
	return [poly.slice()];
};const recurseSkeleton = (points, lines, bisectors) => {
	const intersects = points
		.map((origin, i) => ({ vector: bisectors[i], origin }))
		.map((ray, i, arr) => intersectLineLine(
			ray.vector,
			ray.origin,
			arr[(i + 1) % arr.length].vector,
			arr[(i + 1) % arr.length].origin,
			excludeR,
			excludeR,
		));
	const projections = lines.map((line, i) => (
		nearestPointOnLine(line.vector, line.origin, intersects[i], a => a)
	));
	if (points.length === 3) {
		return points.map(p => ({ type: "skeleton", points: [p, intersects[0]] }))
			.concat([{ type: "perpendicular", points: [projections[0], intersects[0]] }]);
	}
	const projectionLengths = intersects
		.map((intersect, i) => distance(intersect, projections[i]));
	let shortest = 0;
	projectionLengths.forEach((len, i) => {
		if (len < projectionLengths[shortest]) { shortest = i; }
	});
	const solutions = [
		{
			type: "skeleton",
			points: [points[shortest], intersects[shortest]],
		},
		{
			type: "skeleton",
			points: [points[(shortest + 1) % points.length], intersects[shortest]],
		},
		{ type: "perpendicular", points: [projections[shortest], intersects[shortest]] },
	];
	const newVector = clockwiseBisect2(
		flip(lines[(shortest + lines.length - 1) % lines.length].vector),
		lines[(shortest + 1) % lines.length].vector,
	);
	const shortest_is_last_index = shortest === points.length - 1;
	points.splice(shortest, 2, intersects[shortest]);
	lines.splice(shortest, 1);
	bisectors.splice(shortest, 2, newVector);
	if (shortest_is_last_index) {
		points.splice(0, 1);
		bisectors.splice(0, 1);
		lines.push(lines.shift());
	}
	return solutions.concat(recurseSkeleton(points, lines, bisectors));
};
const straightSkeleton = (points) => {
	const lines = points
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.map(side => ({ vector: subtract(side[1], side[0]), origin: side[0] }));
	const bisectors = points
		.map((_, i, ar) => [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length]
			.map(j => ar[j]))
		.map(p => [subtract(p[0], p[1]), subtract(p[2], p[1])])
		.map(v => clockwiseBisect2(...v));
	return recurseSkeleton([...points], lines, bisectors);
};const geometry = {
	...convexHullMethods,
	...pleatMethods,
	...polygonMethods,
	...radialMethods,
	clipLineConvexPolygon,
	clipPolygonPolygon,
	splitConvexPolygon,
	straightSkeleton,
};const collinearBetween = (p0, p1, p2, inclusive = false, epsilon = EPSILON) => {
	const similar = [p0, p2]
		.map(p => fnEpsilonEqualVectors(p1, p))
		.reduce((a, b) => a || b, false);
	if (similar) { return inclusive; }
	const vectors = [[p0, p1], [p1, p2]]
		.map(segment => subtract(segment[1], segment[0]))
		.map(vector => normalize(vector));
	return fnEpsilonEqual(1.0, dot(...vectors), epsilon);
};const generalIntersect=/*#__PURE__*/Object.freeze({__proto__:null,collinearBetween});const enclosingBoundingBoxes = (outer, inner) => {
	const dimensions = Math.min(outer.min.length, inner.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (inner.min[d] < outer.min[d] || inner.max[d] > outer.max[d]) {
			return false;
		}
	}
	return true;
};
const enclosingPolygonPolygon = (outer, inner, fnInclusive = include) => {
	const outerGoesInside = outer
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a || b, false);
	const innerGoesOutside = inner
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a && b, true);
	return (!outerGoesInside && innerGoesOutside);
};const encloses=/*#__PURE__*/Object.freeze({__proto__:null,enclosingBoundingBoxes,enclosingPolygonPolygon});const getUniquePair = (intersections) => {
	for (let i = 1; i < intersections.length; i += 1) {
		if (!fnEpsilonEqualVectors(intersections[0], intersections[i])) {
			return [intersections[0], intersections[i]];
		}
	}
	return undefined;
};
const intersectConvexPolygonLineInclusive = (
	poly,
	vector,
	origin,
	fn_poly = includeS,
	fn_line = includeL,
	epsilon = EPSILON,
) => {
	const intersections = poly
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.map(side => intersectLineLine(
			subtract(side[1], side[0]),
			side[0],
			vector,
			origin,
			fn_poly,
			fn_line,
			epsilon,
		))
		.filter(a => a !== undefined);
	switch (intersections.length) {
	case 0: return undefined;
	case 1: return [intersections];
	default:
		return getUniquePair(intersections) || [intersections[0]];
	}
};
const intersectConvexPolygonLine = (
	poly,
	vector,
	origin,
	fn_poly = includeS,
	fn_line = excludeL,
	epsilon = EPSILON,
) => {
	const sects = intersectConvexPolygonLineInclusive(
		poly,
		vector,
		origin,
		fn_poly,
		fn_line,
		epsilon,
	);
	let altFunc;
	switch (fn_line) {
	case excludeR: altFunc = includeR; break;
	case excludeS: altFunc = includeS; break;
	default: return sects;
	}
	const includes = intersectConvexPolygonLineInclusive(
		poly,
		vector,
		origin,
		includeS,
		altFunc,
		epsilon,
	);
	if (includes === undefined) { return undefined; }
	const uniqueIncludes = getUniquePair(includes);
	if (uniqueIncludes === undefined) {
		switch (fn_line) {
		case excludeR:
			return overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		case excludeS:
			return overlapConvexPolygonPoint(poly, add(origin, vector), exclude, epsilon)
				|| overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	return overlapConvexPolygonPoint(poly, midpoint(...uniqueIncludes), exclude, epsilon)
		? uniqueIncludes
		: sects;
};const acosSafe = (x) => {
	if (x >= 1.0) return 0;
	if (x <= -1.0) return Math.PI;
	return Math.acos(x);
};
const rotateVector2 = (center, pt, a) => {
	const x = pt[0] - center[0];
	const y = pt[1] - center[1];
	const xRot = x * Math.cos(a) + y * Math.sin(a);
	const yRot = y * Math.cos(a) - x * Math.sin(a);
	return [center[0] + xRot, center[1] + yRot];
};
const intersectCircleCircle = (c1_radius, c1_origin, c2_radius, c2_origin, epsilon = EPSILON) => {
	const r = (c1_radius < c2_radius) ? c1_radius : c2_radius;
	const R = (c1_radius < c2_radius) ? c2_radius : c1_radius;
	const smCenter = (c1_radius < c2_radius) ? c1_origin : c2_origin;
	const bgCenter = (c1_radius < c2_radius) ? c2_origin : c1_origin;
	const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
	const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
	if (d < epsilon) { return undefined; }
	const point = vec.map((v, i) => (v / d) * R + bgCenter[i]);
	if (Math.abs((R + r) - d) < epsilon
		|| Math.abs(R - (r + d)) < epsilon) { return [point]; }
	if ((d + r) < R || (R + r < d)) { return undefined; }
	const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
	const pt1 = rotateVector2(bgCenter, point, +angle);
	const pt2 = rotateVector2(bgCenter, point, -angle);
	return [pt1, pt2];
};const intersectCircleLine = (
	circle_radius,
	circle_origin,
	line_vector,
	line_origin,
	line_func = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line_vector[0] ** 2 + line_vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line_vector : line_vector.map(c => c / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract(line_origin, circle_origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle_radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle_radius ** 2) - (det ** 2));
	const f = (s, i) => circle_origin[i] - rot90[i] * det + norm[i] * s;
	const results = Math.abs(circle_radius - Math.abs(det)) < epsilon
		? [side].map((s) => [s, s].map(f))
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line_origin[i]))
		.map(v => v[0] * line_vector[0] + line_vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => line_func(ts[i], epsilon));
};const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			const origin = polyA[i];
			const vector = rotate90(subtract(polyA[(i + 1) % polyA.length], polyA[i]));
			const projected = polyB
				.map(point => subtract(point, origin))
				.map(v => dot(vector, v));
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot(vector, subtract(other_test_point, origin));
			const side = side_a > 0;
			const one_sided = projected
				.map(dotProd => (side ? dotProd < epsilon : dotProd > -epsilon))
				.reduce((a, b) => a && b, true);
			if (one_sided) { return false; }
		}
	}
	return true;
};const overlapBoundingBoxes = (box1, box2) => {
	const dimensions = Math.min(box1.min.length, box2.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (box1.min[d] > box2.max[d] || box1.max[d] < box2.min[d]) {
			return false;
		}
	}
	return true;
};const overlapLineLine = (
	aVector,
	aOrigin,
	bVector,
	bOrigin,
	aFunction = excludeL,
	bFunction = excludeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(aVector, bVector);
	const denominator1 = -denominator0;
	const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
	if (Math.abs(denominator0) < epsilon) {
		if (Math.abs(cross2(a2b, aVector)) > epsilon) { return false; }
		const bPt1 = a2b;
		const bPt2 = add(bPt1, bVector);
		const aProjLen = dot(aVector, aVector);
		const bProj1 = dot(bPt1, aVector) / aProjLen;
		const bProj2 = dot(bPt2, aVector) / aProjLen;
		const bProjSm = bProj1 < bProj2 ? bProj1 : bProj2;
		const bProjLg = bProj1 < bProj2 ? bProj2 : bProj1;
		const bOutside1 = bProjSm > 1 - epsilon;
		const bOutside2 = bProjLg < epsilon;
		if (bOutside1 || bOutside2) { return false; }
		return true;
	}
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, bVector) / denominator0;
	const t1 = cross2(b2a, aVector) / denominator1;
	return aFunction(t0, epsilon / magnitude(aVector))
		&& bFunction(t1, epsilon / magnitude(bVector));
};const intersection = {
	...generalIntersect,
	...encloses,
	intersectConvexPolygonLine,
	intersectCircleCircle,
	intersectCircleLine,
	intersectLineLine,
	overlapConvexPolygons,
	overlapConvexPolygonPoint,
	overlapBoundingBoxes,
	overlapLineLine,
	overlapLinePoint,
};const typeOf = function (obj) {
	switch (obj.constructor.name) {
	case "vector":
	case "matrix":
	case "segment":
	case "ray":
	case "line":
	case "circle":
	case "ellipse":
	case "rect":
	case "polygon": return obj.constructor.name;
	}
	if (typeof obj === "object") {
		if (obj.radius != null) { return "circle"; }
		if (obj.width != null) { return "rect"; }
		if (obj.x != null || typeof obj[0] === "number") { return "vector"; }
		if (obj[0] != null && obj[0].length && (typeof obj[0].x === "number" || typeof obj[0][0] === "number")) { return "segment"; }
		if (obj.vector != null && obj.origin != null) { return "line"; }
	}
	return undefined;
};const pointsToLine = (...args) => {
	const points = getVectorOfVectors(...args);
	return {
		vector: subtract(points[1], points[0]),
		origin: points[0],
	};
};
const rayLineToUniqueLine = ({ vector, origin }) => {
	const mag = magnitude(vector);
	const normal = rotate90(vector);
	const distance = dot(origin, normal) / mag;
	return { normal: scale(normal, 1 / mag), distance };
};
const uniqueLineToRayLine = ({ normal, distance }) => ({
	vector: rotate270(normal),
	origin: scale(normal, distance),
});const parameterize=/*#__PURE__*/Object.freeze({__proto__:null,pointsToLine,rayLineToUniqueLine,uniqueLineToRayLine});const types = {
	...resizers,
	...parameterize,
	...getters,
	typeOf,
};const math = {
	...algebra,
	...geometry,
	...intersection,
	...types,
};return math;}));
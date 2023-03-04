/* Math (c) Kraft, MIT License */
const EPSILON = 1e-6;
const R2D = 180 / Math.PI;
const D2R = Math.PI / 180;
const TWO_PI = Math.PI * 2;

const constants = /*#__PURE__*/Object.freeze({
	__proto__: null,
	D2R,
	EPSILON,
	R2D,
	TWO_PI
});

const epsilonEqual = (a, b, epsilon = EPSILON) => Math.abs(a - b) < epsilon;
const epsilonCompare = (a, b, epsilon = EPSILON) => (
	epsilonEqual(a, b, epsilon) ? 0 : Math.sign(b - a)
);
const epsilonEqualVectors = (a, b, epsilon = EPSILON) => {
	for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
		if (!epsilonEqual(a[i] || 0, b[i] || 0, epsilon)) { return false; }
	}
	return true;
};
const include = (n, epsilon = EPSILON) => n > -epsilon;
const exclude = (n, epsilon = EPSILON) => n > epsilon;
const includeL = () => true;
const excludeL = () => true;
const includeR = include;
const excludeR = exclude;
const includeS = (n, e = EPSILON) => n > -e && n < 1 + e;
const excludeS = (n, e = EPSILON) => n > e && n < 1 - e;
const clampLine = dist => dist;
const clampRay = dist => (dist < -EPSILON ? 0 : dist);
const clampSegment = (dist) => {
	if (dist < -EPSILON) { return 0; }
	if (dist > 1 + EPSILON) { return 1; }
	return dist;
};

const mathFunctions = /*#__PURE__*/Object.freeze({
	__proto__: null,
	clampLine,
	clampRay,
	clampSegment,
	epsilonCompare,
	epsilonEqual,
	epsilonEqualVectors,
	exclude,
	excludeL,
	excludeR,
	excludeS,
	include,
	includeL,
	includeR,
	includeS
});

const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
const semiFlattenArrays = function () {
	switch (arguments.length) {
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
	case 0: return Array.from(arguments);
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).flat();
	}
};

const arrayMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	flattenArrays,
	semiFlattenArrays
});

const getVector = function () {
	let list = flattenArrays(arguments);
	const a = list[0];
	if (typeof a === "object" && a !== null && !Number.isNaN(a.x)) {
		list = ["x", "y", "z"].map(c => a[c]).filter(b => b !== undefined);
	}
	return list.filter(n => typeof n === "number");
};
const getArrayOfVectors = function () {
	return semiFlattenArrays(arguments).map(el => getVector(el));
};
const getSegment = function () {
	const args = semiFlattenArrays(arguments);
	return args.length === 4
		? [[0, 1], [2, 3]].map(s => s.map(i => args[i]))
		: args.map(el => getVector(el));
};
const vectorOriginForm = (vector, origin = []) => ({ vector, origin });
const getLine = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0 || args[0] == null) { return vectorOriginForm([], []); }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector, args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};

const getMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getArrayOfVectors,
	getLine,
	getSegment,
	getVector
});

const safeAdd = (a, b) => a + (b || 0);
const magnitude = v => Math.sqrt(v
	.map(n => n * n)
	.reduce(safeAdd, 0));
const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
const magnitude3 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
const magSquared = v => v
	.map(n => n * n)
	.reduce(safeAdd, 0);
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
	.reduce(safeAdd, 0);
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
		.forEach(vec => sum
			.forEach((_, i) => { sum[i] += vec[i] || 0; }));
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
	.reduce(safeAdd, 0));
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
	.reduce(safeAdd, 0) < epsilon;
const parallelNormalized = (v, u, epsilon = EPSILON) => 1 - Math
	.abs(dot(v, u)) < epsilon;
const parallel = (v, u, epsilon = EPSILON) => parallelNormalized(
	normalize(v),
	normalize(u),
	epsilon,
);
const parallel2 = (v, u, epsilon = EPSILON) => Math
	.abs(cross2(v, u)) < epsilon;
const resize = (dimension, vector) => (vector.length === dimension
	? vector
	: Array(dimension).fill(0).map((z, i) => (vector[i] ? vector[i] : z)));
const resizeUp = (a, b) => [a, b]
	.map(v => resize(Math.max(a.length, b.length), v));

const vector = /*#__PURE__*/Object.freeze({
	__proto__: null,
	add,
	add2,
	add3,
	average,
	cross2,
	cross3,
	degenerate,
	distance,
	distance2,
	distance3,
	dot,
	dot2,
	dot3,
	flip,
	lerp,
	magSquared,
	magnitude,
	magnitude2,
	magnitude3,
	midpoint,
	midpoint2,
	midpoint3,
	normalize,
	normalize2,
	normalize3,
	parallel,
	parallel2,
	parallelNormalized,
	resize,
	resizeUp,
	rotate270,
	rotate90,
	scale,
	scale2,
	scale3,
	subtract,
	subtract2,
	subtract3
});

const vectorToAngle = v => Math.atan2(v[1], v[0]);
const angleToVector = a => [Math.cos(a), Math.sin(a)];
const pointsToLine = (...args) => {
	const points = getArrayOfVectors(...args);
	return {
		vector: subtract(points[1], points[0]),
		origin: points[0],
	};
};
const vecLineToUniqueLine = ({ vector, origin }) => {
	const mag = magnitude(vector);
	const normal = rotate90(vector);
	const distance = dot(origin, normal) / mag;
	return { normal: scale(normal, 1 / mag), distance };
};
const uniqueLineToVecLine = ({ normal, distance }) => ({
	vector: rotate270(normal),
	origin: scale(normal, distance),
});

const convertMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	angleToVector,
	pointsToLine,
	uniqueLineToVecLine,
	vecLineToUniqueLine,
	vectorToAngle
});

const countPlaces = function (num) {
	const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
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

const numberMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	cleanNumber
});

const smallestComparisonSearch = (array, obj, compare_func) => {
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
const smallestVectorSearch = (vectors, axis, compFn, epsilon) => {
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
	if (!points || !points.length) { return undefined; }
	const smallSet = smallestVectorSearch(points, 0, epsilonCompare, epsilon);
	let sm = 0;
	for (let i = 1; i < smallSet.length; i += 1) {
		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
	}
	return smallSet[sm];
};

const searchMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	minimum2DPointIndex,
	smallestComparisonSearch
});

const sortAgainstItem = (array, item, compareFn) => array
	.map((el, i) => ({ i, n: compareFn(el, item) }))
	.sort((a, b) => a.n - b.n)
	.map(a => a.i);
const sortPointsAlongVector = (points, vector) => (
	sortAgainstItem(points, vector, dot)
);
const clusterIndicesOfSortedNumbers = (numbers, epsilon = EPSILON) => {
	const clusters = [[0]];
	let clusterIndex = 0;
	for (let i = 1; i < numbers.length; i += 1) {
		if (epsilonEqual(numbers[i], numbers[i - 1], epsilon)) {
			clusters[clusterIndex].push(i);
		} else {
			clusterIndex = clusters.length;
			clusters.push([i]);
		}
	}
	return clusters;
};
const radialSortPointIndices2 = (points, epsilon = EPSILON) => {
	const first = minimum2DPointIndex(points, epsilon);
	if (first === undefined) { return []; }
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
};

const sortMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	clusterIndicesOfSortedNumbers,
	radialSortPointIndices2,
	sortAgainstItem,
	sortPointsAlongVector
});

const typeOf = (obj) => {
	if (typeof obj !== "object") { return typeof obj; }
	if (obj.radius !== undefined) { return "circle"; }
	if (obj.min && obj.max && obj.span) { return "box"; }
	if (typeof obj[0] === "number") { return "vector"; }
	if (obj.vector !== undefined && obj.origin !== undefined) { return "line"; }
	if (obj[0] !== undefined && obj[0].length && typeof obj[0][0] === "number") {
		return obj.length === 2 ? "segment" : "polygon";
	}
	return "object";
};

const general = {
	...constants,
	...mathFunctions,
	...getMethods,
	...convertMethods,
	...arrayMethods,
	...numberMethods,
	...searchMethods,
	...sortMethods,
	typeof: typeOf,
};

const identity2x2 = [1, 0, 0, 1];
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
const makeMatrix2UniformScale = (scale = 1, origin = [0, 0]) => (
	makeMatrix2Scale([scale, scale], origin)
);
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
};

const matrix2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	determinant2,
	identity2x2,
	identity2x3,
	invertMatrix2,
	makeMatrix2Reflect,
	makeMatrix2Rotate,
	makeMatrix2Scale,
	makeMatrix2Translate,
	makeMatrix2UniformScale,
	multiplyMatrices2,
	multiplyMatrix2Line2,
	multiplyMatrix2Vector2
});

const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
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
const makeMatrix3UniformScale = (scale = 1, origin = [0, 0, 0]) => (
	makeMatrix3Scale([scale, scale, scale], origin)
);
const makeMatrix3ReflectZ = (vector, origin = [0, 0]) => {
	const m = makeMatrix2Reflect(vector, origin);
	return [m[0], m[1], 0, m[2], m[3], 0, 0, 0, 1, m[4], m[5], 0];
};

const matrix3 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	determinant3,
	identity3x3,
	identity3x4,
	invertMatrix3,
	isIdentity3x4,
	makeMatrix3ReflectZ,
	makeMatrix3Rotate,
	makeMatrix3RotateX,
	makeMatrix3RotateY,
	makeMatrix3RotateZ,
	makeMatrix3Scale,
	makeMatrix3Translate,
	makeMatrix3UniformScale,
	multiplyMatrices3,
	multiplyMatrix3Line3,
	multiplyMatrix3Vector3
});

const identity4x4 = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
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
const determinant4 = (m) => {
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
const makeMatrix4UniformScale = (scale = 1, origin = [0, 0, 0]) => (
	makeMatrix4Scale([scale, scale, scale], origin)
);
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
};

const matrix4 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	determinant4,
	identity4x4,
	invertMatrix4,
	isIdentity4x4,
	makeLookAtMatrix4,
	makeMatrix4ReflectZ,
	makeMatrix4Rotate,
	makeMatrix4RotateX,
	makeMatrix4RotateY,
	makeMatrix4RotateZ,
	makeMatrix4Scale,
	makeMatrix4Translate,
	makeMatrix4UniformScale,
	makeOrthographicMatrix4,
	makePerspectiveMatrix4,
	multiplyMatrices4,
	multiplyMatrix4Line3,
	multiplyMatrix4Vector3
});

const quaternionFromTwoVectors = (u, v) => {
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
]);

const quaternion = /*#__PURE__*/Object.freeze({
	__proto__: null,
	matrix4FromQuaternion,
	quaternionFromTwoVectors
});

const algebra = {
	...vector,
	...matrix2,
	...matrix3,
	...matrix4,
	...quaternion,
};

const isCounterClockwiseBetween = (angle, floor, ceiling) => {
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
const clockwiseBisect2 = (a, b) => (
	angleToVector(vectorToAngle(a) - clockwiseAngle2(a, b) / 2)
);
const counterClockwiseBisect2 = (a, b) => (
	angleToVector(vectorToAngle(a) + counterClockwiseAngle2(a, b) / 2)
);
const clockwiseSubsectRadians = (angleA, angleB, divisions) => {
	const angle = clockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
const counterClockwiseSubsectRadians = (angleA, angleB, divisions) => {
	const angle = counterClockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
const clockwiseSubsect2 = (vectorA, vectorB, divisions) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return clockwiseSubsectRadians(angleA, angleB, divisions)
		.map(angleToVector);
};
const counterClockwiseSubsect2 = (vectorA, vectorB, divisions) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return counterClockwiseSubsectRadians(angleA, angleB, divisions)
		.map(angleToVector);
};
const counterClockwiseOrderRadians = (...args) => {
	const radians = args.flat();
	const counter_clockwise = radians
		.map((_, i) => i)
		.sort((a, b) => radians[a] - radians[b]);
	return counter_clockwise
		.slice(counter_clockwise.indexOf(0), counter_clockwise.length)
		.concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
const counterClockwiseOrder2 = function () {
	return counterClockwiseOrderRadians(
		semiFlattenArrays(arguments).map(vectorToAngle),
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
		semiFlattenArrays(arguments).map(vectorToAngle),
	);
};
const threePointTurnDirection = (p0, p1, p2, epsilon = EPSILON) => {
	const v = normalize2(subtract2(p1, p0));
	const u = normalize2(subtract2(p2, p0));
	const cross = cross2(v, u);
	if (!epsilonEqual(cross, 0, epsilon)) {
		return Math.sign(cross);
	}
	return epsilonEqual(distance2(p0, p1) + distance2(p1, p2), distance2(p0, p2))
		? 0
		: undefined;
};

const radialMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	clockwiseAngle2,
	clockwiseAngleRadians,
	clockwiseBisect2,
	clockwiseSubsect2,
	clockwiseSubsectRadians,
	counterClockwiseAngle2,
	counterClockwiseAngleRadians,
	counterClockwiseBisect2,
	counterClockwiseOrder2,
	counterClockwiseOrderRadians,
	counterClockwiseSectors2,
	counterClockwiseSectorsRadians,
	counterClockwiseSubsect2,
	counterClockwiseSubsectRadians,
	isCounterClockwiseBetween,
	threePointTurnDirection
});

const mirrorArray = (arr) => arr.concat(arr.slice(0, -1).reverse());
const convexHull = (points = [], includeCollinear = false, epsilon = EPSILON) => {
	if (points.length < 2) { return []; }
	const order = radialSortPointIndices2(points, epsilon)
		.map(arr => (arr.length === 1 ? arr : mirrorArray(arr)))
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

const convexHullMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	convexHull
});

const collinearBetween = (p0, p1, p2, inclusive = false, epsilon = EPSILON) => {
	const similar = [p0, p2]
		.map(p => epsilonEqualVectors(p1, p))
		.reduce((a, b) => a || b, false);
	if (similar) { return inclusive; }
	const vectors = [[p0, p1], [p1, p2]]
		.map(segment => subtract(segment[1], segment[0]))
		.map(vector => normalize(vector));
	return epsilonEqual(1.0, dot(...vectors), epsilon);
};
const lerpLines = (a, b, t) => {
	const vector = lerp(a.vector, b.vector, t);
	const origin = lerp(a.origin, b.origin, t);
	return { vector, origin };
};
const pleat = (a, b, count, epsilon = EPSILON) => {
	const dotProd = dot(a.vector, b.vector);
	const determinant = cross2(a.vector, b.vector);
	const numerator = cross2(subtract2(b.origin, a.origin), b.vector);
	const t = numerator / determinant;
	const normalized = [a.vector, b.vector].map(vec => normalize(vec));
	const sides = determinant > -epsilon
		? [[a.vector, b.vector], [flip(b.vector), a.vector]]
		: [[b.vector, a.vector], [flip(a.vector), b.vector]];
	const pleatVectors = sides
		.map(pair => counterClockwiseSubsect2(pair[0], pair[1], count));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const intersection = isParallel
		? undefined
		: add2(a.origin, scale2(a.vector, t));
	const iter = Array.from(Array(count - 1));
	const origins = isParallel
		? iter.map((_, i) => lerp(a.origin, b.origin, (i + 1) / count))
		: iter.map(() => intersection);
	const solution = pleatVectors
		.map(side => side.map((vector, i) => ({
			vector,
			origin: [...origins[i]],
		})));
	if (isParallel) { solution[(dotProd > -epsilon ? 1 : 0)] = []; }
	return solution;
};
const bisectLines2 = (a, b, epsilon = EPSILON) => {
	const solution = pleat(a, b, 2, epsilon).map(arr => arr[0]);
	solution.forEach((val, i) => {
		if (val === undefined) { delete solution[i]; }
	});
	return solution;
};

const lineMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	bisectLines2,
	collinearBetween,
	lerpLines,
	pleat
});

const nearestPoint2 = (array_of_points, point) => {
	const index = smallestComparisonSearch(array_of_points, point, distance2);
	return index === undefined ? undefined : array_of_points[index];
};
const nearestPoint = (array_of_points, point) => {
	const index = smallestComparisonSearch(array_of_points, point, distance);
	return index === undefined ? undefined : array_of_points[index];
};
const nearestPointOnLine = (
	{ vector, origin },
	point,
	clampFunc = clampLine,
	epsilon = EPSILON,
) => {
	origin = resize(vector.length, origin);
	point = resize(vector.length, point);
	const magSq = magSquared(vector);
	const vectorToPoint = subtract(point, origin);
	const dotProd = dot(vector, vectorToPoint);
	const dist = dotProd / magSq;
	const d = clampFunc(dist, epsilon);
	return add(origin, scale(vector, d));
};
const nearestPointOnPolygon = (polygon, point) => polygon
	.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p))
	.map((vector, i) => ({ vector, origin: polygon[i] }))
	.map(line => nearestPointOnLine(line, point, clampSegment))
	.map((p, edge) => ({ point: p, edge, distance: distance(p, point) }))
	.sort((a, b) => a.distance - b.distance)
	.shift();
const nearestPointOnCircle = ({ radius, origin }, point) => (
	add(origin, scale(normalize(subtract(point, origin)), radius))
);

const nearestMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	nearestPoint,
	nearestPoint2,
	nearestPointOnCircle,
	nearestPointOnLine,
	nearestPointOnPolygon
});

const angleArray = count => Array
	.from(Array(Math.floor(count)))
	.map((_, i) => TWO_PI * (i / count));
const anglesToVecs = (angles, radius) => angles
	.map(a => [radius * Math.cos(a), radius * Math.sin(a)]);
const makePolygonCircumradius = (sides = 3, circumradius = 1) => (
	anglesToVecs(angleArray(sides), circumradius)
);
const makePolygonCircumradiusSide = (sides = 3, circumradius = 1) => {
	const halfwedge = Math.PI / sides;
	const angles = angleArray(sides).map(a => a + halfwedge);
	return anglesToVecs(angles, circumradius);
};
const makePolygonInradius = (sides = 3, inradius = 1) => (
	makePolygonCircumradius(sides, inradius / Math.cos(Math.PI / sides)));
const makePolygonInradiusSide = (sides = 3, inradius = 1) => (
	makePolygonCircumradiusSide(sides, inradius / Math.cos(Math.PI / sides)));
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
const circumcircle = (a, b, c) => {
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
	.map((el, i, arr) => [el, arr[(i + 1) % arr.length]])
	.map(pair => cross2(...pair))
	.reduce((a, b) => a + b, 0);
const centroid = (points) => {
	const sixthArea = 1 / (6 * signedArea(points));
	return points
		.map((el, i, arr) => [el, arr[(i + 1) % arr.length]])
		.map(pair => scale2(add2(...pair), cross2(...pair)))
		.reduce((a, b) => add2(a, b), [0, 0])
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
};

const polygonMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	boundingBox,
	centroid,
	circumcircle,
	makePolygonCircumradius,
	makePolygonCircumradiusSide,
	makePolygonInradius,
	makePolygonInradiusSide,
	makePolygonNonCollinear,
	makePolygonSideLength,
	makePolygonSideLengthSide,
	signedArea
});

const overlapLinePoint = (
	{ vector, origin },
	point,
	lineDomain = excludeL,
	epsilon = EPSILON,
) => {
	const p2p = subtract2(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot2(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && lineDomain(proj, epsilon / lineMag);
};
const overlapLineLine = (
	a,
	b,
	aDomain = excludeL,
	bDomain = excludeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(a.vector, b.vector);
	const denominator1 = -denominator0;
	const a2b = subtract2(b.origin, a.origin);
	const b2a = [-a2b[0], -a2b[1]];
	if (Math.abs(denominator0) < epsilon) {
		if (Math.abs(cross2(a2b, a.vector)) > epsilon) { return false; }
		const aPt1 = b2a;
		const aPt2 = add2(aPt1, a.vector);
		const bPt1 = a2b;
		const bPt2 = add2(bPt1, b.vector);
		const aProjLen = dot2(a.vector, a.vector);
		const bProjLen = dot2(a.vector, a.vector);
		const aProj1 = dot2(aPt1, b.vector) / bProjLen;
		const aProj2 = dot2(aPt2, b.vector) / bProjLen;
		const bProj1 = dot2(bPt1, a.vector) / aProjLen;
		const bProj2 = dot2(bPt2, a.vector) / aProjLen;
		return aDomain(bProj1, epsilon) || aDomain(bProj2, epsilon)
			|| bDomain(aProj1, epsilon) || bDomain(aProj2, epsilon);
	}
	const t0 = cross2(a2b, b.vector) / denominator0;
	const t1 = cross2(b2a, a.vector) / denominator1;
	return aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector));
};
const overlapCirclePoint = (
	{ radius, origin },
	point,
	circleDomain = exclude,
	epsilon = EPSILON,
) => (
	circleDomain(radius - distance2(origin, point), epsilon)
);
const overlapConvexPolygonPoint = (
	polygon,
	point,
	polyDomain = exclude,
	epsilon = EPSILON,
) => polygon
	.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	.map(s => cross2(normalize2(subtract2(s[1], s[0])), subtract2(point, s[0])))
	.map(side => polyDomain(side, epsilon))
	.map((s, _, arr) => s === arr[0])
	.reduce((prev, curr) => prev && curr, true);
const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			const origin = polyA[i];
			const vector = rotate90(subtract2(polyA[(i + 1) % polyA.length], polyA[i]));
			const projected = polyB
				.map(point => subtract2(point, origin))
				.map(v => dot2(vector, v));
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot2(vector, subtract2(other_test_point, origin));
			const side = side_a > 0;
			const one_sided = projected
				.map(dotProd => (side ? dotProd < epsilon : dotProd > -epsilon))
				.reduce((a, b) => a && b, true);
			if (one_sided) { return false; }
		}
	}
	return true;
};
const overlapBoundingBoxes = (box1, box2, epsilon = EPSILON) => {
	const dimensions = Math.min(box1.min.length, box2.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (box1.min[d] > box2.max[d] + epsilon
			|| box1.max[d] < box2.min[d] - epsilon) {
			return false;
		}
	}
	return true;
};

const overlapMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	overlapBoundingBoxes,
	overlapCirclePoint,
	overlapConvexPolygonPoint,
	overlapConvexPolygons,
	overlapLineLine,
	overlapLinePoint
});

const intersectLineLine = (
	a,
	b,
	aDomain = includeL,
	bDomain = includeL,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(a.vector, b.vector);
	const determinant1 = -determinant0;
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / determinant0;
	const t1 = cross2(b2a, a.vector) / determinant1;
	if (aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector))) {
		return add2(a.origin, scale2(a.vector, t0));
	}
	return undefined;
};
const intersectCircleLine = (
	circle,
	line,
	circleDomain = include,
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line.vector : line.vector.map(c => c / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract2(line.origin, circle.origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
	const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
	const results = Math.abs(circle.radius - Math.abs(det)) < epsilon
		? [side].map((s) => [s, s].map(f))
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line.origin[i]))
		.map(v => v[0] * line.vector[0] + line.vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => lineDomain(ts[i], epsilon));
};
const acosSafe = (x) => {
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
const intersectCircleCircle = (
	c1,
	c2,
	c1Domain = include,
	c2Domain = include,
	epsilon = EPSILON,
) => {
	const r = (c1.radius < c2.radius) ? c1.radius : c2.radius;
	const R = (c1.radius < c2.radius) ? c2.radius : c1.radius;
	const smCenter = (c1.radius < c2.radius) ? c1.origin : c2.origin;
	const bgCenter = (c1.radius < c2.radius) ? c2.origin : c1.origin;
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
};
const getUniquePair = (intersections) => {
	for (let i = 1; i < intersections.length; i += 1) {
		if (!epsilonEqualVectors(intersections[0], intersections[i])) {
			return [intersections[0], intersections[i]];
		}
	}
	return undefined;
};
const intersectConvexPolygonLineInclusive = (
	poly,
	{ vector, origin },
	fn_poly = includeS,
	fn_line = includeL,
	epsilon = EPSILON,
) => {
	const intersections = poly
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.map(side => intersectLineLine(
			{ vector: subtract2(side[1], side[0]), origin: side[0] },
			{ vector, origin },
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
	{ vector, origin },
	fn_poly = includeS,
	fn_line = excludeL,
	epsilon = EPSILON,
) => {
	const sects = intersectConvexPolygonLineInclusive(
		poly,
		{ vector, origin },
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
		{ vector, origin },
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
			return overlapConvexPolygonPoint(poly, add2(origin, vector), exclude, epsilon)
				|| overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	return overlapConvexPolygonPoint(poly, midpoint2(...uniqueIncludes), exclude, epsilon)
		? uniqueIncludes
		: sects;
};

const intersectMethods$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	intersectCircleCircle,
	intersectCircleLine,
	intersectConvexPolygonLine,
	intersectLineLine
});

const recurseSkeleton = (points, lines, bisectors) => {
	const intersects = points
		.map((origin, i) => ({ vector: bisectors[i], origin }))
		.map((ray, i, arr) => intersectLineLine(
			ray,
			arr[(i + 1) % arr.length],
			excludeR,
			excludeR,
		));
	const projections = lines.map((line, i) => (
		nearestPointOnLine(line, intersects[i], a => a)
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
};

const geometry = {
	...convexHullMethods,
	...lineMethods,
	...nearestMethods,
	...polygonMethods,
	...radialMethods,
	straightSkeleton,
};

const enclosingBoundingBoxes = (outer, inner, epsilon = EPSILON) => {
	const dimensions = Math.min(outer.min.length, inner.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (inner.min[d] < outer.min[d] - epsilon
			|| inner.max[d] > outer.max[d] + epsilon) {
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
};

const encloses = /*#__PURE__*/Object.freeze({
	__proto__: null,
	enclosingBoundingBoxes,
	enclosingPolygonPolygon
});

const lineLineParameter = (
	lineVector,
	lineOrigin,
	polyVector,
	polyOrigin,
	polyLineFunc = includeS,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize2(lineVector), normalize2(polyVector));
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(lineVector, polyVector);
	const determinant1 = -determinant0;
	const a2b = subtract2(polyOrigin, lineOrigin);
	const b2a = flip(a2b);
	const t0 = cross2(a2b, polyVector) / determinant0;
	const t1 = cross2(b2a, lineVector) / determinant1;
	if (polyLineFunc(t1, epsilon / magnitude2(polyVector))) {
		return t0;
	}
	return undefined;
};
const linePointFromParameter = (vector, origin, t) => (
	add2(origin, scale2(vector, t))
);
const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
	.map((p, i, arr) => [subtract2(arr[(i + 1) % arr.length], p), p])
	.map(side => lineLineParameter(
		vector,
		origin,
		side[0],
		side[1],
		polyLineFunc,
		epsilon,
	))
	.filter(a => a !== undefined)
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
	{ vector, origin },
	fnPoly = include,
	fnLine = includeL,
	epsilon = EPSILON,
) => {
	const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
	if (numbers.length < 2) { return undefined; }
	const scaled_epsilon = (epsilon * 2) / magnitude2(vector);
	const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
	if (ends === undefined) { return undefined; }
	const clip_fn = (t) => {
		if (fnLine(t)) { return t; }
		return t < 0.5 ? 0 : 1;
	};
	const ends_clip = ends.map(clip_fn);
	if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude2(vector)) {
		return undefined;
	}
	const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
		? ends_clip.map(t => linePointFromParameter(vector, origin, t))
		: undefined;
};
const clipPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	const inside = (p, cp1, cp2) => (
		(cp2[0] - cp1[0]) * (p[1] - cp1[1])) > ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon
	);
	const intersection = (cp1, cp2, e, s) => {
		const dc = subtract2(cp1, cp2);
		const dp = subtract2(s, e);
		const n1 = cross2(cp1, cp2);
		const n2 = cross2(s, e);
		const n3 = 1.0 / cross2(dc, dp);
		return scale2(subtract2(scale2(dp, n1), scale2(dc, n2)), n3);
	};
	let outputList = polygon1;
	let cp1 = polygon2[polygon2.length - 1];
	for (let j = 0; j < polygon2.length; j += 1) {
		const cp2 = polygon2[j];
		const inputList = outputList;
		outputList = [];
		let s = inputList[inputList.length - 1];
		for (let i = 0; i < inputList.length; i += 1) {
			const e = inputList[i];
			if (inside(e, cp1, cp2)) {
				if (!inside(s, cp1, cp2)) {
					outputList.push(intersection(cp1, cp2, e, s));
				}
				outputList.push(e);
			} else if (inside(s, cp1, cp2)) {
				outputList.push(intersection(cp1, cp2, e, s));
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};

const clip = /*#__PURE__*/Object.freeze({
	__proto__: null,
	clipLineConvexPolygon,
	clipPolygonPolygon
});

const splitConvexPolygon = (poly, line) => {
	const vertices_intersections = poly.map((v, i) => {
		const intersection = overlapLinePoint(line, v, includeL);
		return { point: intersection ? v : null, at_index: i };
	}).filter(el => el.point != null);
	const edges_intersections = poly
		.map((v, i, arr) => ({
			vector: subtract(v, arr[(i + 1) % arr.length]),
			origin: arr[(i + 1) % arr.length],
		}))
		.map((polyLine, i) => ({
			point: intersectLineLine(line, polyLine, excludeL, excludeS),
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
};

const split = /*#__PURE__*/Object.freeze({
	__proto__: null,
	splitConvexPolygon
});

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
const defaultDomain = {
	polygon: includeS,
	circle: include,
	line: includeL,
	ray: includeR,
	segment: includeS,
};
const intersect = (a, b, epsilon = EPSILON) => {
	const nameType = s => (s === "polygon" ? "ConvexPolygon" : capitalize(s));
	const types = [a, b].map(typeOf);
	const methods = [types, types.slice().reverse()]
		.map(pair => pair.map(nameType).join(""))
		.map(str => intersectMethods$1[`intersect${str}`]);
	const doms = [a.domain, b.domain]
		.map((d, i) => d || defaultDomain[types[i]]);
	const parameters = [[a, b, ...doms], [b, a, ...doms.slice().reverse()]];
	const match = methods
		.map((fn, i) => ({ fn, params: parameters[i] }))
		.filter(el => el.fn)
		.shift();
	return match ? match.fn(...match.params, epsilon) : undefined;
};

const intersectMethods = {
	...encloses,
	...overlapMethods,
	...intersectMethods$1,
	...clip,
	...split,
	intersect,
};

const math = {
	...general,
	...algebra,
	...geometry,
	...intersectMethods,
};

export { math as default };

/**
 * Math (c) Kraft
 */
import typeOf from "../types/typeof.js";
import {
	exclude,
	includeS,
	excludeL,
	excludeR,
	excludeS,
} from "../general/functions.js";
import {
	intersectLineLine,
	intersectCircleCircle,
	intersectCircleLine,
	intersectConvexPolygonLine,
} from "./intersect.js";

// all intersection functions expect primitives to be in a certain form
// for example all lines are: vector, origin
const intersect_param_form = {
	polygon: a => [a],
	rect: a => [a],
	circle: a => [a.radius, a.origin],
	line: a => [a.vector, a.origin],
	ray: a => [a.vector, a.origin],
	segment: a => [a.vector, a.origin],
	// segment: a => [subtract(a[1], a[0]), a[0]],
};

const intersect_func = {
	polygon: {
		// polygon: intersectPolygonPolygon,
		// circle: convex_poly_circle,
		line: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
	},
	circle: {
		// polygon: (a, b) => convex_poly_circle(b, a),
		circle: (a, b, fnA, fnB, ep) => intersectCircleCircle(...a, ...b, ep),
		line: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
	},
	line: {
		polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
		circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
		line: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
	},
	ray: {
		polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
		circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
		line: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
	},
	segment: {
		polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
		circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
		line: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
		segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
	},
};

// convert "rect" to "polygon"
const similar_intersect_types = {
	polygon: "polygon",
	rect: "polygon",
	circle: "circle",
	line: "line",
	ray: "ray",
	segment: "segment",
};

const default_intersect_domain_function = {
	polygon: exclude, // not used
	rect: exclude, // not used
	circle: exclude, // not used
	line: excludeL,
	ray: excludeR,
	segment: excludeS,
};

/**
 * @name intersect
 * @description get the intersection of two geometry objects, the type of each is inferred.
 * @param {any} a any geometry object
 * @param {any} b any geometry object
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number[]|number[][]|undefined} the type of the result varies depending on
 * the type of the input parameters, it is always one point, or an array of points,
 * or undefined if no intersection.
 * @linkcode Math ./src/intersection/intersect.js 92
 */
const intersect = function (a, b, epsilon) {
	const type_a = typeOf(a);
	const type_b = typeOf(b);
	const aT = similar_intersect_types[type_a];
	const bT = similar_intersect_types[type_b];
	const params_a = intersect_param_form[type_a](a);
	const params_b = intersect_param_form[type_b](b);
	const domain_a = a.domain_function || default_intersect_domain_function[type_a];
	const domain_b = b.domain_function || default_intersect_domain_function[type_b];
	return intersect_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
};

export default intersect;

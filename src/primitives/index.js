/**
 * Math (c) Kraft
 */
import Constructors from "./constructors";
import Vector from "./vector/index";
import Line from "./lines/line";
import Ray from "./lines/ray";
import Segment from "./lines/segment";
import Circle from "./circle/index";
import Ellipse from "./ellipse/index";
import Rect from "./rect/index";
import Polygon from "./polygon/index";
import Polyline from "./polyline/index";
import Matrix from "./matrix/matrix";
// import Junction from "./junction/index";
// import Plane from "./plane/index";
// import Matrix2 from "./matrix/matrix2";

// import PolygonPrototype from "./prototypes/polygon";

// Each primitive is defined by these key/values:
// {
//   P: proto- the prototype of the prototype (default: Object.prototype)
//   G: getters- will become Object.defineProperty(___, ___, { get: })
//   M: methods- will become Object.defineProperty(___, ___, { value: })
//   A: args- parse user-arguments, set properties on "this"
//   S: static- static methods added to the constructor
// }
// keys are one letter to shrink minified compile size

const Definitions = Object.assign({},
  Vector,
  Line,
  Ray,
  Segment,
  Circle,
  Ellipse,
  Rect,
  Polygon,
  Polyline,
  Matrix,
  // Junction,
  // Plane,
  // Matrix2,
);

const create = function (primitiveName, args) {
  const a = Object.create(Definitions[primitiveName].proto);
  Definitions[primitiveName].A.apply(a, args);
  return a; // Object.freeze(a); // basically no cost. matrix needs to able to be modified now
};

// these have to be typed out longform like this
// this function name is what appears as the object type name in use
/**
 * @description this vector object inherits from Array.prototype, its components
 * can be accessed via array syntax, [0], [1], or .x, .y, .z properties. There
 * is no limit to the dimensions, but be careful some member functions
 * (like cross product) are limited.
 * @param {...number|number[]} numbers a list of numbers as arguments or inside an array
 * @returns {vector} one vector object
 */
const vector = function () { return create("vector", arguments); };
/**
 * @description line defined by a vector and a point passing through the line
 * @param {number[]} vector the line's vector
 * @param {number[]} origin the line's origin (without this, it will assumed to be the origin)
 * @returns {line} one line object
 */
const line = function () { return create("line", arguments); };
/**
 * @description ray defined by a vector and a point passing through the ray
 * @param {number[]} vector the ray's vector
 * @param {number[]} origin the ray's origin (without this, it will assumed to be the origin)
 * @returns {ray} one ray object
 */
const ray = function () { return create("ray", arguments); };
/**
 * @description segment, a straight line bounded by two points
 * @param {number[]} a the first point
 * @param {number[]} b the second point
 * @returns {segment} one segment object
 */
const segment = function () { return create("segment", arguments); };
/**
 * @description a circle defined by a radius and the circle's center
 * @param {number} radius
 * @param {number[]|...number} the origin of the circle 
 * @returns {circle} one circle object
 */
const circle = function () { return create("circle", arguments); };
/**
 * @description ellipse defined by two foci
 * @param {number} rx the radius along the x axis
 * @param {number} ry the radius along the y axis
 * @param {number[]} origin the center of the ellipse
 * @param {number} spin the angle of rotation in radians
 * @returns {ellipse} one ellipse object
 */
const ellipse = function () { return create("ellipse", arguments); };
/**
 * @description an axis-aligned rectangle defined by the corner and a width and height
 * @param {number} x the x coordinate of the origin
 * @param {number} y the y coordinate of the origin
 * @param {number} width the width of the rectangle
 * @param {number} height the height of the rectangle
 * @returns {rect} one rect object
 */
const rect = function () { return create("rect", arguments); };
/**
 * @description a polygon defined by a sequence of points
 * @param {number[][]|...number[]} one array containing points (array of numbers) or a list of points as the arguments.
 * @returns {polygon} one polygon object
 */
const polygon = function () { return create("polygon", arguments); };
/**
 * @description a polyline defined by a sequence of points
 * @param {number[][]|...number[]} one array containing points (array of numbers) or a list of points as the arguments.
 * @returns {polyline} one polyline object
 */
const polyline = function () { return create("polyline", arguments); };
/**
 * @description a 3x4 column-major matrix containing ijk basis vectors and a translation column.
 * @param {number[]|...number} one array of numbers, or list of numbers as parameters.
 * @returns {matrix} one 3x4 matrix object
 */
const matrix = function () { return create("matrix", arguments); };
// const junction = function () { return create("junction", arguments); };
// const plane = function () { return create("plane", arguments); };
// const matrix2 = function () { return create("matrix2", arguments); };

Object.assign(Constructors, {
  vector,
  line,
  ray,
  segment,
  circle,
  ellipse,
  rect,
  polygon,
  polyline,
  matrix,
  // junction,
  // plane,
  // matrix2,
});

// build prototypes
Object.keys(Definitions).forEach(primitiveName => {
  // create the prototype
  const Proto = {};
  Proto.prototype = Definitions[primitiveName].P != null
    ? Object.create(Definitions[primitiveName].P)
    : Object.create(Object.prototype);
  Proto.prototype.constructor = Proto;

  // make this present in the prototype chain so "instanceof" works
  Constructors[primitiveName].prototype = Proto.prototype;
  Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];

  // getters
  Object.keys(Definitions[primitiveName].G)
    .forEach(key => Object.defineProperty(Proto.prototype, key, {
      get: Definitions[primitiveName].G[key],
      // enumerable: true
    }));

  // methods
  Object.keys(Definitions[primitiveName].M)
    .forEach(key => Object.defineProperty(Proto.prototype, key, {
      value: Definitions[primitiveName].M[key],
    }));

  // applied to the constructor not the prototype
  Object.keys(Definitions[primitiveName].S)
    .forEach(key => Object.defineProperty(Constructors[primitiveName], key, {
      // bind to the prototype, this.constructor will point to the constructor
      value: Definitions[primitiveName].S[key]
        .bind(Constructors[primitiveName].prototype),
    }));

  // done with prototype
  // Object.freeze(Proto.prototype); // now able to be modified from the outside

  // store the prototype on the Definition, to be called during instantiation
  Definitions[primitiveName].proto = Proto.prototype;
});

// console.log(Definitions);

// add the prototypes as a child of the main exported object
// Constructors.__prototypes__ = Object.create(null);
// Object.keys(Definitions).forEach(primitiveName => {
//   Constructors.__prototypes__[primitiveName] = Definitions[primitiveName].proto;
// });

export default Constructors;


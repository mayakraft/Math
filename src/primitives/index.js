import Constructors from "./constructors";
import Vector from "./vector/index";
// import Circle from "./circle/index";
// import Ellipse from "./ellipse/index";
// import Rect from "./rect/index";
// import Polygon from "./polygon/index";
import Line from "./lines/line";
// import Ray from "./lines/ray";
// import Segment from "./lines/segment";
// import Matrix from "./matrix/matrix";
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
  // Circle,
  // Ellipse,
  // Rect,
  // Polygon,
  // Line,
  // Ray,
  // Segment,
  // Matrix,
  // Matrix2,
);

const create = function (primitiveName, args) {
  const a = Object.create(Definitions[primitiveName].proto);
  Definitions[primitiveName].A.apply(a, args);
  return Object.freeze(a);
};

// these have to be typed out longform like this
// this function name is what appears as the object type name in use
const vector = function () { return create("vector", arguments); };
const circle = function () { return create("circle", arguments); };
const ellipse = function () { return create("ellipse", arguments); };
const rect = function () { return create("rect", arguments); };
const polygon = function () { return create("polygon", arguments); };
const line = function () { return create("line", arguments); };
const ray = function () { return create("ray", arguments); };
const segment = function () { return create("segment", arguments); };
const matrix = function () { return create("matrix", arguments); };
// const matrix2 = function () { return create("matrix2", arguments); };

Object.assign(Constructors, {
  vector,
  circle,
  ellipse,
  rect,
  polygon,
  line,
  ray,
  segment,
  matrix,
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

  // getters
  Object.keys(Definitions[primitiveName].G)
    .forEach(key => Object.defineProperty(Proto.prototype, key, {
      get: Definitions[primitiveName].G[key],
      enumerable: true
    }));

  // methods
  Object.keys(Definitions[primitiveName].M)
    .forEach(key => Object.defineProperty(Proto.prototype, key, {
      value: Definitions[primitiveName].M[key],
    }));

  // static methods
  // applied to the constructor not the prototype
  Object.keys(Definitions[primitiveName].S)
    .forEach(key => Object.defineProperty(Constructors[primitiveName], key, {
      value: Definitions[primitiveName].S[key],
    }));

  // make this present in the prototype chain so "instanceof" works
  Constructors[primitiveName].prototype = Proto.prototype;
  Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];

  // done with prototype
  Object.freeze(Proto.prototype);
  // store the prototype on the Definition, to be called during instantiation
  Definitions[primitiveName].proto = Proto.prototype;
});

// console.log(Definitions);

export default Constructors;

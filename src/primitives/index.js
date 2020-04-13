import Constructors from "./constructors";
import Vector from "./vector/index";
import Circle from "./circle/index";
import Rect from "./rect/index";
import Polygon from "./polygon/index";
import Line from "./lines/line";

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

const create = function (primitiveName, args) {
  const a = Object.create(Definitions[primitiveName].proto);
  Definitions[primitiveName].A.apply(a, args);
  return Object.freeze(a);
};

const Definitions = Object.assign({},
  Vector,
  Circle,
  Rect,
  Polygon,
  Line,
);

// these have to be typed out longform like this
// this function name is what appears as the object type name in use
const vector = function () { return create("vector", arguments); };
const circle = function () { return create("circle", arguments); };
const rect = function () { return create("rect", arguments); };
const polygon = function () { return create("polygon", arguments); };
const line = function () { return create("line", arguments); };

Object.assign(Constructors, {
  vector,
  circle,
  rect,
  polygon,
  line,
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

  // store the prototype on the Definition, to be called during instantiation
  Definitions[primitiveName].proto = Proto.prototype;

  // static methods
  // applied to the constructor not the prototype
  Object.keys(Definitions[primitiveName].S)
    .forEach(key => Object.defineProperty(Constructors[primitiveName], key, {
      value: Definitions[primitiveName].S[key],
    }));

  // make this present in the prototype chain so "instanceof" works
  Constructors[primitiveName].prototype = Definitions[primitiveName].proto;
  Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];

  // done with prototype
  Object.freeze(Definitions[primitiveName].proto);
});

console.log(Definitions);

export default Constructors;

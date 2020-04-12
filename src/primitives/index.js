import Vector from "./vector/index";

const Definitions = Object.assign({}, Vector);

// we need:
// - Super: what should be the prototype of the prototype (default Object)
//   example: Array.prototype
// - Getters
// - Methods
// - args
// - static

const create = function (primitiveName, args) {
  const a = Object.create(Definitions[primitiveName].proto.prototype);
  Definitions[primitiveName].Args.apply(a, args);
  return Object.freeze(a);
};

// these have to be typed out longform like this
// this function name is what appears as the object type name
const vector = function () { return create("vector", arguments); };
const circle = function () { return create("circle", arguments); };
const rect = function () { return create("rect", arguments); };

const Primitives = {
  vector,
  circle,
  rect
};

// build prototypes
Object.keys(Definitions).forEach(primitiveName => {
  // create the prototype
  const Proto = {};
  Proto.prototype = Object
    .create(Definitions[primitiveName].Super || Object.prototype);
  Proto.prototype.constructor = Proto;

  // getters
  Object.keys(Definitions[primitiveName].Getters)
    .forEach(key => Object.defineProperty(Proto.prototype, key, {
      get: Definitions[primitiveName].Getters[key],
      enumerable: true
    }));

  // methods
  Object.keys(Definitions[primitiveName].Methods)
    .forEach(key => Object.defineProperty(Proto.prototype, key, {
      value: Definitions[primitiveName].Methods[key],
    }));
  Definitions[primitiveName].proto = Proto;

  // static methods
  Definitions[primitiveName].Static(Primitives[primitiveName]);

  // make this present in the prototype chain so "instanceof" works
  Primitives[primitiveName].prototype = Definitions[primitiveName].proto.prototype;
  Primitives[primitiveName].prototype.constructor = Primitives[primitiveName];

  // done with prototype
  Object.freeze(Definitions[primitiveName].proto.prototype);

  // pass a pointer to this object up the chain
  Definitions[primitiveName].Methods.constructor = Primitives[primitiveName];
});

export default Primitives;

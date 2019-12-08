import { get_vector } from "../parsers/arguments";
import Prototype from "./prototypes/vector";

/** n-dimensional vector, but some operations meant only for 2D */
const Vector = function (...args) {
  const proto = Prototype(Vector);
  const vector = Object.create(proto);
  proto.bind(vector);
  get_vector(args).forEach(v => vector.push(v));

  Object.defineProperty(vector, "x", { get: () => vector[0] });
  Object.defineProperty(vector, "y", { get: () => vector[1] });
  Object.defineProperty(vector, "z", { get: () => vector[2] });

  return vector;
};

Vector.withAngle = function (angle) {
  return Vector(Math.cos(angle), Math.sin(angle));
};

export default Vector;

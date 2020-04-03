import ConvexPolygon from "./convexPolygon";
import Prototype from "./prototypes/polygon";
import Vector from "./vector";
import { get_vector_of_vectors } from "../parsers/arguments";
import { enclosing_rectangle } from "../core/geometry";

/**
 * this Rectangle type is aligned to the axes for speedy calculation.
 * for a rectangle that can be rotated, use Polygon or ConvexPolygon
 */
const Rectangle = function (...args) {
  // it's possible to initialize a Rectangle with:
  // - 4 points, one for each corner
  // - 4 numbers in this order: x, y, width, height, where x,y specify top left
  // todo build that input
  let origin;
  let width;
  let height;
  // get parameters
  const params = Array.from(args);
  const numbers = params.filter(param => !isNaN(param));
  let arrays = params.filter(param => param.constructor === Array);
  if (numbers.length === 4) {
    origin = Vector(numbers.slice(0, 2));
    [, , width, height] = numbers;
  }
  if (arrays.length === 1) { arrays = arrays[0]; }
  if (arrays.length === 2) {
    if (typeof arrays[0][0] === "number") {
      origin = Vector(arrays[0].slice());
      width = arrays[1][0];
      height = arrays[1][1];
    }
  }
  // end get parameters
  const points = [
    [origin[0], origin[1]],
    [origin[0] + width, origin[1]],
    [origin[0] + width, origin[1] + height],
    [origin[0], origin[1] + height],
  ];

  const proto = Prototype.bind(this);
  const rect = Object.create(proto(Rectangle));

  // overwrite prototype methods
  const scale = function (magnitude, center_point) {
    const center = (center_point != null)
      ? center_point
      : [origin[0] + width, origin[1] + height];
    const x = origin[0] + (center[0] - origin[0]) * (1 - magnitude);
    const y = origin[1] + (center[1] - origin[1]) * (1 - magnitude);
    return Rectangle(x, y, width * magnitude, height * magnitude);
  };

  const rotate = function (...innerArgs) {
    return ConvexPolygon(points).rotate(...innerArgs);
  };
  const transform = function (...innerArgs) {
    return ConvexPolygon(points).transform(innerArgs);
  };

  Object.defineProperty(rect, "points", { get: () => points });
  Object.defineProperty(rect, "origin", { get: () => origin });
  Object.defineProperty(rect, "width", { get: () => width });
  Object.defineProperty(rect, "height", { get: () => height });
  Object.defineProperty(rect, "area", { get: () => width * height });
  Object.defineProperty(rect, "scale", { value: scale });
  Object.defineProperty(rect, "rotate", { value: rotate });
  Object.defineProperty(rect, "transform", { value: transform });

  // return Object.freeze(rect);
  return rect;
};

Rectangle.fromPoints = function (...args) {
  const points = get_vector_of_vectors(args);
  const rect = enclosing_rectangle(points);
  return Rectangle(rect);
};


export default Rectangle;

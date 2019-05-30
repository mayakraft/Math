import ConvexPolygon from "./convexPolygon";
import Prototype from "./prototypes/polygon";

/**
 * this Rectangle type is aligned to the axes for speedy calculation.
 * for a rectangle that can be rotated, use Polygon or ConvexPolygon
 */
const Rectangle = function (...args) {
  // it's possible to initialize a Rectangle with:
  // - 4 points, one for each corner
  // - 4 numbers in this order: x, y, width, height, where x,y specify top left
  // todo build that input
  let _origin;
  let _width;
  let _height;
  // get parameters
  const params = Array.from(args);
  const numbers = params.filter(param => !isNaN(param));
  let arrays = params.filter(param => param.constructor === Array);
  if (numbers.length === 4) {
    _origin = numbers.slice(0, 2);
    [, , _width, _height] = numbers;
  }
  if (arrays.length === 1) { arrays = arrays[0]; }
  if (arrays.length === 2) {
    if (typeof arrays[0][0] === "number") {
      _origin = arrays[0].slice();
      _width = arrays[1][0];
      _height = arrays[1][1];
    }
  }
  // end get parameters
  const points = [
    [_origin[0], _origin[1]],
    [_origin[0] + _width, _origin[1]],
    [_origin[0] + _width, _origin[1] + _height],
    [_origin[0], _origin[1] + _height],
  ];

  const rect = Object.create(Prototype(Rectangle));

  // overwrite prototype methods
  const scale = function (magnitude, center_point) {
    const center = (center_point != null)
      ? center_point
      : [_origin[0] + _width, _origin[1] + _height];
    const x = _origin[0] + (center[0] - _origin[0]) * (1 - magnitude);
    const y = _origin[1] + (center[1] - _origin[1]) * (1 - magnitude);
    return Rectangle(x, y, _width * magnitude, _height * magnitude);
  };

  const rotate = function (...innerArgs) {
    return ConvexPolygon(points).rotate(...innerArgs);
  };
  const transform = function (...innerArgs) {
    return ConvexPolygon(points).transform(innerArgs);
  };

  Object.defineProperty(rect, "origin", { get: () => _origin });
  Object.defineProperty(rect, "width", { get: () => _width });
  Object.defineProperty(rect, "height", { get: () => _height });
  Object.defineProperty(rect, "area", { get: () => _width * _height });
  Object.defineProperty(rect, "scale", { value: scale });
  Object.defineProperty(rect, "rotate", { value: rotate });
  Object.defineProperty(rect, "transform", { value: transform });

  // return Object.freeze(rect);
  return rect;
};

export default Rectangle;

/* Math (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.math = factory());
}(this, (function () { 'use strict';

  var magnitude = function magnitude(v) {
    var sum = v.map(function (component) {
      return component * component;
    }).reduce(function (prev, curr) {
      return prev + curr;
    }, 0);
    return Math.sqrt(sum);
  };
  var normalize = function normalize(v) {
    var m = magnitude(v);
    return m === 0 ? v : v.map(function (c) {
      return c / m;
    });
  };
  var dot = function dot(a, b) {
    return a.map(function (_, i) {
      return a[i] * b[i];
    }).reduce(function (prev, curr) {
      return prev + curr;
    }, 0);
  };
  var average = function average() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var dimension = args.length > 0 ? args[0].length : 0;
    var sum = Array(dimension).fill(0);
    args.forEach(function (vec) {
      return sum.forEach(function (_, i) {
        sum[i] += vec[i] || 0;
      });
    });
    return sum.map(function (n) {
      return n / args.length;
    });
  };
  var cross2 = function cross2(a, b) {
    return [a[0] * b[1], a[1] * b[0]];
  };
  var cross3 = function cross3(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[0] * b[2] - a[2] * b[0], a[0] * b[1] - a[1] * b[0]];
  };
  var distance2 = function distance2(a, b) {
    var p = a[0] - b[0];
    var q = a[1] - b[1];
    return Math.sqrt(p * p + q * q);
  };
  var distance3 = function distance3(a, b) {
    var c = a[0] - b[0];
    var d = a[1] - b[1];
    var e = a[2] - b[2];
    return Math.sqrt(c * c + d * d + e * e);
  };
  var distance = function distance(a, b) {
    var dimension = a.length;
    var sum = 0;

    for (var i = 0; i < dimension; i += 1) {
      sum += Math.pow(a[i] - b[i], 2);
    }

    return Math.sqrt(sum);
  };
  var midpoint2 = function midpoint2(a, b) {
    return a.map(function (_, i) {
      return (a[i] + b[i]) / 2;
    });
  };

  var algebra = /*#__PURE__*/Object.freeze({
    __proto__: null,
    magnitude: magnitude,
    normalize: normalize,
    dot: dot,
    average: average,
    cross2: cross2,
    cross3: cross3,
    distance2: distance2,
    distance3: distance3,
    distance: distance,
    midpoint2: midpoint2
  });

  var multiply_matrix2_vector2 = function multiply_matrix2_vector2(matrix, vector) {
    return [matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4], matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]];
  };
  var multiply_matrix2_line2 = function multiply_matrix2_line2(matrix, origin, vector) {
    return {
      origin: [matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4], matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]],
      vector: [matrix[0] * vector[0] + matrix[2] * vector[1], matrix[1] * vector[0] + matrix[3] * vector[1]]
    };
  };
  var multiply_matrices2 = function multiply_matrices2(m1, m2) {
    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
  };
  var matrix2_determinant = function matrix2_determinant(m) {
    return m[0] * m[3] - m[1] * m[2];
  };
  var invert_matrix2 = function invert_matrix2(m) {
    var det = matrix2_determinant(m);

    if (Math.abs(det) < 1e-6 || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
      return undefined;
    }

    return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
  };
  var make_matrix2_translate = function make_matrix2_translate(x, y) {
    return [1, 0, 0, 1, x, y];
  };
  var make_matrix2_scale = function make_matrix2_scale(x, y) {
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
    return [x, 0, 0, y, x * -origin[0] + origin[0], y * -origin[1] + origin[1]];
  };
  var make_matrix2_rotate = function make_matrix2_rotate(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [cos, sin, -sin, cos, origin[0], origin[1]];
  };
  var make_matrix2_reflection = function make_matrix2_reflection(vector) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
    var angle = Math.atan2(vector[1], vector[0]);
    var cosAngle = Math.cos(angle);
    var sinAngle = Math.sin(angle);
    var cos_Angle = Math.cos(-angle);
    var sin_Angle = Math.sin(-angle);
    var a = cosAngle * cos_Angle + sinAngle * sin_Angle;
    var b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
    var c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
    var d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
    var tx = origin[0] + a * -origin[0] + -origin[1] * c;
    var ty = origin[1] + b * -origin[0] + -origin[1] * d;
    return [a, b, c, d, tx, ty];
  };

  var matrix2_core = /*#__PURE__*/Object.freeze({
    __proto__: null,
    multiply_matrix2_vector2: multiply_matrix2_vector2,
    multiply_matrix2_line2: multiply_matrix2_line2,
    multiply_matrices2: multiply_matrices2,
    matrix2_determinant: matrix2_determinant,
    invert_matrix2: invert_matrix2,
    make_matrix2_translate: make_matrix2_translate,
    make_matrix2_scale: make_matrix2_scale,
    make_matrix2_rotate: make_matrix2_rotate,
    make_matrix2_reflection: make_matrix2_reflection
  });

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var multiply_matrix3_vector3 = function multiply_matrix3_vector3(m, vector) {
    return [m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9], m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10], m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]];
  };
  var multiply_matrix3_line3 = function multiply_matrix3_line3(m, origin, vector) {
    return {
      origin: [m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9], m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10], m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11]],
      vector: [m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2], m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2], m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2]]
    };
  };
  var multiply_matrices3 = function multiply_matrices3(m1, m2) {
    return [m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2], m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2], m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2], m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5], m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5], m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5], m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8], m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8], m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8], m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9], m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10], m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11]];
  };
  var matrix3_determinant = function matrix3_determinant(m) {
    return m[0] * m[4] * m[8] - m[0] * m[7] * m[5] - m[3] * m[1] * m[8] + m[3] * m[7] * m[2] + m[6] * m[1] * m[5] - m[6] * m[4] * m[2];
  };
  var invert_matrix3 = function invert_matrix3(m) {
    var det = matrix3_determinant(m);

    if (Math.abs(det) < 1e-6 || isNaN(det) || !isFinite(m[9]) || !isFinite(m[10]) || !isFinite(m[11])) {
      return undefined;
    }

    var inv = [m[4] * m[8] - m[7] * m[5], -m[1] * m[8] + m[7] * m[2], m[1] * m[5] - m[4] * m[2], -m[3] * m[8] + m[6] * m[5], m[0] * m[8] - m[6] * m[2], -m[0] * m[5] + m[3] * m[2], m[3] * m[7] - m[6] * m[4], -m[0] * m[7] + m[6] * m[1], m[0] * m[4] - m[3] * m[1], -m[3] * m[7] * m[11] + m[3] * m[8] * m[10] + m[6] * m[4] * m[11] - m[6] * m[5] * m[10] - m[9] * m[4] * m[8] + m[9] * m[5] * m[7], m[0] * m[7] * m[11] - m[0] * m[8] * m[10] - m[6] * m[1] * m[11] + m[6] * m[2] * m[10] + m[9] * m[1] * m[8] - m[9] * m[2] * m[7], -m[0] * m[4] * m[11] + m[0] * m[5] * m[10] + m[3] * m[1] * m[11] - m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4]];
    var invDet = 1.0 / det;
    return inv.map(function (n) {
      return n * invDet;
    });
  };
  var make_matrix3_translate = function make_matrix3_translate() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return [1, 0, 0, 0, 1, 0, 0, 0, 1, x, y, z];
  };
  var make_matrix3_rotateX = function make_matrix3_rotateX(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [1, 0, 0, 0, cos, sin, 0, -sin, cos, origin[0] || 0, origin[1] || 0, origin[2] || 0];
  };
  var make_matrix3_rotateY = function make_matrix3_rotateY(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [cos, 0, -sin, 0, 1, 0, sin, 0, cos, origin[0] || 0, origin[1] || 0, origin[2] || 0];
  };
  var make_matrix3_rotateZ = function make_matrix3_rotateZ(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [cos, sin, 0, -sin, cos, 0, 0, 0, 1, origin[0] || 0, origin[1] || 0, origin[2] || 0];
  };
  var make_matrix3_rotate = function make_matrix3_rotate(angle) {
    var vector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 1];
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 0];
    var vec = normalize(vector);
    var pos = Array.from(Array(3)).map(function (n, i) {
      return origin[i] || 0;
    });

    var _vec = _slicedToArray(vec, 3),
        a = _vec[0],
        b = _vec[1],
        c = _vec[2];

    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var d = Math.sqrt(vec[1] * vec[1] + vec[2] * vec[2]);
    var b_d = Math.abs(d) < 1e-6 ? 0 : b / d;
    var c_d = Math.abs(d) < 1e-6 ? 1 : c / d;
    var t = [1, 0, 0, 0, 1, 0, 0, 0, 1, pos[0], pos[1], pos[2]];
    var t_inv = [1, 0, 0, 0, 1, 0, 0, 0, 1, -pos[0], -pos[1], -pos[2]];
    var rx = [1, 0, 0, 0, c_d, b_d, 0, -b_d, c_d, 0, 0, 0];
    var rx_inv = [1, 0, 0, 0, c_d, -b_d, 0, b_d, c_d, 0, 0, 0];
    var ry = [d, 0, a, 0, 1, 0, -a, 0, d, 0, 0, 0];
    var ry_inv = [d, 0, -a, 0, 1, 0, a, 0, d, 0, 0, 0];
    var rz = [cos, sin, 0, -sin, cos, 0, 0, 0, 1, 0, 0, 0];
    return multiply_matrices3(t_inv, multiply_matrices3(rx_inv, multiply_matrices3(ry_inv, multiply_matrices3(rz, multiply_matrices3(ry, multiply_matrices3(rx, t))))));
  };
  var make_matrix3_scale = function make_matrix3_scale(scale) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    return [scale, 0, 0, 0, scale, 0, 0, 0, scale, scale * -origin[0] + origin[0], scale * -origin[1] + origin[1], scale * -origin[2] + origin[2]];
  };
  var make_matrix3_reflectionZ = function make_matrix3_reflectionZ(vector) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
    var angle = Math.atan2(vector[1], vector[0]);
    var cosAngle = Math.cos(angle);
    var sinAngle = Math.sin(angle);
    var cos_Angle = Math.cos(-angle);
    var sin_Angle = Math.sin(-angle);
    var a = cosAngle * cos_Angle + sinAngle * sin_Angle;
    var b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
    var c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
    var d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
    var tx = origin[0] + a * -origin[0] + -origin[1] * c;
    var ty = origin[1] + b * -origin[0] + -origin[1] * d;
    return [a, b, 0, c, d, 0, 0, 0, 0, tx, ty, 0];
  };

  var matrix3_core = /*#__PURE__*/Object.freeze({
    __proto__: null,
    multiply_matrix3_vector3: multiply_matrix3_vector3,
    multiply_matrix3_line3: multiply_matrix3_line3,
    multiply_matrices3: multiply_matrices3,
    matrix3_determinant: matrix3_determinant,
    invert_matrix3: invert_matrix3,
    make_matrix3_translate: make_matrix3_translate,
    make_matrix3_rotateX: make_matrix3_rotateX,
    make_matrix3_rotateY: make_matrix3_rotateY,
    make_matrix3_rotateZ: make_matrix3_rotateZ,
    make_matrix3_rotate: make_matrix3_rotate,
    make_matrix3_scale: make_matrix3_scale,
    make_matrix3_reflectionZ: make_matrix3_reflectionZ
  });

  var Typeof = function Typeof(obj) {
    if (_typeof(obj) === "object") {
      if (obj.radius != null) {
        return "circle";
      }

      if (obj.width != null) {
        return "rectangle";
      }

      if (obj.x != null) {
        return "vector";
      }

      if (obj.rotate180 != null) {
        return "ray";
      }

      if (obj[0] != null && obj[0].length && obj[0].x != null) {
        return "segment";
      }

      if (obj.vector != null && obj.origin != null) {
        return "line";
      }
    }

    return undefined;
  };

  var countPlaces = function countPlaces(num) {
    var m = "".concat(num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

    if (!m) {
      return 0;
    }

    return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
  };

  var clean_number = function clean_number(num) {
    var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;

    if (typeof num !== "number") {
      return num;
    }

    var crop = parseFloat(num.toFixed(places));

    if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
      return num;
    }

    return crop;
  };
  var is_number = function is_number(n) {
    return n != null && !isNaN(n);
  };
  var is_vector = function is_vector(a) {
    return a != null && a[0] != null && !isNaN(a[0]);
  };
  var is_iterable = function is_iterable(obj) {
    return obj != null && typeof obj[Symbol.iterator] === "function";
  };
  var flatten_input = function flatten_input() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    switch (args.length) {
      case undefined:
      case 0:
        return args;

      case 1:
        return is_iterable(args[0]) && typeof args[0] !== "string" ? flatten_input.apply(void 0, _toConsumableArray(args[0])) : [args[0]];

      default:
        return Array.from(args).map(function (a) {
          return is_iterable(a) ? _toConsumableArray(flatten_input(a)) : a;
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []);
    }
  };
  var semi_flatten_input = function semi_flatten_input() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var list = args;

    while (list.length === 1 && _typeof(list[0]) === "object" && list[0].length) {
      var _list = list;

      var _list2 = _slicedToArray(_list, 1);

      list = _list2[0];
    }

    return list;
  };
  var get_vector = function get_vector() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var list = flatten_input(args).filter(function (a) {
      return a !== undefined;
    });

    if (list === undefined) {
      return undefined;
    }

    if (list.length === 0) {
      return undefined;
    }

    if (!isNaN(list[0].x)) {
      list = ["x", "y", "z"].map(function (c) {
        return list[0][c];
      }).filter(function (a) {
        return a !== undefined;
      });
    }

    return list.filter(function (n) {
      return typeof n === "number";
    });
  };
  var get_vector_of_vectors = function get_vector_of_vectors() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return semi_flatten_input(args).map(function (el) {
      return get_vector(el);
    });
  };
  var identity2 = [1, 0, 0, 1, 0, 0];
  var identity3 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
  var get_matrix2 = function get_matrix2() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    var m = get_vector(args);

    if (m === undefined) {
      return undefined;
    }

    if (m.length === 6) {
      return m;
    }

    if (m.length > 6) {
      return [m[0], m[1], m[2], m[3], m[4], m[5]];
    }

    if (m.length < 6) {
      return identity2.map(function (n, i) {
        return m[i] || n;
      });
    }

    return undefined;
  };
  var get_matrix3 = function get_matrix3() {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    var m = get_vector(args);

    if (m === undefined) {
      return undefined;
    }

    switch (m.length) {
      case 4:
        return [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

      case 6:
        return [m[0], m[1], 0, m[2], m[3], 0, 0, 0, 1, m[4], m[5], 0];

      case 9:
        return [m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], 0, 0, 0];

      case 12:
        return m;

      case 16:
        return [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10], m[12], m[13], m[14]];
    }

    if (m.length > 12) {
      return [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10], m[12], m[13], m[14]];
    }

    if (m.length < 12) {
      return identity3.map(function (n, i) {
        return m[i] || n;
      });
    }

    return undefined;
  };
  function get_segment() {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return get_vector_of_vectors(args);
  }
  function get_line() {
    var params = Array.from(arguments);
    var numbers = params.filter(function (param) {
      return !isNaN(param);
    });
    var arrays = params.filter(function (param) {
      return param.constructor === Array;
    });

    if (params.length === 0) {
      return {
        vector: [],
        origin: []
      };
    }

    if (!isNaN(params[0]) && numbers.length >= 4) {
      return {
        origin: [params[0], params[1]],
        vector: [params[2], params[3]]
      };
    }

    if (arrays.length > 0) {
      if (arrays.length === 1) {
        return get_line.apply(void 0, _toConsumableArray(arrays[0]));
      }

      if (arrays.length === 2) {
        return {
          origin: [arrays[0][0], arrays[0][1]],
          vector: [arrays[1][0], arrays[1][1]]
        };
      }

      if (arrays.length === 4) {
        return {
          origin: [arrays[0], arrays[1]],
          vector: [arrays[2], arrays[3]]
        };
      }
    }

    if (params[0].constructor === Object) {
      var vector = [],
          origin = [];

      if (params[0].vector != null) {
        vector = get_vector(params[0].vector);
      } else if (params[0].direction != null) {
        vector = get_vector(params[0].direction);
      }

      if (params[0].origin != null) {
        origin = get_vector(params[0].origin);
      } else if (params[0].point != null) {
        origin = get_vector(params[0].point);
      }

      return {
        origin: origin,
        vector: vector
      };
    }

    return {
      origin: [],
      vector: []
    };
  }
  function get_ray() {
    return get_line.apply(void 0, arguments);
  }
  function get_two_vec2() {
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    if (args.length === 0) {
      return undefined;
    }

    if (args.length === 1 && args[0] !== undefined) {
      return get_two_vec2.apply(void 0, _toConsumableArray(args[0]));
    }

    var params = Array.from(args);
    var numbers = params.filter(function (param) {
      return !isNaN(param);
    });
    var arrays = params.filter(function (o) {
      return _typeof(o) === "object";
    }).filter(function (param) {
      return param.constructor === Array;
    });

    if (numbers.length >= 4) {
      return [[numbers[0], numbers[1]], [numbers[2], numbers[3]]];
    }

    if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
      return arrays;
    }

    if (arrays.length === 1 && !isNaN(arrays[0][0][0])) {
      return arrays[0];
    }

    return undefined;
  }
  function get_array_of_vec() {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    if (args.length === 0) {
      return undefined;
    }

    if (args.length === 1 && args[0] !== undefined) {
      return get_array_of_vec.apply(void 0, _toConsumableArray(args[0]));
    }

    return Array.from(args);
  }
  function get_array_of_vec2() {
    var params = Array.from(arguments);
    var arrays = params.filter(function (param) {
      return param.constructor === Array;
    });

    if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
      return arrays;
    }

    if (arrays.length === 1 && arrays[0].length >= 1) {
      return arrays[0];
    }

    return params;
  }

  var args = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Typeof: Typeof,
    clean_number: clean_number,
    is_number: is_number,
    is_vector: is_vector,
    is_iterable: is_iterable,
    flatten_input: flatten_input,
    semi_flatten_input: semi_flatten_input,
    get_vector: get_vector,
    get_vector_of_vectors: get_vector_of_vectors,
    get_matrix2: get_matrix2,
    get_matrix3: get_matrix3,
    get_segment: get_segment,
    get_line: get_line,
    get_ray: get_ray,
    get_two_vec2: get_two_vec2,
    get_array_of_vec: get_array_of_vec,
    get_array_of_vec2: get_array_of_vec2
  });

  var EPSILON = 1e-6;

  var array_similarity_test = function array_similarity_test(list, compFunc) {
    return Array.from(Array(list.length - 1)).map(function (_, i) {
      return compFunc(list[0], list[i + 1]);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };

  var equivalent_numbers = function equivalent_numbers() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length === 0) {
      return false;
    }

    if (args.length === 1 && args[0] !== undefined) {
      return equivalent_numbers.apply(void 0, _toConsumableArray(args[0]));
    }

    return array_similarity_test(args, function (a, b) {
      return Math.abs(a - b) < EPSILON;
    });
  };
  var equivalent_vectors = function equivalent_vectors() {
    var list = get_vector_of_vectors.apply(void 0, arguments);

    if (list.length === 0) {
      return false;
    }

    if (list.length === 1 && list[0] !== undefined) {
      return equivalent_vectors.apply(void 0, _toConsumableArray(list[0]));
    }

    var dimension = list[0].length;
    var dim_array = Array.from(Array(dimension));

    for (var i = 1; i < list.length; i += 1) {
      if (_typeof(list[i - 1]) !== _typeof(list[i])) {
        return false;
      }
    }

    return Array.from(Array(list.length - 1)).map(function (element, i) {
      return dim_array.map(function (_, di) {
        return Math.abs(list[i][di] - list[i + 1][di]) < EPSILON;
      }).reduce(function (prev, curr) {
        return prev && curr;
      }, true);
    }).reduce(function (prev, curr) {
      return prev && curr;
    }, true) && Array.from(Array(list.length - 1)).map(function (_, i) {
      return list[0].length === list[i + 1].length;
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };
  var equivalent = function equivalent() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var list = semi_flatten_input(args);

    if (list.length < 1) {
      return false;
    }

    var typeofList = _typeof(list[0]);

    if (typeofList === "undefined") {
      return false;
    }

    if (list[0].constructor === Array) {
      list = list.map(function (el) {
        return semi_flatten_input(el);
      });
    }

    switch (typeofList) {
      case "number":
        return array_similarity_test(list, function (a, b) {
          return Math.abs(a - b) < EPSILON;
        });

      case "boolean":
        return array_similarity_test(list, function (a, b) {
          return a === b;
        });

      case "string":
        return array_similarity_test(list, function (a, b) {
          return a === b;
        });

      case "object":
        if (list[0].constructor === Array) {
          return equivalent_vectors.apply(void 0, _toConsumableArray(list));
        }

        console.warn("comparing array of objects for equivalency by slow JSON.stringify with no epsilon check");
        return array_similarity_test(list, function (a, b) {
          return JSON.stringify(a) === JSON.stringify(b);
        });

      default:
        console.warn("incapable of determining comparison method");
        break;
    }

    return false;
  };

  var equal = /*#__PURE__*/Object.freeze({
    __proto__: null,
    EPSILON: EPSILON,
    equivalent_numbers: equivalent_numbers,
    equivalent_vectors: equivalent_vectors,
    equivalent: equivalent
  });

  var overlap_function = function overlap_function(aPt, aVec, bPt, bVec, compFunc) {
    var det = function det(a, b) {
      return a[0] * b[1] - b[0] * a[1];
    };

    var denominator0 = det(aVec, bVec);
    var denominator1 = -denominator0;
    var numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
    var numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);

    if (Math.abs(denominator0) < EPSILON) {
      return false;
    }

    var t0 = numerator0 / denominator0;
    var t1 = numerator1 / denominator1;
    return compFunc(t0, t1);
  };

  var segment_segment_comp = function segment_segment_comp(t0, t1) {
    return t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
  };

  var segment_segment_overlap = function segment_segment_overlap(a0, a1, b0, b1) {
    var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return overlap_function(a0, aVec, b0, bVec, segment_segment_comp);
  };
  var degenerate = function degenerate(v) {
    return Math.abs(v.reduce(function (a, b) {
      return a + b;
    }, 0)) < EPSILON;
  };
  var parallel = function parallel(a, b) {
    return 1 - Math.abs(dot(normalize(a), normalize(b))) < EPSILON;
  };
  var point_on_line = function point_on_line(linePoint, lineVector, point) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    var pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
    var cross = pointPoint[0] * lineVector[1] - pointPoint[1] * lineVector[0];
    return Math.abs(cross) < epsilon;
  };
  var point_on_segment = function point_on_segment(seg0, seg1, point) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    var seg0_1 = [seg0[0] - seg1[0], seg0[1] - seg1[1]];
    var seg0_p = [seg0[0] - point[0], seg0[1] - point[1]];
    var seg1_p = [seg1[0] - point[0], seg1[1] - point[1]];
    var dEdge = Math.sqrt(seg0_1[0] * seg0_1[0] + seg0_1[1] * seg0_1[1]);
    var dP0 = Math.sqrt(seg0_p[0] * seg0_p[0] + seg0_p[1] * seg0_p[1]);
    var dP1 = Math.sqrt(seg1_p[0] * seg1_p[0] + seg1_p[1] * seg1_p[1]);
    return Math.abs(dEdge - dP0 - dP1) < epsilon;
  };
  var point_in_poly = function point_in_poly(point, poly) {
    var isInside = false;

    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      if (poly[i][1] > point[1] != poly[j][1] > point[1] && point[0] < (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) {
        isInside = !isInside;
      }
    }

    return isInside;
  };
  var point_in_convex_poly = function point_in_convex_poly(point, poly) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;

    if (poly == null || !(poly.length > 0)) {
      return false;
    }

    return poly.map(function (p, i, arr) {
      var nextP = arr[(i + 1) % arr.length];
      var a = [nextP[0] - p[0], nextP[1] - p[1]];
      var b = [point[0] - p[0], point[1] - p[1]];
      return a[0] * b[1] - a[1] * b[0] > -epsilon;
    }).map(function (s, i, arr) {
      return s === arr[0];
    }).reduce(function (prev, curr) {
      return prev && curr;
    }, true);
  };
  var point_in_convex_poly_exclusive = function point_in_convex_poly_exclusive(point, poly) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;

    if (poly == null || !(poly.length > 0)) {
      return false;
    }

    return poly.map(function (p, i, arr) {
      var nextP = arr[(i + 1) % arr.length];
      var a = [nextP[0] - p[0], nextP[1] - p[1]];
      var b = [point[0] - p[0], point[1] - p[1]];
      return a[0] * b[1] - a[1] * b[0] > epsilon;
    }).map(function (s, i, arr) {
      return s === arr[0];
    }).reduce(function (prev, curr) {
      return prev && curr;
    }, true);
  };
  var convex_polygons_overlap = function convex_polygons_overlap(ps1, ps2) {
    var e1 = ps1.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    });
    var e2 = ps2.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    });

    for (var i = 0; i < e1.length; i += 1) {
      for (var j = 0; j < e2.length; j += 1) {
        if (segment_segment_overlap(e1[i][0], e1[i][1], e2[j][0], e2[j][1])) {
          return true;
        }
      }
    }

    if (point_in_poly(ps2[0], ps1)) {
      return true;
    }

    if (point_in_poly(ps1[0], ps2)) {
      return true;
    }

    return false;
  };
  var convex_polygon_is_enclosed = function convex_polygon_is_enclosed(inner, outer) {
    var goesInside = outer.map(function (p) {
      return point_in_convex_poly(p, inner);
    }).reduce(function (a, b) {
      return a || b;
    }, false);

    if (goesInside) {
      return false;
    }

    return undefined;
  };
  var convex_polygons_enclose = function convex_polygons_enclose(inner, outer) {
    var outerGoesInside = outer.map(function (p) {
      return point_in_convex_poly(p, inner);
    }).reduce(function (a, b) {
      return a || b;
    }, false);
    var innerGoesOutside = inner.map(function (p) {
      return point_in_convex_poly(p, inner);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    return !outerGoesInside && innerGoesOutside;
  };
  var is_counter_clockwise_between = function is_counter_clockwise_between(angle, angleA, angleB) {
    while (angleB < angleA) {
      angleB += Math.PI * 2;
    }

    while (angle < angleA) {
      angle += Math.PI * 2;
    }

    return angle < angleB;
  };

  var query = /*#__PURE__*/Object.freeze({
    __proto__: null,
    overlap_function: overlap_function,
    segment_segment_overlap: segment_segment_overlap,
    degenerate: degenerate,
    parallel: parallel,
    point_on_line: point_on_line,
    point_on_segment: point_on_segment,
    point_in_poly: point_in_poly,
    point_in_convex_poly: point_in_convex_poly,
    point_in_convex_poly_exclusive: point_in_convex_poly_exclusive,
    convex_polygons_overlap: convex_polygons_overlap,
    convex_polygon_is_enclosed: convex_polygon_is_enclosed,
    convex_polygons_enclose: convex_polygons_enclose,
    is_counter_clockwise_between: is_counter_clockwise_between
  });

  var line_line_comp = function line_line_comp() {
    return true;
  };

  var line_ray_comp = function line_ray_comp(t0, t1) {
    return t1 >= -EPSILON;
  };

  var line_segment_comp = function line_segment_comp(t0, t1) {
    return t1 >= -EPSILON && t1 <= 1 + EPSILON;
  };

  var ray_ray_comp = function ray_ray_comp(t0, t1) {
    return t0 >= -EPSILON && t1 >= -EPSILON;
  };

  var ray_segment_comp = function ray_segment_comp(t0, t1) {
    return t0 >= -EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
  };

  var segment_segment_comp$1 = function segment_segment_comp(t0, t1) {
    return t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
  };

  var line_ray_comp_exclusive = function line_ray_comp_exclusive(t0, t1) {
    return t1 > EPSILON;
  };

  var line_segment_comp_exclusive = function line_segment_comp_exclusive(t0, t1) {
    return t1 > EPSILON && t1 < 1 - EPSILON;
  };

  var ray_ray_comp_exclusive = function ray_ray_comp_exclusive(t0, t1) {
    return t0 > EPSILON && t1 > EPSILON;
  };

  var ray_segment_comp_exclusive = function ray_segment_comp_exclusive(t0, t1) {
    return t0 > EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
  };

  var segment_segment_comp_exclusive = function segment_segment_comp_exclusive(t0, t1) {
    return t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
  };

  var limit_line = function limit_line(dist) {
    return dist;
  };
  var limit_ray = function limit_ray(dist) {
    return dist < -EPSILON ? 0 : dist;
  };
  var limit_segment = function limit_segment(dist) {
    if (dist < -EPSILON) {
      return 0;
    }

    if (dist > 1 + EPSILON) {
      return 1;
    }

    return dist;
  };
  var intersection_function = function intersection_function(aPt, aVec, bPt, bVec, compFunc) {
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;

    function det(a, b) {
      return a[0] * b[1] - b[0] * a[1];
    }

    var denominator0 = det(aVec, bVec);

    if (Math.abs(denominator0) < epsilon) {
      return undefined;
    }

    var denominator1 = -denominator0;
    var numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
    var numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
    var t0 = numerator0 / denominator0;
    var t1 = numerator1 / denominator1;

    if (compFunc(t0, t1, epsilon)) {
      return [aPt[0] + aVec[0] * t0, aPt[1] + aVec[1] * t0];
    }

    return undefined;
  };
  var line_line = function line_line(aPt, aVec, bPt, bVec, epsilon) {
    return intersection_function(aPt, aVec, bPt, bVec, line_line_comp, epsilon);
  };
  var line_ray = function line_ray(linePt, lineVec, rayPt, rayVec, epsilon) {
    return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp, epsilon);
  };
  var line_segment = function line_segment(origin, vec, segment0, segment1, epsilon) {
    var segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
    return intersection_function(origin, vec, segment0, segmentVec, line_segment_comp, epsilon);
  };
  var ray_ray = function ray_ray(aPt, aVec, bPt, bVec, epsilon) {
    return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
  };
  var ray_segment = function ray_segment(rayPt, rayVec, segment0, segment1, epsilon) {
    var segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
    return intersection_function(rayPt, rayVec, segment0, segmentVec, ray_segment_comp, epsilon);
  };
  var segment_segment = function segment_segment(a0, a1, b0, b1, epsilon) {
    var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return intersection_function(a0, aVec, b0, bVec, segment_segment_comp$1, epsilon);
  };
  var line_ray_exclusive = function line_ray_exclusive(linePt, lineVec, rayPt, rayVec, epsilon) {
    return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp_exclusive, epsilon);
  };
  var line_segment_exclusive = function line_segment_exclusive(origin, vec, segment0, segment1, epsilon) {
    var segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
    return intersection_function(origin, vec, segment0, segmentVec, line_segment_comp_exclusive, epsilon);
  };
  var ray_ray_exclusive = function ray_ray_exclusive(aPt, aVec, bPt, bVec, epsilon) {
    return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp_exclusive, epsilon);
  };
  var ray_segment_exclusive = function ray_segment_exclusive(rayPt, rayVec, segment0, segment1, epsilon) {
    var segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
    return intersection_function(rayPt, rayVec, segment0, segmentVec, ray_segment_comp_exclusive, epsilon);
  };
  var segment_segment_exclusive = function segment_segment_exclusive(a0, a1, b0, b1, epsilon) {
    var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return intersection_function(a0, aVec, b0, bVec, segment_segment_comp_exclusive, epsilon);
  };

  var acossafe = function acossafe(x) {
    if (x >= 1.0) return 0;
    if (x <= -1.0) return Math.PI;
    return Math.acos(x);
  };

  var rotatePoint = function rotatePoint(fp, pt, a) {
    var x = pt[0] - fp[0];
    var y = pt[1] - fp[1];
    var xRot = x * Math.cos(a) + y * Math.sin(a);
    var yRot = y * Math.cos(a) - x * Math.sin(a);
    return [fp[0] + xRot, fp[1] + yRot];
  };

  var circle_circle = function circle_circle(center, radius, center2, radius2) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var r = radius < radius2 ? radius : radius2;
    var R = radius < radius2 ? radius2 : radius;
    var smCenter = radius < radius2 ? center : center2;
    var bgCenter = radius < radius2 ? center2 : center;
    var vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
    var d = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));

    if (d < epsilon && Math.abs(R - r) < epsilon) {
      return undefined;
    } else if (d < epsilon) {
      return undefined;
    }

    var point = vec.map(function (v, i) {
      return v / d * R + bgCenter[i];
    });

    if (Math.abs(R + r - d) < epsilon || Math.abs(R - (r + d)) < epsilon) {
      return [point];
    }

    if (d + r < R || R + r < d) {
      return undefined;
    }

    var angle = acossafe((r * r - d * d - R * R) / (-2.0 * d * R));
    var pt1 = rotatePoint(bgCenter, point, +angle);
    var pt2 = rotatePoint(bgCenter, point, -angle);
    return [pt1, pt2];
  };
  var circle_line = function circle_line(center, radius, lpt, lvec) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var magSq = Math.pow(lvec[0], 2) + Math.pow(lvec[1], 2);
    var mag = Math.sqrt(magSq);
    var norm = mag === 0 ? lvec : lvec.map(function (c) {
      return c / mag;
    });
    var rot90 = [-norm[1], norm[0]];
    var bvec = [lpt[0] - center[0], lpt[1] - center[1]];
    var det = bvec[0] * norm[1] - norm[0] * bvec[1];

    if (Math.abs(det) > radius + epsilon) {
      return undefined;
    }

    var side = Math.sqrt(Math.pow(radius, 2) - Math.pow(det, 2));

    var f = function f(s, i) {
      return center[i] - rot90[i] * det + norm[i] * s;
    };

    return Math.abs(radius - Math.abs(det)) < epsilon ? [side].map(function (s) {
      return [s, s].map(f);
    }) : [-side, side].map(function (s) {
      return [s, s].map(f);
    });
  };
  var circle_ray = function circle_ray(center, radius, lpt, lvec) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var magSq = Math.pow(lvec[0], 2) + Math.pow(lvec[1], 2);
    var mag = Math.sqrt(magSq);
    var norm = mag === 0 ? lvec : lvec.map(function (c) {
      return c / mag;
    });
    var rot90 = [-norm[1], norm[0]];
    var bvec = [lpt[0] - center[0], lpt[1] - center[1]];
    var det = bvec[0] * norm[1] - norm[0] * bvec[1];

    if (Math.abs(det) > radius + epsilon) {
      return undefined;
    }

    var side = Math.sqrt(Math.pow(radius, 2) - Math.pow(det, 2));

    var f = function f(s, i) {
      return center[i] - rot90[i] * det + norm[i] * s;
    };

    var result = Math.abs(radius - Math.abs(det)) < epsilon ? [side].map(function (s) {
      return [s, s].map(f);
    }) : [-side, side].map(function (s) {
      return [s, s].map(f);
    });
    var ts = result.map(function (res) {
      return res.map(function (n, i) {
        return n - lpt[i];
      });
    }).map(function (v) {
      return v[0] * lvec[0] + lvec[1] * v[1];
    }).map(function (d) {
      return d / magSq;
    });
    return result.filter(function (_, i) {
      return ts[i] > -epsilon;
    });
  };
  var circle_segment = function circle_segment(center, radius, p1, p2) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var lpt = p1;
    var lvec = [p2[0] - p1[0], p2[1] - p1[1]];
    var magSq = Math.pow(lvec[0], 2) + Math.pow(lvec[1], 2);
    var mag = Math.sqrt(magSq);
    var norm = mag === 0 ? lvec : lvec.map(function (c) {
      return c / mag;
    });
    var rot90 = [-norm[1], norm[0]];
    var bvec = [lpt[0] - center[0], lpt[1] - center[1]];
    var det = bvec[0] * norm[1] - norm[0] * bvec[1];

    if (Math.abs(det) > radius + epsilon) {
      return undefined;
    }

    var side = Math.sqrt(Math.pow(radius, 2) - Math.pow(det, 2));

    var f = function f(s, i) {
      return center[i] - rot90[i] * det + norm[i] * s;
    };

    var result = Math.abs(radius - Math.abs(det)) < epsilon ? [side].map(function (s) {
      return [s, s].map(f);
    }) : [-side, side].map(function (s) {
      return [s, s].map(f);
    });
    var ts = result.map(function (res) {
      return res.map(function (n, i) {
        return n - lpt[i];
      });
    }).map(function (v) {
      return v[0] * lvec[0] + lvec[1] * v[1];
    }).map(function (d) {
      return d / magSq;
    });
    return result.filter(function (_, i) {
      return ts[i] > -epsilon && ts[i] < 1 + epsilon;
    });
  };

  var quick_equivalent_2 = function quick_equivalent_2(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
  };

  var convex_poly_circle = function convex_poly_circle(poly, center, radius) {
    return [];
  };
  var convex_poly_line = function convex_poly_line(poly, linePoint, lineVector) {
    var intersections = poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (el) {
      return line_segment(linePoint, lineVector, el[0], el[1]);
    }).filter(function (el) {
      return el != null;
    });

    switch (intersections.length) {
      case 0:
        return undefined;

      case 1:
        return [intersections[0], intersections[0]];

      case 2:
        return intersections;

      default:
        for (var i = 1; i < intersections.length; i += 1) {
          if (!quick_equivalent_2(intersections[0], intersections[i])) {
            return [intersections[0], intersections[i]];
          }
        }

        return undefined;
    }
  };
  var convex_poly_ray = function convex_poly_ray(poly, linePoint, lineVector) {
    var intersections = poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (el) {
      return ray_segment(linePoint, lineVector, el[0], el[1]);
    }).filter(function (el) {
      return el != null;
    });

    switch (intersections.length) {
      case 0:
        return undefined;

      case 1:
        return [linePoint, intersections[0]];

      case 2:
        return intersections;

      default:
        for (var i = 1; i < intersections.length; i += 1) {
          if (!quick_equivalent_2(intersections[0], intersections[i])) {
            return [intersections[0], intersections[i]];
          }
        }

        return undefined;
    }
  };
  var convex_poly_segment = function convex_poly_segment(poly, segmentA, segmentB) {
    var intersections = poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (el) {
      return segment_segment_exclusive(segmentA, segmentB, el[0], el[1]);
    }).filter(function (el) {
      return el != null;
    });
    var aInsideExclusive = point_in_convex_poly_exclusive(segmentA, poly);
    var bInsideExclusive = point_in_convex_poly_exclusive(segmentB, poly);
    var aInsideInclusive = point_in_convex_poly(segmentA, poly);
    var bInsideInclusive = point_in_convex_poly(segmentB, poly);

    if (intersections.length === 0 && (aInsideExclusive || bInsideExclusive)) {
      return [segmentA, segmentB];
    }

    if (intersections.length === 0 && aInsideInclusive && bInsideInclusive) {
      return [segmentA, segmentB];
    }

    switch (intersections.length) {
      case 0:
        return aInsideExclusive ? [_toConsumableArray(segmentA), _toConsumableArray(segmentB)] : undefined;

      case 1:
        return aInsideInclusive ? [_toConsumableArray(segmentA), intersections[0]] : [_toConsumableArray(segmentB), intersections[0]];

      case 2:
        return intersections;

      default:
        throw new Error("clipping segment in a convex polygon resulting in 3 or more points");
    }
  };
  var convex_poly_ray_exclusive = function convex_poly_ray_exclusive(poly, linePoint, lineVector) {
    var intersections = poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (el) {
      return ray_segment_exclusive(linePoint, lineVector, el[0], el[1]);
    }).filter(function (el) {
      return el != null;
    });

    switch (intersections.length) {
      case 0:
        return undefined;

      case 1:
        return [linePoint, intersections[0]];

      case 2:
        return intersections;

      default:
        for (var i = 1; i < intersections.length; i += 1) {
          if (!quick_equivalent_2(intersections[0], intersections[i])) {
            return [intersections[0], intersections[i]];
          }
        }

        return undefined;
    }
  };

  var intersection = /*#__PURE__*/Object.freeze({
    __proto__: null,
    limit_line: limit_line,
    limit_ray: limit_ray,
    limit_segment: limit_segment,
    intersection_function: intersection_function,
    line_line: line_line,
    line_ray: line_ray,
    line_segment: line_segment,
    ray_ray: ray_ray,
    ray_segment: ray_segment,
    segment_segment: segment_segment,
    line_ray_exclusive: line_ray_exclusive,
    line_segment_exclusive: line_segment_exclusive,
    ray_ray_exclusive: ray_ray_exclusive,
    ray_segment_exclusive: ray_segment_exclusive,
    segment_segment_exclusive: segment_segment_exclusive,
    circle_circle: circle_circle,
    circle_line: circle_line,
    circle_ray: circle_ray,
    circle_segment: circle_segment,
    convex_poly_circle: convex_poly_circle,
    convex_poly_line: convex_poly_line,
    convex_poly_ray: convex_poly_ray,
    convex_poly_segment: convex_poly_segment,
    convex_poly_ray_exclusive: convex_poly_ray_exclusive
  });

  var clockwise_angle2_radians = function clockwise_angle2_radians(a, b) {
    while (a < 0) {
      a += Math.PI * 2;
    }

    while (b < 0) {
      b += Math.PI * 2;
    }

    var a_b = a - b;
    return a_b >= 0 ? a_b : Math.PI * 2 - (b - a);
  };
  var counter_clockwise_angle2_radians = function counter_clockwise_angle2_radians(a, b) {
    while (a < 0) {
      a += Math.PI * 2;
    }

    while (b < 0) {
      b += Math.PI * 2;
    }

    var b_a = b - a;
    return b_a >= 0 ? b_a : Math.PI * 2 - (a - b);
  };
  var clockwise_angle2 = function clockwise_angle2(a, b) {
    var dotProduct = b[0] * a[0] + b[1] * a[1];
    var determinant = b[0] * a[1] - b[1] * a[0];
    var angle = Math.atan2(determinant, dotProduct);

    if (angle < 0) {
      angle += Math.PI * 2;
    }

    return angle;
  };
  var counter_clockwise_angle2 = function counter_clockwise_angle2(a, b) {
    var dotProduct = a[0] * b[0] + a[1] * b[1];
    var determinant = a[0] * b[1] - a[1] * b[0];
    var angle = Math.atan2(determinant, dotProduct);

    if (angle < 0) {
      angle += Math.PI * 2;
    }

    return angle;
  };
  var counter_clockwise_vector_order = function counter_clockwise_vector_order() {
    for (var _len = arguments.length, vectors = new Array(_len), _key = 0; _key < _len; _key++) {
      vectors[_key] = arguments[_key];
    }

    var vectors_radians = vectors.map(function (v) {
      return Math.atan2(v[1], v[0]);
    });
    var counter_clockwise = Array.from(Array(vectors_radians.length)).map(function (_, i) {
      return i;
    }).sort(function (a, b) {
      return vectors_radians[a] - vectors_radians[b];
    });
    return counter_clockwise.slice(counter_clockwise.indexOf(0), counter_clockwise.length).concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
  };
  var interior_angles2 = function interior_angles2(a, b) {
    var interior1 = counter_clockwise_angle2(a, b);
    var interior2 = Math.PI * 2 - interior1;
    return [interior1, interior2];
  };
  var interior_angles = function interior_angles() {
    for (var _len2 = arguments.length, vectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      vectors[_key2] = arguments[_key2];
    }

    return vectors.map(function (v, i, ar) {
      return counter_clockwise_angle2(v, ar[(i + 1) % ar.length]);
    });
  };

  var bisect_vectors = function bisect_vectors(a, b) {
    var aV = normalize(a);
    var bV = normalize(b);
    var sum = aV.map(function (_, i) {
      return aV[i] + bV[i];
    });
    var vecA = normalize(sum);
    var vecB = aV.map(function (_, i) {
      return -aV[i] + -bV[i];
    });
    return [vecA, normalize(vecB)];
  };
  var bisect_lines2 = function bisect_lines2(pointA, vectorA, pointB, vectorB) {
    var denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];

    if (Math.abs(denominator) < EPSILON) {
      var solution = [midpoint2(pointA, pointB), [vectorA[0], vectorA[1]]];
      var array = [solution, solution];
      var dot = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
      delete array[dot > 0 ? 1 : 0];
      return array;
    }

    var numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
    var t = numerator / denominator;
    var x = pointA[0] + vectorA[0] * t;
    var y = pointA[1] + vectorA[1] * t;
    var bisects = bisect_vectors(vectorA, vectorB);
    bisects[1] = [bisects[1][1], -bisects[1][0]];
    return bisects.map(function (el) {
      return [[x, y], el];
    });
  };
  var subsect_radians = function subsect_radians(divisions, angleA, angleB) {
    var angle = counter_clockwise_angle2(angleA, angleB) / divisions;
    return Array.from(Array(divisions - 1)).map(function (_, i) {
      return angleA + angle * i;
    });
  };
  var subsect = function subsect(divisions, vectorA, vectorB) {
    var angleA = Math.atan2(vectorA[1], vectorA[0]);
    var angleB = Math.atan2(vectorB[1], vectorB[0]);
    return subsect_radians(divisions, angleA, angleB).map(function (rad) {
      return [Math.cos(rad), Math.sin(rad)];
    });
  };
  var signed_area = function signed_area(points) {
    return 0.5 * points.map(function (el, i, arr) {
      var next = arr[(i + 1) % arr.length];
      return el[0] * next[1] - next[0] * el[1];
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  };
  var centroid = function centroid(points) {
    var sixthArea = 1 / (6 * signed_area(points));
    return points.map(function (el, i, arr) {
      var next = arr[(i + 1) % arr.length];
      var mag = el[0] * next[1] - next[0] * el[1];
      return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
    }).reduce(function (a, b) {
      return [a[0] + b[0], a[1] + b[1]];
    }, [0, 0]).map(function (c) {
      return c * sixthArea;
    });
  };
  var enclosing_rectangle = function enclosing_rectangle(points) {
    var l = points[0].length;
    var mins = Array.from(Array(l)).map(function () {
      return Infinity;
    });
    var maxs = Array.from(Array(l)).map(function () {
      return -Infinity;
    });
    points.forEach(function (point) {
      return point.forEach(function (c, i) {
        if (c < mins[i]) {
          mins[i] = c;
        }

        if (c > maxs[i]) {
          maxs[i] = c;
        }
      });
    });
    var lengths = maxs.map(function (max, i) {
      return max - mins[i];
    });
    return [mins, lengths];
  };
  var make_regular_polygon = function make_regular_polygon(sides) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var halfwedge = 2 * Math.PI / sides * 0.5;
    var r = radius / Math.cos(halfwedge);
    return Array.from(Array(Math.floor(sides))).map(function (_, i) {
      var a = -2 * Math.PI * i / sides + halfwedge;
      var px = clean_number(x + r * Math.sin(a), 14);
      var py = clean_number(y + r * Math.cos(a), 14);
      return [px, py];
    });
  };

  var smallest_comparison_search = function smallest_comparison_search(obj, array, compare_func) {
    var objs = array.map(function (o, i) {
      return {
        o: o,
        i: i,
        d: compare_func(obj, o)
      };
    });
    var index;
    var smallest_value = Infinity;

    for (var i = 0; i < objs.length; i += 1) {
      if (objs[i].d < smallest_value) {
        index = i;
        smallest_value = objs[i].d;
      }
    }

    return index;
  };

  var nearest_point2 = function nearest_point2(point, array_of_points) {
    var index = smallest_comparison_search(point, array_of_points, distance2);
    return index === undefined ? undefined : array_of_points[index];
  };
  var nearest_point = function nearest_point(point, array_of_points) {
    var index = smallest_comparison_search(point, array_of_points, distance);
    return index === undefined ? undefined : array_of_points[index];
  };
  var nearest_point_on_line = function nearest_point_on_line(linePoint, lineVec, point, limiterFunc) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var magSquared = Math.pow(lineVec[0], 2) + Math.pow(lineVec[1], 2);
    var vectorToPoint = [0, 1].map(function (_, i) {
      return point[i] - linePoint[i];
    });
    var dot = [0, 1].map(function (_, i) {
      return lineVec[i] * vectorToPoint[i];
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
    var dist = dot / magSquared;
    var d = limiterFunc(dist, epsilon);
    return [0, 1].map(function (_, i) {
      return linePoint[i] + lineVec[i] * d;
    });
  };
  var split_polygon = function split_polygon(poly, linePoint, lineVector) {
    var vertices_intersections = poly.map(function (v, i) {
      var intersection = point_on_line(linePoint, lineVector, v);
      return {
        type: "v",
        point: intersection ? v : null,
        at_index: i
      };
    }).filter(function (el) {
      return el.point != null;
    });
    var edges_intersections = poly.map(function (v, i, arr) {
      var intersection = line_segment_exclusive(linePoint, lineVector, v, arr[(i + 1) % arr.length]);
      return {
        type: "e",
        point: intersection,
        at_index: i
      };
    }).filter(function (el) {
      return el.point != null;
    });
    var sorted = vertices_intersections.concat(edges_intersections).sort(function (a, b) {
      return Math.abs(a.point[0] - b.point[0]) < EPSILON ? a.point[1] - b.point[1] : a.point[0] - b.point[0];
    });
    console.log(sorted);
    return poly;
  };
  var split_convex_polygon = function split_convex_polygon(poly, linePoint, lineVector) {
    var vertices_intersections = poly.map(function (v, i) {
      var intersection = point_on_line(linePoint, lineVector, v);
      return {
        point: intersection ? v : null,
        at_index: i
      };
    }).filter(function (el) {
      return el.point != null;
    });
    var edges_intersections = poly.map(function (v, i, arr) {
      var intersection = line_segment_exclusive(linePoint, lineVector, v, arr[(i + 1) % arr.length]);
      return {
        point: intersection,
        at_index: i
      };
    }).filter(function (el) {
      return el.point != null;
    });

    if (edges_intersections.length == 2) {
      var sorted_edges = edges_intersections.slice().sort(function (a, b) {
        return a.at_index - b.at_index;
      });
      var face_a = poly.slice(sorted_edges[1].at_index + 1).concat(poly.slice(0, sorted_edges[0].at_index + 1));
      face_a.push(sorted_edges[0].point);
      face_a.push(sorted_edges[1].point);
      var face_b = poly.slice(sorted_edges[0].at_index + 1, sorted_edges[1].at_index + 1);
      face_b.push(sorted_edges[1].point);
      face_b.push(sorted_edges[0].point);
      return [face_a, face_b];
    } else if (edges_intersections.length == 1 && vertices_intersections.length == 1) {
      vertices_intersections[0]["type"] = "v";
      edges_intersections[0]["type"] = "e";
      var sorted_geom = vertices_intersections.concat(edges_intersections).sort(function (a, b) {
        return a.at_index - b.at_index;
      });

      var _face_a = poly.slice(sorted_geom[1].at_index + 1).concat(poly.slice(0, sorted_geom[0].at_index + 1));

      if (sorted_geom[0].type === "e") {
        _face_a.push(sorted_geom[0].point);
      }

      _face_a.push(sorted_geom[1].point);

      var _face_b = poly.slice(sorted_geom[0].at_index + 1, sorted_geom[1].at_index + 1);

      if (sorted_geom[1].type === "e") {
        _face_b.push(sorted_geom[1].point);
      }

      _face_b.push(sorted_geom[0].point);

      return [_face_a, _face_b];
    } else if (vertices_intersections.length == 2) {
      var sorted_vertices = vertices_intersections.slice().sort(function (a, b) {
        return a.at_index - b.at_index;
      });

      var _face_a2 = poly.slice(sorted_vertices[1].at_index).concat(poly.slice(0, sorted_vertices[0].at_index + 1));

      var _face_b2 = poly.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index + 1);

      return [_face_a2, _face_b2];
    }

    return [poly.slice()];
  };
  var convex_hull = function convex_hull(points) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    var INFINITE_LOOP = 10000;
    var sorted = points.slice().sort(function (a, b) {
      return Math.abs(a[1] - b[1]) < epsilon ? a[0] - b[0] : a[1] - b[1];
    });
    var hull = [];
    hull.push(sorted[0]);
    var ang = 0;
    var infiniteLoop = 0;

    var _loop = function _loop() {
      infiniteLoop += 1;
      var h = hull.length - 1;
      var angles = sorted.filter(function (el) {
        return !(Math.abs(el[0] - hull[h][0]) < epsilon && Math.abs(el[1] - hull[h][1]) < epsilon);
      }).map(function (el) {
        var angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);

        while (angle < ang) {
          angle += Math.PI * 2;
        }

        return {
          node: el,
          angle: angle,
          distance: undefined
        };
      }).sort(function (a, b) {
        return a.angle < b.angle ? -1 : a.angle > b.angle ? 1 : 0;
      });

      if (angles.length === 0) {
        return {
          v: undefined
        };
      }

      var rightTurn = angles[0];
      angles = angles.filter(function (el) {
        return Math.abs(rightTurn.angle - el.angle) < epsilon;
      }).map(function (el) {
        var distance = Math.sqrt(Math.pow(hull[h][0] - el.node[0], 2) + Math.pow(hull[h][1] - el.node[1], 2));
        el.distance = distance;
        return el;
      }).sort(function (a, b) {
        return a.distance < b.distance ? 1 : a.distance > b.distance ? -1 : 0;
      });

      if (hull.filter(function (el) {
        return el === angles[0].node;
      }).length > 0) {
        return {
          v: hull
        };
      }

      hull.push(angles[0].node);
      ang = Math.atan2(hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
    };

    do {
      var _ret = _loop();

      if (_typeof(_ret) === "object") return _ret.v;
    } while (infiniteLoop < INFINITE_LOOP);

    return undefined;
  };

  var geometry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clockwise_angle2_radians: clockwise_angle2_radians,
    counter_clockwise_angle2_radians: counter_clockwise_angle2_radians,
    clockwise_angle2: clockwise_angle2,
    counter_clockwise_angle2: counter_clockwise_angle2,
    counter_clockwise_vector_order: counter_clockwise_vector_order,
    interior_angles2: interior_angles2,
    interior_angles: interior_angles,
    bisect_vectors: bisect_vectors,
    bisect_lines2: bisect_lines2,
    subsect_radians: subsect_radians,
    subsect: subsect,
    signed_area: signed_area,
    centroid: centroid,
    enclosing_rectangle: enclosing_rectangle,
    make_regular_polygon: make_regular_polygon,
    nearest_point2: nearest_point2,
    nearest_point: nearest_point,
    nearest_point_on_line: nearest_point_on_line,
    split_polygon: split_polygon,
    split_convex_polygon: split_convex_polygon,
    convex_hull: convex_hull
  });

  var Args = function Args() {
    var _this = this;

    get_vector(arguments).forEach(function (n) {
      return _this.push(n);
    });
  };

  var M = {};
  var table = {
    preserve: {
      isEquivalent: function isEquivalent() {
        var vec = get_vector(arguments);
        var sm = this.length < vec.length ? this : vec;
        var lg = this.length < vec.length ? vec : this;
        return equivalent(sm, lg);
      },
      isParallel: function isParallel() {
        var vec = get_vector(arguments);
        var sm = this.length < vec.length ? this : vec;
        var lg = this.length < vec.length ? vec : this;
        return parallel(sm, lg);
      },
      dot: function dot$1() {
        var v = get_vector(arguments);
        return this.length > v.length ? dot(v, this) : dot(this, v);
      },
      distanceTo: function distanceTo() {
        var _this = this;

        var v = get_vector(arguments);
        var length = this.length < v.length ? this.length : v.length;
        var sum = Array.from(Array(length)).map(function (_, i) {
          return Math.pow(_this[i] - v[i], 2);
        }).reduce(function (a, b) {
          return a + b;
        }, 0);
        return Math.sqrt(sum);
      },
      bisect: function bisect() {
        var vec = get_vector(arguments);
        return bisect_vectors(this, vec).map(function (b) {
          return M.constructor(b);
        });
      }
    },
    vector: {
      copy: function copy() {
        return _toConsumableArray(this);
      },
      normalize: function normalize$1() {
        return normalize(this);
      },
      scale: function scale(mag) {
        return this.map(function (v) {
          return v * mag;
        });
      },
      cross: function cross() {
        var b = get_vector(arguments);
        var a = this.slice();

        if (a[2] == null) {
          a[2] = 0;
        }

        if (b[2] == null) {
          b[2] = 0;
        }

        return cross3(a, b);
      },
      transform: function transform() {
        return multiply_matrix2_vector2(get_matrix2(arguments), this);
      },
      add: function add() {
        var vec = get_vector(arguments);
        return this.map(function (v, i) {
          return v + vec[i];
        });
      },
      subtract: function subtract() {
        var vec = get_vector(arguments);
        return this.map(function (v, i) {
          return v - vec[i];
        });
      },
      rotateZ: function rotateZ(angle, origin) {
        return multiply_matrix2_vector2(make_matrix2_rotate(angle, origin), this);
      },
      rotateZ90: function rotateZ90() {
        return [-this[1], this[0]];
      },
      rotateZ180: function rotateZ180() {
        return [-this[0], -this[1]];
      },
      rotateZ270: function rotateZ270() {
        return [this[1], -this[0]];
      },
      flip: function flip() {
        return this.map(function (n) {
          return -n;
        });
      },
      reflect: function reflect() {
        var ref = get_line(arguments);
        var m = make_matrix2_reflection(ref.vector, ref.origin);
        return multiply_matrix2_vector2(m, this);
      },
      lerp: function lerp(vector, pct) {
        var _this2 = this;

        var vec = get_vector(vector);
        var inv = 1.0 - pct;
        var length = this.length < vec.length ? this.length : vec.length;
        return Array.from(Array(length)).map(function (_, i) {
          return _this2[i] * pct + vec[i] * inv;
        });
      },
      midpoint: function midpoint() {
        var vec = get_vector(arguments);
        var sm = this.length < vec.length ? this.slice() : vec;
        var lg = this.length < vec.length ? vec : this.slice();

        for (var i = sm.length; i < lg.length; i += 1) {
          sm[i] = 0;
        }

        return lg.map(function (_, i) {
          return (sm[i] + lg[i]) * 0.5;
        });
      }
    }
  };
  Object.keys(table.preserve).forEach(function (key) {
    M[key] = table.preserve[key];
  });
  Object.keys(table.vector).forEach(function (key) {
    M[key] = function () {
      return M.constructor.apply(M, _toConsumableArray(table.vector[key].apply(this, arguments)));
    };
  });

  var getters = {
    x: function x() {
      return this[0];
    },
    y: function y() {
      return this[1];
    },
    z: function z() {
      return this[2];
    },
    magnitude: function magnitude$1() {
      return magnitude(this);
    }
  };

  var vector = function vector() {
    var v = Object.create(vector.prototype);
    Args.apply(v, arguments);
    Object.keys(getters).forEach(function (key) {
      return Object.defineProperty(v, key, {
        get: getters[key].bind(v),
        enumerable: true
      });
    });
    Object.keys(M).forEach(function (key) {
      return Object.defineProperty(v, key, {
        value: M[key].bind(v)
      });
    });
    return Object.freeze(v);
  };

  vector.prototype = Object.create(Array.prototype);
  vector.prototype.constructor = vector;
  M.constructor = vector;

  vector.fromAngle = function (angle) {
    return vector(Math.cos(angle), Math.sin(angle));
  };

  Object.freeze(vector);

  var Matrix2 = function Matrix2() {
    var matrix = [1, 0, 0, 1, 0, 0];

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var argsMatrix = get_matrix2(args);

    if (argsMatrix !== undefined) {
      argsMatrix.forEach(function (n, i) {
        matrix[i] = n;
      });
    }

    var multiply = function multiply() {
      for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }

      return Matrix2(multiply_matrices2(matrix, get_matrix2(innerArgs)).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var determinant = function determinant() {
      return clean_number(matrix2_determinant(matrix));
    };

    var inverse = function inverse() {
      return Matrix2(invert_matrix2(matrix).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var translate = function translate(x, y) {
      var transform = make_matrix2_translate(x, y);
      return Matrix2(multiply_matrices2(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var scale = function scale() {
      var transform = make_matrix2_scale.apply(void 0, arguments);
      return Matrix2(multiply_matrices2(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotate = function rotate() {
      var transform = make_matrix2_rotate.apply(void 0, arguments);
      return Matrix2(multiply_matrices2(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var reflect = function reflect() {
      var transform = make_matrix2_reflection.apply(void 0, arguments);
      return Matrix2(multiply_matrices2(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transform = function transform() {
      for (var _len3 = arguments.length, innerArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        innerArgs[_key3] = arguments[_key3];
      }

      var v = get_vector(innerArgs);
      return vector(multiply_matrix2_vector2(matrix, v).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transformVector = function transformVector(vector) {
      return Matrix2(multiply_matrix2_vector2(matrix, vector).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transformLine = function transformLine(origin, vector) {
      return Matrix2(multiply_matrix2_line2(matrix, origin, vector).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    Object.defineProperty(matrix, "multiply", {
      value: multiply
    });
    Object.defineProperty(matrix, "determinant", {
      value: determinant
    });
    Object.defineProperty(matrix, "inverse", {
      value: inverse
    });
    Object.defineProperty(matrix, "translate", {
      value: translate
    });
    Object.defineProperty(matrix, "scale", {
      value: scale
    });
    Object.defineProperty(matrix, "rotate", {
      value: rotate
    });
    Object.defineProperty(matrix, "reflect", {
      value: reflect
    });
    Object.defineProperty(matrix, "transform", {
      value: transform
    });
    Object.defineProperty(matrix, "transformVector", {
      value: transformVector
    });
    Object.defineProperty(matrix, "transformLine", {
      value: transformLine
    });
    return Object.freeze(matrix);
  };

  Matrix2.makeIdentity = function () {
    return Matrix2(1, 0, 0, 1, 0, 0);
  };

  Matrix2.makeTranslation = function (x, y) {
    return Matrix2(make_matrix2_translate(x, y));
  };

  Matrix2.makeRotation = function (angle_radians, origin) {
    return Matrix2(make_matrix2_rotate(angle_radians, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix2.makeScale = function (x, y, origin) {
    return Matrix2(make_matrix2_scale(x, y, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix2.makeReflection = function (vector, origin) {
    return Matrix2(make_matrix2_reflection(vector, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  var Matrix = function Matrix() {
    var matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var argsMatrix = get_matrix3(args);

    if (argsMatrix !== undefined) {
      argsMatrix.forEach(function (n, i) {
        matrix[i] = n;
      });
    }

    var multiply = function multiply() {
      for (var _len5 = arguments.length, innerArgs = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        innerArgs[_key5] = arguments[_key5];
      }

      return Matrix(multiply_matrices3(matrix, get_matrix3(innerArgs)).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var determinant = function determinant() {
      return clean_number(matrix3_determinant(matrix), 13);
    };

    var inverse = function inverse() {
      return Matrix(invert_matrix3(matrix).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var translate = function translate(x, y, z) {
      var transform = make_matrix3_translate(x, y, z);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotateX = function rotateX(angle_radians) {
      var transform = make_matrix3_rotateX(angle_radians);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotateY = function rotateY(angle_radians) {
      var transform = make_matrix3_rotateY(angle_radians);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotateZ = function rotateZ(angle_radians) {
      var transform = make_matrix3_rotateZ(angle_radians);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotate = function rotate(angle_radians, vector, origin) {
      var transform = make_matrix3_rotate(angle_radians, vector, origin);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var scale = function scale(amount) {
      var transform = make_matrix3_scale(amount);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var reflectZ = function reflectZ(vector, origin) {
      var transform = make_matrix3_reflectionZ(vector, origin);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transform = function transform() {
      for (var _len6 = arguments.length, innerArgs = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        innerArgs[_key6] = arguments[_key6];
      }

      var v = get_vector(innerArgs);
      return vector(multiply_matrix3_vector3(v, matrix).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transformVector = function transformVector(vector) {
      return Matrix(multiply_matrix3_vector3(matrix, vector).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transformLine = function transformLine(origin, vector) {
      return Matrix(multiply_matrix3_line3(matrix, origin, vector).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    Object.defineProperty(matrix, "multiply", {
      value: multiply
    });
    Object.defineProperty(matrix, "determinant", {
      value: determinant
    });
    Object.defineProperty(matrix, "inverse", {
      value: inverse
    });
    Object.defineProperty(matrix, "translate", {
      value: translate
    });
    Object.defineProperty(matrix, "rotateX", {
      value: rotateX
    });
    Object.defineProperty(matrix, "rotateY", {
      value: rotateY
    });
    Object.defineProperty(matrix, "rotateZ", {
      value: rotateZ
    });
    Object.defineProperty(matrix, "rotate", {
      value: rotate
    });
    Object.defineProperty(matrix, "scale", {
      value: scale
    });
    Object.defineProperty(matrix, "reflectZ", {
      value: reflectZ
    });
    Object.defineProperty(matrix, "transform", {
      value: transform
    });
    Object.defineProperty(matrix, "transformVector", {
      value: transformVector
    });
    Object.defineProperty(matrix, "transformLine", {
      value: transformLine
    });
    return Object.freeze(matrix);
  };

  Matrix.makeIdentity = function () {
    return Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0);
  };

  Matrix.makeTranslation = function (x, y, z) {
    return Matrix(make_matrix3_translate(x, y, z));
  };

  Matrix.makeRotationX = function (angle_radians) {
    return Matrix(make_matrix3_rotateX(angle_radians).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeRotationY = function (angle_radians) {
    return Matrix(make_matrix3_rotateY(angle_radians).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeRotationZ = function (angle_radians) {
    return Matrix(make_matrix3_rotateZ(angle_radians).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeRotation = function (angle_radians, vector, origin) {
    return Matrix(make_matrix3_rotate(angle_radians, vector, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeScale = function (amount, origin) {
    return Matrix(make_matrix3_scale(amount, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeReflectionZ = function (vector, origin) {
    return Matrix(make_matrix3_reflectionZ(vector, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  var map = {
    circle: {
      poly: function poly(a, b) {
        return convex_poly_circle(b, a.origin, a.radius);
      },
      circle: function circle(a, b) {
        return circle_circle(a.origin, a.radius, b.origin, b.radius);
      },
      line: function line(a, b) {
        return circle_line(a.origin, a.radius, b.origin, b.vector);
      },
      ray: function ray(a, b) {
        return circle_ray(a.origin, a.radius, b.origin, b.vector);
      },
      segment: function segment(a, b) {
        return circle_segment(a.origin, a.radius, b[0], b[1]);
      }
    },
    line: {
      poly: function poly(a, b) {
        return convex_poly_line(b, a.origin, a.vector);
      },
      circle: function circle(a, b) {
        return circle_line(b.origin, b.radius, a.origin, a.vector);
      },
      line: function line(a, b) {
        return line_line(a.origin, a.vector, b.origin, b.vector);
      },
      ray: function ray(a, b) {
        return line_ray(a.origin, a.vector, b.origin, b.vector);
      },
      segment: function segment(a, b) {
        return line_segment(a.origin, a.vector, b[0], b[1]);
      }
    },
    ray: {
      poly: function poly(a, b) {
        return convex_poly_ray(b, a.origin, a.vector);
      },
      circle: function circle(a, b) {
        return circle_ray(b.origin, b.radius, a.origin, a.vector);
      },
      line: function line(a, b) {
        return line_ray(b.origin, b.vector, a.origin, a.vector);
      },
      ray: function ray(a, b) {
        return ray_ray(a.origin, a.vector, b.origin, b.vector);
      },
      segment: function segment(a, b) {
        return ray_segment(a.origin, a.vector, b[0], b[1]);
      }
    },
    segment: {
      poly: function poly(a, b) {
        return convex_poly_segment(b, a.origin, a.vector);
      },
      circle: function circle(a, b) {
        return circle_segment(b.origin, b.radius, a[0], a[1]);
      },
      line: function line(a, b) {
        return line_segment(b.origin, b.vector, a[0], a[1]);
      },
      ray: function ray(a, b) {
        return ray_segment(b.origin, b.vector, a[0], a[1]);
      },
      segment: function segment(a, b) {
        return segment_segment(a[0], a[1], b[0], b[1]);
      }
    }
  };

  var intersect = function intersect(a, b) {
    var aT = Typeof(a);
    var bT = Typeof(b);
    var func = map[aT][bT];
    return func(a, b);
  };

  function Prototype (subtype, prototype) {
    var proto = prototype != null ? prototype : {};

    var compare_to_line = function compare_to_line(t0, t1) {
      var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
      return this.compare_function(t0, epsilon) && true;
    };

    var compare_to_ray = function compare_to_ray(t0, t1) {
      var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
      return this.compare_function(t0, epsilon) && t1 >= -epsilon;
    };

    var compare_to_segment = function compare_to_segment(t0, t1) {
      var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
      return this.compare_function(t0, epsilon) && t1 >= -epsilon && t1 <= 1 + epsilon;
    };

    var isParallel = function isParallel(line, epsilon) {
      if (line.vector == null) {
        throw new Error("isParallel() argument is missing a vector");
      }

      var this_is_smaller = this.vector.length < line.vector.length;
      var sm = this_is_smaller ? this.vector : line.vector;
      var lg = this_is_smaller ? line.vector : this.vector;
      return parallel(sm, lg);
    };

    var isDegenerate = function isDegenerate() {
      return degenerate(this.vector);
    };

    var reflection = function reflection() {
      return Matrix2.makeReflection(this.vector, this.origin);
    };

    var nearestPoint = function nearestPoint() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var point = get_vector(args);
      return vector(nearest_point_on_line(this.origin, this.vector, point, this.clip_function));
    };

    var intersect$1 = function intersect$1(other) {
      return intersect(this, other);
    };

    var intersectLine = function intersectLine() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var line = get_line(args);
      return intersection_function(this.origin, this.vector, line.origin, line.vector, compare_to_line.bind(this));
    };

    var intersectRay = function intersectRay() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var ray = get_ray(args);
      return intersection_function(this.origin, this.vector, ray.origin, ray.vector, compare_to_ray.bind(this));
    };

    var intersectSegment = function intersectSegment() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var edge = get_segment(args);
      var edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
      return intersection_function(this.origin, this.vector, edge[0], edgeVec, compare_to_segment.bind(this));
    };

    var bisectLine = function bisectLine() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      var line = get_line(args);
      return bisect_lines2(this.origin, this.vector, line.origin, line.vector);
    };

    var bisectRay = function bisectRay() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      var ray = get_ray(args);
      return bisect_lines2(this.origin, this.vector, ray.origin, ray.vector);
    };

    var bisectSegment = function bisectSegment() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      var s = get_segment(args);
      var vector = [s[1][0] - s[0][0], s[1][1] - s[0][1]];
      return bisect_lines2(this.origin, this.vector, s[0], vector);
    };

    Object.defineProperty(proto, "isParallel", {
      value: isParallel
    });
    Object.defineProperty(proto, "isDegenerate", {
      value: isDegenerate
    });
    Object.defineProperty(proto, "nearestPoint", {
      value: nearestPoint
    });
    Object.defineProperty(proto, "reflection", {
      value: reflection
    });
    Object.defineProperty(proto, "intersect", {
      value: intersect$1
    });
    Object.defineProperty(proto, "intersectLine", {
      value: intersectLine
    });
    Object.defineProperty(proto, "intersectRay", {
      value: intersectRay
    });
    Object.defineProperty(proto, "intersectSegment", {
      value: intersectSegment
    });
    Object.defineProperty(proto, "bisectLine", {
      value: bisectLine
    });
    Object.defineProperty(proto, "bisectRay", {
      value: bisectRay
    });
    Object.defineProperty(proto, "bisectSegment", {
      value: bisectSegment
    });
    return Object.freeze(proto);
  }

  var Line = function Line() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _get_line = get_line(args),
        origin = _get_line.origin,
        vector$1 = _get_line.vector;

    var transform = function transform() {
      for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }

      var mat = get_matrix2(innerArgs);
      var line = multiply_matrix2_line2(mat, origin, vector$1);
      return Line(line[0], line[1]);
    };

    var proto = Prototype.bind(this);
    var line = Object.create(proto(Line));

    var compare_function = function compare_function() {
      return true;
    };

    Object.defineProperty(line, "compare_function", {
      value: compare_function
    });
    Object.defineProperty(line, "clip_function", {
      value: limit_line
    });
    line.origin = vector(origin);
    line.vector = vector(vector$1);
    Object.defineProperty(line, "length", {
      get: function get() {
        return Infinity;
      }
    });
    Object.defineProperty(line, "transform", {
      value: transform
    });
    return line;
  };

  Line.fromPoints = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var points = get_vector_of_vectors(args);
    return Line({
      origin: points[0],
      vector: [points[1][0] - points[0][0], points[1][1] - points[0][1]]
    });
  };

  Line.perpendicularBisector = function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var points = get_vector_of_vectors(args);
    var vec = normalize([points[1][0] - points[0][0], points[1][1] - points[0][1]]);
    return Line({
      origin: average(points[0], points[1]),
      vector: [vec[1], -vec[0]]
    });
  };

  var Ray = function Ray() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _get_line = get_line(args),
        origin = _get_line.origin,
        vector$1 = _get_line.vector;

    var transform = function transform() {
      for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }

      var mat = get_matrix2(innerArgs);
      var vec_translated = vector$1.map(function (vec, i) {
        return vec + origin[i];
      });
      var new_origin = multiply_matrix2_vector2(mat, origin);
      var new_vector = multiply_matrix2_vector2(mat, vec_translated).map(function (vec, i) {
        return vec - new_origin[i];
      });
      return Ray(new_origin, new_vector);
    };

    var rotate180 = function rotate180() {
      return Ray(origin[0], origin[1], -vector$1[0], -vector$1[1]);
    };

    var proto = Prototype.bind(this);
    var ray = Object.create(proto(Ray));

    var compare_function = function compare_function(t0, ep) {
      return t0 >= -ep;
    };

    Object.defineProperty(ray, "origin", {
      get: function get() {
        return vector(origin);
      }
    });
    Object.defineProperty(ray, "vector", {
      get: function get() {
        return vector(vector$1);
      }
    });
    Object.defineProperty(ray, "length", {
      get: function get() {
        return Infinity;
      }
    });
    Object.defineProperty(ray, "transform", {
      value: transform
    });
    Object.defineProperty(ray, "rotate180", {
      value: rotate180
    });
    Object.defineProperty(ray, "compare_function", {
      value: compare_function
    });
    Object.defineProperty(ray, "clip_function", {
      value: limit_ray
    });
    return ray;
  };

  Ray.fromPoints = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var points = get_vector_of_vectors(args);
    return Ray({
      origin: points[0],
      vector: normalize([points[1][0] - points[0][0], points[1][1] - points[0][1]])
    });
  };

  var Segment = function Segment() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var inputs = get_vector_of_vectors(args);
    var proto = Prototype.bind(this);
    var vecPts = inputs.length > 0 ? inputs.map(function (p) {
      return vector(p);
    }) : undefined;

    if (vecPts === undefined) {
      return undefined;
    }

    var segment = Object.create(proto(Segment, vecPts));

    var transform = function transform() {
      for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }

      var mat = get_matrix2(innerArgs);
      var transformed_points = segment.map(function (point) {
        return multiply_matrix2_vector2(mat, point);
      });
      return Segment(transformed_points);
    };

    var scale = function scale(magnitude) {
      var mid = average(segment[0], segment[1]);
      var transformed_points = segment.map(function (p) {
        return p.lerp(mid, magnitude);
      });
      return Segment(transformed_points);
    };

    var vector$1 = function vector$1() {
      return vector(segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]);
    };

    var midpoint = function midpoint() {
      return vector(average(segment[0], segment[1]));
    };

    var magnitude = function magnitude() {
      return Math.sqrt(Math.pow(segment[1][0] - segment[0][0], 2) + Math.pow(segment[1][1] - segment[0][1], 2));
    };

    var compare_function = function compare_function(t0, ep) {
      return t0 >= -ep && t0 <= 1 + ep;
    };

    Object.defineProperty(segment, "origin", {
      get: function get() {
        return segment[0];
      }
    });
    Object.defineProperty(segment, "vector", {
      get: function get() {
        return vector$1();
      }
    });
    Object.defineProperty(segment, "midpoint", {
      value: midpoint
    });
    Object.defineProperty(segment, "magnitude", {
      get: function get() {
        return magnitude();
      }
    });
    Object.defineProperty(segment, "transform", {
      value: transform
    });
    Object.defineProperty(segment, "scale", {
      value: scale
    });
    Object.defineProperty(segment, "compare_function", {
      value: compare_function
    });
    Object.defineProperty(segment, "clip_function", {
      value: limit_segment
    });
    return segment;
  };

  var Args$1 = function Args() {
    var arr = Array.from(arguments);
    var numbers = arr.filter(function (param) {
      return !isNaN(param);
    });
    var vectors = get_vector_of_vectors(arr);

    if (numbers.length === 3) {
      this.origin = vector(numbers[0], numbers[1]);

      var _numbers = _slicedToArray(numbers, 3);

      this.radius = _numbers[2];
    } else if (vectors.length === 2) {
      this.radius = distance2.apply(void 0, _toConsumableArray(vectors));
      this.origin = vector.apply(void 0, _toConsumableArray(vectors[0]));
    }
  };

  var M$1 = {
    intersectionLine: function intersectionLine() {
      var line = get_line(arguments);
      var result = circle_line(origin, radius, line.origin, line.vector);
      return result === undefined ? undefined : result.map(function (i) {
        return vector(i);
      });
    },
    intersectionRay: function intersectionRay() {
      var ray = get_ray(arguments);
      var result = circle_ray(origin, radius, ray.origin, ray.vector);
      return result === undefined ? undefined : result.map(function (i) {
        return vector(i);
      });
    },
    intersectionSegment: function intersectionSegment() {
      var segment = get_vector_of_vectors(arguments);
      var result = circle_segment(origin, radius, segment[0], segment[1]);
      return result === undefined ? undefined : result.map(function (i) {
        return vector(i);
      });
    },
    intersectionCircle: function intersectionCircle() {},
    intersect: function intersect$1(object) {
      return intersect(circle, object);
    }
  };

  var getters$1 = {
    x: function x() {
      return this.origin[0];
    },
    y: function y() {
      return this.origin[1];
    }
  };

  var Static = function Static(circle) {
    circle.fromPoints = function () {
      var points = get_vector_of_vectors(innerArgs);
      return circle(points, distance2(points[0], points[1]));
    };
  };

  var circle$1 = function circle() {
    var c = Object.create(circle.prototype);
    Args$1.apply(c, arguments);
    Object.keys(getters$1).forEach(function (key) {
      return Object.defineProperty(c, key, {
        get: getters$1[key].bind(c),
        enumerable: true
      });
    });
    Object.keys(M$1).forEach(function (key) {
      return Object.defineProperty(c, key, {
        value: M$1[key].bind(c)
      });
    });
    return Object.freeze(c);
  };

  circle$1.prototype = Object.create(Array.prototype);
  circle$1.prototype.constructor = circle$1;
  Static(circle$1);
  Object.freeze(circle$1);

  var Sector = function Sector(vectorA, vectorB) {
    var center = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
    var vectors = [get_vector(vectorA), get_vector(vectorB)];

    var bisect = function bisect() {
      var interior_angle = counter_clockwise_angle2(vectors[0], vectors[1]);
      var vectors_radians = vectors.map(function (el) {
        return Math.atan2(el[1], el[0]);
      });
      var bisected = vectors_radians[0] + interior_angle * 0.5;
      return vector(Math.cos(bisected), Math.sin(bisected));
    };

    var subsect_sector = function subsect_sector(divisions) {
      return subsect(divisions, vectors[0], vectors[1]).map(function (vec) {
        return vector(vec[0], vec[1]);
      });
    };

    var contains = function contains() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var point = get_vector(args).map(function (n, i) {
        return n + center[i];
      });
      var cross0 = (point[1] - vectors[0][1]) * -vectors[0][0] - (point[0] - vectors[0][0]) * -vectors[0][1];
      var cross1 = point[1] * vectors[1][0] - point[0] * vectors[1][1];
      return cross0 < 0 && cross1 < 0;
    };

    return {
      contains: contains,
      bisect: bisect,
      subsect: subsect_sector,

      get center() {
        return center;
      },

      get vectors() {
        return vectors;
      },

      get angle() {
        return counter_clockwise_angle2(vectors[0], vectors[1]);
      }

    };
  };

  Sector.fromVectors = function (vectorA, vectorB) {
    return Sector(vectorA, vectorB);
  };

  Sector.fromPoints = function (pointA, pointB) {
    var center = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
    var vectors = [pointA, pointB].map(function (p) {
      return p.map(function (_, i) {
        return p[i] - center[i];
      });
    });
    return Sector(vectors[0], vectors[1], center);
  };

  function Prototype$1 (subtype) {
    var proto = {};
    var Type = subtype;

    var area = function area() {
      return signed_area(this.points);
    };

    var midpoint = function midpoint() {
      return average(this.points);
    };

    var enclosingRectangle = function enclosingRectangle() {
      return enclosing_rectangle(this.points);
    };

    var sectors = function sectors() {
      return this.points.map(function (p, i, arr) {
        var prev = (i + arr.length - 1) % arr.length;
        var next = (i + 1) % arr.length;
        var center = p;
        var a = arr[prev].map(function (n, j) {
          return n - center[j];
        });
        var b = arr[next].map(function (n, j) {
          return n - center[j];
        });
        return Sector(b, a, center);
      });
    };

    var contains = function contains() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return point_in_poly(get_vector(args), this.points);
    };

    var polyCentroid = function polyCentroid() {
      return centroid(this.points);
    };

    var nearest = function nearest() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var point = get_vector(args);
      var points = this.sides.map(function (edge) {
        return edge.nearestPoint(point);
      });
      var lowD = Infinity;
      var lowI;
      points.map(function (p) {
        return distance2(point, p);
      }).forEach(function (d, i) {
        if (d < lowD) {
          lowD = d;
          lowI = i;
        }
      });
      return {
        point: points[lowI],
        edge: this.sides[lowI]
      };
    };

    var clipSegment = function clipSegment() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var edge = get_segment(args);
      var e = convex_poly_segment(this.points, edge[0], edge[1]);
      return e === undefined ? undefined : Segment(e);
    };

    var clipLine = function clipLine() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var line = get_line(args);
      var e = convex_poly_line(this.points, line.origin, line.vector);
      return e === undefined ? undefined : Segment(e);
    };

    var clipRay = function clipRay() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      var line = get_line(args);
      var e = convex_poly_ray(this.points, line.origin, line.vector);
      return e === undefined ? undefined : Segment(e);
    };

    var split = function split() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      var line = get_line(args);
      return split_polygon(this.points, line.origin, line.vector).map(function (poly) {
        return Type(poly);
      });
    };

    var scale = function scale(magnitude) {
      var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(this.points);
      var newPoints = this.points.map(function (p) {
        return [0, 1].map(function (_, i) {
          return p[i] - center[i];
        });
      }).map(function (vec) {
        return vec.map(function (_, i) {
          return center[i] + vec[i] * magnitude;
        });
      });
      return Type(newPoints);
    };

    var rotate = function rotate(angle) {
      var centerPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(this.points);
      var newPoints = this.points.map(function (p) {
        var vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
        var mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
        var a = Math.atan2(vec[1], vec[0]);
        return [centerPoint[0] + Math.cos(a + angle) * mag, centerPoint[1] + Math.sin(a + angle) * mag];
      });
      return Type(newPoints);
    };

    var translate = function translate() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      var vec = get_vector(args);
      var newPoints = this.points.map(function (p) {
        return p.map(function (n, i) {
          return n + vec[i];
        });
      });
      return Type(newPoints);
    };

    var transform = function transform() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      var m = get_matrix2(args);
      var newPoints = this.points.map(function (p) {
        return vector(multiply_matrix2_vector2(m, p));
      });
      return Type(newPoints);
    };

    Object.defineProperty(proto, "area", {
      value: area
    });
    Object.defineProperty(proto, "centroid", {
      value: polyCentroid
    });
    Object.defineProperty(proto, "midpoint", {
      value: midpoint
    });
    Object.defineProperty(proto, "enclosingRectangle", {
      value: enclosingRectangle
    });
    Object.defineProperty(proto, "contains", {
      value: contains
    });
    Object.defineProperty(proto, "nearest", {
      value: nearest
    });
    Object.defineProperty(proto, "clipSegment", {
      value: clipSegment
    });
    Object.defineProperty(proto, "clipLine", {
      value: clipLine
    });
    Object.defineProperty(proto, "clipRay", {
      value: clipRay
    });
    Object.defineProperty(proto, "split", {
      value: split
    });
    Object.defineProperty(proto, "scale", {
      value: scale
    });
    Object.defineProperty(proto, "rotate", {
      value: rotate
    });
    Object.defineProperty(proto, "translate", {
      value: translate
    });
    Object.defineProperty(proto, "transform", {
      value: transform
    });
    Object.defineProperty(proto, "edges", {
      get: function get() {
        return this.sides;
      }
    });
    Object.defineProperty(proto, "sectors", {
      get: function get() {
        return sectors.call(this);
      }
    });
    Object.defineProperty(proto, "signedArea", {
      value: area
    });
    return Object.freeze(proto);
  }

  var Polygon = function Polygon() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var points = get_vector_of_vectors(args).map(function (p) {
      return vector(p);
    });

    if (points === undefined) {
      return undefined;
    }

    var sides = points.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (ps) {
      return Segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]);
    });
    var proto = Prototype$1.bind(this);
    var polygon = Object.create(proto());
    Object.defineProperty(polygon, "points", {
      get: function get() {
        return points;
      }
    });
    Object.defineProperty(polygon, "sides", {
      get: function get() {
        return sides;
      }
    });
    return polygon;
  };

  Polygon.regularPolygon = function (sides) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var points = make_regular_polygon(sides, x, y, radius);
    return Polygon(points);
  };

  Polygon.convexHull = function (points) {
    var includeCollinear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var hull = convex_hull(points, includeCollinear);
    return Polygon(hull);
  };

  var ConvexPolygon = function ConvexPolygon() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var points = get_array_of_vec(args).map(function (p) {
      return vector(p);
    });

    if (points === undefined) {
      return undefined;
    }

    var sides = points.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (ps) {
      return Segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]);
    });
    var proto = Prototype$1.bind(this);
    var polygon = Object.create(proto(ConvexPolygon));

    var split = function split() {
      for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }

      var line = get_line(innerArgs);
      return split_convex_polygon(points, line.origin, line.vector).map(function (poly) {
        return ConvexPolygon(poly);
      });
    };

    var overlaps = function overlaps() {
      for (var _len3 = arguments.length, innerArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        innerArgs[_key3] = arguments[_key3];
      }

      var poly2Points = get_array_of_vec(innerArgs);
      return convex_polygons_overlap(points, poly2Points);
    };

    var scale = function scale(magnitude) {
      var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(polygon.points);
      var newPoints = polygon.points.map(function (p) {
        return [0, 1].map(function (_, i) {
          return p[i] - center[i];
        });
      }).map(function (vec) {
        return vec.map(function (_, i) {
          return center[i] + vec[i] * magnitude;
        });
      });
      return ConvexPolygon(newPoints);
    };

    var rotate = function rotate(angle) {
      var centerPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(polygon.points);
      var newPoints = polygon.points.map(function (p) {
        var vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
        var mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
        var a = Math.atan2(vec[1], vec[0]);
        return [centerPoint[0] + Math.cos(a + angle) * mag, centerPoint[1] + Math.sin(a + angle) * mag];
      });
      return ConvexPolygon(newPoints);
    };

    Object.defineProperty(polygon, "points", {
      get: function get() {
        return points;
      }
    });
    Object.defineProperty(polygon, "sides", {
      get: function get() {
        return sides;
      }
    });
    Object.defineProperty(polygon, "split", {
      value: split
    });
    Object.defineProperty(polygon, "overlaps", {
      value: overlaps
    });
    Object.defineProperty(polygon, "scale", {
      value: scale
    });
    Object.defineProperty(polygon, "rotate", {
      value: rotate
    });
    return polygon;
  };

  ConvexPolygon.regularPolygon = function (sides) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var points = make_regular_polygon(sides, x, y, radius);
    return ConvexPolygon(points);
  };

  ConvexPolygon.convexHull = function (points) {
    var includeCollinear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var hull = convex_hull(points, includeCollinear);
    return ConvexPolygon(hull);
  };

  var Rectangle = function Rectangle() {
    var origin;
    var width;
    var height;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var params = Array.from(args);
    var numbers = params.filter(function (param) {
      return !isNaN(param);
    });
    var arrays = params.filter(function (param) {
      return param.constructor === Array;
    });

    if (numbers.length === 4) {
      origin = vector(numbers.slice(0, 2));

      var _numbers = _slicedToArray(numbers, 4);

      width = _numbers[2];
      height = _numbers[3];
    }

    if (arrays.length === 1) {
      arrays = arrays[0];
    }

    if (arrays.length === 2) {
      if (typeof arrays[0][0] === "number") {
        origin = vector(arrays[0].slice());
        width = arrays[1][0];
        height = arrays[1][1];
      }
    }

    var points = [[origin[0], origin[1]], [origin[0] + width, origin[1]], [origin[0] + width, origin[1] + height], [origin[0], origin[1] + height]];
    var proto = Prototype$1.bind(this);
    var rect = Object.create(proto(Rectangle));

    var scale = function scale(magnitude, center_point) {
      var center = center_point != null ? center_point : [origin[0] + width, origin[1] + height];
      var x = origin[0] + (center[0] - origin[0]) * (1 - magnitude);
      var y = origin[1] + (center[1] - origin[1]) * (1 - magnitude);
      return Rectangle(x, y, width * magnitude, height * magnitude);
    };

    var rotate = function rotate() {
      var _ConvexPolygon;

      return (_ConvexPolygon = ConvexPolygon(points)).rotate.apply(_ConvexPolygon, arguments);
    };

    var transform = function transform() {
      for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }

      return ConvexPolygon(points).transform(innerArgs);
    };

    Object.defineProperty(rect, "points", {
      get: function get() {
        return points;
      }
    });
    Object.defineProperty(rect, "origin", {
      get: function get() {
        return origin;
      }
    });
    Object.defineProperty(rect, "width", {
      get: function get() {
        return width;
      }
    });
    Object.defineProperty(rect, "height", {
      get: function get() {
        return height;
      }
    });
    Object.defineProperty(rect, "area", {
      get: function get() {
        return width * height;
      }
    });
    Object.defineProperty(rect, "scale", {
      value: scale
    });
    Object.defineProperty(rect, "rotate", {
      value: rotate
    });
    Object.defineProperty(rect, "transform", {
      value: transform
    });
    return rect;
  };

  Rectangle.fromPoints = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var points = get_vector_of_vectors(args);
    var rect = enclosing_rectangle(points);
    return Rectangle(rect);
  };

  var Junction = function Junction() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var vectors = get_vector_of_vectors(args);

    if (vectors === undefined) {
      return undefined;
    }

    var sorted_order = counter_clockwise_vector_order.apply(void 0, _toConsumableArray(vectors));

    var sectors = function sectors() {
      return sorted_order.map(function (i) {
        return vectors[i];
      }).map(function (v, i, arr) {
        return [v, arr[(i + 1) % arr.length]];
      }).map(function (pair) {
        return Sector.fromVectors(pair[0], pair[1]);
      });
    };

    var angles = function angles() {
      return sorted_order.map(function (i) {
        return vectors[i];
      }).map(function (v, i, arr) {
        return [v, arr[(i + 1) % arr.length]];
      }).map(function (pair) {
        return counter_clockwise_angle2(pair[0], pair[1]);
      });
    };

    return {
      sectors: sectors,
      angles: angles,

      get vectors() {
        return vectors;
      },

      get vectorOrder() {
        return _toConsumableArray(sorted_order);
      }

    };
  };

  Junction.fromVectors = function () {
    return Junction.apply(void 0, arguments);
  };

  Junction.fromPoints = function (center, edge_adjacent_points) {
    var vectors = edge_adjacent_points.map(function (p) {
      return p.map(function (_, i) {
        return p[i] - center[i];
      });
    });
    return Junction.fromVectors(vectors);
  };

  var core = Object.create(null);
  Object.assign(core, algebra, matrix2_core, matrix3_core, geometry, query, equal);
  core.clean_number = clean_number;
  core.flatten_input = flatten_input;
  core.semi_flatten_input = semi_flatten_input;
  Object.keys(args).filter(function (key) {
    return /^is_/g.test(key);
  }).forEach(function (key) {
    core[key] = args[key];
  });
  Object.keys(args).filter(function (key) {
    return /^get_/g.test(key);
  }).forEach(function (key) {
    core[key] = args[key];
  });
  core.intersection = intersection;
  Object.freeze(core);
  var math = {
    vector: vector,
    matrix2: Matrix2,
    matrix: Matrix,
    line: Line,
    ray: Ray,
    segment: Segment,
    circle: circle$1,
    polygon: Polygon,
    convexPolygon: ConvexPolygon,
    rectangle: Rectangle,
    junction: Junction,
    sector: Sector,
    core: core
  };

  return math;

})));

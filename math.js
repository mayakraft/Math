/* Math (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.math = factory());
}(this, (function () { 'use strict';

  var Constructors = {};

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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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
  var resize = function resize(d, v) {
    return Array(d).fill(0).map(function (z, i) {
      return v[i] ? v[i] : z;
    });
  };
  var resizeUp = function resizeUp(a, b) {
    var size = a.length > b.length ? a.length : b.length;
    return [a, b].map(function (v) {
      return resize(size, v);
    });
  };
  var is_iterable = function is_iterable(obj) {
    return obj != null && typeof obj[Symbol.iterator] === "function";
  };
  var semi_flatten_arrays = function semi_flatten_arrays() {
    switch (arguments.length) {
      case undefined:
      case 0:
        return arguments;

      case 1:
        return is_iterable(arguments[0]) && typeof arguments[0] !== "string" ? semi_flatten_arrays.apply(void 0, _toConsumableArray(arguments[0])) : [arguments[0]];

      default:
        return Array.from(arguments).map(function (a) {
          return is_iterable(a) ? _toConsumableArray(semi_flatten_arrays(a)) : a;
        });
    }
  };
  var flatten_arrays = function flatten_arrays() {
    var arr = semi_flatten_arrays(arguments);
    return arr.length > 1 ? arr.reduce(function (a, b) {
      return a.concat(b);
    }, []) : arr;
  };
  var get_vector = function get_vector() {
    var list = flatten_arrays(arguments);

    if (list.length > 0 && _typeof(list[0]) === "object" && list[0] !== null && !isNaN(list[0].x)) {
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
    return semi_flatten_arrays(arguments).map(function (el) {
      return get_vector(el);
    });
  };
  var identity2 = [1, 0, 0, 1, 0, 0];
  var get_matrix2 = function get_matrix2() {
    var m = get_vector(arguments);

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
  function get_segment() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return get_vector_of_vectors(args);
  }
  function get_line() {
    if (arguments.length === 4) {
      return {
        origin: [arguments[0], arguments[1]],
        vector: [arguments[2], arguments[3]]
      };
    }

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

  var VectorArgs = function VectorArgs() {
    var _this = this;

    get_vector(arguments).forEach(function (n) {
      return _this.push(n);
    });
  };

  var VectorGetters = {
    x: function x() {
      return this[0];
    },
    y: function y() {
      return this[1];
    },
    z: function z() {
      return this[2];
    }
  };

  var EPSILON$1 = 1e-6;

  var magnitude = function magnitude(v) {
    return Math.sqrt(v.map(function (n) {
      return n * n;
    }).reduce(function (a, b) {
      return a + b;
    }, 0));
  };
  var normalize = function normalize(v) {
    var m = magnitude(v);
    return m === 0 ? v : v.map(function (c) {
      return c / m;
    });
  };
  var dot = function dot(v, u) {
    return v.map(function (_, i) {
      return v[i] * u[i];
    }).reduce(function (a, b) {
      return a + b;
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
  var midpoint2 = function midpoint2(a, b) {
    return a.map(function (_, i) {
      return (a[i] + b[i]) / 2;
    });
  };
  var cross3 = function cross3(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[0] * b[2] - a[2] * b[0], a[0] * b[1] - a[1] * b[0]];
  };
  var distance2 = function distance2(a, b) {
    var p = a[0] - b[0];
    var q = a[1] - b[1];
    return Math.sqrt(p * p + q * q);
  };

  var degenerate = function degenerate(v) {
    return Math.abs(v.reduce(function (a, b) {
      return a + b;
    }, 0)) < EPSILON$1;
  };
  var parallel = function parallel(a, b) {
    return 1 - Math.abs(dot(normalize(a), normalize(b))) < EPSILON$1;
  };
  var point_on_line = function point_on_line(linePoint, lineVector, point) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON$1;
    var pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
    var cross = pointPoint[0] * lineVector[1] - pointPoint[1] * lineVector[0];
    return Math.abs(cross) < epsilon;
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
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;

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
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;

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

  var determ2 = function determ2(a, b) {
    return a[0] * b[1] - b[0] * a[1];
  };

  var line_line_comp = function line_line_comp() {
    return true;
  };

  var line_ray_comp = function line_ray_comp(t0, t1) {
    return t1 >= -EPSILON$1;
  };

  var line_segment_comp = function line_segment_comp(t0, t1) {
    return t1 >= -EPSILON$1 && t1 <= 1 + EPSILON$1;
  };

  var ray_ray_comp = function ray_ray_comp(t0, t1) {
    return t0 >= -EPSILON$1 && t1 >= -EPSILON$1;
  };

  var ray_segment_comp = function ray_segment_comp(t0, t1) {
    return t0 >= -EPSILON$1 && t1 >= -EPSILON$1 && t1 <= 1 + EPSILON$1;
  };

  var segment_segment_comp = function segment_segment_comp(t0, t1) {
    return t0 >= -EPSILON$1 && t0 <= 1 + EPSILON$1 && t1 >= -EPSILON$1 && t1 <= 1 + EPSILON$1;
  };

  var line_segment_comp_exclusive = function line_segment_comp_exclusive(t0, t1) {
    return t1 > EPSILON$1 && t1 < 1 - EPSILON$1;
  };

  var segment_segment_comp_exclusive = function segment_segment_comp_exclusive(t0, t1) {
    return t0 > EPSILON$1 && t0 < 1 - EPSILON$1 && t1 > EPSILON$1 && t1 < 1 - EPSILON$1;
  };

  var limit_line = function limit_line(dist) {
    return dist;
  };
  var intersection_function = function intersection_function(aPt, aVec, bPt, bVec, compFunc) {
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON$1;
    var denominator0 = determ2(aVec, bVec);

    if (Math.abs(denominator0) < epsilon) {
      return undefined;
    }

    var denominator1 = -denominator0;
    var numerator0 = determ2([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
    var numerator1 = determ2([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
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
    return intersection_function(a0, aVec, b0, bVec, segment_segment_comp, epsilon);
  };
  var line_segment_exclusive = function line_segment_exclusive(origin, vec, segment0, segment1, epsilon) {
    var segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
    return intersection_function(origin, vec, segment0, segmentVec, line_segment_comp_exclusive, epsilon);
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
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON$1;
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
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON$1;
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
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON$1;
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
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON$1;
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
    return Math.abs(a[0] - b[0]) < EPSILON$1 && Math.abs(a[1] - b[1]) < EPSILON$1;
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

    if (Math.abs(denominator) < EPSILON$1) {
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
    var mins = Array(points[0].length).fill(Infinity);
    var maxs = Array(points[0].length).fill(-Infinity);
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
      return Math.abs(a.point[0] - b.point[0]) < EPSILON$1 ? a.point[1] - b.point[1] : a.point[0] - b.point[0];
    });
    console.log(sorted);
    return poly;
  };

  var multiply_matrix2_vector2 = function multiply_matrix2_vector2(matrix, vector) {
    return [matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4], matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]];
  };
  var multiply_matrix2_line2 = function multiply_matrix2_line2(matrix, origin, vector) {
    return {
      origin: [matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4], matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]],
      vector: [matrix[0] * vector[0] + matrix[2] * vector[1], matrix[1] * vector[0] + matrix[3] * vector[1]]
    };
  };

  var table = {
    preserve: {
      magnitude: function magnitude$1() {
        return magnitude(this);
      },
      isEquivalent: function isEquivalent() {
        var vecs = resizeUp(this, get_vector(arguments));
        return vecs[0].map(function (_, i) {
          return Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON$1;
        }).reduce(function (a, b) {
          return a && b;
        }, true);
      },
      isParallel: function isParallel() {
        return parallel.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
      },
      dot: function dot$1() {
        return dot.apply(void 0, _toConsumableArray(lengthSort(this, get_vector(arguments))));
      },
      distanceTo: function distanceTo() {
        var vecs = resizeUp(this, get_vector(arguments));
        return Math.sqrt(vecs.map(function (_, i) {
          return Math.pow(vecs[0][i] - vecs[1][i], 2);
        }).reduce(function (a, b) {
          return a + b;
        }, 0));
      },
      bisect: function bisect() {
        return bisect_vectors(this, get_vector(arguments)).map(function (b) {
          return Constructors.vector(b);
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
        return cross3(resize(3, this), resize(3, get_vector(arguments)));
      },
      add: function add() {
        var _this = this;

        return resize(this.length, get_vector(arguments)).map(function (n, i) {
          return _this[i] + n;
        });
      },
      subtract: function subtract() {
        var _this2 = this;

        return resize(this.length, get_vector(arguments)).map(function (n, i) {
          return _this2[i] - n;
        });
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
      lerp: function lerp(vector, pct) {
        var _this3 = this;

        var inv = 1.0 - pct;
        return resize(this.length, get_vector(vector)).map(function (n, i) {
          return _this3[i] * inv + n * pct;
        });
      },
      midpoint: function midpoint() {
        var vecs = resizeUp(this, get_vector(arguments));
        return vecs[0].map(function (_, i) {
          return (vecs[0][i] + vecs[1][i]) / 2;
        });
      }
    }
  };
  var VectorMethods = {};
  Object.keys(table.preserve).forEach(function (key) {
    VectorMethods[key] = table.preserve[key];
  });
  Object.keys(table.vector).forEach(function (key) {
    VectorMethods[key] = function () {
      return Constructors.vector.apply(Constructors, _toConsumableArray(table.vector[key].apply(this, arguments)));
    };
  });

  var VectorStatic = {
    fromAngle: function fromAngle(angle) {
      return Constructors.vector(Math.cos(angle), Math.sin(angle));
    }
  };

  var Vector$1 = {
    vector: {
      P: Array.prototype,
      A: VectorArgs,
      G: VectorGetters,
      M: VectorMethods,
      S: VectorStatic
    }
  };

  var CircleArgs = function CircleArgs() {
    var arr = Array.from(arguments);
    var numbers = arr.filter(function (param) {
      return !isNaN(param);
    });
    var vectors = get_vector_of_vectors(arr);

    if (numbers.length === 3) {
      this.origin = Constructors.vector(numbers[0], numbers[1]);
      this.radius = numbers[2];
    } else if (vectors.length === 2) {
      this.radius = distance2.apply(void 0, _toConsumableArray(vectors));
      this.origin = Constructors.vector.apply(Constructors, _toConsumableArray(vectors[0]));
    }
  };

  var CircleGetters = {
    x: function x() {
      return this.origin[0];
    },
    y: function y() {
      return this.origin[1];
    }
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

  var CircleMethods = {};

  var CircleStatic = {
    fromPoints: function fromPoints() {
      var points = get_vector_of_vectors(innerArgs);
      return Constructors.circle(points, distance2(points[0], points[1]));
    }
  };

  var Circle = {
    circle: {
      A: CircleArgs,
      G: CircleGetters,
      M: CircleMethods,
      S: CircleStatic
    }
  };

  var Polygon = function Polygon() {};

  Polygon.prototype.area = function () {
    return signed_area(this.points);
  };

  Polygon.prototype.midpoint = function () {
    return average(this.points);
  };

  Polygon.prototype.centroid = function () {
    return centroid(this.points);
  };

  Polygon.prototype.enclosingRectangle = function () {
    return enclosing_rectangle(this.points);
  };

  Polygon.prototype.contains = function () {
    return point_in_poly(get_vector(arguments), this.points);
  };

  Polygon.prototype.scale = function (magnitude) {
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
    return Constructors.polygon(newPoints);
  };

  Polygon.prototype.rotate = function (angle) {
    var centerPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(this.points);
    var newPoints = this.points.map(function (p) {
      var vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
      var mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
      var a = Math.atan2(vec[1], vec[0]);
      return [centerPoint[0] + Math.cos(a + angle) * mag, centerPoint[1] + Math.sin(a + angle) * mag];
    });
    return Constructors.polygon(newPoints);
  };

  Polygon.prototype.translate = function () {
    var vec = get_vector(arguments);
    var newPoints = this.points.map(function (p) {
      return p.map(function (n, i) {
        return n + vec[i];
      });
    });
    return Constructors.polygon(newPoints);
  };

  Polygon.prototype.transform = function () {
    var m = get_matrix2(arguments);
    var newPoints = this.points.map(function (p) {
      return multiply_matrix2_vector2(m, p);
    });
    return Constructors.polygon(newPoints);
  };

  Polygon.prototype.sectors = function () {
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
      return Constructors.sector(b, a, center);
    });
  };

  Polygon.prototype.enclosingRectangle = function () {
    return Constructors.rect(enclosing_rectangle(this.points));
  };

  Polygon.prototype.clipSegment = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var edge = get_segment(args);
    var e = convex_poly_segment(this.points, edge[0], edge[1]);
    return e === undefined ? undefined : Segment(e);
  };

  Polygon.prototype.clipLine = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var line = get_line(args);
    var e = convex_poly_line(this.points, line.origin, line.vector);
    return e === undefined ? undefined : Segment(e);
  };

  Polygon.prototype.clipRay = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var line = get_line(args);
    var e = convex_poly_ray(this.points, line.origin, line.vector);
    return e === undefined ? undefined : Segment(e);
  };

  Polygon.prototype.split = function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var line = get_line(args);
    return split_polygon(this.points, line.origin, line.vector).map(function (poly) {
      return Constructors.polygon(poly);
    });
  };

  var argsToPoints = function argsToPoints(x, y, w, h) {
    return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  };

  var resize$1 = function resize(d, a) {
    return Array(d).fill(0).map(function (z, i) {
      return a[i] ? a[i] : z;
    });
  };

  var Rect = {
    rect: {
      P: Polygon.prototype,
      A: function A() {
        var n = resize$1(4, flatten_arrays(arguments));
        this.origin = [n[0], n[1]];
        this.width = n[2];
        this.height = n[3];
        this.points = argsToPoints.apply(void 0, _toConsumableArray(n));
      },
      G: {
        x: function x() {
          return this.origin[0];
        },
        y: function y() {
          return this.origin[1];
        }
      },
      M: {
        area: function area() {
          return this.width * this.height;
        },
        scale: function scale(magnitude, center_point) {
          var center = center_point != null ? center_point : [this.origin[0] + this.width, this.origin[1] + this.height];
          var x = this.origin[0] + (center[0] - this.origin[0]) * (1 - magnitude);
          var y = this.origin[1] + (center[1] - this.origin[1]) * (1 - magnitude);
          return Constructors.rect(x, y, this.width * magnitude, this.height * magnitude);
        }
      },
      S: {
        fromPoints: function fromPoints() {
          return Constructors.rect(enclosing_rectangle(get_vector_of_vectors(arguments)));
        }
      }
    }
  };

  var Polygon$1 = {
    polygon: {
      P: Polygon.prototype,
      A: function A() {
        this.points = semi_flatten_arrays(arguments);
      },
      G: {},
      M: {},
      S: {}
    }
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

  var Line$1 = function Line() {};

  Line$1.prototype.compare_to_line = function (t0, t1) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;
    return this.compare_function(t0, epsilon) && true;
  };

  Line$1.prototype.compare_to_ray = function (t0, t1) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;
    return this.compare_function(t0, epsilon) && t1 >= -epsilon;
  };

  Line$1.prototype.compare_to_segment = function (t0, t1) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;
    return this.compare_function(t0, epsilon) && t1 >= -epsilon && t1 <= 1 + epsilon;
  };

  Line$1.prototype.isParallel = function () {
    var arr = resizeUp(this.vector, get_line.apply(void 0, arguments).vector);
    console.log(arguments, this.vector, get_line.apply(void 0, arguments).vector, arr);
    return parallel.apply(void 0, _toConsumableArray(arr));
  };

  Line$1.prototype.isDegenerate = function () {
    return degenerate(this.vector);
  };

  Line$1.prototype.reflection = function () {
    return Matrix2.makeReflection(this.vector, this.origin);
  };

  Line$1.prototype.nearestPoint = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var point = get_vector(args);
    return Vector(nearest_point_on_line(this.origin, this.vector, point, this.clip_function));
  };

  Line$1.prototype.intersect = function (other) {
    return intersect(this, other);
  };

  Line$1.prototype.intersectLine = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var line = get_line(args);
    return intersection_function(this.origin, this.vector, line.origin, line.vector, compare_to_line.bind(this));
  };

  Line$1.prototype.intersectRay = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var ray = get_ray(args);
    return intersection_function(this.origin, this.vector, ray.origin, ray.vector, compare_to_ray.bind(this));
  };

  Line$1.prototype.intersectSegment = function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var edge = get_segment(args);
    var edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
    return intersection_function(this.origin, this.vector, edge[0], edgeVec, compare_to_segment.bind(this));
  };

  Line$1.prototype.bisectLine = function () {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    var line = get_line(args);
    return bisect_lines2(this.origin, this.vector, line.origin, line.vector);
  };

  Line$1.prototype.bisectRay = function () {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    var ray = get_ray(args);
    return bisect_lines2(this.origin, this.vector, ray.origin, ray.vector);
  };

  Line$1.prototype.bisectSegment = function () {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    var s = get_segment(args);
    var vector = [s[1][0] - s[0][0], s[1][1] - s[0][1]];
    return bisect_lines2(this.origin, this.vector, s[0], vector);
  };

  var Line$2 = {
    line: {
      P: Line$1.prototype,
      A: function A() {
        var l = get_line.apply(void 0, arguments);
        this.origin = Constructors.vector(l.origin);
        this.vector = Constructors.vector(l.vector);
      },
      G: {
        length: function length() {
          return Infinity;
        }
      },
      M: {
        area: function area() {
          return this.width * this.height;
        },
        transform: function transform() {
          var mat = get_matrix2(arguments);
          var line = multiply_matrix2_line2(mat, this.origin, this.vector);
          return Line(line[0], line[1]);
        },
        compare_function: function compare_function() {
          return true;
        },
        clip_function: limit_line
      },
      S: {
        fromPoints: function fromPoints() {
          var points = get_vector_of_vectors(arguments);
          return Constructors.line({
            origin: points[0],
            vector: [points[1][0] - points[0][0], points[1][1] - points[0][1]]
          });
        },
        perpendicularBisector: function perpendicularBisector() {
          var points = get_vector_of_vectors(arguments);
          var vec = normalize([points[1][0] - points[0][0], points[1][1] - points[0][1]]);
          return Constructors.line({
            origin: average(points[0], points[1]),
            vector: [vec[1], -vec[0]]
          });
        }
      }
    }
  };

  var create = function create(primitiveName, args) {
    var a = Object.create(Definitions[primitiveName].proto);
    Definitions[primitiveName].A.apply(a, args);
    return Object.freeze(a);
  };

  var Definitions = Object.assign({}, Vector$1, Circle, Rect, Polygon$1, Line$2);

  var vector = function vector() {
    return create("vector", arguments);
  };

  var circle = function circle() {
    return create("circle", arguments);
  };

  var rect = function rect() {
    return create("rect", arguments);
  };

  var polygon = function polygon() {
    return create("polygon", arguments);
  };

  var line = function line() {
    return create("line", arguments);
  };

  Object.assign(Constructors, {
    vector: vector,
    circle: circle,
    rect: rect,
    polygon: polygon,
    line: line
  });
  Object.keys(Definitions).forEach(function (primitiveName) {
    var Proto = {};
    Proto.prototype = Definitions[primitiveName].P != null ? Object.create(Definitions[primitiveName].P) : Object.create(Object.prototype);
    Proto.prototype.constructor = Proto;
    Object.keys(Definitions[primitiveName].G).forEach(function (key) {
      return Object.defineProperty(Proto.prototype, key, {
        get: Definitions[primitiveName].G[key],
        enumerable: true
      });
    });
    Object.keys(Definitions[primitiveName].M).forEach(function (key) {
      return Object.defineProperty(Proto.prototype, key, {
        value: Definitions[primitiveName].M[key]
      });
    });
    Definitions[primitiveName].proto = Proto.prototype;
    Object.keys(Definitions[primitiveName].S).forEach(function (key) {
      return Object.defineProperty(Constructors[primitiveName], key, {
        value: Definitions[primitiveName].S[key]
      });
    });
    Constructors[primitiveName].prototype = Definitions[primitiveName].proto;
    Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];
    Object.freeze(Definitions[primitiveName].proto);
  });
  console.log(Definitions);

  var math = Constructors;

  return math;

})));

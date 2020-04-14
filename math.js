/* Math (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.math = factory());
}(this, (function () { 'use strict';

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
    var _arguments = arguments;
    var dimension = arguments.length > 0 ? arguments[0].length : 0;
    var sum = Array(dimension).fill(0);
    Array.from(arguments).forEach(function (vec) {
      return sum.forEach(function (_, i) {
        sum[i] += vec[i] || 0;
      });
    });
    return sum.map(function (n) {
      return n / _arguments.length;
    });
  };
  var midpoint2 = function midpoint2(a, b) {
    return a.map(function (_, i) {
      return (a[i] + b[i]) / 2;
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
    return Math.sqrt(Array.from(Array(a.length)).map(function (_, i) {
      return Math.pow(a[i] - b[i], 2);
    }).reduce(function (a, b) {
      return a + b;
    }, 0));
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
        return Array.from(arguments);

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
    if (arguments[0] instanceof Constructors.vector) {
      return arguments[0];
    }

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
    if (arguments[0] instanceof Constructors.segment) {
      return arguments[0];
    }

    if (arguments.length === 4) {
      return [[arguments[0], arguments[1]], [arguments[2], arguments[3]]];
    }

    return get_vector_of_vectors(arguments);
  }
  function get_line() {
    if (arguments[0] instanceof Constructors.line) {
      return arguments[0];
    }

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

  var comp_l_l = function comp_l_l() {
    return true;
  };
  var comp_l_r = function comp_l_r(t0, t1) {
    return t1 >= -EPSILON$1;
  };
  var comp_l_s = function comp_l_s(t0, t1) {
    return t1 >= -EPSILON$1 && t1 <= 1 + EPSILON$1;
  };
  var comp_r_r = function comp_r_r(t0, t1) {
    return t0 >= -EPSILON$1 && t1 >= -EPSILON$1;
  };
  var comp_r_s = function comp_r_s(t0, t1) {
    return t0 >= -EPSILON$1 && t1 >= -EPSILON$1 && t1 <= 1 + EPSILON$1;
  };
  var comp_s_s = function comp_s_s(t0, t1) {
    return t0 >= -EPSILON$1 && t0 <= 1 + EPSILON$1 && t1 >= -EPSILON$1 && t1 <= 1 + EPSILON$1;
  };
  var exclude_l_r = function exclude_l_r(t0, t1) {
    return t1 > EPSILON$1;
  };
  var exclude_l_s = function exclude_l_s(t0, t1) {
    return t1 > EPSILON$1 && t1 < 1 - EPSILON$1;
  };
  var exclude_r_r = function exclude_r_r(t0, t1) {
    return t0 > EPSILON$1 && t1 > EPSILON$1;
  };
  var exclude_r_s = function exclude_r_s(t0, t1) {
    return t0 > EPSILON$1 && t1 > EPSILON$1 && t1 < 1 - EPSILON$1;
  };
  var exclude_s_s = function exclude_s_s(t0, t1) {
    return t0 > EPSILON$1 && t0 < 1 - EPSILON$1 && t1 > EPSILON$1 && t1 < 1 - EPSILON$1;
  };
  var determ2 = function determ2(a, b) {
    return a[0] * b[1] - b[0] * a[1];
  };
  var intersect = function intersect(a, b, compFunc) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON$1;
    var denominator0 = determ2(a.vector, b.vector);

    if (Math.abs(denominator0) < epsilon) {
      return undefined;
    }

    var denominator1 = -denominator0;
    var numerator0 = determ2([b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]], b.vector);
    var numerator1 = determ2([a.origin[0] - b.origin[0], a.origin[1] - b.origin[1]], a.vector);
    var t0 = numerator0 / denominator0;
    var t1 = numerator1 / denominator1;

    if (compFunc(t0, t1, epsilon)) {
      return [a.origin[0] + a.vector[0] * t0, a.origin[1] + a.vector[1] * t0];
    }

    return undefined;
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

  var line_segment_exclusive = function line_segment_exclusive(linePoint, lineVector, segmentA, segmentB) {
    var pt = segmentA;
    var vec = [segmentB[0] - segmentA[0], segmentB[1] - segmentA[1]];
    return intersect(linePoint, lineVector, pt, vec, exclude_l_s);
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

  var multiply_matrix2_vector2$1 = function multiply_matrix2_vector2(matrix, vector) {
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
        return dot.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
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

  var circle_circle = function circle_circle(c1, c2) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;
    var r = c1.radius < c2.radius ? c1.radius : c2.radius;
    var R = c1.radius < c2.radius ? c2.radius : c1.radius;
    var smCenter = c1.radius < c2.radius ? c1.origin : c2.origin;
    var bgCenter = c1.radius < c2.radius ? c2.origin : c1.origin;
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
  var circle_line = function circle_line(circle, line) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;
    var magSq = Math.pow(line.vector[0], 2) + Math.pow(line.vector[1], 2);
    var mag = Math.sqrt(magSq);
    var norm = mag === 0 ? line.vector : line.vector.map(function (c) {
      return c / mag;
    });
    var rot90 = [-norm[1], norm[0]];
    var bvec = [line.origin[0] - circle.origin[0], line.origin[1] - circle.origin[1]];
    var det = bvec[0] * norm[1] - norm[0] * bvec[1];

    if (Math.abs(det) > circle.radius + epsilon) {
      return undefined;
    }

    var side = Math.sqrt(Math.pow(circle.radius, 2) - Math.pow(det, 2));

    var f = function f(s, i) {
      return circle.origin[i] - rot90[i] * det + norm[i] * s;
    };

    return Math.abs(circle.radius - Math.abs(det)) < epsilon ? [side].map(function (s) {
      return [s, s].map(f);
    }) : [-side, side].map(function (s) {
      return [s, s].map(f);
    });
  };
  var circle_ray = function circle_ray(circle, ray) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;
    var magSq = Math.pow(ray.vector[0], 2) + Math.pow(ray.vector[1], 2);
    var mag = Math.sqrt(magSq);
    var norm = mag === 0 ? ray.vector : ray.vector.map(function (c) {
      return c / mag;
    });
    var rot90 = [-norm[1], norm[0]];
    var bvec = [ray.origin[0] - circle.origin[0], ray.origin[1] - circle.origin[1]];
    var det = bvec[0] * norm[1] - norm[0] * bvec[1];

    if (Math.abs(det) > circle.radius + epsilon) {
      return undefined;
    }

    var side = Math.sqrt(Math.pow(circle.radius, 2) - Math.pow(det, 2));

    var f = function f(s, i) {
      return circle.origin[i] - rot90[i] * det + norm[i] * s;
    };

    var result = Math.abs(circle.radius - Math.abs(det)) < epsilon ? [side].map(function (s) {
      return [s, s].map(f);
    }) : [-side, side].map(function (s) {
      return [s, s].map(f);
    });
    var ts = result.map(function (res) {
      return res.map(function (n, i) {
        return n - ray.origin[i];
      });
    }).map(function (v) {
      return v[0] * ray.vector[0] + ray.vector[1] * v[1];
    }).map(function (d) {
      return d / magSq;
    });
    return result.filter(function (_, i) {
      return ts[i] > -epsilon;
    });
  };
  var circle_segment = function circle_segment(circle, segment) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;
    var magSq = Math.pow(segment.vector[0], 2) + Math.pow(segment.vector[1], 2);
    var mag = Math.sqrt(magSq);
    var norm = mag === 0 ? segment.vector : segment.vector.map(function (c) {
      return c / mag;
    });
    var rot90 = [-norm[1], norm[0]];
    var bvec = [segment.origin[0] - circle.origin[0], segment.origin[1] - circle.origin[1]];
    var det = bvec[0] * norm[1] - norm[0] * bvec[1];

    if (Math.abs(det) > circle.radius + epsilon) {
      return undefined;
    }

    var side = Math.sqrt(Math.pow(circle.radius, 2) - Math.pow(det, 2));

    var f = function f(s, i) {
      return circle.origin[i] - rot90[i] * det + norm[i] * s;
    };

    var result = Math.abs(circle.radius - Math.abs(det)) < epsilon ? [side].map(function (s) {
      return [s, s].map(f);
    }) : [-side, side].map(function (s) {
      return [s, s].map(f);
    });
    var ts = result.map(function (res) {
      return res.map(function (n, i) {
        return n - segment.origin[i];
      });
    }).map(function (v) {
      return v[0] * segment.vector[0] + segment.vector[1] * v[1];
    }).map(function (d) {
      return d / magSq;
    });
    return result.filter(function (_, i) {
      return ts[i] > -epsilon && ts[i] < 1 + epsilon;
    });
  };

  var line_segment = function line_segment(origin, vector, pt0, pt1) {
    var a = {
      origin: origin,
      vector: vector
    };
    var b = {
      origin: pt0,
      vector: [[pt1[0] - pt0[0]], [pt1[1] - pt0[1]]]
    };
    return intersect(a, b, comp_l_s);
  };

  var quick_equivalent_2 = function quick_equivalent_2(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON$1 && Math.abs(a[1] - b[1]) < EPSILON$1;
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

  var intersection_map = {
    circle: {
      circle: circle_circle,
      line: circle_line,
      ray: circle_ray,
      segment: circle_segment
    },
    line: {
      poly: function poly(a, b) {
        return convex_poly_line(b, a);
      },
      circle: function circle(a, b) {
        return circle_line(b, a);
      },
      line: function line(a, b) {
        return intersect(a, b, comp_l_l);
      },
      ray: function ray(a, b, c) {
        return intersect(a, b, c === false ? exclude_l_r : comp_l_r);
      },
      segment: function segment(a, b, c) {
        return intersect(a, b, c === false ? exclude_l_s : comp_l_s);
      }
    },
    ray: {
      poly: function poly(a, b) {
        return convex_poly_ray(b, a);
      },
      circle: function circle(a, b) {
        return circle_ray(b, a);
      },
      line: function line(a, b, c) {
        return intersect(b, a, c === false ? exclude_l_r : comp_l_r);
      },
      ray: function ray(a, b, c) {
        return intersect(a, b, c === false ? exclude_r_r : comp_r_r);
      },
      segment: function segment(a, b, c) {
        return intersect(a, b, c === false ? exclude_r_s : comp_r_s);
      }
    },
    segment: {
      poly: function poly(a, b) {
        return convex_poly_segment(b, a);
      },
      circle: function circle(a, b) {
        return circle_segment(b, a);
      },
      line: function line(a, b, c) {
        return intersect(b, a, c === false ? exclude_l_s : comp_l_s);
      },
      ray: function ray(a, b, c) {
        return intersect(b, a, c === false ? exclude_r_s : comp_r_s);
      },
      segment: function segment(a, b, c) {
        return intersect(a, b, c === false ? exclude_s_s : comp_s_s);
      }
    }
  };

  var intersect$1 = function intersect(a, b) {
    var aT = Typeof(a);
    var bT = Typeof(b);
    var func = intersection_map[aT][bT];
    return func(a, b);
  };

  var CircleMethods = {
    intersect: function intersect(object) {
      return intersect$1(this, object);
    }
  };

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
      return multiply_matrix2_vector2$1(m, p);
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
    return e === undefined ? undefined : Constructors.segment(e);
  };

  Polygon.prototype.clipLine = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var line = get_line(args);
    var e = convex_poly_line(this.points, line.origin, line.vector);
    return e === undefined ? undefined : Constructors.segment(e);
  };

  Polygon.prototype.clipRay = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var line = get_line(args);
    var e = convex_poly_ray(this.points, line.origin, line.vector);
    return e === undefined ? undefined : Constructors.segment(e);
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

  var Line = function Line() {};

  Line.prototype.isParallel = function () {
    var arr = resizeUp(this.vector, get_line.apply(void 0, arguments).vector);
    console.log(arguments, this.vector, get_line.apply(void 0, arguments).vector, arr);
    return parallel.apply(void 0, _toConsumableArray(arr));
  };

  Line.prototype.isDegenerate = function () {
    return degenerate(this.vector);
  };

  Line.prototype.reflection = function () {
    return Matrix2.makeReflection(this.vector, this.origin);
  };

  Line.prototype.nearestPoint = function () {
    var point = get_vector(arguments);
    return Vector(nearest_point_on_line(this.origin, this.vector, point, this.clip_function));
  };

  Line.prototype.intersect = function (other) {
    return intersect$1(this, other);
  };

  var Line$1 = {
    line: {
      P: Line.prototype,
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
        transform: function transform() {
          var mat = get_matrix2(arguments);
          var line = multiply_matrix2_line2(mat, this.origin, this.vector);
          return Constructors.line(line[0], line[1]);
        },
        clip_function: function clip_function(dist) {
          return dist;
        }
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

  var Ray = {
    ray: {
      P: Line.prototype,
      A: function A() {
        var ray = get_line.apply(void 0, arguments);
        this.origin = Constructors.vector(ray.origin);
        this.vector = Constructors.vector(ray.vector);
      },
      G: {
        length: function length() {
          return Infinity;
        }
      },
      M: {
        transform: function transform() {
          var _this = this;

          for (var _len = arguments.length, innerArgs = new Array(_len), _key = 0; _key < _len; _key++) {
            innerArgs[_key] = arguments[_key];
          }

          var mat = get_matrix2(innerArgs);
          var vec_translated = this.vector.map(function (vec, i) {
            return vec + _this.origin[i];
          });
          var new_origin = multiply_matrix2_vector2(mat, this.origin);
          var new_vector = multiply_matrix2_vector2(mat, vec_translated).map(function (vec, i) {
            return vec - new_origin[i];
          });
          return Constructors.ray(new_origin, new_vector);
        },
        rotate180: function rotate180() {
          return Constructors.ray(this.origin[0], this.origin[1], -this.vector[0], -this.vector[1]);
        },
        clip_function: function clip_function(dist) {
          return dist < -EPSILON ? 0 : dist;
        }
      },
      S: {
        fromPoints: function fromPoints() {
          var p = get_vector_of_vectors(arguments);
          return Constructors.ray({
            origin: p[0],
            vector: [p[1][0] - p[0][0], p[1][1] - p[0][1]]
          });
        }
      }
    }
  };

  var Segment = {
    segment: {
      P: Line.prototype,
      A: function A() {
        this.points = get_segment.apply(void 0, arguments).map(function (p) {
          return Constructors.vector(p);
        });
        this.origin = this.points[0];
        this.vector = this.points[1].subtract(this.points[0]);
      },
      G: {
        "0": function _() {
          return this.points[0];
        },
        "1": function _() {
          return this.points[1];
        },
        length: function length() {
          return this.vector.magnitude();
        }
      },
      M: {
        clip_function: function clip_function(dist) {
          if (dist < -EPSILON) {
            return 0;
          }

          if (dist > 1 + EPSILON) {
            return 1;
          }

          return dist;
        },
        transform: function transform() {
          for (var _len = arguments.length, innerArgs = new Array(_len), _key = 0; _key < _len; _key++) {
            innerArgs[_key] = arguments[_key];
          }

          var mat = get_matrix2(innerArgs);
          var transformed_points = this.points.map(function (point) {
            return multiply_matrix2_vector2$1(mat, point);
          });
          return Constructor.segment(transformed_points);
        },
        scale: function scale(magnitude) {
          var mid = average(this.points[0], this.points[1]);
          var transformed_points = this.points.map(function (p) {
            return p.lerp(mid, magnitude);
          });
          return Constructor.segment(transformed_points);
        },
        midpoint: function midpoint() {
          return Constructor.vector(average(this.points[0], this.points[1]));
        }
      },
      S: {
        fromPoints: Constructors.segment
      }
    }
  };

  var create = function create(primitiveName, args) {
    var a = Object.create(Definitions[primitiveName].proto);
    Definitions[primitiveName].A.apply(a, args);
    return Object.freeze(a);
  };

  var Definitions = Object.assign({}, Vector$1, Circle, Rect, Polygon$1, Line$1, Ray, Segment);

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

  var ray = function ray() {
    return create("ray", arguments);
  };

  var segment = function segment() {
    return create("segment", arguments);
  };

  Object.assign(Constructors, {
    vector: vector,
    circle: circle,
    rect: rect,
    polygon: polygon,
    line: line,
    ray: ray,
    segment: segment
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
    Object.keys(Definitions[primitiveName].S).forEach(function (key) {
      return Object.defineProperty(Constructors[primitiveName], key, {
        value: Definitions[primitiveName].S[key]
      });
    });
    Constructors[primitiveName].prototype = Proto.prototype;
    Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];
    Object.freeze(Proto.prototype);
    Definitions[primitiveName].proto = Proto.prototype;
  });

  var math = Constructors;
  math.core = {
    nearest_point: nearest_point,
    magnitude: magnitude,
    normalize: normalize,
    dot: dot,
    average: average,
    midpoint2: midpoint2,
    cross2: cross2,
    cross3: cross3,
    distance2: distance2,
    distance3: distance3,
    distance: distance
  };

  return math;

})));

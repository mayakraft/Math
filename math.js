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
  var identity3x4 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
  var maps_3x4 = [[0, 1, 3, 4, 9, 10], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11]];
  [11, 7, 3].forEach(function (i) {
    return delete maps_3x4[2][i];
  });

  var matrix_map_3x4 = function matrix_map_3x4(len) {
    var i;
    if (len < 8) i = 0;else if (len < 13) i = 1;else i = 2;
    return maps_3x4[i];
  };

  var get_matrix_3x4 = function get_matrix_3x4() {
    var mat = flatten_arrays(arguments);
    var matrix = [].concat(identity3x4);
    matrix_map_3x4(mat.length).filter(function (_, i) {
      return mat[i] != null;
    }).forEach(function (n, i) {
      matrix[n] = mat[i];
    });
    return matrix;
  };

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

  var EPSILON = 1e-6;
  var equivalent_vectors = function equivalent_vectors(a, b) {
    var vecs = resizeUp(a, b);
    return vecs[0].map(function (_, i) {
      return Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON;
    }).reduce(function (u, v) {
      return u && v;
    }, true);
  };

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
  var scale = function scale(v, s) {
    return v.map(function (n) {
      return n * s;
    });
  };
  var add = function add(v, u) {
    return v.map(function (n, i) {
      return n + u[i];
    });
  };
  var subtract = function subtract(v, u) {
    return v.map(function (n, i) {
      return n - u[i];
    });
  };
  var dot = function dot(v, u) {
    return v.map(function (_, i) {
      return v[i] * u[i];
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  };
  var midpoint = function midpoint(v, u) {
    return v.map(function (n, i) {
      return (n + u[i]) / 2;
    });
  };
  var lerp = function lerp(v, u, t) {
    var inv = 1.0 - t;
    return v.map(function (n, i) {
      return n * inv + u[i] * t;
    });
  };
  var cross3 = function cross3(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[0] * b[2] - a[2] * b[0], a[0] * b[1] - a[1] * b[0]];
  };
  var distance = function distance(a, b) {
    return Math.sqrt(Array.from(Array(a.length)).map(function (_, i) {
      return Math.pow(a[i] - b[i], 2);
    }).reduce(function (u, v) {
      return u + v;
    }, 0));
  };
  var rotate90 = function rotate90(v) {
    return [-v[1], v[0]];
  };
  var flip = function flip(v) {
    return v.map(function (n) {
      return -n;
    });
  };
  var rotate270 = function rotate270(v) {
    return [-v[1], v[0]];
  };

  var parallel = function parallel(a, b) {
    return 1 - Math.abs(dot(normalize(a), normalize(b))) < EPSILON;
  };

  var bisect_vectors = function bisect_vectors(a, b) {
    var aV = normalize(a);
    var bV = normalize(b);
    return dot(aV, bV) < -1 + EPSILON ? [-aV[1], aV[0]] : normalize(add(aV, bV));
  };

  var make_matrix2_rotate = function make_matrix2_rotate(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [cos, sin, -sin, cos, origin[0], origin[1]];
  };

  var multiply_matrix3_vector3 = function multiply_matrix3_vector3(m, vector) {
    return [m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9], m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10], m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]];
  };

  var table = {
    preserve: {
      magnitude: function magnitude$1() {
        return magnitude(this);
      },
      isEquivalent: function isEquivalent() {
        return equivalent_vectors(this, get_vector(arguments));
      },
      isParallel: function isParallel() {
        return parallel.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
      },
      dot: function dot$1() {
        return dot.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
      },
      distanceTo: function distanceTo() {
        return distance.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
      }
    },
    vector: {
      copy: function copy() {
        return _toConsumableArray(this);
      },
      normalize: function normalize$1() {
        return normalize(this);
      },
      scale: function scale$1() {
        return scale(this, arguments[0]);
      },
      flip: function flip$1() {
        return flip(this);
      },
      rotate90: function rotate90$1() {
        return rotate90(this);
      },
      rotate270: function rotate270$1() {
        return rotate270(this);
      },
      cross: function cross() {
        return cross3(resize(3, this), resize(3, get_vector(arguments)));
      },
      transform: function transform() {
        return multiply_matrix3_vector3(get_matrix_3x4(arguments), resize(3, this));
      },
      add: function add$1() {
        return add(this, resize(this.length, get_vector(arguments)));
      },
      subtract: function subtract$1() {
        return subtract(this, resize(this.length, get_vector(arguments)));
      },
      rotateZ: function rotateZ(angle, origin) {
        return multiply_matrix3_vector3(get_matrix_3x4(make_matrix2_rotate(angle, origin)), this);
      },
      lerp: function lerp$1(vector, pct) {
        return lerp(this, resize(this.length, get_vector(vector)), pct);
      },
      midpoint: function midpoint$1() {
        return midpoint.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
      },
      bisect: function bisect() {
        return bisect_vectors(this, get_vector(arguments));
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

  var Vector = {
    vector: {
      P: Array.prototype,
      A: VectorArgs,
      G: VectorGetters,
      M: VectorMethods,
      S: VectorStatic
    }
  };

  var Definitions = Object.assign({}, Vector);

  var create = function create(primitiveName, args) {
    var a = Object.create(Definitions[primitiveName].proto);
    Definitions[primitiveName].A.apply(a, args);
    return Object.freeze(a);
  };

  var vector = function vector() {
    return create("vector", arguments);
  };

  var circle = function circle() {
    return create("circle", arguments);
  };

  var ellipse = function ellipse() {
    return create("ellipse", arguments);
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

  var matrix = function matrix() {
    return create("matrix", arguments);
  };

  Object.assign(Constructors, {
    vector: vector,
    circle: circle,
    ellipse: ellipse,
    rect: rect,
    polygon: polygon,
    line: line,
    ray: ray,
    segment: segment,
    matrix: matrix
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

  return math;

})));

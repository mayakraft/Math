/* Math (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.math = factory());
}(this, (function () { 'use strict';

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

  var VectorArgs = function VectorArgs() {
    var _this = this;

    get_vector(arguments).forEach(function (n) {
      return _this.push(n);
    });
  };

  var EPSILON = 1e-6;

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
  var cross3 = function cross3(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[0] * b[2] - a[2] * b[0], a[0] * b[1] - a[1] * b[0]];
  };
  var distance2 = function distance2(a, b) {
    var p = a[0] - b[0];
    var q = a[1] - b[1];
    return Math.sqrt(p * p + q * q);
  };

  var parallel = function parallel(a, b) {
    return 1 - Math.abs(dot(normalize(a), normalize(b))) < EPSILON;
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

  var lengthSort = function lengthSort(a, b) {
    return [a, b].sort(function (a, b) {
      return a.length - b.length;
    });
  };

  var resize = function resize(d, a) {
    return Array(d).fill(0).map(function (z, i) {
      return a[i] ? a[i] : z;
    });
  };

  var makeSameD = function makeSameD(a, b) {
    var lengths = [a.length - b.length, b.length - a.length];
    var vecs = lengthSort(a, b);
    vecs[0] = vecs[1].map(function (_, i) {
      return vecs[0][i] || 0;
    });
    return vecs;
  };

  var VectorMethods = {};
  var table = {
    preserve: {
      magnitude: function magnitude$1() {
        return magnitude(this);
      },
      isEquivalent: function isEquivalent() {
        var vecs = makeSameD(this, get_vector(arguments));
        return vecs[0].map(function (_, i) {
          return Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON;
        }).reduce(function (a, b) {
          return a && b;
        }, true);
      },
      isParallel: function isParallel() {
        return parallel.apply(void 0, _toConsumableArray(makeSameD(this, get_vector(arguments))));
      },
      dot: function dot$1() {
        return dot.apply(void 0, _toConsumableArray(lengthSort(this, get_vector(arguments))));
      },
      distanceTo: function distanceTo() {
        var vecs = makeSameD(this, get_vector(arguments));
        return Math.sqrt(vecs.map(function (_, i) {
          return Math.pow(vecs[0][i] - vecs[1][i], 2);
        }).reduce(function (a, b) {
          return a + b;
        }, 0));
      },
      bisect: function bisect() {
        return bisect_vectors(this, get_vector(arguments)).map(function (b) {
          return VectorMethods.constructor(b);
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
        var vecs = makeSameD(this, get_vector(arguments));
        return vecs[0].map(function (_, i) {
          return (vecs[0][i] + vecs[1][i]) / 2;
        });
      }
    }
  };
  Object.keys(table.preserve).forEach(function (key) {
    VectorMethods[key] = table.preserve[key];
  });
  Object.keys(table.vector).forEach(function (key) {
    VectorMethods[key] = function () {
      return VectorMethods.constructor.apply(VectorMethods, _toConsumableArray(table.vector[key].apply(this, arguments)));
    };
  });

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

  var VectorStatic = function VectorStatic(proto) {
    proto.fromAngle = function (angle) {
      return proto(Math.cos(angle), Math.sin(angle));
    };
  };

  var Vector = {
    vector: {
      Super: Array.prototype,
      Args: VectorArgs,
      Getters: VectorGetters,
      Methods: VectorMethods,
      Static: VectorStatic
    }
  };

  var CircleArgs = function CircleArgs() {
    var arr = Array.from(arguments);
    var numbers = arr.filter(function (param) {
      return !isNaN(param);
    });
    var vectors = get_vector_of_vectors(arr);

    if (numbers.length === 3) {
      this.origin = Vector(numbers[0], numbers[1]);
      this.radius = numbers[2];
    } else if (vectors.length === 2) {
      this.radius = distance2.apply(void 0, _toConsumableArray(vectors));
      this.origin = Vector.apply(void 0, _toConsumableArray(vectors[0]));
    }
  };

  var CircleMethods = {};

  var CircleGetters = {
    x: function x() {
      return this.origin[0];
    },
    y: function y() {
      return this.origin[1];
    }
  };

  var CircleStatic = function CircleStatic(circle) {
    circle.fromPoints = function () {
      var points = get_vector_of_vectors(innerArgs);
      return circle(points, distance2(points[0], points[1]));
    };
  };

  var Circle = {
    circle: {
      Args: CircleArgs,
      Getters: CircleGetters,
      Methods: CircleMethods,
      Static: CircleStatic
    }
  };

  var Definitions = Object.assign({}, Vector, Circle);

  var create = function create(primitiveName, args) {
    var a = Object.create(Definitions[primitiveName].proto.prototype);
    Definitions[primitiveName].Args.apply(a, args);
    return Object.freeze(a);
  };

  var vector = function vector() {
    return create("vector", arguments);
  };

  var circle = function circle() {
    return create("circle", arguments);
  };

  var rect = function rect() {
    return create("rect", arguments);
  };

  var Primitives = {
    vector: vector,
    circle: circle,
    rect: rect
  };
  Object.keys(Definitions).forEach(function (primitiveName) {
    var Proto = {};
    Proto.prototype = Object.create(Definitions[primitiveName].Super || Object.prototype);
    Proto.prototype.constructor = Proto;
    Object.keys(Definitions[primitiveName].Getters).forEach(function (key) {
      return Object.defineProperty(Proto.prototype, key, {
        get: Definitions[primitiveName].Getters[key],
        enumerable: true
      });
    });
    Object.keys(Definitions[primitiveName].Methods).forEach(function (key) {
      return Object.defineProperty(Proto.prototype, key, {
        value: Definitions[primitiveName].Methods[key]
      });
    });
    Definitions[primitiveName].proto = Proto;
    Definitions[primitiveName].Static(Primitives[primitiveName]);
    Primitives[primitiveName].prototype = Definitions[primitiveName].proto.prototype;
    Primitives[primitiveName].prototype.constructor = Primitives[primitiveName];
    Object.freeze(Definitions[primitiveName].proto.prototype);
    Definitions[primitiveName].Methods.constructor = Primitives[primitiveName];
  });

  var math = Primitives;

  return math;

})));

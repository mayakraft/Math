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
  var flatten_arrays = function flatten_arrays() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    switch (args.length) {
      case undefined:
      case 0:
        return args;

      case 1:
        return is_iterable(args[0]) && typeof args[0] !== "string" ? flatten_arrays.apply(void 0, _toConsumableArray(args[0])) : [args[0]];

      default:
        return args.map(function (a) {
          return is_iterable(a) ? _toConsumableArray(flatten_arrays(a)) : a;
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []);
    }
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

  var methods = {};
  var table = {
    preserve: {
      magnitude: function magnitude$1() {
        return magnitude(this);
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
          return methods.constructor(b);
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
    methods[key] = table.preserve[key];
  });
  Object.keys(table.vector).forEach(function (key) {
    methods[key] = function () {
      return methods.constructor.apply(methods, _toConsumableArray(table.vector[key].apply(this, arguments)));
    };
  });

  var VectorStatic = function VectorStatic(proto) {
    proto.fromAngle = function (angle) {
      return proto(Math.cos(angle), Math.sin(angle));
    };
  };

  var Vector = {
    vector: {
      Super: Array.prototype,
      Args: Args,
      Getters: Getters,
      Methods: Methods,
      Static: VectorStatic
    }
  };

  var Definitions = Object.assign({}, Vector);

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

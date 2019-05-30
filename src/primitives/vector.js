import * as Input from "../parse/input";
import * as Prototypes from "./prototypes";

/** n-dimensional vector, but some operations meant only for 2D */
export function Vector(...args) {
  let proto = Prototypes.VectorProto();
  let _v = Object.create(proto);
  proto.bind(_v);
  Input.get_vector(args).forEach((v, i) => { _v.push(v); });

  Object.defineProperty(_v, "x", {get: function(){ return _v[0]; }});
  Object.defineProperty(_v, "y", {get: function(){ return _v[1]; }});
  Object.defineProperty(_v, "z", {get: function(){ return _v[2]; }});

  // Object.defineProperty(_v, "0", {
  //  get: function(){ return _v[0]; },
  //  set: function(input){ _v[0] = input; console.log("done"); }
  // });
  // Object.defineProperty(_v, "1", {get: function(){ return _v[0]; }});
  // Object.defineProperty(_v, "2", {get: function(){ return _v[0]; }});


  // return Object.freeze(_v);
  return _v;
}

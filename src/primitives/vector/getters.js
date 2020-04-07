import { magnitude } from "../../core/algebra";

const getters = {
  x: function () { return this[0]; },
  y: function () { return this[1]; },
  z: function () { return this[2]; },
  magnitude: function () { return magnitude(this); },
};

export default getters;

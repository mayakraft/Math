/**
 * Math (c) Kraft
 */
import { getVector } from "../../arguments/get";

const VectorArgs = function () {
  this.push(...getVector(arguments));
};

export default VectorArgs;

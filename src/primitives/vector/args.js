/**
 * Math (c) Kraft
 */
import { get_vector } from "../../arguments/get";

const VectorArgs = function () {
  this.push(...get_vector(arguments));
};

export default VectorArgs;

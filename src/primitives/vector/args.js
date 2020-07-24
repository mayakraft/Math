import { get_vector } from "../../arguments/get";

const VectorArgs = function () {
  get_vector(arguments).forEach(n => this.push(n));
};

export default VectorArgs;

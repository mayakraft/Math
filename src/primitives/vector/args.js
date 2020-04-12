import { get_vector } from "../../parsers/arguments";

const VectorArgs = function () {
  get_vector(arguments).forEach(n => this.push(n));
};

export default VectorArgs;

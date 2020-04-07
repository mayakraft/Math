import { get_vector } from "../../parsers/arguments";

const Args = function () {
  get_vector(arguments).forEach(n => this.push(n));
};

export default Args;

import { get_vector_of_vectors } from "../../parsers/arguments";
import vector from "../vector/index";
import { distance2 } from "../../core/algebra";

const Args = function () {
  const numbers = Array.from(arguments).filter(param => !isNaN(param));
  const vectors = get_vector_of_vectors(arguments);
  if (numbers.length === 3) {
    this.origin = vector(numbers[0], numbers[1]);
    [, , this.radius] = numbers;
  } else if (vectors.length === 2) {
    this.radius = distance2(...vectors);
    this.origin = vector(...vectors[0]);
  }
};

export default Args;

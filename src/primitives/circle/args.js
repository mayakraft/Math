import Constructors from "../constructors";
import {
  flatten_arrays,
  resize,
  get_vector_of_vectors,
} from "../../parsers/arguments";
import { distance2 } from "../../core/algebra";

const CircleArgs = function () {
  const vectors = get_vector_of_vectors(arguments);
  const numbers = resize(3, flatten_arrays(arguments));

  if (vectors.length === 2) {
    this.radius = distance2(...vectors);
    this.origin = Constructors.vector(...vectors[0]);
  } else {
    this.radius = numbers[0];
    this.origin = Constructors.vector(numbers[1], numbers[2]);
  }
};

export default CircleArgs;

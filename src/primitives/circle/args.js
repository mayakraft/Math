import Constructors from "../constructors";
import {
  flatten_arrays,
  resize,
} from "../../arguments/resize";
import { get_vector_of_vectors } from "../../arguments/get";
import { distance2 } from "../../core/algebra";

/**
 * circle constructors:
 * circle(1, [4,5]) radius:1, origin:4,5
 * circle([4,5], 1) radius:1, origin:4,5
 * circle(1, 2) radius: 2, origin:1
 * circle(1, 2, 3) radius: 3, origin:1,2
 * circle(1, 2, 3, 4) radius: 4, origin:1,2,3
 * circle([1,2], [3,4]) radius:(dist between pts), origin:1,2
 * circle([1,2], [3,4], [5,6]) circumcenter between 3 points
 */

// todo: refactor that big switch statement below
const CircleArgs = function () {
  const vectors = get_vector_of_vectors(arguments);
  const numbers = flatten_arrays(arguments).filter(a => typeof a === "number");
  if (arguments.length === 2) {
    if (vectors[1].length === 1) {
      this.radius = vectors[1][0];
      this.origin = Constructors.vector(...vectors[0]);
    } else if (vectors[0].length === 1) {
      this.radius = vectors[0][0];
      this.origin = Constructors.vector(...vectors[1]);
    } else if (vectors[0].length > 1 && vectors[1].length > 1) {
      this.radius = distance2(...vectors);
      this.origin = Constructors.vector(...vectors[0]);
    }
  }
  else {
    switch (numbers.length) {
      case 0:
        this.radius = 1;
        this.origin = Constructors.vector(0, 0, 0);
        break;
      case 1:
        this.radius = numbers[0];
        this.origin = Constructors.vector(0, 0, 0);
        break;
      default:
        this.radius = numbers.pop();
        this.origin = Constructors.vector(...numbers);
        break;
    }
  }
};

export default CircleArgs;

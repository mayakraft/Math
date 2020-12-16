import Constructors from "../constructors";
import {
  subtract,
  alternating_sum,
} from "../../core/algebra";
import {
  counter_clockwise_angle_radians,
  counter_clockwise_radians_order
} from "../../core/radial";
import {
  get_vector,
  get_vector_of_vectors,
} from "../../arguments/get";

const invert_order_array = (arr) => {
  const new_arr = [];
  arr.forEach((n, i) => new_arr[n] = i);
  return new_arr;
};

export default {
  junction: {
    A: function () {
      const vectors = get_vector_of_vectors(arguments)
				.map(v => Constructors.vector(v));
      const radians = vectors.map(v => Math.atan2(v[1], v[0]));
      const order = counter_clockwise_radians_order(...radians);
      this.vectors = order.map(i => vectors[i]);
      this.radians = order.map(i => radians[i]);
      this.order = invert_order_array(order);
    },
    G: {
      sectors: function () {
        return this.radians
          .map((n, i, arr) => [n, arr[(i + 1) % arr.length]])
          .map(pair => counter_clockwise_angle_radians(pair[0], pair[1]));
          // .map(pair => Sector.fromVectors(pair[0], pair[1]));
      },
    },
    M: {
      alternatingAngleSum: function () {
        return alternating_sum(this.sectors);
      },
    },
    S: {
      fromRadians: function () {
        // todo, this duplicates work converting back to vector form
        const radians = get_vector(arguments);
        return this.constructor(radians.map(r => [Math.cos(r), Math.sin(r)]));
      },
			// fromVectors: function () {
      //   return this.constructor(arguments);
      // },
      // fromPoints: function (center, edge_adjacent_points) {
      //   return this.constructor(edge_adjacent_points.map(p => subtract(p, center)));
      // },
			// // this probably won't exist. the first sector will be assumed to
			// // begin at vector [1, 0]. i think it assumes too much
      // fromSectorAngles: function (...angles) {
      // },
    }
  }
};


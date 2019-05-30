const math = require("../math");

const {
  average,
  equivalent,
  equivalent_numbers,
  get_vector,
} = math.core;

average([4, 1], [5, 6], [4, 6], [2, 6]);
// should equal [3.75, 4.75]
average([4, 1], [5, 6], [4, 6], [2, 6]);

equivalent(4, 4, 4);
equivalent(4, 4, 5);
equivalent([0], [0], [0]);
equivalent([0], [0, 0], [0]);
equivalent([0], [0], [1]);
equivalent([1], [0], [1]);
equivalent([1], [1], [1]);
equivalent([1], [1, 0], [1]);
equivalent(true, true, true, true);
equivalent(false, false, false, false);
equivalent(false, false, false, true);

equivalent_numbers([[[1, 1, 1, 1, 1]]]);
equivalent_numbers([[[1, 1, 1, 1, 1, 4]]]);
equivalent_numbers([1, 1, 1, 1, 1, 1], [1, 2]);

get_vector([[[1, 2, 3, 4]]]);
// (4) [1,  2,  3,  4]
get_vector(1, 2, 3, 4);
// (4) [1,  2,  3,  4]
get_vector([1, 2, 3, 4], [2, 4]);
// (4) [1,  2,  3,  4]
get_vector([1, 2, 3, 4], [6, 7], 6);
// (4) [1,  2,  3,  4]
get_vector([1, 2, 3, 4], [6, 7], 6, 2, 4, 5);
// (4) [1, 2, 3, 4]

average([1,2,3],[4,5,6],[7,8])
// (3) [4, 5, 3]
average([1,2,3],[4,5,6],[7,8,9])
// [4, 5, 6]
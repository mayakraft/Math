import * as overlap_lines from "./lines";
import * as overlap_point from "./points";
import * as overlap_polygon from "./polygon";

const overlap = Object.assign(Object.create(null),
  overlap_lines,
  overlap_point,
  overlap_polygon,
);

export default overlap;

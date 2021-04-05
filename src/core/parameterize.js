import {
  magnitude,
  dot,
  scale,
  rotate90,
  rotate270,
} from "./algebra";

// counter-clockwise
export const vector_origin_to_ud = ({ vector, origin }) => {
  const mag = magnitude(vector);
  const u = rotate90(vector);
  const d = dot(origin, u) / mag;
  return d < 0
    ? { u: scale(u, -1/mag), d: -d }
    : { u: scale(u, 1/mag), d };
  // return d < 0
  //   ? { u: [-u[0] / mag, -u[1] / mag], d: -d }
  //   : { u: [u[0] / mag, u[1] / mag], d };
};

// clockwise (undo counter-clockwise)
export const ud_to_vector_origin = ({ u, d }) => ({
  vector: rotate270(u),
  origin: scale(u, d),
});

/**
 * Math (c) Kraft
 */
/**
 * @description point1 and point2 define the segment
 * @param {object} box1, the result of calling "bounding_box()"
 */
const overlapBoundingBoxes = (box1, box2) => {
  const dimensions = box1.min.length > box2.min.length
    ? box2.min.length
    : box1.min.length;
  for (let d = 0; d < dimensions; d++) {
    // if one minimum is above the other's maximum, or visa versa
    if (box1.min[d] > box2.max[d] || box1.max[d] < box2.min[d]) {
      return false;
    }
  }
  return true;
};

export default overlapBoundingBoxes;
